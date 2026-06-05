const cardStyle = {
  background: "var(--ivory)",
  border: "1px solid var(--line)",
  borderTop: "3px solid var(--navy-700)",
  borderRadius: "var(--r-md)",
  boxShadow: "var(--shadow-sm)",
  padding: "24px 26px 26px",
};

const ACTION_LABELS = {
  connexion: { label: "Connexion", color: "var(--navy-600)" },
  modification: { label: "Modification", color: "var(--gold-700)" },
  gestion: { label: "Gestion des droits", color: "var(--liturgic-purple)" },
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ActivityLog({ events = [] }) {
  return (
    <section style={cardStyle}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: 24, color: "var(--navy-700)", margin: "0 0 4px" }}>
        Journal d'activité
      </h2>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)", margin: "0 0 18px" }}>
        Connexions et modifications récentes (100 dernières).
      </p>

      {events.length === 0 ? (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--stone-500)" }}>Aucune activité enregistrée.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--stone-500)", borderBottom: "1px solid var(--line)" }}>
                <th style={{ padding: "8px 10px", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "8px 10px", fontWeight: 600 }}>Utilisateur</th>
                <th style={{ padding: "8px 10px", fontWeight: 600 }}>Action</th>
                <th style={{ padding: "8px 10px", fontWeight: 600 }}>Détail</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => {
                const a = ACTION_LABELS[ev.action] || { label: ev.action, color: "var(--ink-soft)" };
                return (
                  <tr key={ev.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "8px 10px", whiteSpace: "nowrap", color: "var(--ink-soft)" }}>{formatDate(ev.created_at)}</td>
                    <td style={{ padding: "8px 10px", color: "var(--navy-800)", fontWeight: 600 }}>{ev.user_email || "—"}</td>
                    <td style={{ padding: "8px 10px", color: a.color, fontWeight: 600 }}>{a.label}</td>
                    <td style={{ padding: "8px 10px", color: "var(--ink-soft)" }}>{ev.detail || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
