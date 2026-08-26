import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LiveAgentCard = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 p-5 rounded-2xl border border-primary/20 bg-primary/5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Phone className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-base">Speak to a Live Agent</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Not sure what you need? Talk to a real person instantly.
          </p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            <MessageCircle className="w-3 h-3" />
            Usually responds in 1-2 minutes
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => navigate("/request-callback")}
        className="w-full mt-4 h-12 rounded-xl border-primary/30 text-primary font-semibold hover:bg-primary/10"
      >
        <Phone className="w-4 h-4 mr-2" />
        Request a Callback
      </Button>
    </div>
  );
};

export default LiveAgentCard;
