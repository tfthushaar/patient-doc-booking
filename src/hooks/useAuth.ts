import { useState, useEffect } from "react";
import { supabase } from "@/db/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/types";
import { getCurrentUserProfile } from "@/db/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          if (isMounted) setLoading(false);
          return;
        }

        if (isMounted) {
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadProfile();
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Auth initialization failed");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile();
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadProfile() {
    try {
      const profileData = await getCurrentUserProfile();
      setProfile(profileData);
      setError(null);
    } catch (err) {
      console.error("Profile loading error:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = profile?.role === "admin";

  return { user, profile, loading, error, isAdmin };
}

