import React, { useEffect, useState } from "react";
import { getInsightData } from "../lib/trelloApi.js";

const sampleData = {
  overview: {
    total: 24,
    completed: 8,
    dueThisWeek: 6,
    overdue: 3,
  },

  stages: [
  { name: "Planning", count: 5 },
  { name: "In Progress", count: 8 },
  { name: "Review", count: 6 },
  { name: "Completed", count: 3 },
],

  team: [
    { name: "Surbhi", count: 8 },
    { name: "Amit", count: 6 },
    { name: "Rahul", count: 5 },
    { name: "Priya", count: 3 },
    { name: "Unassigned", count: 2 },
  ],

  attention: [
    {
      name: "Prepare project report",
      type: "Overdue",
      date: "Sep 20",
    },
    {
      name: "Client presentation",
      type: "Due this week",
      date: "Sep 25",
    },
    {
      name: "Update documentation",
      type: "Unassigned",
      date: "No member",
    },
    {
      name: "Start using Trello",
      type: "No due date",
      date: "No due date",
    },
  ],

    stageCards: {
    Planning: [
      { name: "Define campaign goals", date: "Sep 18", member: "S" },
      { name: "Identify target audience", date: "Sep 20", member: "A" },
      { name: "Create campaign brief", date: "Sep 22", member: "R" },
      { name: "Set budget", date: "Sep 25", member: "S" },
      { name: "Align stakeholders", date: "Sep 26", member: "A" },
    ],

    "In Progress": [
      { name: "Design creatives", date: "Sep 21", member: "S" },
      { name: "Write ad copy", date: "Sep 23", member: "A" },
      { name: "Build landing page", date: "Sep 24", member: "R" },
      { name: "Set up tracking", date: "Sep 25", member: "R" },
      { name: "Test creatives", date: "Sep 27", member: "P" },
    ],
  },
  teamCards: {
  Surbhi: [
    {
      name: "Define campaign goals",
      date: "Sep 18",
      stage: "Planning",
    },
    {
      name: "Review content calendar",
      date: "Sep 19",
      stage: "Planning",
    },
    {
      name: "Approve ad creatives",
      date: "Sep 22",
      stage: "In Progress",
    },
    {
      name: "Finalize media plan",
      date: "Sep 24",
      stage: "Review",
    },
    {
      name: "Coordinate with agency",
      date: "Sep 26",
      stage: "Review",
    },
  ],
},
};

