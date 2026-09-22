import Link from "next/link";

const experiences = [
  {
    href: "/wact",
    name: "WACT",
    label: "Editorial / Intelligence",
    description: "Uma experiência verde, editorial e premium para operações que querem transformar dados em decisão.",
    accent: "bg-[#C1ED84]",
    text: "text-[#2C2E2A]",
  },
  {
    href: "/shoppers",
    name: "SHOPPERS",
    label: "Operational SaaS",
    description: "Uma experiência azul, objetiva e operacional, com foco em velocidade, clareza e execução.",
    accent: "bg-[#2563EB]",
    text: "text-white",
  },
  {
    href: "/mai",
    name: "MAI",
    label: "Revenue AI",
    description: "A experiência laranja, direta e orientada a atendimento, IA, CRM e conversão.",
    accent: "bg-[#FF6A2A]",
    text: "text-white",
  },
];

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
          <Link href="/login" className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-bold hover:bg-neutral-50">Entrar</Link>
        </header>

        <section className="mx-auto max-w-3xl py-24 text-center sm:py-32">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">Escolha uma experiência</div>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] sm:text-7xl">Um backend.<br />Três produtos visuais.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500">
            WACT, SHOPPERS e MAI compartilham autenticação, banco, APIs, dados, multi-tenancy e lógica de negócio. O que muda é a camada de experiência.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {experiences.map((experience) => (
            <Link key={experience.href} href={experience.href} className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-2xl">
              <div className={`flex h-28 items-end p-6 ${experience.accent}`}>
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${experience.text}`}>{experience.name}</span>
              </div>
              <div className="p-7">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">{experience.label}</div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{experience.name}</h2>
                <p className="mt-3 min-h-20 text-sm leading-6 text-neutral-500">{experience.description}</p>
                <div className="mt-7 text-xs font-bold text-neutral-900 group-hover:underline">Abrir experiência →</div>
              </div>
            </Link>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.12em] text-neutral-400">
          <span>Shared Backend</span><span>Shared Database</span><span>Shared Auth</span><span>Shared Multi-Tenancy</span><span>Theme Layer</span>
        </div>
      </div>
    </main>
  );
}
