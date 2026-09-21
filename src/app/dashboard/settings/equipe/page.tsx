"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  User,
  ExternalLink,
  CheckCircle2,
  Copy,
  Trash2,
  Mail,
  Phone,
  Lock,
} from "lucide-react";

interface TeamMember {
  id: string;
  nome: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    assignedLeads: number;
  };
}

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [role, setRole] = useState("VENDEDOR");
  const [senha, setSenha] = useState("Mudar@123");

  const [inviteSuccess, setInviteSuccess] = useState<{
    message: string;
    telefone: string;
  } | null>(null);

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/settings/team");
      const data = await res.json();
      if (data.users) setMembers(data.users);
    } catch (e) {
      console.error("Erro ao buscar equipe", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/settings/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone, role, senha }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setMembers((prev) => [...prev, { ...data.user, createdAt: new Date().toISOString(), _count: { assignedLeads: 0 } }]);
        setInviteSuccess({
          message: data.inviteMessage,
          telefone: telefone || "",
        });
        setNome("");
        setEmail("");
        setTelefone("");
      } else {
        alert(data.error || "Falha ao adicionar membro");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header da Tela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00ddd7]" /> Gestão de Equipe & Vendedores
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Cadastre vendedores e gerentes. Novos leads serão distribuídos automaticamente entre a equipe.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setInviteSuccess(null);
            setShowModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#00ddd7]/20"
        >
          <UserPlus className="w-4 h-4" /> Adicionar Vendedor / Gerente
        </button>
      </div>

      {/* Lista de Membros da Equipe */}
      <div className="p-6 rounded-2xl bg-[#111622] border border-[#1e2638] space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center justify-between">
          <span>Membros Ativos ({members.length})</span>
          <span className="text-[#00ddd7] text-[11px]">Distribuição Round-Robin Ativa</span>
        </h3>

        {loading ? (
          <p className="text-xs text-gray-500 py-6 text-center">Carregando membros da equipe...</p>
        ) : members.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">Nenhum membro cadastrado além do administrador.</p>
        ) : (
          <div className="divide-y divide-[#1e2638]/60">
            {members.map((user) => (
              <div
                key={user.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#161d2d] border border-[#252e42] text-white flex items-center justify-center font-bold text-sm">
                    {user.nome.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{user.nome}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-semibold border ${
                          user.role === "SUPER_ADMIN" || user.role === "ADMIN_EMPRESA"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {user.role === "ADMIN_EMPRESA" ? "GERENTE" : user.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "VENDEDOR"}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono block mt-0.5">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Leads Atribuídos</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {user._count?.assignedLeads || 0} leads
                    </span>
                  </div>

                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Ativo no Rodízio" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Convidar / Cadastrar Membro */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111622] border border-[#1e2638] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#00ddd7]" />
              Cadastrar Novo Vendedor ou Gerente
            </h3>

            {inviteSuccess ? (
              <div className="space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-white">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Vendedor Cadastrado com Sucesso!
                </div>
                <p className="text-gray-300">
                  Envie os dados de acesso para o vendedor via WhatsApp:
                </p>
                <div className="p-2.5 rounded-lg bg-[#0c101a] text-[11px] font-mono text-gray-300 border border-[#1e2638] break-all">
                  {inviteSuccess.message}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteSuccess.message);
                      alert("Mensagem copiada para a área de transferência!");
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#161d2d] hover:bg-[#1e2638] text-white font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copiar Dados
                  </button>

                  {inviteSuccess.telefone && (
                    <a
                      href={`https://wa.me/${inviteSuccess.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(inviteSuccess.message)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Enviar no WhatsApp
                    </a>
                  )}
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-xs text-gray-400 hover:text-white underline"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddMember} className="space-y-3">
                <div>
                  <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto Vendas"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                    E-mail de Login
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vendas@suaempresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                    WhatsApp do Vendedor (Para envio do link de acesso)
                  </label>
                  <input
                    type="text"
                    placeholder="+55 11 99999-8888"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                      Cargo / Perfil
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white focus:outline-none focus:border-[#00ddd7]"
                    >
                      <option value="VENDEDOR">Vendedor (Apenas seus leads)</option>
                      <option value="ADMIN_EMPRESA">Gerente (Acesso total)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 uppercase font-mono block mb-1">
                      Senha Provisória
                    </label>
                    <input
                      type="text"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#161d2d] border border-[#252e42] text-xs text-white font-mono focus:outline-none focus:border-[#00ddd7]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#161d2d] hover:bg-[#1e2638] text-xs text-gray-300 font-medium transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !nome || !email}
                    className="px-4 py-2 rounded-xl bg-[#00ddd7] hover:bg-[#00c4be] text-black text-xs font-bold transition disabled:opacity-50"
                  >
                    {submitting ? "Cadastrando..." : "Cadastrar e Gerar Convite"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
