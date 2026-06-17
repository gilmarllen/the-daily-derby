// Client-safe OAuth provider metadata (no server-only imports — used by both
// the server helper that queries enablement and the client buttons).

// The providers this app offers, keyed by the id used in the UI / i18n.
export type OAuthProvider =
  | "apple"
  | "azure"
  | "discord"
  | "facebook"
  | "google"
  | "x";

// Map our UI id → the provider id Supabase uses (for both the settings map and
// `signInWithOAuth`). X is still called `twitter` in GoTrue.
export const SUPABASE_PROVIDER_ID: Record<OAuthProvider, string> = {
  apple: "apple",
  azure: "azure",
  discord: "discord",
  facebook: "facebook",
  google: "google",
  x: "twitter",
};

export const ALL_PROVIDERS = Object.keys(
  SUPABASE_PROVIDER_ID
) as OAuthProvider[];
