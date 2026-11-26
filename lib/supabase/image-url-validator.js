// Validate that image URLs only come from allowed sources: Supabase Storage or the project itself
export function isAllowedImageUrl(url) {
  if (!url || typeof url !== "string") return true; // null/empty is ok
  const trimmed = url.trim();
  if (!trimmed) return true; // empty is ok
  try {
    const parsed = new URL(trimmed);
    const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "");
    return (
      // Supabase Storage URLs (project.supabase.co)
      parsed.hostname.includes("supabase.co") ||
      // Project URLs (localhost, pelesaintmichel.vercel.app, etc.)
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname.includes("vercel.app") ||
      parsed.hostname === "pelesaintmichel.fr" ||
      parsed.hostname === "www.pelesaintmichel.fr"
    );
  } catch {
    return false; // invalid URL
  }
}
