/**
 * Centralized admin PIN verification.
 * Fails CLOSED if ADMIN_PIN is missing or weak.
 */
export function verifyAdminPin(
  pin: string | null | undefined
): { ok: true } | { ok: false; error: string; status: number } {
  const expected = process.env.ADMIN_PIN;

  // Fail closed if server misconfigured
  if (!expected || expected.trim().length === 0) {
    console.error("❌ CRITICAL: ADMIN_PIN is not set in environment");
    return {
      ok: false,
      error: "Server admin authentication is not configured",
      status: 500,
    };
  }

  // Refuse to authorize if still using insecure default
  if (expected === "1234") {
    console.error("❌ CRITICAL: ADMIN_PIN is still the default value");
    return {
      ok: false,
      error: "Server admin PIN must be changed from default",
      status: 500,
    };
  }

  // Reject missing/empty/non-string pins
  if (!pin || typeof pin !== "string") {
    return { ok: false, error: "Unauthorized", status: 401 };
  }

  // Reject wrong pins
  if (pin !== expected) {
    return { ok: false, error: "Unauthorized", status: 401 };
  }

  return { ok: true };
}