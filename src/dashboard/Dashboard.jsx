import React, { useState } from "react";

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
    { name: "Completed", count: 5 },
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
};

export default function Dashboard({ t }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [sortBy, setSortBy] = useState("Due date — Oldest first");
  const [selectedCard, setSelectedCard] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

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

        <button style={styles.closeButton}>×</button>
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
      <div style={styles.controls}>
        <button style={styles.refreshButton} onClick={handleRefresh}>
          {refreshing ? "Refreshing..." : "↻ Refresh"}
        </button>

        <select
          style={styles.sortSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option>Due date — Oldest first</option>
          <option>Due date — Newest first</option>
          <option>Priority — Highest first</option>
          <option>Checklist progress — Lowest first</option>
          <option>Card name — A–Z</option>
        </select>
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab === "Overview" && (
        <>
          {/* STAT CARDS */}
          <div style={styles.statsGrid}>
            <StatCard
              type="total"
              icon="▣"
              value={sampleData.overview.total}
              title="Total Cards"
            />

            <StatCard
              type="completed"
              icon="✓"
              value={sampleData.overview.completed}
              title="Completed"
            />

            <StatCard
              type="due"
              icon="◷"
              value={sampleData.overview.dueThisWeek}
              title="Due this week"
            />

            <StatCard
              type="overdue"
              icon="!"
              value={sampleData.overview.overdue}
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

              {sampleData.stages.map((stage) => (
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
                          (stage.count / sampleData.overview.total) * 100
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

              {sampleData.team.map((member) => (
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
                title="3 overdue cards"
                description="These cards are past their due date"
              />

              <AttentionCard
                type="due"
                icon="◷"
                title="6 cards due this week"
                description="Due in the next 7 days"
              />

              <AttentionCard
                type="unassigned"
                icon="●"
                title="2 unassigned cards"
                description="No member assigned"
              />

              <AttentionCard
                type="noDate"
                icon="▣"
                title="1 card without due date"
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
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Work by Stage</h2>

          {sampleData.stages.map((stage) => (
            <div key={stage.name} style={styles.detailRow}>
              <div style={styles.detailHeader}>
                <span>{stage.name}</span>
                <strong>{stage.count} cards</strong>
              </div>

              <div style={styles.largeProgressBackground}>
                <div
                  style={{
                    ...styles.progressBar,
                    height: "100%",
                    background:
                      stage.name === "Planning"
                        ? "#0c66e4"
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
      )}

      {/* ================= TEAM ================= */}
      {activeTab === "Team" && (
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Team Workload</h2>

          {sampleData.team.map((member) => (
            <div key={member.name} style={styles.teamDetailRow}>
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

              <strong>{member.count} cards</strong>

              <button style={styles.boardButton}>View on board</button>
            </div>
          ))}
        </div>
      )}

      {/* ================= NEEDS ATTENTION ================= */}
      {activeTab === "Needs Attention" && (
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Needs Attention</h2>

          <AttentionSection
            title="Overdue"
            type="overdue"
            items={sampleData.attention.filter(
              (item) => item.type === "Overdue"
            )}
            onSelect={setSelectedCard}
          />

          <AttentionSection
            title="Due This Week"
            type="due"
            items={sampleData.attention.filter(
              (item) => item.type === "Due this week"
            )}
            onSelect={setSelectedCard}
          />

          <AttentionSection
            title="Unassigned"
            type="unassigned"
            items={sampleData.attention.filter(
              (item) => item.type === "Unassigned"
            )}
            onSelect={setSelectedCard}
          />

          <AttentionSection
            title="No Due Date"
            type="noDate"
            items={sampleData.attention.filter(
              (item) => item.type === "No due date"
            )}
            onSelect={setSelectedCard}
          />
        </div>
      )}

      {/* CARD POPUP */}
      {selectedCard && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeModalButton}
              onClick={() => setSelectedCard(null)}
            >
              ×
            </button>

            <h2 style={styles.modalTitle}>{selectedCard.name}</h2>

            <div style={styles.modalRow}>
              <strong>Status</strong>
              <span>{selectedCard.type}</span>
            </div>

            <div style={styles.modalRow}>
              <strong>Due date</strong>
              <span>{selectedCard.date}</span>
            </div>

            <div style={styles.modalRow}>
              <strong>Priority</strong>
              <span>High</span>
            </div>

            <div style={styles.modalRow}>
              <strong>Assigned to</strong>
              <span>Unassigned</span>
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
};