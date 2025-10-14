import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * 1️⃣ Supabase Admin Client (Service Role)
 * Used only on the backend (services, cron jobs, etc.)
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * 2️⃣ Universal cookie resolver
 * Handles both sync and async `cookies()` (Next 13–15)
 */
async function getCookieStore() {
  const maybeStore = cookies();
  return maybeStore instanceof Promise ? await maybeStore : maybeStore;
}

/**
 * 3️⃣ Create Supabase Server Client (SSR-aware)
 */
export async function createSupabaseServerClient() {
  const cookieStore = await getCookieStore();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: any) {
          try {
            // ✅ Check if the store supports mutation (Next 15)
            if (typeof cookieStore.set === "function") {
              // @ts-ignore – Next 15 typings can differ
              cookieStore.set(name, value, options);
            }
          } catch {
            // Silent fallback (read-only cookieStore)
          }
        },
        remove(name: string, options?: any) {
          try {
            if (typeof cookieStore.delete === "function") {
              // @ts-ignore – Next 15 typings can differ
              cookieStore.delete(name, options);
            }
          } catch {
            // Silent fallback (read-only cookieStore)
          }
        },
      },
    }
  );
}

/**
 * 4️⃣ Require Auth Helper
 * - Ensures only logged-in users can access API routes
 */
export async function requireAuth() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}
