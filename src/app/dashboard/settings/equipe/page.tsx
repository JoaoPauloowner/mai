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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
        setMembers((prev) => [
          ...prev,
          { ...data.user, createdAt: new Date().toISOString(), _count: { assignedLeads: 0 } },
        ]);
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E7EBE6] text-[#2C2E2A] text-xs font-medium border border-[#D0D5CD] mb-2">
            <Users className="w-3.5 h-3.5 text-[#7A8E75]" /> Distribuição Round-Robin
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2C2E2A]">
            Gestão de Equipe & Vendedores
          </h1>
          <p className="text-xs text-[#63695B] mt-1">
            Cadastre vendedores e gerentes. Novos leads são distribuídos automaticamente entre a equipe comercial.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => {
            setInviteSuccess(null);
            setShowModal(true);
          }}
        >
          <UserPlus className="w-4 h-4" /> Adicionar Vendedor / Gerente
        </Button>
      </div>

      {/* Lista de Membros da Equipe */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Membros Ativos ({members.length})</CardTitle>
            <CardDescription>Operadores habilitados a receber atendimentos e leads do CRM</CardDescription>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#DDE8DE] text-[#2D6A4F] border border-[#C4D7C4] font-bold">
            Round-Robin Ativo
          </span>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-xs text-[#7C8472] py-8 text-center">Carregando membros da equipe...</p>
          ) : members.length === 0 ? (
            <p className="text-xs text-[#7C8472] py-8 text-center">Nenhum membro cadastrado além do administrador.</p>
          ) : (
            <div className="divide-y divide-[#E0E3DE]">
              {members.map((user) => (
                <div
                  key={user.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAE2CA] text-[#2C2E2A] border border-[#D0D5CD] flex items-center justify-center font-bold text-sm shrink-0">
                      {user.nome.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#2C2E2A]">{user.nome}</span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                            user.role === "SUPER_ADMIN" || user.role === "ADMIN_EMPRESA"
                              ? "bg-[#DDE8DE] text-[#2D6A4F] border-[#C4D7C4]"
                              : "bg-[#E7EBE6] text-[#2C2E2A] border-[#D0D5CD]"
                          }`}
                        >
                          {user.role === "ADMIN_EMPRESA"
                            ? "GERENTE"
                            : user.role === "SUPER_ADMIN"
                            ? "SUPER ADMIN"
                            : "VENDEDOR"}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#7C8472] font-mono block mt-0.5">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block uppercase font-mono">Leads Atribuídos</span>
                      <span className="font-mono font-bold text-zinc-900">
                        {user._count?.assignedLeads || 0} leads
                      </span>
                    </div>

                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600" title="Ativo no Rodízio" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Convidar / Cadastrar Membro */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E0E3DE] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#2C2E2A] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#7A8E75]" />
              Cadastrar Novo Vendedor ou Gerente
            </h3>

            {inviteSuccess ? (
              <div className="space-y-3 bg-[#DDE8DE] border border-[#C4D7C4] rounded-2xl p-4 text-xs text-[#2C2E2A]">
                <div className="flex items-center gap-2 text-[#2D6A4F] font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Vendedor Cadastrado com Sucesso!
                </div>
                <p className="text-[#63695B]">
                  Envie os dados de acesso para o vendedor via WhatsApp:
                </p>
                <div className="p-3 rounded-xl bg-white text-[11px] font-mono text-[#2C2E2A] border border-[#C4D7C4] break-all">
                  {inviteSuccess.message}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteSuccess.message);
                      alert("Mensagem copiada para a área de transferência!");
                    }}
                    className="flex-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copiar Dados
                  </Button>

                  {inviteSuccess.telefone && (
                    <a
                      href={`https://wa.me/${inviteSuccess.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        inviteSuccess.message
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#24543E] transition shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-xs text-[#7C8472] hover:text-[#2C2E2A] underline cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddMember} className="space-y-3.5">
                <div>
                  <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto Vendas"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0E3DE] text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                    E-mail de Login
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vendas@suaempresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0E3DE] text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                    WhatsApp do Vendedor (Para envio do link de acesso)
                  </label>
                  <input
                    type="text"
                    placeholder="+55 11 99999-8888"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0E3DE] text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                      Cargo / Perfil
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0E3DE] text-xs text-[#2C2E2A] focus:outline-none focus:border-[#7A8E75]"
                    >
                      <option value="VENDEDOR">Vendedor (Apenas seus leads)</option>
                      <option value="ADMIN_EMPRESA">Gerente (Acesso total)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#2C2E2A] font-bold uppercase font-mono block mb-1">
                      Senha Provisória
                    </label>
                    <input
                      type="text"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E0E3DE] text-xs text-[#2C2E2A] font-mono focus:outline-none focus:border-[#7A8E75]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting || !nome || !email}
                  >
                    {submitting ? "Cadastrando..." : "Cadastrar e Gerar Convite"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
