"use client";

import ChatWidget from "@/components/ChatWidget";

/**
 * Main page — renders the fullscreen AI chat interface.
 * When embedded in the portfolio via iframe, this IS the chat UI.
 * When accessed directly, it shows the standalone chat experience.
 */
export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />

      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(123,47,190,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Chat Widget — fullscreen mode */}
      <ChatWidget />
    </main>
  );
}
