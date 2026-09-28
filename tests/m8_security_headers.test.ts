import { describe, it, expect } from "vitest";
import nextConfig from "../apps/web/next.config";

describe("[M8] Security Headers in Next.js", () => {
  it("should define critical security headers in nextConfig", async () => {
    expect(nextConfig.headers).toBeDefined();
    if (nextConfig.headers) {
      const headersList = await nextConfig.headers();
      expect(headersList.length).toBeGreaterThan(0);

      const rootHeaders = headersList[0].headers;
      const headerKeys = rootHeaders.map((h) => h.key);

      expect(headerKeys).toContain("X-Content-Type-Options");
      expect(headerKeys).toContain("X-Frame-Options");
      expect(headerKeys).toContain("Strict-Transport-Security");
      expect(headerKeys).toContain("Content-Security-Policy");
      expect(headerKeys).toContain("Permissions-Policy");

      const csp = rootHeaders.find((h) => h.key === "Content-Security-Policy")?.value;
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-ancestors 'self'");
    }
  });
});
