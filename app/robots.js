// Robots : on autorise explicitement les principaux robots d'IA génératives
// (pour être indexé/cité), tout en gardant l'admin hors d'accès.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Bytespider",
];

export default function robots() {
  return {
    rules: [
      { userAgent: AI_BOTS, allow: "/", disallow: "/admin" },
      { userAgent: "*", allow: "/", disallow: "/admin" },
    ],
    sitemap: "https://www.pelesaintmichel.fr/sitemap.xml",
    host: "https://www.pelesaintmichel.fr",
  };
}
