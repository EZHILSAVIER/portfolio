"use client";

import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-x9s4.onrender.com";
};

const API_URL = getApiUrl();

/**
 * useChat — Custom React hook managing all chat state and SSE streaming.
 *
 * Handles:
 * - Message state management
 * - Session persistence (localStorage)
 * - SSE streaming from the backend
 * - Error handling and loading states
 */
export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const sessionIdRef = useRef(getOrCreateSessionId());

  /**
   * Get existing sessionId from localStorage or create a new one.
   */
  function getOrCreateSessionId() {
    if (typeof window === "undefined") return uuidv4();

    let sid = localStorage.getItem("ai-chat-session-id");
    if (!sid) {
      sid = uuidv4();
      localStorage.setItem("ai-chat-session-id", sid);
    }
    return sid;
  }

  /**
   * Send a message and stream the AI response.
   */
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      // Add user message immediately
      const userMsg = {
        id: uuidv4(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      // Add a placeholder AI message for streaming
      const aiMsgId = uuidv4();
      const aiMsg = {
        id: aiMsgId,
        role: "assistant",
        content: "",
        isStreaming: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setIsLoading(true);

      try {
        // Send the request and read SSE stream
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            sessionId: sessionIdRef.current,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        // Read the SSE stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE events from buffer
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === "chunk") {
                  // Append text chunk to the streaming AI message
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMsgId
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                  );
                } else if (data.type === "meta" && data.sessionId) {
                  // Update session ID if server assigned a new one
                  sessionIdRef.current = data.sessionId;
                  localStorage.setItem(
                    "ai-chat-session-id",
                    data.sessionId
                  );
                } else if (data.type === "error") {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMsgId
                        ? {
                            ...msg,
                            content:
                              data.message ||
                              "Something went wrong. Please try again.",
                            isStreaming: false,
                          }
                        : msg
                    )
                  );
                } else if (data.type === "done") {
                  // Mark streaming as complete
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMsgId
                        ? { ...msg, isStreaming: false }
                        : msg
                    )
                  );
                }
              } catch {
                // Ignore malformed JSON lines
              }
            }
          }
        }

        // Ensure streaming flag is cleared
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
          )
        );
      } catch (error) {
        console.error("[useChat] Error:", error);

        // Update the AI message with an error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  content:
                    "I'm having trouble connecting to the server. Please make sure the backend is running and try again.",
                  isStreaming: false,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  /**
   * Clear the chat and start a new session.
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setInputValue("");

    // Generate a new session ID
    const newSessionId = uuidv4();
    sessionIdRef.current = newSessionId;
    localStorage.setItem("ai-chat-session-id", newSessionId);
  }, []);

  return {
    messages,
    isLoading,
    inputValue,
    setInputValue,
    sendMessage,
    clearChat,
    sessionId: sessionIdRef.current,
  };
}
