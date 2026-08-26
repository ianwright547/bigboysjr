import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: anonKey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already_unsubscribed");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet>
        <title>Unsubscribe | Big Boys Junk Removal</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <p className="text-muted-foreground text-lg">Validating...</p>
        )}
        {status === "valid" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Unsubscribe</h1>
            <p className="text-muted-foreground">
              Are you sure you want to unsubscribe from emails?
            </p>
            <button
              onClick={handleUnsubscribe}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              Confirm Unsubscribe
            </button>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Unsubscribed</h1>
            <p className="text-muted-foreground">
              You've been successfully unsubscribed and will no longer receive these emails.
            </p>
          </>
        )}
        {status === "already_unsubscribed" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Already Unsubscribed</h1>
            <p className="text-muted-foreground">
              This email address has already been unsubscribed.
            </p>
          </>
        )}
        {status === "invalid" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Invalid Link</h1>
            <p className="text-muted-foreground">
              This unsubscribe link is invalid or has expired.
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">
              We couldn't process your request. Please try again later.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
