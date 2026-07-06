"use client";

import { useRef, useState } from "react";

type Photo = { id: string; url: string; angle: string; date: string };
const ANGLES = [
  ["FRONT", "Frente"],
  ["SIDE", "Perfil"],
  ["BACK", "Espalda"],
] as const;

// Compress/resize an image file to a JPEG data URL (max ~1024px, keeps DB small).
function fileToCompressedDataUrl(file: File, maxDim = 1024, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image error"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProgressGallery({ initial, initialAnalysis }: { initial: Photo[]; initialAnalysis?: string | null }) {
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [angle, setAngle] = useState<"FRONT" | "SIDE" | "BACK">("FRONT");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(initialAnalysis ?? null);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function analyze() {
    setAnalyzing(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const res = await fetch("/api/progress/analyze", { method: "POST", signal: controller.signal });
      const data = await res.json();
      setAnalysis(res.ok ? data.analysis : data.error ?? "No se pudo analizar.");
    } catch {
      setAnalysis("El análisis tardó demasiado o falló. Revisa la clave de IA e inténtalo de nuevo.");
    } finally {
      clearTimeout(timer);
      setAnalyzing(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: dataUrl, angle }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo subir la foto");
      } else {
        setPhotos((p) => [data.photo, ...p]);
      }
    } catch {
      setError("Error procesando la imagen");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(id: string) {
    setPhotos((p) => p.filter((x) => x.id !== id));
    await fetch("/api/progress", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  const byAngle = (a: string) => photos.filter((p) => p.angle === a);

  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant">ÁNGULO</span>
            <div className="grid grid-cols-3 gap-2 mt-2 max-w-xs">
              {ANGLES.map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setAngle(val)}
                  className={
                    "py-2 font-label-caps text-label-caps border rounded transition " +
                    (angle === val
                      ? "bg-primary-container text-on-primary-container border-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-primary")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" id="photo-input" />
            <label
              htmlFor="photo-input"
              className={
                "inline-flex items-center gap-2 px-5 py-3 font-label-caps text-label-caps font-bold cursor-pointer transition " +
                (uploading
                  ? "bg-surface-container-highest text-on-surface-variant"
                  : "bg-primary-container text-on-primary-container hover:brightness-110")
              }
            >
              <span className="material-symbols-outlined">{uploading ? "hourglass_top" : "photo_camera"}</span>
              {uploading ? "SUBIENDO..." : "SUBIR FOTO"}
            </label>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-error">{error}</p>}
        <p className="mt-3 text-xs text-on-surface-variant opacity-70">
          Las imágenes se comprimen en tu dispositivo antes de subirlas.
        </p>
      </div>

      {/* AI analysis */}
      {photos.length > 0 && (
        <div className="glass-card p-6 border-l-4 border-primary">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed-dim">smart_toy</span>
              <span className="font-label-caps text-label-caps text-primary-fixed-dim">ANÁLISIS IA DE COMPOSICIÓN</span>
            </div>
            <button
              onClick={analyze}
              disabled={analyzing}
              className="px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">{analyzing ? "hourglass_top" : "auto_awesome"}</span>
              {analyzing ? "ANALIZANDO..." : analysis ? "VOLVER A ANALIZAR" : "ANALIZAR MI PROGRESO"}
            </button>
          </div>
          {analysis ? (
            <p className="text-on-surface leading-relaxed whitespace-pre-wrap">{analysis}</p>
          ) : (
            <p className="text-sm text-on-surface-variant">
              La IA revisa tus fotos más recientes (frente/perfil/espalda) junto con tu peso, cintura y objetivo, y te da una lectura honesta. Estimación visual orientativa, no diagnóstico.
            </p>
          )}
        </div>
      )}

      {photos.length === 0 && (
        <div className="glass-card p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">add_a_photo</span>
          <p className="mt-3 text-on-surface-variant">Aún no tienes fotos. Sube la primera para empezar tu línea de tiempo.</p>
        </div>
      )}

      {ANGLES.map(([val, label]) => {
        const list = byAngle(val);
        if (list.length === 0) return null;
        return (
          <div key={val}>
            <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-3">
              {label.toUpperCase()} · {list.length}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {list.map((p) => (
                <div key={p.id} className="glass-card overflow-hidden group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Progreso ${label} ${p.date}`} className="w-full h-56 object-cover" />
                  <div className="p-2 flex justify-between items-center">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{p.date}</span>
                    <button
                      onClick={() => remove(p.id)}
                      className="material-symbols-outlined text-on-surface-variant hover:text-error text-base"
                      title="Eliminar"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
