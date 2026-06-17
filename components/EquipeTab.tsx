"use client";

import React, { useState } from "react";
import { Staff } from "../types/erp";

interface EquipeTabProps {
  staffList: Staff[];
  onAddNewStaff: (newStaff: Omit<Staff, "id" | "earnedCommission">) => void;
  onPayCommission: (staffId: string) => void;
  onUpdateStaff?: (updated: Staff) => void;
  onDeleteStaff?: (staffId: string) => void;
}

export default function EquipeTab({
  staffList,
  onAddNewStaff,
  onPayCommission,
  onUpdateStaff,
  onDeleteStaff,
}: EquipeTabProps) {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffSpecialty, setStaffSpecialty] = useState("Dermatologia Estética");
  const [staffPermission, setStaffPermission] = useState<
    "Especialista" | "Admin Unidade" | "Atendimento"
  >("Especialista");
  const [staffCommission, setStaffCommission] = useState("40"); // default 40%

  // Status logs
  const [payoutLogs, setPayoutLogs] = useState<string[]>([]);

  const handleOpenEdit = (staff: Staff) => {
    console.log("Edit clicked for:", staff.id);
    setStaffName(staff.name);
    setStaffEmail(staff.email);
    setStaffSpecialty(staff.specialty);
    setStaffPermission(staff.permission);
    setStaffCommission((staff.commissionRate * 100).toString());
    setEditingStaffId(staff.id);
    setShowAddStaffModal(true);
  };

  const handleAddNewStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit clicked, editingStaffId:", editingStaffId);
    if (!staffName || !staffEmail) return;

    if (editingStaffId && onUpdateStaff) {
      const existing = staffList.find((s) => s.id === editingStaffId);
      if (existing) {
        onUpdateStaff({
          ...existing,
          name: staffName,
          email: staffEmail,
          specialty: staffSpecialty,
          permission: staffPermission,
          commissionRate: parseFloat(staffCommission) / 100,
        });
      }
    } else {
      onAddNewStaff({
        name: staffName,
        email: staffEmail,
        specialty: staffSpecialty,
        permission: staffPermission,
        status: "Ativo",
        commissionRate: parseFloat(staffCommission) / 100,
      });
    }

    setStaffName("");
    setStaffEmail("");
    setEditingStaffId(null);
    setShowAddStaffModal(false);
  };

  const handlePayoutTrigger = (staff: Staff) => {
    if (staff.earnedCommission === 0) return;
    onPayCommission(staff.id);

    // Save notification
    const log = `Comissão de R$ ${staff.earnedCommission.toLocaleString("pt-BR")} paga com sucesso para ${staff.name}!`;
    setPayoutLogs([log, ...payoutLogs]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-gold/5 pb-4 mb-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary-dark">
            Membros da Equipe
          </h1>
          <p className="text-on-surface-variant font-medium mt-1 text-sm">
            Gestão de credenciais de corpo clínico, rateio de honorários e
            tabelas percentuais de comissão.
          </p>
        </div>
        <button
          onClick={() => setShowAddStaffModal(true)}
          className="px-6 py-3 bg-gradient-gold-button text-white rounded-xl font-bold text-xs tracking-wider uppercase shadow-md active:scale-95 transition-smooth shrink-0"
        >
          Novo Membro Especialista
        </button>
      </div>

      {/* Notifications log band if any payouts occur */}
      {payoutLogs.length > 0 && (
        <div className="space-y-2">
          {payoutLogs.slice(0, 2).map((log, index) => (
            <div
              key={index}
              className="p-4 bg-primary/10 border border-primary/20 text-primary-dark rounded-xl text-xs font-bold font-sans flex items-center gap-2 animate-in slide-in-from-top-1"
            >
              <span className="material-symbols-outlined text-[#3d4c3a] text-sm">
                verified_user
              </span>
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Grid of Team Specialists & Payouts */}
      <section className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="bg-white border border-gold/15 rounded-2xl shadow-sm text-left overflow-hidden">
          <div className="p-6 border-b border-gold/10 bg-bg-base/30">
            <h3 className="font-bold text-lg text-primary-dark flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">badge</span>
              Quadro Clínico e Comissões Acumuladas
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold text-left">
              <thead>
                <tr className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest bg-bg-base/20 border-b border-gold/5">
                  <th className="px-6 py-4">Nome / Cadastro</th>
                  <th className="px-6 py-4">Specialty / Role</th>
                  <th className="px-6 py-4">Comissão Base</th>
                  <th className="px-6 py-4 text-center">Acesso</th>
                  <th className="px-6 py-4 text-right">Comissão Acumulada</th>
                  <th className="px-6 py-4 text-right">Ação Comercial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10 font-sans">
                {staffList.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-bg-base/40 transition-smooth"
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gold/10 text-[#775a19] rounded-full flex items-center justify-center font-extrabold text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-extrabold text-primary-dark leading-snug">
                            {member.name}
                          </p>
                          <span className="text-[10px] text-on-surface-variant/70 italic font-medium">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <p className="text-primary-dark font-bold">
                        {member.specialty}
                      </p>
                      <span className="text-2xs font-extrabold uppercase bg-bg-base/50 text-[#1a1c1b]/60 px-2.5 py-0.5 border border-gold/5 rounded mt-1.5 inline-block">
                        {member.permission}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-primary-dark font-extrabold text-sm">
                      {(member.commissionRate * 100).toFixed(0)}%
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-primary/10 text-primary-dark">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right text-base text-primary font-extrabold">
                      R${" "}
                      {member.earnedCommission.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-2 bg-white border border-gold/20 rounded-lg hover:border-gold-dark text-on-surface-variant hover:text-primary active:scale-95 transition-smooth cursor-pointer"
                          title="Editar Especialista"
                        >
                          <span className="material-symbols-outlined text-xs leading-none font-bold">
                            edit
                          </span>
                        </button>
                        {onDeleteStaff && (
                          <button
                            onClick={() => {
                              onDeleteStaff(member.id);
                            }}
                            className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 active:scale-95 transition-smooth cursor-pointer"
                            title="Remover Especialista"
                          >
                            <span className="material-symbols-outlined text-xs leading-none font-bold">
                              delete
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => handlePayoutTrigger(member)}
                          disabled={member.earnedCommission === 0}
                          className="px-4 py-2 text-2xs bg-gold/15 hover:bg-gold hover:text-white disabled:bg-neutral-100 disabled:text-neutral-400 font-extrabold rounded-lg tracking-wide uppercase shadow-2xs transition-all active:scale-95 text-gold-dark ml-2"
                        >
                          Pagar Payout
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Creational modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/12 pb-3">
              <h3 className="text-lg font-bold text-primary-dark">
                Cadastrar Especialista Clínico
              </h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-on-surface-variant hover:text-red-500 font-bold"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddNewStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Elenice Silva"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">
                  E-mail Profissional
                </label>
                <input
                  type="email"
                  required
                  placeholder="elenice@benessere.com"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">
                    Especialidade Principal
                  </label>
                  <select
                    value={staffSpecialty}
                    onChange={(e) => setStaffSpecialty(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="Dermatologia Estética">
                      Estética Facial
                    </option>
                    <option value="Massoterapia Crânio">
                      Massoterapia Crânio
                    </option>
                    <option value="Harmonização Facial">
                      Harmonização Avançada
                    </option>
                    <option value="Terapia de Spas">Terapia de Spas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary mb-1">
                    Taxa Comissão (%)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="40"
                    value={staffCommission}
                    onChange={(e) => setStaffCommission(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">
                  Classe de Permissão
                </label>
                <select
                  value={staffPermission}
                  onChange={(e) => setStaffPermission(e.target.value as any)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                >
                  <option value="Especialista">Especialista Clínico</option>
                  <option value="Admin Unidade">Admin de Unidade</option>
                  <option value="Atendimento">Atendimento & Recepção</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
