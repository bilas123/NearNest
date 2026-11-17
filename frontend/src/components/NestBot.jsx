import React, { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, Send, X, RotateCcw } from "lucide-react";

const QUICK_PROMPTS = [
  "How does renting work?",
  "How do I use the pickup code?",
  "Where are safe meetup spots?",
  "How to post 'I Need This'?",
];

export function NestBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm NestBot, your campus assistant. Ask me anything about buying, renting, pickup codes, or campus safety!",
    },
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "I'm having a little trouble connecting right now." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Network error. Please try asking again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        sender: "bot",
        text: "Conversation reset! What can I help you with today?",
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-3 bg-[#FFB703] hover:bg-[#f0ac00] text-gray-900 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-xs"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-gray-900" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <span>NestBot AI</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-900" />
        </button>
      </div>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-20 sm:right-6 z-50 flex flex-col justify-end sm:justify-start">
          {/* Backdrop on mobile */}
          <div className="fixed inset-0 bg-black/40 sm:hidden" onClick={() => setIsOpen(false)} />

          {/* Chat Container */}
          <div className="relative w-full sm:w-96 bg-white dark:bg-gray-800 sm:rounded-3xl rounded-t-3xl shadow-2xl border border-gray-200/80 dark:border-gray-700 overflow-hidden flex flex-col h-[520px] max-h-[85vh] z-10 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-white/20 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center space-x-1.5">
                    <span>NestBot AI</span>
                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-medium">Campus</span>
                  </h3>
                  <p className="text-[11px] text-emerald-100">NearNest Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleReset}
                  title="Reset Chat"
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-gray-50/50 dark:bg-gray-900/40">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-xs"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200/70 dark:border-gray-700 shadow-2xs rounded-bl-xs"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="px-3.5 py-2.5 bg-white dark:bg-gray-800 rounded-2xl rounded-bl-xs border border-gray-200/70 dark:border-gray-700 shadow-2xs flex items-center space-x-1.5 text-gray-400">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700/60 overflow-x-auto flex space-x-1.5 no-scrollbar">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 text-[11px] px-2.5 py-1 bg-gray-100 dark:bg-gray-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-full cursor-pointer transition-colors border border-gray-200/50 dark:border-gray-600/50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask NestBot anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700/60 text-gray-900 dark:text-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-transparent dark:border-gray-600"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
