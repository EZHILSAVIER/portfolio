"use client";

import { useEffect } from "react";

/**
 * Root Page redirect to index.html.
 * Resolves the localhost:3000 root 404 issue during next dev.
 */
export default function RootPage() {
  useEffect(() => {
    window.location.replace("/index.html");
  }, []);

  return null;
}