export default function Dashboard({ t }) {
  const [activeTab, setActiveTab] = useState("Overview");
const [selectedCard, setSelectedCard] = useState(null);
const [attentionSort, setAttentionSort] = useState("Due date — Oldest first");
const [showOverdueModal, setShowOverdueModal] = useState(false);
const [showDueWeekModal, setShowDueWeekModal] = useState(false);
const [insightData, setInsightData] = useState(null);
const [dataLoading, setDataLoading] = useState(true);
const [dataError, setDataError] = useState(null);

useEffect(() => {
  let cancelled = false;

  async function loadInsightData() {
    try {
      setDataLoading(true);
      setDataError(null);

      const t = window.TrelloPowerUp.iframe();

      console.log("Loading real Trello data...");

      const data = await getInsightData(t);

      console.log("REAL INSIGHT DATA:", data);

      if (!cancelled) {
        setInsightData(data);
      }
    } catch (error) {
      console.error("Insight data load error:", error);

      if (!cancelled) {
        setDataError(error.message || "Failed to load Trello data");
      }
    } finally {
      if (!cancelled) {
        setDataLoading(false);
      }
    }
  }

  loadInsightData();

  return () => {
    cancelled = true;
  };
}, []);

  

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.logo}>
            <span style={styles.logoBar1}></span>
            <span style={styles.logoBar2}></span>
            <span style={styles.logoBar3}></span>
          </div>

          <div>
            <h1 style={styles.title}>Insights</h1>
            <p style={styles.subtitle}>Your board at a glance</p>
          </div>
        </div>

      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {["Overview", "By Stage", "Team", "Needs Attention"].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TOP CONTROLS */}
     

      {/* ================= OVERVIEW ================= */}
      {activeTab === "Overview" && (
        <>
          {/* STAT CARDS */}
          <div style={styles.statsGrid}>
            <StatCard
              type="total"
              icon="▣"
              value={(insightData?.overview?.total ?? sampleData.overview.total)}
              title="Total Cards"
            />

            <StatCard
              type="completed"
              icon="✓"
              value={(insightData?.overview?.completed ?? sampleData.overview.completed)}
              title="Completed"
            />

            <StatCard
              type="due"
              icon="◷"
              value={(insightData?.overview?.dueThisWeek ?? sampleData.overview.dueThisWeek)}
              title="Due this week"
            />

            <StatCard
              type="overdue"
              icon="!"
              value={(insightData?.overview?.overdue ?? sampleData.overview.overdue)}
              title="Overdue"
            />
          </div>

          {/* TWO COLUMNS */}
          <div style={styles.twoColumn}>
            {/* WORK BY STAGE */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Work by Stage</h2>

                <button
                  style={styles.viewAllButton}
                  onClick={() => setActiveTab("By Stage")}
                >
                  View all →
                </button>
              </div>

{(insightData?.stages ?? sampleData.stages).map((stage) => (
                  <div key={stage.name} style={styles.stageRow}>
                  <div style={styles.rowHeader}>
                    <span>{stage.name}</span>
                    <strong>{stage.count}</strong>
                  </div>

                  <div style={styles.progressBackground}>
                    <div
                      style={{
                        ...styles.progressBar,
                        background:
                          stage.name === "Planning"
                            ? "#0c66e4"
                            : stage.name === "In Progress"
                            ? "#8b5cf6"
                            : stage.name === "Review"
                            ? "#f59e0b"
                            : "#22c55e",
                        width: `${
  (stage.count /
    (insightData?.overview?.total ?? sampleData.overview.total)) *
  100
}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* TEAM WORKLOAD */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Team Workload</h2>

                <button
                  style={styles.viewAllButton}
                  onClick={() => setActiveTab("Team")}
                >
                  View all →
                </button>
              </div>

{(insightData?.team ?? sampleData.team).map((member) => (
                  <div key={member.name} style={styles.stageRow}>
                  <div style={styles.rowHeader}>
                    <div style={styles.memberInfo}>
                      <span
                        style={{
                          ...styles.memberAvatar,
                          background:
                            member.name === "Surbhi"
                              ? "#0c66e4"
                              : member.name === "Amit"
                              ? "#8b5cf6"
                              : member.name === "Rahul"
                              ? "#f59e0b"
                              : member.name === "Priya"
                              ? "#22c55e"
                              : "#dfe1e6",
                          color:
                            member.name === "Unassigned"
                              ? "#5e6c84"
                              : "#ffffff",
                        }}
                      >
                        {member.name === "Unassigned"
                          ? "•"
                          : member.name.charAt(0)}
                      </span>

                      <span>{member.name}</span>
                    </div>

                    <strong>{member.count}</strong>
                  </div>

                  <div style={styles.progressBackground}>
                    <div
                      style={{
                        ...styles.progressBar,
                        background:
                          member.name === "Surbhi"
                            ? "#0c66e4"
                            : member.name === "Amit"
                            ? "#8b5cf6"
                            : member.name === "Rahul"
                            ? "#f59e0b"
                            : member.name === "Priya"
                            ? "#22c55e"
                            : "#9ca3af",
                        width: `${
                          (member.count /
                            Math.max(
                              ...sampleData.team.map((m) => m.count)
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEEDS ATTENTION */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Needs Attention</h2>

              <button
                style={styles.viewAllButton}
                onClick={() => setActiveTab("Needs Attention")}
              >
                View all →
              </button>
            </div>

            <div style={styles.attentionGrid}>
  <AttentionCard
    type="overdue"
    icon="!"
    title={`${insightData?.overview?.overdue ?? 0} overdue cards`}
    description="These cards are past their due date"
  />

  <AttentionCard
    type="due"
    icon="◷"
    title={`${insightData?.overview?.dueThisWeek ?? 0} cards due this week`}
    description="Due in the next 7 days"
  />

  <AttentionCard
    type="unassigned"
    icon="●"
    title={`${
      insightData?.counts?.unassigned ?? 0
    } unassigned cards`}
    description="No member assigned"
  />

  <AttentionCard
    type="noDate"
    icon="▣"
    title={`${
      insightData?.counts?.noDueDate ?? 0
    } cards without due date`}
    description="Consider adding a due date"
  />
</div>
          </div>

          {/* TIP */}
          <div style={styles.tip}>
            <span style={styles.tipIcon}>♧</span>
            <span>
              <strong>Tip:</strong> Click on any insight to view the relevant
              cards on your board.
            </span>
          </div>
        </>
      )}

      {/* ================= BY STAGE ================= */}
      {activeTab === "By Stage" && (
  <>
    {/* TOP BY-STAGE SECTION */}
    <div style={styles.stageTopGrid}>

      {/* CARDS BY STAGE */}
      <div style={styles.stageChartPanel}>
        <h2 style={styles.panelTitle}>Cards by Stage</h2>

        <div style={styles.chartSubtitle}>
Total {insightData?.overview?.total ?? sampleData.overview.total} cards        </div>

        <div style={styles.chartArea}>
          {(insightData?.stages ?? sampleData.stages).map((stage) => (
            <div key={stage.name} style={styles.chartColumn}>

              <strong style={styles.chartValue}>
                {stage.count}
              </strong>

              <div
                style={{
                  ...styles.chartBar,
                  height: `${stage.count * 12}px`,
                  background:
                    stage.name === "Planning"
                      ? "#2f80ed"
                      : stage.name === "In Progress"
                      ? "#8b5cf6"
                      : stage.name === "Review"
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              />

              <span style={styles.chartLabel}>
                {stage.name}
              </span>

            </div>
          ))}
        </div>
      </div>

      {/* STAGE BREAKDOWN */}
      <div style={styles.stageBreakdownPanel}>
        <h2 style={styles.panelTitle}>Stage breakdown</h2>

{(insightData?.stages ?? sampleData.stages).map((stage) => (
            <div
            key={stage.name}
            style={styles.breakdownRow}
          >
            <div style={styles.breakdownTop}>
              <span>{stage.name}</span>

              <span>
                <strong>{stage.count} cards</strong>
                <span style={styles.percentage}>
                  {Math.round(
(stage.count / (insightData?.overview?.total ?? sampleData.overview.total)) * 100                  )}
                  %
                </span>
              </span>
            </div>

            <div style={styles.progressBackground}>
              <div
                style={{
                  ...styles.progressBar,
                  background:
                    stage.name === "Planning"
                      ? "#2f80ed"
                      : stage.name === "In Progress"
                      ? "#8b5cf6"
                      : stage.name === "Review"
                      ? "#f59e0b"
                      : "#22c55e",
                  width: `${
                    (stage.count / sampleData.overview.total) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* STAGE CARD LISTS */}
    {/* STAGE CARD LISTS */}
<div style={styles.stageCardsGrid}>

  {(insightData?.stages ?? sampleData.stages).map((stage) => {
    const stageCards = (insightData?.cards ?? []).filter(
      (card) => card.listName === stage.name
    );

    const visibleCards = stageCards.slice(0, 5);
    const remainingCards = stageCards.length - visibleCards.length;

    return (
      <div
        key={stage.name}
        style={styles.stageCardPanel}
      >
        <div style={styles.stageCardHeader}>
          <div>
            <span
              style={{
                ...styles.stageDot,
                background:
                  stage.name === "Planning"
                    ? "#2f80ed"
                    : stage.name === "In Progress"
                    ? "#8b5cf6"
                    : stage.name === "Review"
                    ? "#f59e0b"
                    : "#22c55e",
              }}
            />

            <strong>
              Cards in {stage.name} ({stage.count})
            </strong>
          </div>

          <button style={styles.viewAllButton}>
            View all →
          </button>
        </div>

        {visibleCards.length === 0 ? (
          <div style={styles.moreCards}>
            No cards in this stage
          </div>
        ) : (
          visibleCards.map((card) => (
            <div
              key={card.id}
              style={styles.cardListRow}
              onClick={() =>
                setSelectedCard({
                  name: card.name,
                  type: stage.name,
                  date: card.displayDate,
                })
              }
            >
              <span>{card.name}</span>

              <div style={styles.cardMeta}>
                <span>▣ {card.displayDate}</span>

                <span
                  style={{
                    ...styles.cardMember,
                    background: "#64748b",
                  }}
                >
                  {card.memberNames?.length
                    ? card.memberNames[0].charAt(0)
                    : "•"}
                </span>

                <span style={styles.arrow}>›</span>
              </div>
            </div>
          ))
        )}

        {remainingCards > 0 && (
          <div style={styles.moreCards}>
            +{remainingCards} more cards
          </div>
        )}
      </div>
    );
  })}

</div>

    {/* TIP */}
    <div style={styles.tip}>
      <span style={styles.tipIcon}>♧</span>

      <span>
        <strong>Tip:</strong> Click on any stage or card to open it on your board.
      </span>
    </div>
  </>
)}

      {/* ================= TEAM ================= */}
      {activeTab === "Team" && (
  <>
    <div style={styles.teamMainGrid}>

      {/* LEFT: TEAM WORKLOAD */}
      <div style={styles.teamWorkloadPanel}>

        <div style={styles.teamPanelHeader}>
          <div>
            <h2 style={styles.panelTitle}>Team workload</h2>

            <div style={styles.chartSubtitle}>
             Total {insightData?.overview?.total ?? sampleData.overview.total} cards
            </div>
          </div>

          <select style={styles.teamSelect}>
            <option>Cards assigned</option>
            <option>Cards completed</option>
            <option>Due dates</option>
          </select>
        </div>

{(insightData?.team ?? sampleData.team).map((member) => (          <div
            key={member.name}
            style={styles.teamWorkloadRow}
          >
            <div style={styles.teamMemberName}>

              <span
                style={{
                  ...styles.memberAvatar,
                  background:
                    member.name === "Surbhi"
                      ? "#0c66e4"
                      : member.name === "Amit"
                      ? "#0c66e4"
                      : member.name === "Rahul"
                      ? "#00875a"
                      : member.name === "Priya"
                      ? "#00a3bf"
                      : "#dfe1e6",

                  color:
                    member.name === "Unassigned"
                      ? "#5e6c84"
                      : "#ffffff",
                }}
              >
                {member.name === "Unassigned"
                  ? "•"
                  : member.name.charAt(0)}
              </span>

              <span>{member.name}</span>
            </div>

            <div style={styles.teamWorkloadBarBackground}>
              <div
                style={{
                  ...styles.teamWorkloadBar,

                  background:
                    member.name === "Surbhi"
                      ? "#2f80ed"
                      : member.name === "Amit"
                      ? "#8b5cf6"
                      : member.name === "Rahul"
                      ? "#f59e0b"
                      : member.name === "Priya"
                      ? "#22c55e"
                      : "#c4c9d1",

                  width: `${
                    (member.count /
                      Math.max(
  ...(insightData?.team ?? sampleData.team).map((m) => m.count)
)) *
                    100
                  }%`,
                }}
              />
            </div>

            <strong style={styles.teamCount}>
              {member.count}
            </strong>
          </div>
        ))}

        {/* LEGEND */}
        <div style={styles.teamLegend}>

          <span>
            <i
              style={{
                ...styles.legendDot,
                background: "#2f80ed",
              }}
            />
            Planning
          </span>

          <span>
            <i
              style={{
                ...styles.legendDot,
                background: "#8b5cf6",
              }}
            />
            In Progress
          </span>

          <span>
            <i
              style={{
                ...styles.legendDot,
                background: "#f59e0b",
              }}
            />
            Review
          </span>

          <span>
            <i
              style={{
                ...styles.legendDot,
                background: "#22c55e",
              }}
            />
            Completed
          </span>

        </div>

        {/* KEY INSIGHT */}
        <div style={styles.keyInsight}>

          <span style={styles.keyInsightIcon}>
            ♧
          </span>

          <div>
            <strong>Key insight</strong>

            <p style={styles.keyInsightText}>
              Surbhi has the highest workload (8 cards),
              which is 33% of the total board workload.
            </p>
          </div>

        </div>

      </div>

      {/* RIGHT: TEAM MEMBER'S CARDS */}
<div style={styles.teamCardsPanel}>

  <div style={styles.teamPanelHeader}>

    <h2 style={styles.panelTitle}>
      {insightData?.team?.[0]?.name || "Team member"}'s cards (
      {insightData?.team?.[0]?.count || 0}
      )
    </h2>

    <button
      style={styles.viewAllButton}
      onClick={async () => {
  console.log("VIEW ON BOARD CLICKED");

  try {
    const trello = window.TrelloPowerUp.iframe();

    const board = await trello.board("id");

    console.log("CURRENT BOARD:", board);

    await trello.closeModal();

    await trello.navigate({
      url: `https://trello.com/b/${board.id}`,
    });
  } catch (error) {
    console.error("VIEW ON BOARD ERROR:", error);
  }
}}
    >
      View on board ↗
    </button>

  </div>

  {(
    insightData?.cards?.filter((card) =>
      card.memberNames?.includes(insightData?.team?.[0]?.name)
    ) || []
  )
    .slice(0, 5)
    .map((card) => (
      <div
        key={card.id}
        style={styles.memberCard}
        onClick={() =>
          setSelectedCard({
            name: card.name,
            type: card.listName,
            date: card.displayDate,
          })
        }
      >

        <div style={styles.memberCardName}>
          {card.name}
        </div>

        <div style={styles.memberCardBottom}>

          <span>
            ▣ {card.displayDate}
          </span>

          <span
            style={{
              ...styles.stageBadge,
              background:
                card.listName === "Planning"
                  ? "#eaf3ff"
                  : card.listName === "In Progress"
                  ? "#f3e8ff"
                  : "#fff4d6",

              color:
                card.listName === "Planning"
                  ? "#0c66e4"
                  : card.listName === "In Progress"
                  ? "#7c3aed"
                  : "#b45309",
            }}
          >
            {card.listName}
          </span>

        </div>

      </div>
    ))}

</div>

    </div>

    {/* TIP */}
    <div style={styles.tip}>

      <span style={styles.tipIcon}>
        ♧
      </span>

      <span>
        <strong>Tip:</strong> Click on a member or card
        to open it on your board.
      </span>

    </div>
  </>
)}
      {/* ================= NEEDS ATTENTION ================= */}
{activeTab === "Needs Attention" && (
  <>
    {(() => {
      const realCards = insightData?.cards ?? [];

      const overdueCards = realCards.filter(
        (card) => card.isOverdue
      );

      const dueThisWeekCards = realCards.filter(
        (card) => card.isDueThisWeek
      );

      const unassignedCards = realCards.filter(
        (card) => card.isUnassigned
      );

      const noDueDateCards = realCards.filter(
        (card) => card.hasNoDueDate
      );

      return (
        <>
          {/* SUMMARY CARDS */}
          <div style={styles.attentionStatsGrid}>

            <div style={{ ...styles.attentionStat, background: "#fff0f2" }}>
              <div style={{ ...styles.attentionStatIcon, color: "#d92d20" }}>
                !
              </div>
              <strong style={{ color: "#d92d20" }}>
                {overdueCards.length}
              </strong>
              <span>Overdue cards</span>
            </div>

            <div style={{ ...styles.attentionStat, background: "#fff4ed" }}>
              <div style={{ ...styles.attentionStatIcon, color: "#e8590c" }}>
                ◷
              </div>
              <strong style={{ color: "#e8590c" }}>
                {dueThisWeekCards.length}
              </strong>
              <span>Due this week</span>
            </div>

            <div style={{ ...styles.attentionStat, background: "#fff8e6" }}>
              <div style={{ ...styles.attentionStatIcon, color: "#d97706" }}>
                ≡
              </div>
              <strong style={{ color: "#d97706" }}>
                {unassignedCards.length}
              </strong>
              <span>Unassigned cards</span>
            </div>

            <div style={{ ...styles.attentionStat, background: "#edf5ff" }}>
              <div style={{ ...styles.attentionStatIcon, color: "#0c66e4" }}>
                ▣
              </div>
              <strong style={{ color: "#0c66e4" }}>
                {noDueDateCards.length}
              </strong>
              <span>No due date</span>
            </div>

          </div>


          {/* OVERDUE CARDS */}
          <div style={styles.attentionPanel}>

            <div style={styles.attentionSectionHeader}>
              <div>
                <span
                  style={{
                    ...styles.attentionDot,
                    background: "#d92d20",
                  }}
                />
                <strong>
                  Overdue cards ({overdueCards.length})
                </strong>
              </div>

              <button
                style={styles.viewAllButton}
                onClick={() => setShowOverdueModal(true)}
              >
                View all →
              </button>
            </div>


            {overdueCards.slice(0, 3).map((card) => (
              <div
                key={card.id}
                style={styles.attentionCardRow}
                onClick={() =>
                  setSelectedCard({
                    name: card.name,
                    type: "Overdue",
                    date: card.displayDate,
                  })
                }
              >
                <span style={styles.attentionCardIcon}>
                  ▣
                </span>

                <span style={styles.attentionCardName}>
                  {card.name}
                </span>

                <span style={styles.attentionDateDanger}>
                  ◷ {card.displayDate}
                </span>

                <span style={styles.dangerBadge}>
                  Overdue
                </span>

                <span
                  style={{
                    ...styles.attentionAvatar,
                    background: "#64748b",
                  }}
                >
                  {card.memberNames?.length
                    ? card.memberNames[0].charAt(0)
                    : "•"}
                </span>

                <span style={styles.attentionStage}>
                  {card.listName}
                </span>
              </div>
            ))}

            {overdueCards.length > 3 && (
              <div style={styles.moreCards}>
                +{overdueCards.length - 3} more cards
              </div>
            )}


            {/* DUE THIS WEEK */}
            <div
              style={{
                ...styles.attentionSectionHeader,
                marginTop: "14px",
              }}
            >
              <div>
                <span
                  style={{
                    ...styles.attentionDot,
                    background: "#e8590c",
                  }}
                />

                <strong>
                  Due this week ({dueThisWeekCards.length})
                </strong>
              </div>

              <button
                style={styles.viewAllButton}
                onClick={() => setShowDueWeekModal(true)}
              >
                View all →
              </button>
            </div>


            {dueThisWeekCards.slice(0, 3).map((card) => (
              <div
                key={card.id}
                style={styles.attentionCardRow}
                onClick={() =>
                  setSelectedCard({
                    name: card.name,
                    type: "Due this week",
                    date: card.displayDate,
                  })
                }
              >
                <span style={styles.attentionCardIcon}>
                  ▣
                </span>

                <span style={styles.attentionCardName}>
                  {card.name}
                </span>

                <span style={styles.attentionDate}>
                  ◷ {card.displayDate}
                </span>

                <span style={styles.weekBadge}>
                  Due this week
                </span>

                <span
                  style={{
                    ...styles.attentionAvatar,
                    background: "#64748b",
                  }}
                >
                  {card.memberNames?.length
                    ? card.memberNames[0].charAt(0)
                    : "•"}
                </span>

                <span style={styles.attentionStage}>
                  {card.listName}
                </span>
              </div>
            ))}

            {dueThisWeekCards.length > 3 && (
              <div style={styles.moreCards}>
                +{dueThisWeekCards.length - 3} more cards
              </div>
            )}

          </div>


          {/* TIP */}
          <div style={styles.tip}>
            <span style={styles.tipIcon}>♧</span>

            <span>
              <strong>Tip:</strong> Click on any card to open it, or use
              "View all" to see all cards on your board.
            </span>
          </div>
        </>
      );
    })()}
  </>
)}
      {/* CARD POPUP */}
      {selectedCard && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
  style={{
    position: "absolute",
    top: "10px",
    right: "12px",
    border: "none",
    background: "transparent",
    color: "#5e6c84",
    fontSize: "22px",
    fontWeight: 400,
    cursor: "pointer",
    lineHeight: "1",
  }}
  onClick={() => setSelectedCard(null)}
>
  ×
</button>

            <h2 style={styles.modalTitle}>{selectedCard.name}</h2>
              {(() => {
  const realCard = insightData?.cards?.find(
    (card) => card.name === selectedCard.name
  );

  return (
    <>
      <div style={styles.modalRow}>
        <strong>Status</strong>
        <span>
          {realCard?.listName || selectedCard.type || "Unknown"}
        </span>
      </div>

      <div style={styles.modalRow}>
        <strong>Due date</strong>
        <span>
          {realCard?.displayDate || selectedCard.date || "No due date"}
        </span>
      </div>

      <div style={styles.modalRow}>
        <strong>Assigned to</strong>
        <span>
          {realCard?.memberNames?.length
            ? realCard.memberNames.join(", ")
            : "Unassigned"}
        </span>
      </div>
    </>
  );
})()}
            

          </div>
        </div>
      )}
      {showOverdueModal && (
  <div style={styles.overlay}>
    <div style={styles.overdueModal}>

      <button
        style={styles.overdueCloseButton}
        onClick={() => setShowOverdueModal(false)}
      >
        ×
      </button>

      <h2 style={styles.overdueModalTitle}>
        🔴 Overdue Cards (
        {insightData?.cards?.filter((card) => card.isOverdue).length || 0}
        )
      </h2>

      <p style={styles.overdueModalSubtitle}>
        These cards are past their due date and need attention.
      </p>
      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "14px",
  }}
>
  <select
    style={styles.sortSelect}
    value={attentionSort}
    onChange={(e) => setAttentionSort(e.target.value)}
  >
    <option>Due date — Oldest first</option>
    <option>Due date — Newest first</option>
    <option>Card name — A–Z</option>
  </select>
</div>

      {[...(insightData?.cards || [])]
  .filter((card) => card.isOverdue)
  .sort((a, b) => {
    if (attentionSort === "Card name — A–Z") {
      return a.name.localeCompare(b.name);
    }

    const dateA = new Date(a.displayDate).getTime();
    const dateB = new Date(b.displayDate).getTime();

    if (attentionSort === "Due date — Newest first") {
      return dateB - dateA;
    }

    return dateA - dateB;
  })
  .map((card) => (
          <div
            key={card.id}
            style={styles.overdueModalCard}
            onClick={() =>
              setSelectedCard({
                name: card.name,
                type: "Overdue",
                date: card.displayDate,
              })
            }
          >
            <div>
              <strong>{card.name}</strong>

              <p>
                {card.description || "No description available."}
              </p>
            </div>

            <div style={styles.overdueModalMeta}>
              <span>{card.displayDate}</span>

              <span>
                ●{" "}
                {card.memberNames?.length
                  ? card.memberNames.join(", ")
                  : "Unassigned"}
              </span>

              <span>{card.listName}</span>
            </div>
          </div>
        ))}

      {(!insightData?.cards ||
        insightData.cards.filter((card) => card.isOverdue).length === 0) && (
        <div style={styles.moreCards}>
          No overdue cards 🎉
        </div>
      )}

      <div style={styles.overdueModalTip}>
        💡 Click on a card to view its details.
      </div>

      <div style={styles.overdueModalFooter}>
        <button
          style={styles.modalCloseButton}
          onClick={() => setShowOverdueModal(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}


{showDueWeekModal && (
  <div style={styles.overlay}>
    <div style={styles.overdueModal}>

      <button
        style={styles.overdueCloseButton}
        onClick={() => setShowDueWeekModal(false)}
      >
        ×
      </button>

      <h2 style={styles.overdueModalTitle}>
        🟠 Due This Week (
        {insightData?.cards?.filter((card) => card.isDueThisWeek).length || 0}
        )
      </h2>

      <p style={styles.overdueModalSubtitle}>
        These cards are due within this week.
      </p>
      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "14px",
  }}
>
  <select
    style={styles.sortSelect}
    value={attentionSort}
    onChange={(e) => setAttentionSort(e.target.value)}
  >
    <option>Due date — Oldest first</option>
    <option>Due date — Newest first</option>
    <option>Card name — A–Z</option>
  </select>
</div>

      {[...(insightData?.cards || [])]
  .filter((card) => card.isDueThisWeek)
  .sort((a, b) => {
    if (attentionSort === "Card name — A–Z") {
      return a.name.localeCompare(b.name);
    }

    const dateA = new Date(a.displayDate).getTime();
    const dateB = new Date(b.displayDate).getTime();

    if (attentionSort === "Due date — Newest first") {
      return dateB - dateA;
    }

    return dateA - dateB;
  })
  .map((card) => (
          <div
            key={card.id}
            style={styles.overdueModalCard}
            onClick={() =>
              setSelectedCard({
                name: card.name,
                type: "Due this week",
                date: card.displayDate,
              })
            }
          >
            <div>
              <strong>{card.name}</strong>

              <p>
                {card.description || "No description available."}
              </p>
            </div>

            <div style={styles.overdueModalMeta}>
              <span>{card.displayDate}</span>

              <span>
                ●{" "}
                {card.memberNames?.length
                  ? card.memberNames.join(", ")
                  : "Unassigned"}
              </span>

              <span>{card.listName}</span>
            </div>
          </div>
        ))}

      {(!insightData?.cards ||
        insightData.cards.filter((card) => card.isDueThisWeek).length === 0) && (
        <div style={styles.moreCards}>
          No cards are due this week.
        </div>
      )}

      <div style={styles.overdueModalTip}>
        💡 Click on a card to view its details.
      </div>

      <div style={styles.overdueModalFooter}>
        <button
          style={styles.modalCloseButton}
          onClick={() => setShowDueWeekModal(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
{showDueWeekModal && (
  <div style={styles.overlay}>
    <div style={styles.overdueModal}>

      <button
        style={styles.overdueCloseButton}
        onClick={() => setShowDueWeekModal(false)}
      >
        ×
      </button>

      <h2 style={styles.overdueModalTitle}>
        🟠 Due This Week (6)
      </h2>

      <p style={styles.overdueModalSubtitle}>
        These cards are due within this week.
      </p>

      <div style={styles.overdueModalCard}>
        <div>
          <strong>Review ad creatives</strong>
          <p>Review and approve the latest advertising creatives.</p>
        </div>

        <div style={styles.overdueModalMeta}>
          <span>Sep 16</span>
          <span>● Priya</span>
          <span>Review</span>
        </div>
      </div>

      <div style={styles.overdueModalCard}>
        <div>
          <strong>Coordinate with agency</strong>
          <p>Coordinate with the agency on the upcoming campaign.</p>
        </div>

        <div style={styles.overdueModalMeta}>
          <span>Sep 17</span>
          <span>● Surbhi</span>
          <span>In Progress</span>
        </div>
      </div>

      <div style={styles.overdueModalCard}>
        <div>
          <strong>Test tracking setup</strong>
          <p>Verify that campaign tracking is working correctly.</p>
        </div>

        <div style={styles.overdueModalMeta}>
          <span>Sep 18</span>
          <span>● Rahul</span>
          <span>In Progress</span>
        </div>
      </div>

      <div style={styles.moreCards}>
        +3 more cards
      </div>

      <div style={styles.overdueModalTip}>
        💡 Tip: Click on a card to open it, or use the button to jump directly.
      </div>

      <div style={styles.overdueModalFooter}>
        <button
          style={styles.modalCloseButton}
          onClick={() => setShowDueWeekModal(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
      
    </div>
  );
}


/* ================= STAT CARD ================= */

function StatCard({ type, icon, value, title }) {
  return (
    <div
      style={{
        ...styles.statCard,
        ...(type === "total"
          ? styles.statTotal
          : type === "completed"
          ? styles.statCompleted
          : type === "due"
          ? styles.statDue
          : styles.statOverdue),
      }}
    >
      <div
        style={{
          ...styles.statIcon,
          ...(type === "total"
            ? styles.iconTotal
            : type === "completed"
            ? styles.iconCompleted
            : type === "due"
            ? styles.iconDue
            : styles.iconOverdue),
        }}
      >
        {icon}
      </div>

      <strong
        style={{
          ...styles.statValue,
          ...(type === "total"
            ? styles.valueTotal
            : type === "completed"
            ? styles.valueCompleted
            : type === "due"
            ? styles.valueDue
            : styles.valueOverdue),
        }}
      >
        {value}
      </strong>

      <span style={styles.statTitle}>{title}</span>
    </div>
  );
}

/* ================= ATTENTION CARD ================= */

function AttentionCard({ type, icon, title, description }) {
  return (
    <div
      style={{
        ...styles.attentionCard,
        ...(type === "overdue"
          ? styles.attentionOverdue
          : type === "due"
          ? styles.attentionDue
          : type === "unassigned"
          ? styles.attentionUnassigned
          : styles.attentionNoDate),
      }}
    >
      <div
        style={{
          ...styles.attentionIcon,
          ...(type === "overdue"
            ? styles.attentionIconOverdue
            : type === "due"
            ? styles.attentionIconDue
            : type === "unassigned"
            ? styles.attentionIconUnassigned
            : styles.attentionIconNoDate),
        }}
      >
        {icon}
      </div>

      <strong style={styles.attentionCount}>{title}</strong>

      <span style={styles.attentionDescription}>{description}</span>
    </div>
  );
}

/* ================= ATTENTION SECTION ================= */

function AttentionSection({ title, type, items, onSelect }) {
  return (
    <div style={styles.attentionSection}>
      <h3 style={styles.attentionTitle}>{title}</h3>

      {items.length === 0 ? (
        <div style={styles.noItems}>No cards in this category.</div>
      ) : (
        items.map((item) => (
          <div
            key={item.name}
            style={styles.attentionRow}
            onClick={() => onSelect(item)}
          >
            <div>
              <strong>{item.name}</strong>
              <div style={styles.smallText}>Due: {item.date}</div>
            </div>

            <span
              style={
                type === "overdue"
                  ? styles.dangerBadge
                  : styles.badge
              }
            >
              {item.type}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#172b4d",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
    padding: "10px 12px",
    fontSize: "11px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "7px",
  },

  titleSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  logo: {
    width: "22px",
    height: "25px",
    display: "flex",
    alignItems: "flex-end",
    gap: "2px",
  },

  logoBar1: {
    width: "5px",
    height: "11px",
    background: "#0c66e4",
    borderRadius: "2px",
  },

  logoBar2: {
    width: "5px",
    height: "17px",
    background: "#00a3bf",
    borderRadius: "2px",
  },

  logoBar3: {
    width: "5px",
    height: "22px",
    background: "#22c55e",
    borderRadius: "2px",
  },

  title: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "16px",
    fontWeight: 700,
  },

  subtitle: {
    margin: "2px 0 0",
    fontSize: "11px",
    fontWeight: 600,
  },

  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: "20px",
    lineHeight: 1,
    color: "#0c66e4",
    cursor: "pointer",
    padding: "0",
  },

  tabs: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    background: "#f4f5f7",
    borderRadius: "4px",
    marginBottom: "8px",
  },

  tab: {
    border: "none",
    background: "transparent",
    padding: "6px 4px",
    fontSize: "9px",
    color: "#5e6c84",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
  },

  activeTab: {
    color: "#0c66e4",
    borderBottom: "2px solid #0c66e4",
    background: "#ffffff",
  },

  controls: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "6px",
    marginBottom: "8px",
  },

  refreshButton: {
    border: "1px solid #dfe1e6",
    background: "#ffffff",
    borderRadius: "4px",
    padding: "4px 7px",
    fontSize: "9px",
    color: "#172b4d",
    cursor: "pointer",
  },

  sortSelect: {
    border: "1px solid #dfe1e6",
    background: "#ffffff",
    borderRadius: "4px",
    padding: "4px 5px",
    fontSize: "9px",
    color: "#172b4d",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "7px",
    marginBottom: "8px",
  },

  statCard: {
    minHeight: "61px",
    padding: "7px",
    borderRadius: "5px",
    boxSizing: "border-box",
    border: "1px solid #ebecf0",
  },

  statTotal: {
    background: "#e9f2ff",
  },

  statCompleted: {
    background: "#e3fcef",
  },

  statDue: {
    background: "#fff4e5",
  },

  statOverdue: {
    background: "#ffebe7",
  },

  statIcon: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "8px",
    fontWeight: 700,
    marginBottom: "3px",
  },

  iconTotal: {
    background: "#d6e4ff",
    color: "#0c66e4",
  },

  iconCompleted: {
    background: "#abf5d1",
    color: "#00875a",
  },

  iconDue: {
    background: "#ffdfc2",
    color: "#d97008",
  },

  iconOverdue: {
    background: "#ffc9c2",
    color: "#c9372c",
  },

  statValue: {
    display: "block",
    fontSize: "16px",
    lineHeight: "16px",
    marginBottom: "1px",
  },

  valueTotal: {
    color: "#0c66e4",
  },

  valueCompleted: {
    color: "#00875a",
  },

  valueDue: {
    color: "#d97008",
  },

  valueOverdue: {
    color: "#c9372c",
  },

  statTitle: {
    display: "block",
    fontSize: "8px",
    color: "#172b4d",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "7px",
    marginBottom: "8px",
  },

  panel: {
    background: "#ffffff",
    border: "1px solid #dfe1e6",
    borderRadius: "5px",
    padding: "8px",
    boxSizing: "border-box",
    marginBottom: "8px",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "7px",
  },

  panelTitle: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 700,
    color: "#172b4d",
  },

  viewAllButton: {
    border: "none",
    background: "transparent",
    color: "#0c66e4",
    fontSize: "8px",
    cursor: "pointer",
    padding: 0,
  },

  stageRow: {
    marginBottom: "6px",
  },

  rowHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "3px",
    fontSize: "8px",
  },

  progressBackground: {
    height: "7px",
    width: "100%",
    background: "#ebecf0",
    borderRadius: "3px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: "3px",
  },

  memberInfo: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  memberAvatar: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "7px",
    fontWeight: 700,
    flexShrink: 0,
  },

  attentionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "7px",
  },

  attentionCard: {
    minHeight: "65px",
    padding: "7px",
    borderRadius: "5px",
    boxSizing: "border-box",
    border: "1px solid #ebecf0",
  },

  attentionOverdue: {
    background: "#fff0ee",
  },

  attentionDue: {
    background: "#fff6ed",
  },

  attentionUnassigned: {
    background: "#fff9e6",
  },

  attentionNoDate: {
    background: "#eaf3ff",
  },

  attentionIcon: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "8px",
    fontWeight: 700,
    marginBottom: "4px",
  },

  attentionIconOverdue: {
    background: "#c9372c",
    color: "#ffffff",
  },

  attentionIconDue: {
    background: "#d97008",
    color: "#ffffff",
  },

  attentionIconUnassigned: {
    background: "#f59e0b",
    color: "#ffffff",
  },

  attentionIconNoDate: {
    background: "#0c66e4",
    color: "#ffffff",
  },

  attentionCount: {
    display: "block",
    fontSize: "8px",
    lineHeight: "10px",
    marginBottom: "2px",
  },

  attentionDescription: {
    display: "block",
    fontSize: "7px",
    lineHeight: "9px",
    color: "#5e6c84",
  },

  tip: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "#eaf3ff",
    borderRadius: "4px",
    padding: "7px 8px",
    fontSize: "7px",
    color: "#172b4d",
    marginBottom: "5px",
  },

  tipIcon: {
    color: "#0c66e4",
    fontSize: "12px",
  },

  detailRow: {
    marginBottom: "18px",
  },

  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "7px",
    fontSize: "11px",
  },

  largeProgressBackground: {
    height: "14px",
    width: "100%",
    background: "#ebecf0",
    borderRadius: "5px",
    overflow: "hidden",
  },

  teamDetailRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: "15px",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #ebecf0",
    fontSize: "11px",
  },

  boardButton: {
    border: "none",
    background: "transparent",
    color: "#0c66e4",
    fontSize: "9px",
    cursor: "pointer",
  },

  attentionSection: {
    marginBottom: "18px",
  },

  attentionTitle: {
    fontSize: "11px",
    fontWeight: 700,
    margin: "0 0 6px",
  },

  attentionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "9px 0",
    borderBottom: "1px solid #ebecf0",
    cursor: "pointer",
  },

  smallText: {
    fontSize: "9px",
    color: "#5e6c84",
    marginTop: "3px",
  },

  badge: {
    padding: "4px 6px",
    borderRadius: "4px",
    background: "#eaf3ff",
    color: "#0c66e4",
    fontSize: "8px",
  },

  dangerBadge: {
    padding: "4px 6px",
    borderRadius: "4px",
    background: "#ffebe7",
    color: "#c9372c",
    fontSize: "8px",
  },

  noItems: {
    padding: "8px 0",
    color: "#5e6c84",
    fontSize: "9px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(9, 30, 66, 0.54)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    position: "relative",
    width: "380px",
    background: "#ffffff",
    borderRadius: "8px",
    padding: "18px",
    boxShadow: "0 8px 24px rgba(9, 30, 66, 0.25)",
  },

  closeModalButton: {
    position: "absolute",
    top: "8px",
    right: "10px",
    border: "none",
    background: "transparent",
    fontSize: "20px",
    cursor: "pointer",
    color: "#5e6c84",
  },

  modalTitle: {
    margin: "0 30px 15px 0",
    fontSize: "15px",
  },

  modalRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "9px 0",
    borderBottom: "1px solid #ebecf0",
    fontSize: "10px",
  },

    stageTopGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "7px",
    marginBottom: "7px",
  },

  stageChartPanel: {
    border: "1px solid #dfe1e6",
    borderRadius: "5px",
    padding: "9px",
    background: "#ffffff",
    height: "185px",
    boxSizing: "border-box",
  },

  stageBreakdownPanel: {
    border: "1px solid #dfe1e6",
    borderRadius: "5px",
    padding: "9px",
    background: "#ffffff",
    height: "185px",
    boxSizing: "border-box",
  },

  chartSubtitle: {
    fontSize: "8px",
    color: "#5e6c84",
    marginTop: "3px",
  },

  chartArea: {
    height: "130px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderBottom: "1px solid #dfe1e6",
    marginTop: "4px",
  },

  chartColumn: {
    height: "125px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "2px",
  },

  chartValue: {
    fontSize: "9px",
    color: "#172b4d",
  },

  chartBar: {
    width: "32px",
    minHeight: "12px",
    borderRadius: "4px 4px 0 0",
  },

  chartLabel: {
    fontSize: "7px",
    color: "#5e6c84",
    marginBottom: "3px",
  },

  breakdownRow: {
    marginTop: "9px",
  },

  breakdownTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "8px",
    marginBottom: "3px",
  },

  percentage: {
    color: "#5e6c84",
    marginLeft: "10px",
  },

  stageCardsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "7px",
    marginBottom: "7px",
  },

  stageCardPanel: {
    border: "1px solid #dfe1e6",
    borderRadius: "5px",
    background: "#ffffff",
    padding: "8px",
  },

  stageCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
    fontSize: "8px",
  },

  stageDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginRight: "5px",
  },

  cardListRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "27px",
    borderTop: "1px solid #ebecf0",
    fontSize: "8px",
    gap: "5px",
  },

  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#5e6c84",
    whiteSpace: "nowrap",
  },

  cardMember: {
    width: "17px",
    height: "17px",
    borderRadius: "50%",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "7px",
    fontWeight: 700,
  },

  arrow: {
    color: "#0c66e4",
    fontSize: "14px",
  },

  moreCards: {
    color: "#0c66e4",
    fontSize: "8px",
    paddingTop: "5px",
  },
    teamMainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "7px",
    marginBottom: "7px",
  },

  teamWorkloadPanel: {
    border: "1px solid #dfe1e6",
    borderRadius: "5px",
    padding: "9px",
    background: "#ffffff",
    boxSizing: "border-box",
  },

  teamCardsPanel: {
    border: "1px solid #dfe1e6",
    borderRadius: "5px",
    padding: "9px",
    background: "#ffffff",
    boxSizing: "border-box",
  },

  teamPanelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  teamSelect: {
    border: "1px solid #dfe1e6",
    borderRadius: "4px",
    padding: "5px 7px",
    fontSize: "8px",
    color: "#172b4d",
    background: "#ffffff",
  },

  teamWorkloadRow: {
    display: "grid",
    gridTemplateColumns: "90px 1fr 20px",
    alignItems: "center",
    gap: "7px",
    marginBottom: "8px",
  },

  teamMemberName: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "8px",
  },

  teamWorkloadBarBackground: {
    height: "12px",
    background: "#ebecf0",
    borderRadius: "3px",
    overflow: "hidden",
  },

  teamWorkloadBar: {
    height: "100%",
    borderRadius: "3px",
  },

  teamCount: {
    fontSize: "8px",
    textAlign: "right",
  },

  teamLegend: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "17px",
    fontSize: "7px",
    color: "#5e6c84",
  },

  legendDot: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    marginRight: "4px",
  },

  keyInsight: {
    display: "flex",
    gap: "8px",
    background: "#eaf3ff",
    borderRadius: "5px",
    padding: "9px",
    marginTop: "17px",
    fontSize: "8px",
  },

  keyInsightIcon: {
    color: "#0c66e4",
    fontSize: "18px",
  },

  keyInsightText: {
    margin: "4px 0 0",
    color: "#5e6c84",
    lineHeight: "12px",
  },

  memberCard: {
    border: "1px solid #ebecf0",
    borderRadius: "5px",
    padding: "8px",
    marginBottom: "5px",
    background: "#ffffff",
  },

  memberCardName: {
    fontSize: "8px",
    fontWeight: 600,
    marginBottom: "6px",
  },

  memberCardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "7px",
    color: "#5e6c84",
  },

  stageBadge: {
    padding: "4px 6px",
    borderRadius: "4px",
    fontSize: "7px",
  },
  attentionStatsGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "7px",
  marginBottom: "8px",
},

