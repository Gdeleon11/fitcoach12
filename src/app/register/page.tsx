import Link from "next/link";
import { Suspense } from "react";
import AuthCard from "@/components/AuthCard";
import RegisterForm from "@/components/RegisterForm";
import GoogleButton from "@/components/GoogleButton";

export default function RegisterPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return (
    <AuthCard
      subtitle="NEW OPERATOR // INITIALIZE"
      title="Crea tu cuenta"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-outline-variant" />
            <span className="font-label-caps text-label-caps text-on-surface-variant">O</span>
            <span className="h-px flex-1 bg-outline-variant" />
          </div>
          <GoogleButton label="Registrarse con Google" />
        </>
      )}
    </AuthCard>
  );
}
