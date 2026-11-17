import crypto from "crypto";

const SEED_PEPPER = "veritas-unimax-2026-salt";

export function hashSeedPassword(rawPassword: string): string {
  const digest = crypto
    .createHash("sha256")
    .update(`${SEED_PEPPER}:${rawPassword}`)
    .digest("hex");
  return `seed_v1:${digest}`;
}

export function hashPassword(rawPassword: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(rawPassword, salt, 32).toString("hex");
  return `scrypt_v2:${salt}:${derived}`;
}

export function verifyPassword(rawPassword: string, storedHash?: string): boolean {
  if (!storedHash || !rawPassword) return false;

  if (storedHash.startsWith("seed_v1:")) {
    const expected = hashSeedPassword(rawPassword);
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(storedHash, "utf8");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  if (storedHash.startsWith("scrypt_v2:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 3) return false;
    const [, salt, hashHex] = parts;
    if (!salt || !hashHex) return false;
    const derived = crypto.scryptSync(rawPassword, salt, 32);
    const storedBuf = Buffer.from(hashHex, "hex");
    return (
      derived.length === storedBuf.length &&
      crypto.timingSafeEqual(derived, storedBuf)
    );
  }

  return false;
}

export function generateSecureToken(prefix: string, bytes = 12): string {
  return `${prefix}-${crypto.randomBytes(bytes).toString("hex")}`;
}
