import { signOut } from "@/app/admin/actions";

export default function AccessDenied({ email }) {
  return (
    <main style={{ minHeight: "100vh", background: "var(--navy-900)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <h1 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-200)", fontSize: 26 }}>Accès non autorisé</h1>
        <p style={{ fontFamily: "var(--font-sans)", color: "var(--fg-on-deep-muted)", fontSize: 15, lineHeight: 1.6 }}>
          Le compte <b style={{ color: "var(--gold-300)" }}>{email}</b> n'est pas autorisé à modifier le site.
          Demandez à l'administrateur de vous ajouter.
        </p>
        <form action={signOut}>
          <button style={{ marginTop: 16, fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--navy-800)", background: "var(--gold-500)", border: "none", borderRadius: "var(--r-sm)", padding: "11px 20px", cursor: "pointer" }}>
            Se déconnecter
          </button>
        </form>
      </div>
    </main>
  );
}
