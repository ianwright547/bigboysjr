import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery event from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Also check if already in a session (user clicked the link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated! Redirecting to login...");
      await supabase.auth.signOut();
      setTimeout(() => navigate("/admin"), 1500);
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Helmet><title>Reset Password | Big Boys Junk Removal</title><meta name="robots" content="noindex, follow" /></Helmet>
        <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-lg text-center space-y-4">
          <KeyRound className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Verifying your reset link... If this takes too long, the link may have expired.
          </p>
          <Button variant="outline" className="rounded-xl" onClick={() => navigate("/admin")}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Helmet><title>Reset Password | Big Boys Junk Removal</title><meta name="robots" content="noindex, follow" /></Helmet>
      <form onSubmit={handleReset} className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-lg space-y-4">
        <div className="flex items-center justify-center mb-2">
          <Lock className="w-8 h-8 text-primary mr-2" />
          <h1 className="text-xl font-bold text-foreground">New Password</h1>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">New Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl"
            required
            minLength={6}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Confirm Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-12 rounded-xl"
            required
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full h-12 rounded-xl font-semibold" disabled={loading}>
          {loading ? "Updating...": "Update Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
