import Link from "next/link";
import { ShieldAlert, Mail, ArrowLeft, Clock, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Exclusão e Eliminação de Dados | OMNAI (OmniBDR)",
  description: "Instruções oficiais para solicitação de exclusão e eliminação de dados nos termos da LGPD e políticas da Meta/WhatsApp.",
};

export default function DataDeletionPage() {
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
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-900" />
          <span>Diretriz de Privacidade & Conformidade LGPD</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 mb-4">
          Instruções de Exclusão de Dados do Usuário
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-8">
          A <strong>OmniBDR (OMNAI)</strong> atua com total compromisso à privacidade e transparência, cumprindo integralmente a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018) e as diretrizes de Plataforma para Desenvolvedores da Meta.
        </p>

        <div className="space-y-8 text-sm text-zinc-700 leading-relaxed">
          {/* Passo a Passo */}
          <section className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-4">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-900" />
              Como solicitar a exclusão dos seus dados
            </h2>
            <p>
              Para solicitar a exclusão definitiva dos seus dados cadastrais, mensagens ou informações vinculadas a sua organização, envie um e-mail para:
            </p>
            <div className="p-3 bg-white border border-zinc-300 rounded-xl font-mono text-xs font-bold text-zinc-900 w-fit">
              {supportEmail}
            </div>
            <p className="text-xs text-zinc-600">
              No corpo da mensagem, por favor informe:
            </p>
            <ul className="list-disc list-inside text-xs space-y-1 text-zinc-600 pl-2">
              <li>Nome completo do titular ou representante legal;</li>
              <li>E-mail cadastrado na plataforma;</li>
              <li>Número de telefone / WhatsApp conectado à integração;</li>
              <li>Nome da organização / empresa registrada no OMNAI.</li>
            </ul>
          </section>

          {/* Prazo */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-900" />
              Prazo de Atendimento
            </h2>
            <p>
              Em conformidade com o Artigo 19 da LGPD, as solicitações são processadas e concluídas em um prazo de até <strong>15 (quinze) dias corridos</strong> após a confirmação da identidade do solicitante. O titular receberá um e-mail com a confirmação do protocolo de eliminação.
            </p>
          </section>

          {/* O que é excluído */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-900" />
              Escopo dos Dados Excluídos
            </h2>
            <p>Após a confirmação do pedido, os seguintes dados são purgados de forma permanente e irreversível dos nossos servidores:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Dados de cadastro (nome, e-mail, senha criptografada)",
                "Histórico completo de conversas e mensagens de WhatsApp/Direct",
                "Documentos e arquivos carregados na Base de Conhecimento (RAG)",
                "Embeddings vetoriais e índices de treinamento da IA",
                "Tokens de acesso da Meta/Facebook e chaves de integração",
                "Logs e rastros operacionais associados à identidade do titular",
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-zinc-200 bg-white flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Retenção legal */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-900">Retenção Legal Obrigatória</h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Determinados registros poderão ser mantidos exclusivamente para cumprimento de obrigação legal ou regulatória (ex: dados fiscais e registros de conexão previstos no Marco Civil da Internet - Lei nº 12.965/2014) pelo prazo estritamente exigido em lei, sob sigilo e sem qualquer uso comercial.
            </p>
          </section>

          {/* Revogação no Facebook */}
          <section className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-900 space-y-2">
            <div className="font-bold">Aviso sobre Desconexão no Facebook / Meta:</div>
            <p>
              A revogação de permissões ou exclusão do aplicativo nas configurações da sua conta do Facebook remove o acesso da plataforma aos seus dados futuros, mas não apaga automaticamente os dados já processados em nossos servidores. Para a exclusão total, é obrigatório o envio da solicitação por e-mail conforme descrito acima.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 bg-zinc-50 text-xs text-zinc-500 text-center">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Política de Privacidade</Link>
            <Link href="/terms" className="hover:underline">Termos de Uso</Link>
            <Link href="/support" className="hover:underline">Suporte</Link>
          </div>
          <div>© {new Date().getFullYear()} OmniBDR / OMNAI Platform.</div>
        </div>
      </footer>
    </div>
  );
}
