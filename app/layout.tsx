import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webcam App",
  description: "Приложение для работы с веб-камерой",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
