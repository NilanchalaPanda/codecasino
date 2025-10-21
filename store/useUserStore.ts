// store/useUserStore.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";

type User = {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  vp_balance: number;
  vp_lifetime_earned: number;
  // Add other fields as needed
};

type UserStore = {
  user: User | null;
  session: any;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  fetchUser: async () => {
    set({ isLoading: true });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      set({ user: profile, session, isLoading: false });
    } else {
      set({ user: null, session: null, isLoading: false });
    }
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
