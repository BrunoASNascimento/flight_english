import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Flight English — Mosquito B Mk XVI",
  description: "Climb through English levels in a de Havilland Mosquito B Mk XVI.",
};

export const viewport: Viewport = {
  themeColor: "#08100d",
  colorScheme: "dark",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body className={`${inter.variable} ${oswald.variable}`}>{children}</body></html>;
}
