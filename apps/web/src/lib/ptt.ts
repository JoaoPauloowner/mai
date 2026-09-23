/**
 * Helper para simulação de presença humana em disparos de WhatsApp e Chat.
 * Simula tempos realistas de "Digitando..." e "Gravando áudio...".
 */

export interface PttSimulationOptions {
  audioSeconds?: number;
  textLength?: number;
}

/**
 * Calcula o tempo de espera humanizado (em ms) para simular digitação ou gravação de áudio.
 */
export function calculatePresenceDelay(options: PttSimulationOptions): number {
  if (options.audioSeconds) {
    // Para áudio PTT, simula entre 70% a 95% do tempo real do áudio gravando
    return Math.min(options.audioSeconds * 800, 15000);
  }

  if (options.textLength) {
    // Velocidade de digitação média: ~50 caracteres por segundo, mínimo 1.5s, máximo 6s
    const ms = (options.textLength / 50) * 1000;
    return Math.max(1500, Math.min(ms, 6000));
  }

  return 2000;
}

export const PTT_PRESENCE_STATES = {
  TYPING: "composing",
  RECORDING: "recording",
  PAUSED: "paused",
} as const;
