import { VerticalGuard } from "@/components/common/VerticalGuard";

export default function AutoLayout({ children }: { children: React.ReactNode }) {
  const isEnabled = process.env.NEXT_PUBLIC_VERTICAL_AUTO_ENABLED !== "false";

  return (
    <VerticalGuard
      verticalName="Automotivo"
      flagName="NEXT_PUBLIC_VERTICAL_AUTO_ENABLED"
      isEnabled={isEnabled}
    >
      {children}
    </VerticalGuard>
  );
}
