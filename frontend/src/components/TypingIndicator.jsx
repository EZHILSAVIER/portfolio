"use client";

import { motion } from "framer-motion";

/**
 * TypingIndicator — Three-dot bouncing animation shown while AI is generating.
 */
export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-3 justify-start"
    >
      {/* AI Avatar */}
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

      {/* Typing dots */}
      <div
        className="message-ai px-5 py-4 flex items-center gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: "var(--color-cyan)",
              animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
