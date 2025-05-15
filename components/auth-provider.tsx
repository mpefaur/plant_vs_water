"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Session, User, AuthApiError } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setIsLoading(false);
        return;
      }

      if (!data.session) {
        console.warn("No active session found.");
        setIsLoading(false);
        return;
      }

      setSession(data.session);
      setUser(data.session.user);
      setIsLoading(false);
    };

    validateSession();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
        console.log("Auth state updated: user=", session?.user, "session=", session);

        if (session?.access_token) {
          console.log("Storing access token in localStorage:", session.access_token);
          localStorage.setItem("access_token", session.access_token);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign up user with email:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000",
        },
      });

      if (error) {
        console.error("Error during sign up:", error);
        if (error instanceof AuthApiError) {
          console.error("Auth API Error details:", error.message);
          console.error("Full error object:", error);
        } else {
          console.error("Unexpected error during sign up:", error);
        }
        throw error;
      }

      console.log("User signed up successfully:", data);
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in user with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error during sign in:", error);
        if (error instanceof AuthApiError) {
          console.error("Auth API Error details:", error.message);
        } else {
          console.error("Unexpected error during sign in:", error);
        }
        throw error;
      }

      console.log("User signed in successfully:", data);
      setSession(data.session);
      setUser(data.user);
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    router.push("/auth/signin");
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};