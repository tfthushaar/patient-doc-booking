import { useState, useEffect } from "react";
import { supabase } from "@/db/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/types";
import { getCurrentUserProfile } from "@/db/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile();
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile() {
    const profileData = await getCurrentUserProfile();
    setProfile(profileData);
    setLoading(false);
  }

  const isAdmin = profile?.role === "admin";

  return { user, profile, loading, isAdmin };
}
