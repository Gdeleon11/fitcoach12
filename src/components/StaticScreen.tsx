/**
 * Renders an analytics/design screen ported from the Stitch mockups.
 * The mockup's own header/sidebar were stripped at generation time, so this
 * content now lives inside the app's real navigation (AppShell).
 * A banner makes clear the figures shown are sample visualizations.
 */
export default function StaticScreen({ html, title }: { html: string; title?: string }) {
  return (
    <div>
      <div className="mb-6 flex items-start gap-3 border border-outline-variant bg-surface-container-high rounded p-3">
        <span className="material-symbols-outlined text-primary-fixed-dim">info</span>
        <p className="text-sm text-on-surface-variant">
          {title ? <span className="text-primary">{title}. </span> : null}
          Vista de análisis con datos de muestra. Se poblará con tus registros a medida que uses la app.
        </p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
