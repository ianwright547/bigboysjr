import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Zap, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { forwardLead } from "@/lib/forwardLead";

const AnimatedHeroBackground = lazy(() => import("@/components/AnimatedHeroBackground"));

const RequestCallback = () => {
  const navigate = useNavigate();
  const storedZip = (() => {
    try {
      const data = JSON.parse(localStorage.getItem("junkfunnel") || "{}");
      return data.zip || "";
    } catch {
      return "";
    }
  })();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState(storedZip);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState("");

  const canSubmit = name.trim().length > 0 && phone.trim().length >= 7;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await supabase.functions.invoke("notify-new-lead", {
        body: {
          name,
          phone,
          email: email || undefined,
          zipCode: zip,
          address: address || undefined,
          message,
          urgency,
          requestType: "live_agent",
        },
      });
    } catch (err) {
      console.error("Lead notification error:", err);
      // Don't block user flow
    }

    try {
      await forwardLead({
        name,
        phone,
        email: email || null,
        zipCode: zip || null,
        address: address || null,
        message: message || null,
        urgency: urgency || null,
        requestType: "live_agent",
      });
    } catch (webhookError) {
      console.error("CRM lead forwarding error:", webhookError);
      // Supabase remains the source of truth, so a CRM outage does not block the form.
    }

    // Also store locally for backwards compatibility
    localStorage.setItem(
      "liveAgentRequest",
      JSON.stringify({ userName: name, phone, email, zipCode: zip, address, message, urgency, requestType: "live_agent" })
    );

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <>
    <Helmet>
      <title>Request a Callback | Big Boys Junk Removal Atlanta</title>
      <meta name="description" content="Request a callback from Big Boys Junk Removal. Tell us what you need hauled and we'll call you back fast with a free quote." />
      <link rel="canonical" href="https://bigboysjr.com/request-callback" />
      <meta property="og:url" content="https://bigboysjr.com/request-callback" />
    </Helmet>
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-8 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <AnimatedHeroBackground className="w-full h-full" opacity={0.14} />
        </Suspense>
      </div>
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Request a Junk Removal Callback</h1>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">
                We'll call you within minutes to help with pricing or scheduling.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-medium text-primary mb-6">
                <Zap className="w-4 h-4" />
                Average response time: 1-2 minutes
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1 h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="mt-1 h-12 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, City, GA"
                    className="mt-1 h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="e.g. 90210"
                    className="mt-1 h-12 rounded-xl"
                    maxLength={5}
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">When do you need service?</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger className="mt-1 h-12 rounded-xl">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This week</SelectItem>
                      <SelectItem value="just-pricing">Just pricing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Brief description (optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us briefly what you need removed..."
                    className="mt-1 rounded-xl resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="w-full h-13 rounded-xl font-semibold text-base"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" />: <Phone className="w-4 h-4 mr-2" />}
                  {submitting ? "Submitting...": "Request a Callback"}
                </Button>
              </form>
            </motion.div>
          ): (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">We've received your request!</h2>
              <p className="text-muted-foreground mb-1">A specialist will call you shortly.</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm font-medium text-primary mt-4"
              >
                ⚡ We are contacting you now…
              </motion.p>
              <Button
                variant="outline"
                onClick={() => navigate("/book")}
                className="mt-8 rounded-xl"
              >
                Return to Booking
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
};

export default RequestCallback;
