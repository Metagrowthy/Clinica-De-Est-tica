"use client";

import React, { useState } from "react";
import { Appointment, Transaction } from "../types/erp";

interface DashboardTabProps {
  appointments: Appointment[];
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
  onOpenAppointmentModal: () => void;
}

export default function DashboardTab({
  appointments,
  transactions,
  onNavigate,
  onOpenAppointmentModal,
}: DashboardTabProps) {
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [sentReminders, setSentReminders] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic date representation matching today's YYYY-MM-DD
  const todayDateStr = (() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Metric Calculators based on state
  const totalEstimatedRevenue = transactions
    .filter((t) => t.value > 0)
    .reduce((sum, t) => sum + t.value, 0);

  const activeAppointmentsCount = appointments.filter(
    (a) => a.status !== "Finalizado",
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
            Dashboard do Dia
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">
            Bem-vinda de volta ao ERP Benessere Vita. Aqui está o resumo de
            hoje.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gold/20 text-[#775a19] font-semibold text-sm shadow-sm">
          <span className="material-symbols-outlined text-gold">
            calendar_today
          </span>
          <span>24 de Maio, 2026</span>
        </div>
      </header>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Estetestimado */}
        <div className="bg-white p-6 rounded-xl border border-[#C5A059]/20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-smooth group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gold/10 text-primary-dark rounded-xl">
              <span className="material-symbols-outlined text-gold-dark font-bold">
                payments
              </span>
            </div>
            <span className="text-primary text-xs font-bold uppercase tracking-wider bg-primary/10 px-2.5 py-1 rounded-full">
              +12%
            </span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Faturamento Estimado
            </span>
            <h3 className="text-2xl font-extrabold text-primary-dark mt-1">
              R${" "}
              {totalEstimatedRevenue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>

        {/* KPI Novos Pacientes */}
        <div className="bg-white p-6 rounded-xl border border-[#C5A059]/20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-smooth group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#3d4c3a]/10 text-[#3d4c3a] rounded-xl">
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <span className="text-gold-dark text-xs font-bold uppercase tracking-wider bg-[#fed488]/30 px-2.5 py-1 rounded-full">
              +4 hoje
            </span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Novos Pacientes
            </span>
            <h3 className="text-2xl font-extrabold text-primary-dark mt-1">
              18
            </h3>
          </div>
        </div>

        {/* KPI Taxa de Ocupação */}
        <div className="bg-white p-6 rounded-xl border border-[#C5A059]/20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md transition-smooth group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#c8c6c6]/30 text-primary-dark rounded-xl">
              <span className="material-symbols-outlined font-bold">
                event_seat
              </span>
            </div>
            <div className="w-20 h-2 bg-on-surface-variant/10 rounded-full overflow-hidden mt-3">
              <div className="bg-gold h-full w-[85%] rounded-full"></div>
            </div>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              Taxa de Ocupação
            </span>
            <h3 className="text-2xl font-extrabold text-primary-dark mt-1">
              85%
            </h3>
          </div>
        </div>

        {/* KPI Venda Própria */}
        <div className="text-white p-6 rounded-xl bg-primary border border-[#C5A059]/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gold/10 rounded-full blur-xl group-hover:bg-gold/25 transition-smooth"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/10 text-gold rounded-xl">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <span className="text-gold text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
              PDV Ativo
            </span>
          </div>
          <div>
            <span className="text-xs text-[#abbca5] font-bold uppercase tracking-wider">
              Vendas de Produtos
            </span>
            <h3 className="text-2xl font-extrabold text-gold mt-1">
              R$ 3.820,00
            </h3>
          </div>
        </div>
      </section>

      {/* Main Insights & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Proximos Atendimentos */}
        <section className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-[#C5A059]/20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/10 bg-bg-base/50 gap-4">
              <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-gold">spa</span>
                Próximos Atendimentos de Hoje
              </h2>
              <button
                onClick={() => onNavigate("agenda")}
                className="text-gold-dark font-bold text-sm tracking-wide hover:underline flex items-center gap-1 active:scale-95 transition-smooth"
              >
                Ver Agenda Completa
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-primary-dark font-extrabold uppercase tracking-widest bg-bg-base/30 border-b border-gold/5">
                    <th className="px-6 py-4">Horário</th>
                    <th className="px-6 py-4">Paciente</th>
                    <th className="px-6 py-4">Procedimento</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {appointments.slice(0, 4).map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-bg-base/40 transition-smooth group"
                    >
                      <td className="px-6 py-4.5 font-extrabold text-primary-dark text-sm md:text-base">
                        {a.time}
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 text-gold-dark flex items-center justify-center font-extrabold text-sm shadow-inner">
                            {a.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-sm md:text-base font-bold text-primary">
                            {a.patientName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-sm md:text-base text-on-surface-variant font-semibold">
                        {a.procedure}
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                          ${
                            a.status === "Confirmado"
                              ? "bg-primary/10 text-primary-dark"
                              : a.status === "Em Atendimento"
                                ? "bg-[#fed488]/40 text-[#785a1a]"
                                : a.status === "Agendado"
                                  ? "bg-on-surface-variant/10 text-on-surface-variant"
                                  : "bg-gold/20 text-gold-dark"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              a.status === "Confirmado"
                                ? "bg-primary"
                                : a.status === "Em Atendimento"
                                  ? "bg-[#785a1a]"
                                  : a.status === "Agendado"
                                    ? "bg-outline"
                                    : "bg-gold-dark"
                            }`}
                          />
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-on-surface-variant text-sm md:text-base font-bold"
                      >
                        Nenhum agendamento para hoje.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-gold/10 text-center">
            <button
              onClick={onOpenAppointmentModal}
              className="px-6 py-2.5 bg-gradient-olive-button text-white rounded-xl font-bold text-xs md:text-sm hover:shadow-md active:scale-95 transition-smooth w-full sm:w-auto cursor-pointer"
            >
              Novo Agendamento
            </button>
          </div>
        </section>

        {/* Sidebar Insights */}
        <aside className="space-y-6">
          {/* Goals Tracker */}
          <div className="bg-white p-6 rounded-xl border border-[#C5A059]/20 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs md:text-sm font-extrabold text-primary-dark uppercase tracking-widest">
                Metas do Mês
              </h4>
              <span className="text-[#775a19] text-sm font-extrabold">72%</span>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2 text-on-surface-variant font-medium">
                  <span>Meta de Faturamento</span>
                  <span className="font-bold text-primary">R$ 84k / 120k</span>
                </div>
                <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
                  <div className="bg-gradient-gold-button h-full w-[72%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2 text-on-surface-variant font-medium">
                  <span>Novos Pacientes</span>
                  <span className="font-bold text-primary">32 / 45</span>
                </div>
                <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
                  <div className="bg-gradient-olive-button h-full w-[65%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate("financeiro")}
              className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gold/10 border border-[#C5A059]/20 rounded-xl hover:border-[#C5A059]/50 active:scale-95 transition-smooth text-primary gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-gold-dark text-2xl font-bold">
                analytics
              </span>
              <span className="text-xs font-semibold text-primary-dark">
                Relatórios Financeiros
              </span>
            </button>
            <button
              onClick={() => setShowNotificationCenter(true)}
              className="flex flex-col items-center justify-center p-4 bg-white hover:bg-gold/10 border border-[#C5A059]/20 rounded-xl hover:border-[#C5A059]/50 active:scale-95 transition-smooth text-primary gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-md shrink-0 cursor-pointer"
              id="btn-client-notifications"
            >
              <span className="material-symbols-outlined text-gold-dark text-2xl font-bold">
                sms
              </span>
              <span className="text-xs font-semibold text-primary-dark">
                Notificações Clientes
              </span>
            </button>
          </div>
        </aside>
      </div>

      {/* Dynamic Toast Feedback Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#3d4c3a] text-white border border-[#C5A059]/30 rounded-xl p-4 shadow-2xl z-55 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-gold font-bold">
            check_circle
          </span>
          <p className="text-xs font-bold font-sans">{toastMessage}</p>
        </div>
      )}

      {/* Authentic Interactive Client Notifications Modal */}
      {showNotificationCenter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-sans">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-gold/12 pb-3">
              <h3 className="text-lg font-bold text-primary-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-gold font-bold">
                  sms
                </span>
                Central de Confirmações e Notificações (Simulação)
              </h3>
              <button
                onClick={() => setShowNotificationCenter(false)}
                className="text-on-surface-variant hover:text-red-500 font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Dispare lembretes de agenda integrada para o WhatsApp de pacientes
              com agendamento ativo.
            </p>

            <div className="space-y-3.5 pt-2">
              {(() => {
                const todayAppointments = appointments.filter(
                  (a) => a.date === todayDateStr,
                );
                if (todayAppointments.length > 0) {
                  return todayAppointments.map((ap) => {
                    const isSent = sentReminders.includes(ap.id);
                    return (
                      <div
                        key={ap.id}
                        className="p-4 rounded-xl border border-gold/15 bg-bg-base/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-black text-[#775a19]">
                              {ap.time}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                            <span className="text-[9px] font-extrabold bg-[#fed488]/40 text-gold-dark px-1.5 py-0.2 rounded font-sans">
                              {ap.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-primary-dark">
                            {ap.patientName}
                          </h4>
                          <p className="text-2xs text-on-surface-variant font-semibold mt-0.5">
                            {ap.procedure}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isSent}
                          onClick={() => {
                            setSentReminders([...sentReminders, ap.id]);
                            // simulate clipboard text
                            const reminderMessage = `Olá ${ap.patientName}, confirmamos seu ritual de ${ap.procedure} hoje às ${ap.time} no Benessere Vita. Responda SIM para confirmar!`;
                            navigator.clipboard
                              .writeText(reminderMessage)
                              .catch(() => {});
                            triggerToast(
                              `Sucesso! Lembrete do WhatsApp copiado para área de transferência e enviado para ${ap.patientName}.`,
                            );
                          }}
                          className={`px-4 py-2.5 rounded-xl text-2xs font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer
                          ${
                            isSent
                              ? "bg-gray-100 text-emerald-700/60 border border-emerald-400/20"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm font-bold">
                            {isSent ? "done_all" : "send_to_mobile"}
                          </span>
                          {isSent ? "Lembrete Enviado" : "Disparar WhatsApp"}
                        </button>
                      </div>
                    );
                  });
                } else {
                  return (
                    <div className="text-center p-6 bg-gold/5 rounded-xl border border-dashed border-gold/15">
                      <span className="material-symbols-outlined text-gold text-2xl mb-1 block">
                        check_circle
                      </span>
                      <p className="text-xs font-bold text-primary-dark">
                        Nenhum atendimento para hoje
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                        Aproveite para planejar novos rituais estéticos!
                      </p>
                    </div>
                  );
                }
              })()}
            </div>

            <div className="flex justify-between items-center bg-gold/5 p-4 rounded-xl border border-gold/12 text-2xs font-semibold leading-relaxed text-gold-dark">
              <span>
                * Configurado para o fone padrão cadastrado no CRM de
                atendimento.
              </span>
              <button
                type="button"
                onClick={() => {
                  setSentReminders(appointments.map((a) => a.id));
                  triggerToast(
                    "Notificações em lote disparadas com sucesso via gateway Benessere!",
                  );
                }}
                className="px-3.5 py-1.5 bg-gold-dark text-white rounded-lg text-3xs font-black uppercase tracking-widest cursor-pointer hover:bg-gold transition-colors"
                id="btn-trigger-all-notifications"
              >
                Disparar Lote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Brand Leaf Section */}
      <footer className="pt-6 border-t border-gold/10 text-center flex items-center justify-center gap-2 text-xs text-on-surface-variant font-medium">
        <span className="material-symbols-outlined text-gold text-sm font-bold">
          spa
        </span>
        <span>
          Benessere Vita • Aura Wellness Design System • Solução Integrada de
          Estética de Alta Performance
        </span>
      </footer>
    </div>
  );
}
