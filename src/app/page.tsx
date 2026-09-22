import Link from "next/link";

export default function ExperienceShowcase() {
  return (
    <main className="min-h-screen bg-[#F4F4F2] text-[#171717]">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#171717] text-sm font-black text-white">M</div>
            <div>
              <div className="text-sm font-bold tracking-tight">MAI Platform</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">One Core · Multiple Experiences</div>
            </div>
          </div>
        </header>
        <section className="mx-auto max-w-3xl py-24 text-center sm:py-32">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Escolha uma experiência</div>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">Um backend.<br />Três experiências.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500">A mesma plataforma, os mesmos dados e a mesma lógica de negócio. Você escolhe apenas a experiência visual.</p>
        </section>
        <section className="grid gap-5 lg:grid-cols-3">
          <Link href="/wact" className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex h-28 items-end bg-[#C1ED84] p-6"><span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#2C2E2A]">WACT</span></div>
            <div className="p-7"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Editorial / Intelligence</div><h2 className="mt-3 text-2xl font-semibold tracking-tight">WACT</h2><p className="mt-3 min-h-20 text-sm leading-6 text-neutral-500">Experiência editorial inspirada na referência WACT.</p><div className="mt-7 text-xs font-bold text-neutral-900 group-hover:underline">Abrir WACT →</div></div>
          </Link>
          <Link href="/shoppers" className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex h-28 items-end bg-[#2563EB] p-6"><span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">SHOPPERS</span></div>
            <div className="p-7"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Operational SaaS</div><h2 className="mt-3 text-2xl font-semibold tracking-tight">SHOPPERS</h2><p className="mt-3 min-h-20 text-sm leading-6 text-neutral-500">Experiência operacional em azul, mantendo a mesma plataforma.</p><div className="mt-7 text-xs font-bold text-neutral-900 group-hover:underline">Abrir SHOPPERS →</div></div>
          </Link>
          <Link href="/mai" className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex h-28 items-end bg-[#FF6A2A] p-6"><span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">MAI</span></div>
            <div className="p-7"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Revenue AI</div><h2 className="mt-3 text-2xl font-semibold tracking-tight">MAI</h2><p className="mt-3 min-h-20 text-sm leading-6 text-neutral-500">Experiência original da MAI, com sua identidade laranja.</p><div className="mt-7 text-xs font-bold text-neutral-900 group-hover:underline">Abrir MAI →</div></div>
          </Link>
        </section>
      </div>
    </main>
  );
}