attentionStat: {
  borderRadius: "5px",
  padding: "7px",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  boxSizing: "border-box",
  minHeight: "55px",
},

attentionStatIcon: {
  fontSize: "12px",
  fontWeight: 700,
},

attentionPanel: {
  border: "1px solid #dfe1e6",
  borderRadius: "5px",
  padding: "9px",
  background: "#ffffff",
},

attentionSectionHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "4px",
  fontSize: "8px",
},

attentionDot: {
  display: "inline-block",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  marginRight: "4px",
},

attentionCardRow: {
  display: "grid",
  gridTemplateColumns: "16px 1fr 55px 60px 20px 65px",
  alignItems: "center",
  gap: "5px",
  minHeight: "30px",
  borderBottom: "1px solid #ebecf0",
  cursor: "pointer",
  fontSize: "7px",
},

attentionCardIcon: {
  color: "#5e6c84",
  fontSize: "9px",
},

attentionCardName: {
  fontWeight: 600,
  color: "#172b4d",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
},

attentionDate: {
  color: "#e8590c",
  background: "#fff4ed",
  padding: "3px",
  borderRadius: "3px",
  textAlign: "center",
},

attentionDateDanger: {
  color: "#d92d20",
  background: "#fff0f2",
  padding: "3px",
  borderRadius: "3px",
  textAlign: "center",
},

