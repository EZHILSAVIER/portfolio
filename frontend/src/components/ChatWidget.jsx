"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useChat from "@/hooks/useChat";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SuggestedPrompts from "./SuggestedPrompts";
import NeuralIntro from "./NeuralIntro";
import NeuralScene from "./NeuralScene";


// Typewriter tagline animation constants for creative welcome screen
const TAGLINES = [
  "I know everything about Ezhil's projects.",
  "Ask me about Python, ML, NLP, or FastAPI.",
  "Explore PhishGuard, TrustCart, and Sentient Shopper.",
  "Wired with Ezhil Savier's portfolio data."
];
const TYPING_SPEED = 60;

/**
 * ChatWidget — The main AI chat interface component.
 * Renders fullscreen with header, message list, and input bar.
 */
export default function ChatWidget() {
  const {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
  } = useChat();

  const [showIntro, setShowIntro] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const seenIntro = sessionStorage.getItem("ai-chat-seen-intro") === "true";
      if (!seenIntro) {
        setShowIntro(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ai-chat-seen-intro", "true");
    }
  };

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Typewriter tagline animation logic for creative welcome screen
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [subText, setSubText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentFullText = TAGLINES[taglineIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        const nextText = currentFullText.substring(0, subText.length - 1);
        setSubText(nextText);

        if (nextText === "") {
          setIsDeleting(false);
          setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        }
      }, 25);
    } else {
      if (subText === currentFullText) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      } else {
        timer = setTimeout(() => {
          const nextText = currentFullText.substring(0, subText.length + 1);
          setSubText(nextText);
        }, TYPING_SPEED);
      }
    }

    return () => clearTimeout(timer);
  }, [subText, isDeleting, taglineIndex]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleSuggestionClick = (text) => {
    if (!isLoading) {
      sendMessage(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
  const contextQuery = lastUserMessage ? lastUserMessage.content : '';
  const isEmpty = messages.length === 0;

  if (!mounted) {
    return <div className="fixed inset-0 bg-[#050810]" />;
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <NeuralIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-screen w-full max-w-3xl mx-auto">
      {/* ===== HEADER ===== */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-strong flex items-center justify-between px-6 py-4 border-b border-border"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-3">
          {/* AI Avatar */}
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{
                background: "linear-gradient(135deg, #00F5D4, #7B2FBE)",
              }}
            >
              <span className="text-[#050810] font-bold">E</span>
            </div>
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0f1a]" />
          </div>

          <div>
            <h1
              className="text-sm font-semibold tracking-wide"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text-primary)",
              }}
            >
              Ezhil&apos;s AI Assistant
            </h1>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-dim)" }}
            >
              Ask me anything about Ezhil&apos;s portfolio
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearChat}
              className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-dim)",
                border: "1px solid var(--color-border)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "rgba(239,68,68,0.5)";
                e.target.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "var(--color-border)";
                e.target.style.color = "var(--color-text-dim)";
              }}
            >
              Clear
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* ===== MESSAGE LIST ===== */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ scrollbarGutter: "stable" }}
      >
        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full gap-8 py-4"
          >
            {/* Animated Welcome Core */}
            <NeuralScene />
 
            {/* Welcome Text with Typewriter Tagline */}
            <div className="text-center space-y-3 px-4">
              <h2
                className="text-2xl font-bold tracking-wide"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-primary)",
                }}
              >
                Hi, I&apos;m Ezhil&apos;s AI 👋
              </h2>
              <div className="h-6 flex items-center justify-center">
                <p
                  className="text-sm font-light min-h-[20px]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {subText}
                  <span className="inline-block w-[2px] h-3.5 ml-1 bg-[#00F5D4] animate-pulse" />
                </p>
              </div>
            </div>

            {/* Interactive Floating Tech Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap gap-2 justify-center max-w-sm px-4"
            >
              {['Python', 'Machine Learning', 'NLP', 'Computer Vision', 'FastAPI'].map((tech, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 text-[10px] rounded-md border border-[#1a2035] bg-[#0a0f1a]/40 text-[#8892a8]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    animation: `float ${3 + idx}s ease-in-out infinite`
                  }}
                >
                  {tech}
                </span>
              ))}
            </motion.div>
 
            {/* Suggested Prompts */}
            <SuggestedPrompts onSelect={handleSuggestionClick} />
          </motion.div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id || index}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={msg.isStreaming}
                />
              ))}
            </AnimatePresence>

            {isLoading &&
              !messages[messages.length - 1]?.isStreaming && (
                <TypingIndicator />
              )}

            {/* Suggested prompts after response completes */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="pt-6 mt-4 border-t border-[#1a2035]/30 flex flex-col gap-3"
              >
                <span className="text-[10px] uppercase tracking-wider opacity-40 font-semibold px-2" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-dim)" }}>
                  Suggested Questions
                </span>
                <SuggestedPrompts onSelect={handleSuggestionClick} compact={true} contextQuery={contextQuery} />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ===== INPUT BAR ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="px-4 pb-4 pt-2"
      >
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid var(--color-border)",
              background: "rgba(10, 15, 26, 0.6)",
              transition: "all 0.3s ease",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isLoading
                  ? "AI is thinking..."
                  : "Ask about projects, skills, experience..."
              }
              disabled={isLoading}
              className="chat-input w-full bg-transparent px-5 py-4 pr-14 text-sm rounded-2xl border-none"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-primary)",
              }}
              maxLength={2000}
              autoComplete="off"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background:
                  inputValue.trim() && !isLoading
                    ? "linear-gradient(135deg, #00F5D4, #7B2FBE)"
                    : "transparent",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={
                  inputValue.trim() && !isLoading
                    ? "#050810"
                    : "var(--color-text-dim)"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Footer hint */}
          <p
            className="text-center text-[10px] mt-2 opacity-40"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-dim)",
            }}
          >
            Powered by Gemini AI · Responses based on Ezhil&apos;s portfolio
            data
          </p>
        </form>
      </motion.div>
    </div>
    </>
  );
}
