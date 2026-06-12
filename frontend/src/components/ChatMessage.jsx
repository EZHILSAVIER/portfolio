"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

/**
 * ChatMessage — Individual message bubble component.
 * User messages: right-aligned with cyan accent.
 * AI messages: left-aligned with avatar and markdown rendering.
 */
export default function ChatMessage({ role, content, isStreaming }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #00F5D4, #7B2FBE)",
              color: "#050810",
            }}
          >
            E
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser ? "message-user" : "message-ai"
        }`}
      >
        {isUser ? (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-text-primary)" }}
          >
            {content}
          </p>
        ) : (
          <div className="ai-markdown text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}>
            <ReactMarkdown>{content}</ReactMarkdown>
            {/* Streaming cursor */}
            {isStreaming && (
              <span
                className="inline-block w-2 h-4 ml-0.5 animate-pulse"
                style={{
                  background: "var(--color-cyan)",
                  borderRadius: "1px",
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
            style={{
              background: "rgba(0, 245, 212, 0.1)",
              border: "1px solid rgba(0, 245, 212, 0.2)",
              color: "var(--color-cyan)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}