weekBadge: {
  color: "#0c66e4",
  background: "#eaf3ff",
  padding: "4px",
  borderRadius: "3px",
  textAlign: "center",
  fontSize: "6px",
},

attentionAvatar: {
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  fontSize: "7px",
  fontWeight: 600,
},

attentionStage: {
  color: "#5e6c84",
  fontSize: "7px",
},


overdueModal: {
  position: "relative",
  width: "360px",
  maxHeight: "420px",
  overflowY: "auto",
  background: "#ffffff",
  borderRadius: "8px",
  padding: "14px",
  boxShadow: "0 8px 24px rgba(9, 30, 66, 0.25)",
  boxSizing: "border-box",
},

overdueCloseButton: {
  position: "absolute",
  top: "8px",
  right: "10px",
  border: "none",
  background: "transparent",
  color: "#5e6c84",
  fontSize: "20px",
  cursor: "pointer",
},

overdueModalTitle: {
  fontSize: "13px",
  color: "#172b4d",
  margin: "0 0 3px",
},

overdueModalSubtitle: {
  fontSize: "7px",
  color: "#5e6c84",
  margin: "0 0 10px",
},

overdueModalCard: {
  borderBottom: "1px solid #ebecf0",
  padding: "9px 0",
},





overdueModalMeta: {
  display: "flex",
  gap: "8px",
  fontSize: "7px",
  color: "#5e6c84",
},

overdueModalTip: {
  background: "#edf5ff",
  borderRadius: "4px",
  padding: "7px",
  marginTop: "10px",
  fontSize: "7px",
  color: "#172b4d",
},

overdueModalFooter: {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "8px",
},

modalCloseButton: {
  border: "none",
  background: "#dfe1e6",
  color: "#172b4d",
  borderRadius: "4px",
  padding: "5px 12px",
  fontSize: "7px",
  cursor: "pointer",
},
};