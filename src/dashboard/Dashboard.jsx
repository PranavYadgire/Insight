import React, { useEffect, useState } from "react";

export default function Dashboard({ t }) {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCards() {
      try {
        const boardCards = await t.cards("all");

        setCards(boardCards || []);
      } catch (err) {
        console.error("Failed to load Trello cards:", err);
        setError("Unable to load Trello cards.");
      } finally {
        setLoading(false);
      }
    }

    loadCards();
  }, [t]);

  if (loading) {
    return (
      <div style={styles.page}>
        <h1>Insight</h1>
        <p>Loading board data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1>Insight</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Insight Dashboard</h1>

      <div style={styles.cards}>
        <div style={styles.statCard}>
          <span>Total Cards</span>
          <strong>{cards.length}</strong>
        </div>

        <div style={styles.statCard}>
          <span>Completed</span>
          <strong>0</strong>
        </div>

        <div style={styles.statCard}>
          <span>Due This Week</span>
          <strong>0</strong>
        </div>

        <div style={styles.statCard}>
          <span>Overdue</span>
          <strong>0</strong>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Board Cards</h2>

        {cards.length === 0 ? (
          <p>No cards found on this board.</p>
        ) : (
          cards.map((card) => (
            <div key={card.id} style={styles.cardRow}>
              <span>{card.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#f7f8f9",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#172b4d",
    boxSizing: "border-box",
  },

  title: {
    marginTop: 0,
    marginBottom: "24px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  section: {
    background: "#ffffff",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  },

  cardRow: {
    padding: "12px 0",
    borderBottom: "1px solid #dfe1e6",
  },
};