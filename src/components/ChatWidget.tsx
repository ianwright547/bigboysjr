import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useNavigate, useLocation } from "react-router-dom";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || "Something went wrong. Please try again.");
    return;
  }

  if (!resp.body) {
    onError("Connection failed. Please try again.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  // Flush remaining
  if (buffer.trim()) {
    for (let raw of buffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hey there! 👋 I'm the **Big Boys Assistant**. I can help you with:\n\n- 💰 **Item pricing**: ask me about any item\n- 📅 **Booking** a junk removal pickup\n- ❓ **Questions** about our services\n\nWhat can I help you with today?",
};

const QUICK_PROMPTS = [
  "How much to remove a couch?",
  "Mattress removal price?",
  "I need a garage cleanout",
  "What items do you remove?",
];

const ChatWidget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  // Hide on funnel pages to avoid overlapping booking buttons
  const isFunnelPage = location.pathname === "/book" || location.pathname === "/";
  const isIndexPage = location.pathname === "/";

  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar }: m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg].filter((m) => m !== WELCOME_MESSAGE),
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (msg) => {
          setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
          setIsLoading(false);
        },
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, something went wrong. Please try again or call us at **(470) 660-6874**." },
      ]);
      setIsLoading(false);
    }
  };

  // Hide the floating button on funnel pages to avoid overlapping action buttons
  if (isFunnelPage && !open) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-shadow font-semibold text-sm"
          >
            <MessageSquare className="w-5 h-5" />
            Need a price? 💬
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[min(600px,calc(100vh-6rem))] bg-foreground rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-foreground">Big Boys Assistant</p>
                  <p className="text-xs text-primary-foreground/70">Online • Instant pricing</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" asChild className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8">
                  <a href="tel:+14706606874"><Phone className="w-4 h-4" /></a>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-foreground/95">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end": "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                       : "bg-background/10 text-background rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:mb-1 [&_ul]:mb-1 [&_li]:mb-0.5 [&_strong]:text-background">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ): (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-background/10 text-background rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}

              {/* Quick prompts after welcome */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs bg-background/10 text-background/80 hover:text-background hover:bg-background/15 rounded-full px-3 py-1.5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Now Banner */}
            <button
              onClick={() => { setOpen(false); navigate("/book"); }}
              className="flex items-center justify-center gap-2 bg-primary/90 text-primary-foreground text-xs font-semibold py-2 hover:bg-primary transition-colors"
            >
              Get Instant Quote Online <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Input */}
            <div className="p-3 bg-foreground border-t border-background/10">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about pricing, booking..."
                  disabled={isLoading}
                  className="flex-1 bg-background/10 text-background placeholder:text-background/70 text-sm rounded-xl px-4 py-2.5 border-none outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl h-10 w-10 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
