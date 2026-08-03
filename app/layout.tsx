"use client";

import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}