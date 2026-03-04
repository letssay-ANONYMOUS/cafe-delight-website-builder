import { useEffect, useState } from "react";
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

  useEffect(() => {
    let mounted = true;

    // Safety timeout - never stay loading forever
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.error('KitchenAuthGate: Loading timed out after 8s');
        setLoading(false);
        navigate('/staff/login');
      }
    }, 8000);

    const checkRole = async (userId: string): Promise<boolean> => {
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);

        if (error) {
          console.error('Role check error:', error);
          return false;
        }

        return roles?.some((r: any) => r.role === 'staff' || r.role === 'admin') ?? false;
      } catch (err) {
        console.error('Role check exception:', err);
        return false;
      }
    };

    // Check existing session first
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      if (!mounted) return;

      if (!existingSession) {
        setLoading(false);
        navigate('/staff/login');
        return;
      }

      setSession(existingSession);
      const hasAccess = await checkRole(existingSession.user.id);

      if (!mounted) return;

      if (hasAccess) {
        setAuthorized(true);
        setLoading(false);
      } else {
        await supabase.auth.signOut();
        setLoading(false);
        navigate('/staff/login');
      }
    }).catch((err) => {
      console.error('getSession error:', err);
      if (mounted) {
        setLoading(false);
        navigate('/staff/login');
      }
    });

    // Listen for auth changes (sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        if (!newSession) {
          setSession(null);
          setAuthorized(false);
          setLoading(false);
          navigate('/staff/login');
          return;
        }

        // Only re-check on SIGNED_IN (not on every TOKEN_REFRESHED)
        if (event === 'SIGNED_IN') {
          setSession(newSession);
          const hasAccess = await checkRole(newSession.user.id);
          if (!mounted) return;

          if (hasAccess) {
            setAuthorized(true);
          } else {
            await supabase.auth.signOut();
            navigate('/staff/login');
          }
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [navigate]);

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