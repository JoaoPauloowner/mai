"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BarChart3, Bot, Check, ChevronDown, Clock3,
  MessageSquare, Phone, Play, Sparkles, Target, Users, Zap
} from "lucide-react";

const features = [
  ["Atendimento imediato", "O lead entra. O MAI responde, conversa e mantém o contexto até a hora certa de entregar para o vendedor.", MessageSquare],
  ["Qualificação com IA", "Intenção, perfil e próximos passos ficam organizados antes de a oportunidade chegar ao seu time.", Bot],
  ["Origem de cada lead", "Conecte campanha, anúncio, conversa e resultado para entender o que realmente gera oportunidade.", Target],
  ["CRM integrado", "Pipeline, responsáveis, status e histórico em uma operação contínua.", Users],
  ["IA de voz", "Quando fizer sentido, o atendimento pode avançar para voz e ligações automatizadas.", Phone],
  ["Torre de controle", "Volume, qualidade, origem, conversas e andamento comercial em uma única camada.", BarChart3],
] as const;

const faqs = [
  ["O MAI substitui meu CRM?", "O MAI centraliza atendimento, qualificação e operação comercial. Se sua operação depende de outro CRM, a arquitetura pode evoluir com integrações."],
  ["Meu vendedor ainda participa da venda?", "Sim. A proposta é tirar do vendedor o trabalho repetitivo e entregar contexto suficiente para ele assumir as oportunidades que precisam de intervenção humana."],
  ["Funciona para quais segmentos?", "A arquitetura é multi-vertical e pode adaptar fluxos para automotivo, seguros, contábil, clínicas, imobiliário e B2B."],
  ["Preciso mudar meu processo inteiro?", "Não. Comece pelo maior vazamento — normalmente entrada, resposta ou qualificação — e evolua por etapas."],
  ["A IA fala exatamente como um vendedor?", "Ela segue regras, contexto, tom e objetivos definidos pela operação. A configuração deve refletir a política comercial real."],
] as const;

function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600">{eyebrow}</div>
      <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{title}</h2>
      {text && <p className="mt-5 max-w-xl text-base leading-7 text-neutral-500">{text}</p>}
    </div>
  );
}

