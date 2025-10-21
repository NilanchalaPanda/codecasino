// components/providers/UserProvider.tsx
"use client";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useUserStore();
  useEffect(() => {
    fetchUser();
  }, []);
  return <>{children}</>;
}
