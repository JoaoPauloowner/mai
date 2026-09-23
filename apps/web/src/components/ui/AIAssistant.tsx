import Link from "next/link";
import { ArrowUpRight, Bot, Sparkles } from "lucide-react";

export function AIAssistant({ title = "Inteligência da operação", description = "Pergunte sobre seus leads, campanhas, conversões ou oportunidades." }: { title?: string; description?: string }) {
  return (
    <div className="rounded-xl border border-[#E7E7E4] bg-white p-5">
      <div className="flex items-center justify-between">
        <div><div className="text-[10px] uppercase tracking-[0.15em] text-[#9A9A94]">AI Assistant</div><h2 className="mt-1 text-sm font-semibold text-[#171717]">{title}</h2></div>
        <Bot className="h-4 w-4 text-[#FF6A2A]" />
      </div>
      <div className="mt-6 rounded-xl bg-[#F7F7F5] p-5 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_8px_25px_rgba(255,106,42,0.16)]"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#FF6A2A] text-white"><Sparkles className="h-5 w-5" /></div></div>
        <h3 className="mt-4 text-sm font-semibold text-[#171717]">Pronto para analisar.</h3>
        <p className="mx-auto mt-1 max-w-[220px] text-[10px] leading-5 text-[#8A8A84]">{description}</p>
        <Link href="/dashboard/inbox" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#171717] px-3.5 py-2 text-[10px] font-bold text-white">Abrir atendimento <ArrowUpRight className="h-3 w-3" /></Link>
      </div>
    </div>
  );
}