function ProductPreview() {
  const bars = ["36%","52%","41%","67%","55%","78%","64%","92%","72%","86%"];
  return (
    <div className="relative mx-auto mt-14 max-w-6xl">
      <div className="absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,106,42,0.22),transparent_58%)] blur-2xl" />
      <div className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-[0_35px_100px_rgba(23,23,23,0.12)]">
        <div className="flex h-10 items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4">
          <i className="h-2.5 w-2.5 rounded-full bg-neutral-300" /><i className="h-2.5 w-2.5 rounded-full bg-neutral-300" /><i className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          <div className="mx-auto rounded-md bg-white px-20 py-1 text-[9px] text-neutral-400 shadow-sm">app.mai.ai/dashboard</div>
        </div>
        <div className="grid min-h-[450px] grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-neutral-200 bg-neutral-50 p-5 sm:block">
            <div className="mb-9 flex items-center gap-2 font-bold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-orange-500 text-sm text-white">M</span> MAI</div>
            <div className="space-y-1 text-[10px] text-neutral-500">
              {["Dashboard","Leads","Conversas","Pipeline","Campanhas","Analytics"].map((x,i)=><div key={x} className={`rounded-lg px-3 py-2.5 ${i===0?"bg-white font-semibold text-neutral-900 shadow-sm":""}`}>{x}</div>)}
            </div>
          </aside>
          <div className="bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><div className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">Overview</div><h3 className="mt-1 text-xl font-semibold tracking-tight">Tudo que acontece com seus leads.</h3></div>
              <div className="flex gap-2 text-[9px]"><span className="rounded-md border border-neutral-200 px-3 py-2 text-neutral-500">Últimos 30 dias</span><span className="rounded-md bg-neutral-900 px-3 py-2 text-white">Exportar</span></div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[["Leads","1.248","+18,4%"],["Qualificados","428","+12,7%"],["Oportunidades","137","+9,2%"]].map(([a,b,c])=><div key={a} className="rounded-xl border border-neutral-200 p-4"><div className="text-[9px] text-neutral-400">{a}</div><div className="mt-2 text-2xl font-semibold">{b}</div><div className="mt-2 text-[9px] font-semibold text-orange-600">{c} no período</div></div>)}
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-xl border border-neutral-200 p-4">
                <div className="text-[9px] text-neutral-400">Performance comercial</div><div className="mt-1 text-sm font-semibold">Leads e oportunidades</div>
                <div className="mt-7 flex h-24 items-end justify-between gap-2">{bars.map((h,i)=><div key={i} className={`w-full rounded-t-sm ${i>6?"bg-orange-500":"bg-neutral-200"}`} style={{height:h}} />)}</div>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4"><div className="text-[9px] text-neutral-400">Atividade recente</div><div className="mt-4 space-y-4">{["Lead qualificado","Nova conversa","Venda atualizada"].map((x,i)=><div key={x} className="flex items-center gap-3"><span className={`h-7 w-7 rounded-full ${i===0?"bg-orange-100":"bg-neutral-100"}`} /><div><div className="text-[9px] font-semibold">{x}</div><div className="text-[8px] text-neutral-400">há {i+1} min</div></div></div>)}</div></div>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200">
              {["Mariana Costa","Lucas Almeida","Ana Beatriz"].map((x,i)=><div key={x} className="grid grid-cols-[1.4fr_1fr_1fr_0.7fr] gap-3 border-b border-neutral-100 px-4 py-3 text-[9px] last:border-0"><span className="font-medium">{x}</span><span className="text-neutral-500">{i===0?"Meta Ads":"Google Ads"}</span><span><b className={`rounded-full px-2 py-1 text-[8px] ${i===1?"bg-orange-100 text-orange-700":"bg-neutral-100 text-neutral-600"}`}>{i===1?"Qualificado":"Em atendimento"}</b></span><span className="text-neutral-400">{i+2} min</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [leads, setLeads] = useState(30), [ticket, setTicket] = useState(3000), [faq, setFaq] = useState<number|null>(null);
  const monthly = leads*30, gap = Math.round(monthly*0.45), recovered = Math.max(1,Math.round(gap*0.08)), revenue = recovered*ticket;

  return (
    <main className="ma-page overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/mai" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-950 text-sm font-black text-white">M</span><span className="text-lg font-bold tracking-[-0.04em]">MAI</span></Link>
          <nav className="hidden items-center gap-8 text-xs font-medium text-neutral-500 md:flex">{[["#problema","O problema"],["#como-funciona","Como funciona"],["#recursos","Recursos"],["#planos","Planos"],["#faq","FAQ"]].map(([h,t])=><a key={h} href={h} className="hover:text-neutral-950">{t}</a>)}</nav>
          <div className="flex items-center gap-2"><Link href="/mai/login" className="hidden px-3 py-2 text-xs font-semibold text-neutral-600 sm:block">Entrar</Link><Link href="/mai/cadastro" className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800">Começar agora <ArrowRight className="h-3.5 w-3.5"/></Link></div>
        </div>
      </header>

      <section className="relative px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[620px] w-[1100px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,106,42,0.22),rgba(255,255,255,0)_64%)] blur-3xl"/>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-700"><Sparkles className="h-3 w-3"/> Atendimento + IA + CRM em uma única operação</div>
          <h1 className="mt-7 text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-neutral-950 sm:text-7xl lg:text-[82px]">Você está pagando para gerar leads.<span className="mt-2 block italic font-medium text-orange-500">E depois deixando esses leads esperando.</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">O MAI responde, conversa, qualifica e organiza seus leads automaticamente — enquanto seu time se concentra nas oportunidades que realmente precisam de um vendedor.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/mai/cadastro" className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-neutral-800">Quero responder meus leads automaticamente <ArrowRight className="h-4 w-4"/></Link><Link href="/quiz/omni-demo" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3.5 text-sm font-bold text-neutral-900 hover:border-neutral-400"><Play className="h-3.5 w-3.5 fill-current"/> Ver o MAI funcionando</Link></div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-neutral-400"><span><Check className="mr-1 inline h-3 w-3 text-orange-500"/>Sem trocar sua operação inteira</span><span><Check className="mr-1 inline h-3 w-3 text-orange-500"/>IA configurável</span><span><Check className="mr-1 inline h-3 w-3 text-orange-500"/>Multi-vertical</span></div>
        </div>
        <ProductPreview/>
      </section>

      <section id="problema" className="border-y border-neutral-200 bg-white px-5 py-24 sm:px-8"><div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]"><Heading eyebrow="O problema" title="Seu marketing pode estar funcionando. O vazamento pode estar depois do clique." text="Você compra tráfego. O lead chega. Mas alguém demora para responder, pergunta a mesma coisa pela centésima vez ou recebe uma oportunidade sem contexto."/><div className="grid gap-3 sm:grid-cols-2">{[["Você gera o lead.","Mas a resposta depende de alguém estar disponível."],["Você recebe a conversa.","Mas a origem pode desaparecer no caminho."],["Você tem um CRM.","Mas o atendimento acontece em outro lugar."],["Você tem vendedores.","Mas eles gastam tempo com perguntas repetitivas."]].map(([a,b],i)=><div key={a} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"><div className="mb-7 text-xs font-bold text-orange-500">0{i+1}</div><h3 className="text-lg font-semibold">{a}</h3><p className="mt-2 text-sm leading-6 text-neutral-500">{b}</p></div>)}</div></div></section>

      <section id="como-funciona" className="px-5 py-24 sm:px-8"><div className="mx-auto max-w-7xl"><Heading eyebrow="O mecanismo" title="O MAI foi criado para fechar essa falha." text="Uma camada entre o tráfego e o vendedor: recebe, responde, entende, qualifica, encaminha e mede."/><div className="mt-14 grid gap-4 md:grid-cols-5">{[["01","Identificar","De onde veio o lead e em qual campanha ele entrou."],["02","Responder","Iniciar a conversa sem depender de uma pessoa disponível."],["03","Qualificar","Descobrir intenção, contexto e próximos passos."],["04","Encaminhar","Entregar a oportunidade ao vendedor com histórico."],["05","Medir","Conectar conversa, pipeline e resultado."]].map(([n,t,d])=><div key={n} className="group rounded-2xl border border-neutral-200 bg-white p-5 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5"><div className="flex justify-between text-[10px] font-bold tracking-[0.14em] text-orange-500">{n}<ArrowRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-orange-500"/></div><h3 className="mt-10 text-lg font-semibold">{t}</h3><p className="mt-2 text-xs leading-5 text-neutral-500">{d}</p></div>)}</div></div></section>

      <section id="recursos" className="border-y border-neutral-200 bg-white px-5 py-24 sm:px-8"><div className="mx-auto max-w-7xl"><Heading eyebrow="Tudo em um lugar" title="Seu time não precisa de mais cinco ferramentas." text="Precisa de um sistema que faça atendimento, qualificação e operação comercial conversarem entre si."/><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{features.map(([title,text,Icon])=><article key={title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 hover:bg-white hover:shadow-lg"><div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-600"><Icon className="h-5 w-5"/></div><h3 className="mt-5 text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-neutral-500">{text}</p></article>)}</div></div></section>

      <section className="px-5 py-24 sm:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center"><div><Heading eyebrow="Uma conversa vale mais quando tem contexto" title="Cada lead tem um relógio." text="O MAI não existe para substituir o vendedor. Existe para fazer o vendedor chegar na conversa certa, no momento certo, com informação suficiente para agir."/><div className="mt-9 space-y-4">{["Perguntas repetitivas saem da frente.","O histórico acompanha o lead.","O time recebe contexto antes do contato.","A gestão enxerga onde a oportunidade está."].map((x,i)=><div key={x} className="flex items-center gap-4 border-b border-neutral-200 pb-4"><span className="text-[10px] font-bold text-orange-500">0{i+1}</span><span className="text-sm font-medium">{x}</span></div>)}</div></div><div className="relative overflow-hidden rounded-[28px] bg-neutral-950 p-8 text-white"><div className="relative"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-orange-300"><Clock3 className="h-3.5 w-3.5"/> O fluxo</div><div className="mt-10 space-y-5">{["Lead chega","MAI responde","IA entende","Vendedor recebe","Resultado aparece"].map((x,i)=><div key={x} className="flex items-center gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-orange-300">{i+1}</span><span className="text-sm font-medium">{x}</span></div>)}</div></div></div></div></section>

      <section className="border-y border-neutral-200 bg-white px-5 py-24 sm:px-8"><div className="mx-auto max-w-7xl"><Heading eyebrow="Diagnóstico" title="Quanto pode estar escapando antes da venda?" text="Use a calculadora como cenário de referência. Ela não promete um resultado; mostra como pequenos vazamentos podem ganhar escala."/><div className="mt-12 grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-neutral-200 p-7"><div className="flex justify-between"><label className="text-sm font-semibold">Leads por dia</label><strong className="text-2xl">{leads}</strong></div><input type="range" min="5" max="200" step="5" value={leads} onChange={e=>setLeads(Number(e.target.value))} className="mt-5 w-full accent-orange-500"/><div className="mt-2 flex justify-between text-[10px] text-neutral-400"><span>5</span><span>200</span></div><div className="mt-9 flex justify-between"><label className="text-sm font-semibold">Ticket médio</label><strong className="text-2xl">R$ {ticket.toLocaleString("pt-BR")}</strong></div><input type="range" min="500" max="50000" step="500" value={ticket} onChange={e=>setTicket(Number(e.target.value))} className="mt-5 w-full accent-orange-500"/><div className="mt-2 flex justify-between text-[10px] text-neutral-400"><span>R$ 500</span><span>R$ 50.000</span></div><div className="mt-9 rounded-xl bg-orange-50 p-4 text-xs leading-5 text-orange-800">Cenário ilustrativo baseado nos números inseridos. Ajuste as premissas à sua operação antes de tomar decisões.</div></div><div className="rounded-2xl bg-neutral-950 p-7 text-white"><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-300">Seu cenário</div><div className="mt-8 space-y-6">{[["Leads no mês",monthly.toLocaleString("pt-BR")],["Leads em cenário de perda de 45%",gap.toLocaleString("pt-BR")],["Vendas em cenário de 8%",recovered.toLocaleString("pt-BR")],["Faturamento potencial correspondente",`R$ ${revenue.toLocaleString("pt-BR")}`]].map(([a,b],i)=><div key={a} className="border-b border-white/10 pb-5 last:border-0"><div className="text-xs text-white/45">{a}</div><div className={`mt-1 text-3xl font-semibold ${i>1?"text-orange-300":""}`}>{b}</div></div>)}</div></div></div></div></section>

      <section id="planos" className="px-5 py-24 sm:px-8"><div className="mx-auto max-w-5xl"><div className="mx-auto max-w-2xl text-center"><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600">Planos</div><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Comece simples. Expanda quando a operação pedir.</h2><p className="mt-5 text-base leading-7 text-neutral-500">Os valores abaixo seguem a configuração comercial descrita no projeto e devem ser validados antes de publicação.</p></div><div className="mt-14 grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-neutral-200 bg-white p-7"><div className="text-[10px] uppercase tracking-[0.16em] text-neutral-400">Starter</div><div className="mt-3 text-4xl font-semibold">R$ 497<span className="text-sm text-neutral-400">/mês</span></div><p className="mt-2 text-sm text-neutral-500">Para começar a organizar atendimento e qualificação.</p><div className="my-7 h-px bg-neutral-200"/><ul className="space-y-3 text-sm">{["1 número de WhatsApp","Qualificação por IA","CRM Kanban","Dashboard básico","Suporte via chat"].map(x=><li key={x}><Check className="mr-2 inline h-4 w-4 text-orange-500"/>{x}</li>)}</ul><Link href="/mai/cadastro" className="mt-8 block rounded-lg border border-neutral-300 py-3 text-center text-sm font-bold hover:bg-neutral-50">Começar com Starter</Link></div><div className="relative rounded-2xl bg-neutral-950 p-7 text-white"><div className="absolute right-5 top-5 rounded-full bg-orange-500 px-2.5 py-1 text-[9px] font-bold uppercase">Pro</div><div className="text-[10px] uppercase tracking-[0.16em] text-orange-300">Operação completa</div><div className="mt-3 text-4xl font-semibold">R$ 997<span className="text-sm text-white/40">/mês</span></div><p className="mt-2 text-sm text-white/55">Para equipes que querem unir atendimento, IA e operação comercial.</p><div className="my-7 h-px bg-white/10"/><ul className="space-y-3 text-sm">{["Tudo do Starter","Até 3 números de WhatsApp","IA de voz","Atribuição avançada","Relatórios exportáveis","Onboarding dedicado"].map(x=><li key={x}><Check className="mr-2 inline h-4 w-4 text-orange-300"/>{x}</li>)}</ul><Link href="/mai/cadastro" className="mt-8 flex justify-center rounded-lg bg-orange-500 py-3 text-sm font-bold hover:bg-orange-600">Ativar Pro <ArrowRight className="ml-2 h-4 w-4"/></Link></div></div></div></section>

      <section className="border-y border-neutral-200 bg-white px-5 py-24 sm:px-8"><div className="mx-auto max-w-5xl"><Heading eyebrow="Objeções" title="Talvez você esteja pensando uma destas três coisas."/><div className="mt-12 grid gap-4 md:grid-cols-3">{[["“Eu já tenho CRM.”","Ótimo. O problema que o MAI resolve começa antes: a conversa, a resposta e a qualificação."],["“Meus vendedores já respondem.”","Então use o MAI para tirar do time o que é repetitivo e deixar o humano para o que exige julgamento."],["“Não quero um robô falando com meus clientes.”","A IA pode operar nos bastidores e escalar para uma pessoa quando necessário."]].map(([a,b])=><div key={a} className="rounded-2xl border border-neutral-200 p-6"><div className="text-lg font-semibold">{a}</div><p className="mt-3 text-sm leading-6 text-neutral-500">{b}</p></div>)}</div></div></section>

      <section id="faq" className="px-5 py-24 sm:px-8"><div className="mx-auto max-w-3xl"><div className="text-center"><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-600">FAQ</div><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Antes de começar.</h2></div><div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">{faqs.map(([q,a],i)=><div key={q}><button type="button" onClick={()=>setFaq(faq===i?null:i)} className="flex w-full items-center justify-between gap-5 py-5 text-left"><span className="text-sm font-semibold">{q}</span><ChevronDown className={`h-4 w-4 text-neutral-400 transition ${faq===i?"rotate-180":""}`}/></button>{faq===i&&<div className="pb-5 pr-10 text-sm leading-6 text-neutral-500">{a}</div>}</div>)}</div></div></section>

      <section className="px-5 pb-24 sm:px-8"><div className="mx-auto max-w-7xl rounded-[28px] bg-neutral-950 px-6 py-16 text-center text-white sm:px-12"><div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-orange-300"><Zap className="h-3 w-3"/> Menos trabalho repetitivo. Mais contexto para vender.</div><h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Você já está pagando pelos leads.<span className="block italic font-medium text-orange-300">Agora faça cada lead trabalhar um pouco mais.</span></h2><p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/55">Veja como o MAI pode entrar na sua operação sem transformar sua equipe em projeto de implementação.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/mai/cadastro" className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-7 py-3.5 text-sm font-bold hover:bg-orange-600">Quero conhecer o MAI <ArrowRight className="h-4 w-4"/></Link><Link href="/quiz/omni-demo" target="_blank" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-7 py-3.5 text-sm font-bold hover:bg-white/5">Ver demonstração</Link></div></div></section>

      <footer className="border-t border-neutral-200 bg-white px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between"><div className="font-semibold text-neutral-800">MAI — Motor de Atendimento & Inteligência</div><div className="flex gap-5"><Link href="/mai/login">Entrar</Link><Link href="/mai/cadastro">Criar conta</Link><a href="#faq">FAQ</a></div><span>© 2026 MAI</span></div></footer>
    </main>
  );
}
