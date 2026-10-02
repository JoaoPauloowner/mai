import Link from "next/link";
import { FileText, ArrowLeft, Shield, CheckCircle, AlertTriangle, Scale } from "lucide-react";

export const metadata = {
  title: "Termos de Serviço e Uso | OMNAI (OmniBDR)",
  description: "Termos e Condições Gerais de Uso da plataforma OMNAI / OmniBDR.",
};

export default function TermsPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "suporte@omnibdr.com.br";

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Login</span>
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
          <Scale className="w-3.5 h-3.5 text-zinc-900" />
          <span>Condições Gerais de Contratação</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mb-4">
          Termos de Serviço
        </h1>
        <p className="text-xs text-zinc-500 mb-8">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </p>

        <div className="space-y-8 text-sm text-zinc-700 leading-relaxed">
          {/* 1. Objeto */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              1. Objeto e Aceitação
            </h2>
            <p>
              Estes Termos de Serviço regem o acesso e uso da plataforma <strong>OMNAI (OmniBDR)</strong>, software como serviço (SaaS) destinado ao atendimento comercial automatizado, qualificação de leads por inteligência artificial (Motor MAI) e gestão de conversas em canais digitais (WhatsApp e Instagram). Ao criar uma conta ou utilizar a plataforma, o usuário e sua organização concordam integralmente com estes termos.
            </p>
          </section>

          {/* 2. Regras de Uso e WhatsApp */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-900" />
              2. Uso Aceitável e Políticas da Meta
            </h2>
            <p>O Contratante compromete-se a utilizar a plataforma estritamente para finalidades lícitas, sendo expressamente vedado:</p>
            <ul className="list-disc list-inside text-xs space-y-1.5 text-zinc-600 pl-2">
              <li>Envio de mensagens não solicitadas em massa (Spam) ou sem consentimento prévio do destinatário (Opt-in).</li>
              <li>Violação da <a href="https://www.whatsapp.com/legal/business-policy" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-zinc-900">Política Comercial do WhatsApp</a> ou dos Termos da Plataforma Meta.</li>
              <li>Disseminação de conteúdo difamatório, discriminatório, fraudulento ou que viole direitos de propriedade intelectual.</li>
              <li>Tentativas de engenharia reversa, sobrecarga proposital de infraestrutura ou exploração de vulnerabilidades.</li>
            </ul>
          </section>

          {/* 3. Inteligência Artificial e Respostas */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-zinc-900" />
              3. Operação dos Agentes de IA (Motor MAI)
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              O Motor MAI gera respostas contextuais com base nos documentos e instruções fornecidos pela organização na Base de Conhecimento (RAG). A organização cliente é responsável pela exatidão dos materiais carregados e pela supervisão periódica das interações através do Inbox Unificado da plataforma.
            </p>
          </section>

          {/* 4. Planos e Cobrança */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-900" />
              4. Assinaturas, Cobrança e Cancelamento
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Os serviços são disponibilizados mediante planos mensais ou anuais pré-pagos. Em caso de inadimplência, o envio de novas mensagens e o acesso ao painel podem ser temporariamente suspensos até a regularização. O cancelamento pode ser solicitado a qualquer momento pelo painel ou via suporte, sem multa para planos mensais.
            </p>
          </section>

          {/* 5. Limitação de Responsabilidade */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-zinc-900" />
              5. Limitação de Responsabilidade
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              A OMNAI envidará seus melhores esforços para garantir alta disponibilidade e estabilidade. Não nos responsabilizamos por instabilidades decorrentes de interrupções em serviços de terceiros (Meta Cloud API, provedores de telecomunicações ou gateway de pagamento), nem por sanções aplicadas pela Meta decorrentes de práticas de spam do usuário.
            </p>
          </section>

          {/* 6. Foro e Legislação */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">6. Legislação Aplicável e Foro</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias decorrentes deste contrato, as partes elegem o foro da Comarca do domicílio do Contratante ou da sede da Contratada.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 bg-zinc-50 text-xs text-zinc-500 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Política de Privacidade</Link>
            <Link href="/data-deletion" className="hover:underline">Exclusão de Dados</Link>
            <Link href="/support" className="hover:underline">Suporte</Link>
          </div>
          <div>© {new Date().getFullYear()} OmniBDR / OMNAI Platform. Contato: {supportEmail}</div>
        </div>
      </footer>
    </div>
  );
}
