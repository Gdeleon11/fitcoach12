// Lightweight inline-SVG line chart (no dependencies). Server-safe.
export default function Sparkline({
  series,
  height = 80,
  stroke = "#00f0ff",
}: {
  series: { day: string; value: number }[];
  height?: number;
  stroke?: string;
}) {
  if (series.length < 2) {
    return (
      <div className="h-20 flex items-center justify-center text-on-surface-variant font-label-caps text-label-caps opacity-50">
        DATOS INSUFICIENTES
      </div>
    );
  }
  const values = series.map((s) => s.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 100;
  const pad = 6;
  const stepX = (w - pad * 2) / (series.length - 1);
  const points = series.map((s, i) => {
    const x = pad + i * stepX;
    const y = pad + (height - pad * 2) * (1 - (s.value - min) / range);
    return { x, y };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <path d={path} fill="none" stroke={stroke} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.6} fill={stroke} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
