import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Utilitário centralizado para tratamento seguro de erros em rotas de API (M2).
 * Evita vazamento de stack traces e mensagens internas brutas para o cliente,
 * gerando um Correlation ID (UUID) para rastreabilidade nos logs do servidor.
 */
export function handleApiError(
  error: unknown,
  clientMessage: string = "Ocorreu um erro interno no servidor.",
  status: number = 500
): NextResponse {
  const correlationId = crypto.randomUUID();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[API ERROR | CorrelationId: ${correlationId}]`, {
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      error: clientMessage,
      correlationId,
    },
    { status }
  );
}
