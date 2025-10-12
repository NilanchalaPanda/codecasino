import { createBrowserClient } from "@supabase/ssr";
import { ENV_VARS } from "../utils/constants";

export const createClient = () => {
  return createBrowserClient(ENV_VARS.SUPABASE_URL, ENV_VARS.SUPABASE_ANON_KEY);
};

export const supabase = createClient();