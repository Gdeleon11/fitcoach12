import Link from "next/link";

/**
 * Renders a design screen ported verbatim from the Stitch mockups.
 * The markup is preserved exactly; a slim overlay bar provides navigation
 * back into the functional app (the mockups' own nav items are static).
 */
export default function StaticScreen({ html }: { html: string }) {
  return (
    <div className="relative">
      <div className="fixed top-3 left-3 z-[100] flex gap-2">
        <Link
          href="/dashboard"
          className="px-3 py-1.5 bg-surface-container-high/90 backdrop-blur border border-outline-variant text-primary font-label-caps text-label-caps rounded hover:border-primary transition"
        >
          ← DASHBOARD
        </Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
