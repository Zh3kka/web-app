"use client";

import { WebSocketClient } from "@/components/WebSocketClient";

export default function WebSocketPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Мониторинг WebSocket соединения
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <WebSocketClient />
          </div>
        </div>
      </div>
    </main>
  );
}
