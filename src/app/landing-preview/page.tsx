import Link from "next/link";

export default function LandingPreview() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">MAI / Landing Preview</div>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">Compare as duas versões da landing.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">A V1 preserva a landing original. A V2 é a nova direção visual + copy + Design System. Abra as duas em abas diferentes e compare lado a lado.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Link href="/landing-v1" className="group rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:border-white/20 hover:bg-white/10">
            <div className="flex items-center justify-between"><span className="rounded-full bg-[#E7EBE6] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2C2E2A]">V1</span><span className="text-xs text-white/40">Original</span></div>
            <h2 className="mt-12 text-2xl font-semibold">Landing antiga</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">Versão original preservada do branch principal, com a identidade WACT/lime/sage.</p>
            <div className="mt-8 text-sm font-bold text-white group-hover:text-orange-300">Abrir V1 →</div>
          </Link>
          <Link href="/landing-v2" className="group rounded-3xl border border-orange-400/30 bg-orange-500/10 p-7 transition hover:border-orange-400/60 hover:bg-orange-500/15">
            <div className="flex items-center justify-between"><span className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">V2</span><span className="text-xs text-orange-200/60">Nova</span></div>
            <h2 className="mt-12 text-2xl font-semibold">Landing MAI nova</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">Nova referência visual, copy de direct response e direção de Design System aplicada ao MAI.</p>
            <div className="mt-8 text-sm font-bold text-orange-300 group-hover:text-orange-200">Abrir V2 →</div>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/5">Voltar para a landing principal</Link>
        </div>
      </div>
    </main>
  );
}
