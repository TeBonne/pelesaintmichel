import { signOut } from "@/app/admin/actions";
import { SaveBarProvider, StickySaveBar } from "./SaveBarContext";

export default function AdminShell({ title, backHref = "/admin", showBack = true, children }) {
  return (
    <SaveBarProvider>
    <div style={{ minHeight: "100vh", background: "var(--parchment)" }}>
      <header style={{ background: "var(--navy-900)", color: "var(--gold-100)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo-medallion-cream.png" alt="" style={{ height: 40 }} />
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15, letterSpacing: "0.04em", color: "var(--gold-200)" }}>
          {title}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          {showBack && (
            <a href={backHref} style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold-300)", textDecoration: "none" }}>
              ← Tableau de bord
            </a>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--gold-300)", textDecoration: "none" }}>
            Voir le site ↗
          </a>
          <form action={signOut}>
            <button style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--gold-100)", background: "rgba(201,164,94,0.16)", border: "1px solid var(--line-on-deep)", borderRadius: "var(--r-sm)", padding: "7px 14px", cursor: "pointer" }}>
              Se déconnecter
            </button>
          </form>
        </div>
      </header>
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px 110px", display: "flex", flexDirection: "column", gap: 28 }}>
        {children}
      </main>
      <StickySaveBar />
    </div>
    </SaveBarProvider>
  );
}
