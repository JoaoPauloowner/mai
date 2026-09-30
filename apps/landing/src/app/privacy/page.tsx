import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Database, Share2, UserCheck, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | OMNAI (OmniBDR)",
  description: "Política de Privacidade e Proteção de Dados Pessoais da plataforma OMNAI / OmniBDR em conformidade com a LGPD.",
};

export default function PrivacyPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "suporte@omnibdr.com.br";

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-zinc-900">
            <span className="w-6 h-6 rounded bg-zinc-900 text-white flex items-center justify-center text-xs font-extrabold">Ω</span>
            <span>OMNAI (OmniBDR)</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 sm:py-16 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-700 mb-6">
          <Lock className="w-3.5 h-3.5 text-zinc-900" />
          <span>Privacidade e Proteção de Dados (LGPD)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mb-4">
          Política de Privacidade
        </h1>
        <p className="text-xs text-zinc-500 mb-8">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </p>

        <div className="space-y-8 text-sm text-zinc-700 leading-relaxed">
          {/* 1. Introdução */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              1. Visão Geral e Compromisso
            </h2>
            <p>
              A <strong>OmniBDR (OMNAI)</strong> oferece soluções de automação e qualificação comercial inteligente para canais digitais (WhatsApp e Instagram Direct). Esta Política de Privacidade descreve como coletamos, tratamos, armazenamos e protegemos os dados pessoais de nossos clientes (Organizações) e dos usuários finais que interagem com os agentes de atendimento (Leads), em estrita conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).
            </p>
          </section>

          {/* 2. Dados Coletados */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-zinc-900" />
              2. Dados Coletados e Finalidades
            </h2>
            <p>Coletamos estritamente os dados necessários para o fornecimento do serviço contratado:</p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <span className="font-bold text-zinc-900 block mb-0.5">Dados da Organização e Usuários do Painel:</span>
                Nome completo, e-mail corporativo, telefone de contato, credenciais de acesso (senhas armazenadas com hash irreversível bcrypt) e tokens de conexão delegados da Meta Cloud API.
              </div>
              <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <span className="font-bold text-zinc-900 block mb-0.5">Dados dos Leads e Interações:</span>
                Número de telefone (armazenado com hash SHA-256 para indexação e identificação), nome informado no perfil do WhatsApp/Instagram, histórico das mensagens trocadas, parâmetros de campanha publicitária (UTMs do Meta Ads) e agendamentos solicitados.
              </div>
              <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <span className="font-bold text-zinc-900 block mb-0.5">Base de Conhecimento Empresarial (RAG):</span>
                Documentos institucionais, manuais e tabelas fornecidos pela organização cliente para treinamento contextual exclusivo da IA daquela organização (dados isolados por tenant).
              </div>
            </div>
          </section>

          {/* 3. Compartilhamento de Dados */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-zinc-900" />
              3. Compartilhamento com Terceiros e Provedores de Infraestrutura
            </h2>
            <p>Para a operação dos serviços, os dados podem ser processados por provedores especializados sob rigorosos acordos de confidencialidade e segurança:</p>
            <ul className="list-disc list-inside text-xs space-y-1.5 text-zinc-600 pl-2">
              <li><strong>Meta Platforms (WhatsApp Cloud API / Instagram Direct):</strong> Para transmissão e recepção de mensagens ponta a ponta.</li>
              <li><strong>Provedores de Modelos de Linguagem (OpenAI / Groq):</strong> Para inferência e geração de respostas do SDR no momento da mensagem, sem retenção para re-treinamento público de modelos.</li>
              <li><strong>Asaas Gestão Financeira:</strong> Para processamento seguro de pagamentos e assinaturas recorrentes.</li>
              <li><strong>Supabase / AWS:</strong> Para hospedagem de banco de dados com criptografia em repouso e em trânsito.</li>
            </ul>
          </section>

          {/* 4. Direitos dos Titulares (LGPD) */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-zinc-900" />
              4. Direitos dos Titulares de Dados
            </h2>
            <p>Nos termos dos artigos 18 e seguintes da LGPD, o titular de dados possui os seguintes direitos:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                "Confirmação da existência de tratamento",
                "Acesso aos dados pessoais mantidos",
                "Correção de dados incompletos ou inexatos",
                "Anonimização, bloqueio ou eliminação de dados desnecessários",
                "Portabilidade dos dados a outro fornecedor",
                "Revogação do consentimento concedido",
              ].map((r, i) => (
                <div key={i} className="p-2.5 rounded-lg border border-zinc-200 bg-white">
                  • {r}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 pt-1">
              Para exercer qualquer um dos seus direitos ou solicitar a exclusão de dados, consulte nossa página de <Link href="/data-deletion" className="text-zinc-900 font-semibold underline">Exclusão de Dados</Link> ou entre em contato pelo e-mail <strong>{supportEmail}</strong>.
            </p>
          </section>

          {/* 5. Segurança da Informação */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-900" />
              5. Segurança da Informação
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Adotamos padrões técnicos robustos de proteção, incluindo criptografia TLS 1.3 em trânsito, isolamento lógico de banco de dados por organização (multi-tenancy seguro), validação estrita de assinaturas HMAC SHA-256 em webhooks e mascaramento de dados confidenciais em logs de auditoria.
            </p>
          </section>

          {/* Aviso Legal */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-[11px] text-zinc-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-zinc-700">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Transparência Institucional:</span>
            </div>
            <p>
              Esta política estabelece as diretrizes práticas de engenharia e privacidade da plataforma OMNAI. Para revisões contratuais específicas ou acordos de processamento de dados (DPA) corporativos, solicite via canal de atendimento.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 bg-zinc-50 text-xs text-zinc-500 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">Termos de Uso</Link>
            <Link href="/data-deletion" className="hover:underline">Exclusão de Dados</Link>
            <Link href="/support" className="hover:underline">Suporte</Link>
          </div>
          <div>© {new Date().getFullYear()} OmniBDR / OMNAI Platform.</div>
        </div>
      </footer>
    </div>
  );
}
