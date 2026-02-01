import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChefHat, Lock } from "lucide-react";

const StaffLogin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-login', {
        body: { password }
      });

      if (error) throw error;

      if (data?.sessionToken) {
        localStorage.setItem('admin_session', data.sessionToken);
        toast({
          title: "Welcome!",
          description: "Redirecting to dashboard...",
        });
        // Navigate to the visitors analytics page
        navigate('/visitors');
      } else {
        throw new Error(data?.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Kitchen Staff Login</CardTitle>
          <CardDescription>
            Enter your staff password to access the kitchen dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Staff Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="h-12 text-lg"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Access Kitchen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffLogin;
