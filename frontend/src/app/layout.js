import { Inter, Outfit, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "AI Assistant — Ezhil Savier S",
  description: "Chat with Ezhil Savier's AI portfolio assistant. Ask about projects, skills, experience, and more.",
  keywords: "AI, portfolio, chatbot, Ezhil Savier, projects, resume",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${dmMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
