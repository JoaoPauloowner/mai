import { VerticalGuard } from "@/components/common/VerticalGuard";

export default function ContabilLayout({ children }: { children: React.ReactNode }) {
  const isEnabled = process.env.NEXT_PUBLIC_VERTICAL_CONTABIL_ENABLED !== "false";

  return (
    <VerticalGuard
      verticalName="Contábil"
      flagName="NEXT_PUBLIC_VERTICAL_CONTABIL_ENABLED"
      isEnabled={isEnabled}
    >
      {children}
    </VerticalGuard>
  );
}
