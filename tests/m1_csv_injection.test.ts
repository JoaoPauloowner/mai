import { describe, it, expect } from "vitest";

export function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

describe("M1: CSV Formula Injection Protection", () => {
  it("deve neutralizar fórmulas que começam com =, +, -, @, tab", () => {
    expect(sanitizeCsvCell("=cmd|' /C calc'!A0")).toBe(`"'=cmd|' /C calc'!A0"`);
    expect(sanitizeCsvCell("+123456")).toBe(`"'+123456"`);
    expect(sanitizeCsvCell("-500")).toBe(`"'-500"`);
    expect(sanitizeCsvCell("@SUM(A1:A10)")).toBe(`"'@SUM(A1:A10)"`);
  });

  it("deve manter textos comuns intactos com escape de aspas", () => {
    expect(sanitizeCsvCell("João da Silva")).toBe(`"João da Silva"`);
    expect(sanitizeCsvCell('Empresa "Exemplo" Ltda')).toBe(`"Empresa ""Exemplo"" Ltda"`);
  });
});
