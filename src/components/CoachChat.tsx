"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: string; content: string };

const SUGGESTIONS = [
  "¿Cómo voy con mi déficit esta semana?",
  "Dame una lectura honesta de mi progreso.",
  "¿Debo ajustar mis calorías?",
];

export default function CoachChat({ initial }: { initial: Msg[] }) {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", content: text }]);
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 55000);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });
      const data = await res.json();
      setMessages((p) => [...p, { role: "assistant", content: res.ok ? data.reply : data.error ?? "Error." }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "La respuesta tardó demasiado o falló. Revisa la clave de IA e inténtalo de nuevo." }]);
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }

  return (
    <div className="glass-card flex flex-col h-[calc(100vh-260px)] min-h-[400px]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-hide">
        {messages.length === 0 && (
          <div className="text-center text-on-surface-variant mt-10">
            <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">smart_toy</span>
            <p className="mt-3 text-sm">Pregúntame sobre tu progreso, nutrición o entrenamiento.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={
                "max-w-[80%] px-4 py-3 rounded-lg text-sm whitespace-pre-wrap " +
                (m.role === "user"
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container-high text-on-surface border border-outline-variant")
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-lg bg-surface-container-high border border-outline-variant text-on-surface-variant text-sm">
              Analizando tus datos…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 0 && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="px-3 py-1.5 border border-outline-variant text-on-surface-variant font-label-caps text-label-caps rounded hover:border-primary hover:text-primary transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-4 border-t border-outline-variant flex gap-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje…"
          className="flex-1 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50 rounded"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
}
