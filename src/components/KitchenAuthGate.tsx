import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

interface KitchenAuthGateProps {
  children: React.ReactNode;
}

const KitchenAuthGate = ({ children }: KitchenAuthGateProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  const validatingRef = useRef(false);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const checkRole = useCallback(async (userId: string): Promise<boolean | null> => {
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .in('role', ['staff', 'admin'])
          .limit(1);

        if (error) {
          lastError = error;
        } else {
          return (roles?.length ?? 0) > 0;
        }
      } catch (err) {
        lastError = err;
      }

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }

    console.error('KitchenAuthGate: Role check failed after retries:', lastError);
    return null;
  }, []);

  const redirectToLogin = useCallback(() => {
    if (!mountedRef.current) return;
    setSession(null);
    setAuthorized(false);
    setLoading(false);
    navigate('/staff/login', { replace: true });
  }, [navigate]);

  const validateSessionAccess = useCallback(async (activeSession: Session | null) => {
    if (!mountedRef.current) return;

    // No session → redirect
    if (!activeSession) {
      redirectToLogin();
      return;
    }

    // Prevent concurrent validations
    if (validatingRef.current) return;
    validatingRef.current = true;

    setSession(activeSession);

    const hasAccess = await checkRole(activeSession.user.id);
    validatingRef.current = false;
    if (!mountedRef.current) return;

    if (hasAccess === true) {
      setAuthorized(true);
      setLoading(false);
      // Clear safety timeout on success
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = undefined;
      }
      return;
    }

    // No access or check failed
    if (hasAccess === false) {
      await supabase.auth.signOut();
    }
    redirectToLogin();
  }, [checkRole, redirectToLogin]);

  useEffect(() => {
    mountedRef.current = true;

    // Safety timeout: if nothing resolves in 8s, redirect to login
    safetyTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      console.error('KitchenAuthGate: Loading timed out after 8s');
      redirectToLogin();
    }, 8000);

    // Primary: restore session from storage
    supabase.auth
      .getSession()
      .then(({ data: { session: existingSession } }) => {
        if (!mountedRef.current) return;
        void validateSessionAccess(existingSession);
      })
      .catch((err) => {
        console.error('KitchenAuthGate getSession error:', err);
        redirectToLogin();
      });

    // Secondary: listen for auth state changes
    // IMPORTANT: Do NOT await inside this callback to avoid blocking Supabase event processing
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mountedRef.current) return;

      if (event === 'SIGNED_OUT') {
        redirectToLogin();
        return;
      }

      if (event === 'TOKEN_REFRESHED' && newSession) {
        setSession(newSession);
        return;
      }

      if (event === 'SIGNED_IN' && newSession) {
        // Defer to avoid blocking Supabase's auth event processing
        setTimeout(() => {
          if (mountedRef.current) {
            void validateSessionAccess(newSession);
          }
        }, 0);
      }
    });

    return () => {
      mountedRef.current = false;
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      subscription.unsubscribe();
    };
  }, [navigate, redirectToLogin, validateSessionAccess]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !authorized) {
    return null;
  }

  return <>{children}</>;
};

export default KitchenAuthGate;
