import { VerticalGuard } from "@/components/common/VerticalGuard";

export default function SegurosLayout({ children }: { children: React.ReactNode }) {
  const isEnabled = process.env.NEXT_PUBLIC_VERTICAL_SEGUROS_ENABLED !== "false";

  return (
    <VerticalGuard
      verticalName="Seguros"
      flagName="NEXT_PUBLIC_VERTICAL_SEGUROS_ENABLED"
      isEnabled={isEnabled}
    >
      {children}
    </VerticalGuard>
  );
}
