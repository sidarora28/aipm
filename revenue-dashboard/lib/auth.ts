/** Edge-safe password gate. The cookie holds a SHA-256 of the password,
 *  never the password itself. */
export const COOKIE = "japm_dash";

export async function tokenFor(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`japm-dash:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time string compare. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
