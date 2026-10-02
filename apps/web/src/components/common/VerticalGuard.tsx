import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface VerticalGuardProps {
  verticalName: string;
  flagName: string;
  isEnabled: boolean;
  children: React.ReactNode;
}

export function VerticalGuard({
  verticalName,
  flagName,
  isEnabled,
  children,
}: VerticalGuardProps) {
  if (!isEnabled) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-neutral-200 rounded-2xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
            Módulo {verticalName} Desativado
          </h2>
          <p className="text-xs text-neutral-600">
            A vertical comercial <span className="font-semibold">{verticalName}</span> está desativada nesta implantação pelo parâmetro <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[11px]">{flagName}=false</code>.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Dashboard Geral</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
