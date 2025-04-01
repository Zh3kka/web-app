"use client";

import { SignalDisplay } from "@/components/SignalDisplay";

export default function SignalsPage() {
  // В реальном приложении URL должен быть в конфигурации
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Мониторинг сигналов</h1>
      <SignalDisplay wsUrl={wsUrl} />
    </div>
  );
}
