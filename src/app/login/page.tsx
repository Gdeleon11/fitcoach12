import Link from "next/link";
import { Suspense } from "react";
import AuthCard from "@/components/AuthCard";
import LoginForm from "@/components/LoginForm";
import GoogleButton from "@/components/GoogleButton";

export default function LoginPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return (
    <AuthCard
      subtitle="OPERATOR ACCESS // AUTH"
      title="Inicia sesión"
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-outline-variant" />
            <span className="font-label-caps text-label-caps text-on-surface-variant">O</span>
            <span className="h-px flex-1 bg-outline-variant" />
          </div>
          <GoogleButton />
        </>
      )}
    </AuthCard>
  );
}
