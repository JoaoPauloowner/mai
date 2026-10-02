import { VerticalGuard } from "@/components/common/VerticalGuard";

export default function ClinicaLayout({ children }: { children: React.ReactNode }) {
  const isEnabled = process.env.NEXT_PUBLIC_VERTICAL_CLINICA_ENABLED !== "false";

  return (
    <VerticalGuard
      verticalName="Clínica"
      flagName="NEXT_PUBLIC_VERTICAL_CLINICA_ENABLED"
      isEnabled={isEnabled}
    >
      {children}
    </VerticalGuard>
  );
}
