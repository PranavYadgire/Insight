// Trello API client for Insight Power-Up

import { APP_KEY, getToken, clearToken } from "./auth.js";

export const NOT_AUTHORIZED = "NOT_AUTHORIZED";

/**
 * Executes an authenticated request against Trello REST API.
 */
export async function apiFetch(
  t,
  path,
  {
    method = "GET",
    params = {},
    body = null,
    headers = {},
  } = {}
) {
  const token = await getToken(t);

  if (!token) {
    throw new Error(NOT_AUTHORIZED);
  }

  const url = new URL(`https://api.trello.com/1${path}`);

  url.searchParams.set("key", APP_KEY);
  url.searchParams.set("token", token);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  }

  const fetchOptions = {
    method,
    headers: {
      ...headers,
    },
  };

  if (body) {
    if (
      typeof body === "object" &&
      !(body instanceof FormData)
    ) {
      fetchOptions.headers["Content-Type"] =
        "application/json";

      fetchOptions.body = JSON.stringify(body);
    } else {
      fetchOptions.body = body;
    }
  }

  const response = await fetch(
    url.toString(),
    fetchOptions
  );

  if (response.status === 401) {
    await clearToken(t);
    throw new Error(NOT_AUTHORIZED);
  }

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "");

    throw new Error(
      `Trello API error ${response.status}: ${
        errorText || response.statusText
      }`
    );
  }

  return response.status === 204
    ? null
    : response.json();
}


/**
 * Get current Trello member.
 */
export function getCurrentMember(t) {
  return apiFetch(t, "/members/me", {
    params: {
      fields:
        "id,username,fullName,avatarUrl,initials",
    },
  });
}


/**
 * Get current board ID from Power-Up context.
 */
export async function getCurrentBoardId(t) {
  const board = await t.board("id");

  return board.id;
}


/**
 * Get board information.
 */
export async function getBoard(t, boardId) {
  return apiFetch(t, `/boards/${boardId}`, {
    params: {
      fields:
        "id,name,url,shortUrl",
    },
  });
}


/**
 * Get all lists from board.
 */
export async function getBoardLists(t, boardId) {
  return apiFetch(
    t,
    `/boards/${boardId}/lists`,
    {
      params: {
        fields:
          "id,name,pos,closed",
        filter: "open",
      },
    }
  );
}


/**
 * Get all cards from board.
 */
export async function getBoardCards(t, boardId) {
  return apiFetch(
    t,
    `/boards/${boardId}/cards`,
    {
      params: {
        fields:
          "id,name,idList,idMembers,due,dueComplete,closed,labels,badges,url,dateLastActivity",
        members: "true",
        member_fields:
          "id,fullName,username,initials,avatarUrl",
      },
    }
  );
}


/**
 * Get all members on board.
 */
export async function getBoardMembers(t, boardId) {
  return apiFetch(
    t,
    `/boards/${boardId}/members`,
    {
      params: {
        fields:
          "id,fullName,username,initials,avatarUrl",
      },
    }
  );
}


/**
 * Get checklists for a card.
 */
export async function getCardChecklists(t, cardId) {
  return apiFetch(
    t,
    `/cards/${cardId}/checklists`,
    {
      params: {
        fields: "id,name",
        checkItems: "all",
        checkItem_fields:
          "id,name,state,pos",
      },
    }
  );
}


/**
 * Get complete board data required by Insight.
 */
export async function getBoardData(t) {
  const boardId = await getCurrentBoardId(t);

  const [
    board,
    lists,
    cards,
    members,
  ] = await Promise.all([
    getBoard(t, boardId),
    getBoardLists(t, boardId),
    getBoardCards(t, boardId),
    getBoardMembers(t, boardId),
  ]);

  return {
    boardId,
    board,
    lists,
    cards,
    members,
  };
}


/**
 * Convert a Trello date into a Date object safely.
 */
function toDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}


/**
 * Check whether a date falls within the current week.
 *
 * Week starts on Monday.
 */
