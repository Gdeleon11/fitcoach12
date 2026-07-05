import Link from "next/link";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile py-12">
      <Link
        href="/"
        className="font-display-lg text-3xl text-primary-container tracking-tighter mb-8"
      >
        FitCoach 12%
      </Link>
      <div className="w-full max-w-md glass-panel p-8 rounded-lg">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          {subtitle}
        </p>
        <h1 className="font-headline-md text-headline-md mb-6">{title}</h1>
        {children}
      </div>
      <div className="mt-6 text-sm text-on-surface-variant">{footer}</div>
    </main>
  );
}
