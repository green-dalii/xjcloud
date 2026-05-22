import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "乡建协作",
  description: "让乡建人协作起来",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