function isDueThisWeek(dateValue) {
  const date = toDate(dateValue);

  if (!date) {
    return false;
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const day = today.getDay();

  const mondayOffset =
    day === 0 ? -6 : 1 - day;

  const monday = new Date(today);

  monday.setDate(
    today.getDate() + mondayOffset
  );

  const sunday = new Date(monday);

  sunday.setDate(
    monday.getDate() + 6
  );

  const cardDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return (
    cardDate >= monday &&
    cardDate <= sunday
  );
}


/**
 * Check whether a card is overdue.
 */
function isOverdue(card) {
  const dueDate = toDate(card.due);

  if (!dueDate) {
    return false;
  }

  if (card.dueComplete) {
    return false;
  }

  return dueDate < new Date();
}


/**
 * Determine whether a list represents completed work.
 *
 * We intentionally use the list name because Trello cards
 * don't have a universal "completed" status.
 */
function isCompletedList(listName) {
  if (!listName) {
    return false;
  }

  const name =
    listName.trim().toLowerCase();

  return [
    "completed",
    "complete",
    "done",
    "finished",
    "closed",
  ].some((word) =>
    name.includes(word)
  );
}


/**
 * Format a Trello date for Insight UI.
 */
function formatDate(dateValue) {
  const date = toDate(dateValue);

  if (!date) {
    return "No due date";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}


/**
 * Calculate Insight information from Trello board data.
 *
 * This function does NOT call the API.
 * It only transforms already fetched data.
 */
export function buildInsightData({
  board,
  lists,
  cards,
  members,
}) {
  const listMap = new Map();

  lists.forEach((list) => {
    listMap.set(list.id, list);
  });

  const memberMap = new Map();

  members.forEach((member) => {
    memberMap.set(member.id, member);
  });


  /*
   * Add useful calculated information to each card.
   */
  const normalizedCards = cards.map(
    (card) => {
      const list =
        listMap.get(card.idList);

      const assignedMembers =
        (card.idMembers || [])
          .map((memberId) =>
            memberMap.get(memberId)
          )
          .filter(Boolean);

      return {
        ...card,

        listName:
          list?.name || "Unknown",

        assignedMembers,

        memberNames:
          assignedMembers.map(
            (member) =>
              member.fullName
          ),

        isCompleted:
          isCompletedList(
            list?.name
          ),

        isOverdue:
          isOverdue(card),

        isDueThisWeek:
          isDueThisWeek(card.due),

        isUnassigned:
          !card.idMembers ||
          card.idMembers.length === 0,

        hasNoDueDate:
          !card.due,

        displayDate:
          formatDate(card.due),
      };
    }
  );


  /*
   * Overview
   */
  const total =
    normalizedCards.length;

  const completed =
    normalizedCards.filter(
      (card) => card.isCompleted
    ).length;

  const dueThisWeek =
    normalizedCards.filter(
      (card) =>
        card.isDueThisWeek
    ).length;

  const overdue =
    normalizedCards.filter(
      (card) =>
        card.isOverdue
    ).length;


  /*
   * Stage breakdown
   */
  const stageMap = new Map();

  normalizedCards.forEach(
    (card) => {
      const stage =
        card.listName;

      if (!stageMap.has(stage)) {
        stageMap.set(stage, 0);
      }

      stageMap.set(
        stage,
        stageMap.get(stage) + 1
      );
    }
  );

  const stages =
    Array.from(stageMap.entries())
      .map(
        ([name, count]) => ({
          name,
          count,
        })
      );


  /*
   * Team workload
   */
  const workloadMap =
    new Map();

  members.forEach(
    (member) => {
      workloadMap.set(
        member.id,
        {
          id: member.id,
          name: member.fullName,
          count: 0,
          initials:
            member.initials || "",
        }
      );
    }
  );

  let unassignedCount = 0;

  normalizedCards.forEach(
    (card) => {
      if (
        !card.idMembers ||
        card.idMembers.length === 0
      ) {
        unassignedCount++;
        return;
      }

      card.idMembers.forEach(
        (memberId) => {
          const member =
            workloadMap.get(
              memberId
            );

          if (member) {
            member.count++;
          }
        }
      );
    }
  );

  const team =
    Array.from(
      workloadMap.values()
    );

  if (unassignedCount > 0) {
    team.push({
      id: null,
      name: "Unassigned",
      count: unassignedCount,
      initials: "•",
    });
  }


  /*
   * Needs Attention
   */
  const overdueCards =
    normalizedCards.filter(
      (card) =>
        card.isOverdue
    );

  const dueThisWeekCards =
    normalizedCards.filter(
      (card) =>
        card.isDueThisWeek &&
        !card.isOverdue
    );

  const unassignedCards =
    normalizedCards.filter(
      (card) =>
        card.isUnassigned
    );

  const noDueDateCards =
    normalizedCards.filter(
      (card) =>
        card.hasNoDueDate
    );


  /*
   * Convert cards into the structure
   * currently used by your Dashboard.
   */
  const attention = [
    ...overdueCards.map(
      (card) => ({
        id: card.id,
        name: card.name,
        type: "Overdue",
        date: card.displayDate,
        url: card.url,
        members:
          card.assignedMembers,
        stage: card.listName,
      })
    ),

    ...dueThisWeekCards.map(
      (card) => ({
        id: card.id,
        name: card.name,
        type: "Due this week",
        date: card.displayDate,
        url: card.url,
        members:
          card.assignedMembers,
        stage: card.listName,
      })
    ),

    ...unassignedCards.map(
      (card) => ({
        id: card.id,
        name: card.name,
        type: "Unassigned",
        date: card.displayDate,
        url: card.url,
        members:
          card.assignedMembers,
        stage: card.listName,
      })
    ),

    ...noDueDateCards.map(
      (card) => ({
        id: card.id,
        name: card.name,
        type: "No due date",
        date: "No due date",
        url: card.url,
        members:
          card.assignedMembers,
        stage: card.listName,
      })
    ),
  ];


  return {
    board,

    overview: {
      total,
      completed,
      dueThisWeek,
      overdue,
    },

    stages,

    team,

    attention,

    cards: normalizedCards,

    members,

    lists,

    counts: {
      overdue:
        overdueCards.length,

      dueThisWeek:
        dueThisWeekCards.length,

      unassigned:
        unassignedCards.length,

      noDueDate:
        noDueDateCards.length,
    },
  };
}


/**
 * Fetch Trello data and build the complete
 * Insight dataset.
 */
export async function getInsightData(t) {
  const boardData =
    await getBoardData(t);

  return buildInsightData(
    boardData
  );
}


/**
 * Disconnect member from Insight.
 */
export async function disconnectMember(t) {
  await clearToken(t);
}