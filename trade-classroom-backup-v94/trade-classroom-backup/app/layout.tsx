import type { Metadata } from "next";
import "./design-tokens.css";
import "./globals.css";
import "./student-game.css";
import "./teacher-game.css";

export const metadata: Metadata = {
  title: "세계 무역 교실",
  description: "기후 퀴즈로 생산하고 무역으로 서로의 부족함을 채우는 6학년 사회 게임",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
