import { NextRequest } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SEED_SESSIONS, SEED_USERS } from "./seed-data";
import { VeritasSession, VeritasUser } from "./types";

export const SESSION_COOKIE_NAME = "veritas_session_token";

export interface AuthenticatedContext {
  user: VeritasUser | null;
  session: VeritasSession | null;
  token: string | null;
}

export async function resolveAuthenticatedUser(
  request: NextRequest,
  adminClient?: SupabaseClient | null
): Promise<AuthenticatedContext> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value?.trim() || null;
  if (!token) {
    return { user: null, session: null, token: null };
  }

  const supabase = adminClient ?? getSupabaseAdmin();
  if (!supabase) {
    const seedSession = SEED_SESSIONS.find(
      (s) => s.session_token === token && s.is_active
    );
    if (!seedSession) return { user: null, session: null, token };
    const seedUser = SEED_USERS.find((u) => u.id === seedSession.user_id) || null;
    return { user: seedUser, session: seedSession, token };
  }

  const { data: sessionData, error: sessionError } = await supabase
    .from("veritas_sessions")
    .select("*")
    .eq("session_token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (sessionError || !sessionData) {
    return { user: null, session: null, token };
  }

  const session = sessionData as VeritasSession;
  const { data: userData, error: userError } = await supabase
    .from("veritas_users")
    .select("*")
    .eq("id", session.user_id)
    .maybeSingle();

  if (userError || !userData) {
    return { user: null, session: null, token };
  }

  await supabase
    .from("veritas_sessions")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", session.id);

  return {
    user: userData as VeritasUser,
    session,
    token,
  };
}

export async function recordActivityLog(
  supabase: SupabaseClient | null,
  params: {
    userId: string | null;
    userName: string;
    userRole: string;
    actionType: string;
    description: string;
  }
): Promise<void> {
  if (!supabase) return;
  await supabase.from("veritas_activity_logs").insert({
    user_id: params.userId,
    user_name: params.userName,
    user_role: params.userRole,
    action_type: params.actionType,
    description: params.description,
  });
}

export function buildDeviceLabel(request: NextRequest, explicitLabel?: string): string {
  if (explicitLabel?.trim()) return explicitLabel.trim().slice(0, 80);
  const ua = request.headers.get("user-agent") || "";
  if (/mobile|iphone|android/i.test(ua)) return "Navegador Mobile";
  if (/firefox/i.test(ua)) return "Desktop Firefox";
  if (/chrome|edg/i.test(ua)) return "Desktop Chromium";
  return "Navegador Web";
}

export function extractMaskedIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for") || "189.12.0.40";
  const ip = fwd.split(",")[0].trim();
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.${parts[3]}`;
  }
  return "ip-protegido";
}
