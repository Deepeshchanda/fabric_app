const ADMIN_EMAILS = new Set(['tharunchinnam@drreddys.com']);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.trim().toLowerCase());
}
