"use client";

import React, { useState } from "react";
import { Appointment } from "../types/erp";

interface BusinessHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface AgendaTabProps {
  appointments: Appointment[];
  onOpenAppointmentModalWithDetails: (day: string, time: string) => void;
  onDeleteAppointment: (id: string) => void;
  onUpdateAppointment?: (updated: Appointment) => void;
  businessHours?: BusinessHour[];
}

export default function AgendaTab({
  appointments,
  onOpenAppointmentModalWithDetails,
  onDeleteAppointment,
  onUpdateAppointment,
  businessHours,
}: AgendaTabProps) {
  const [viewType, setViewType] = useState<"Weekly" | "Daily" | "Monthly">(
    "Weekly",
  ); // Default to Weekly as requested "formato de coluna igual a imagem 1"

  // default to today's index in daysOfWeek (Monday=0 to Sunday=6)
  const getTodayOffset = () => {
    const day = new Date().getDay(); // 0 = Sunday, 1 = Monday ...
    return day === 0 ? 6 : day - 1;
  };

  const [selectedDayOffset, setSelectedDayOffset] =
    useState<number>(getTodayOffset());

  // Edit fields
  const [editingAp, setEditingAp] = useState<Appointment | null>(null);
  const [editPtName, setEditPtName] = useState("");
  const [editProcedure, setEditProcedure] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editProf, setEditProf] = useState("");

  const handleEditApSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAp || !editPtName) return;

    if (onUpdateAppointment) {
      onUpdateAppointment({
        ...editingAp,
        patientName: editPtName,
        procedure: editProcedure,
        time: editTime,
        date: editDate,
        professional: editProf,
      });
    }

    setEditingAp(null);
  };

  // Dynamic weeks list:
  const getDaysOfWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday ...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const ptLabels = [
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
      "Domingo",
    ];
    const shortPtLabels = [
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ];
    const ptShortNames = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + i);

      const dayNum = String(d.getDate()).padStart(2, "0");
      const monthNum = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const dateStr = `${year}-${monthNum}-${dayNum}`;
      const isToday = d.toDateString() === today.toDateString();

      days.push({
        name: ptShortNames[i],
        day: dayNum,
        label: isToday ? `${ptLabels[i]} (Hoje)` : ptLabels[i],
        shortLabel: shortPtLabels[i],
        dateStr: dateStr,
        isToday: isToday,
      });
    }
    return days;
  };

  const daysOfWeek = getDaysOfWeek();

  const activeHours = businessHours || [
    {
      day: "Segunda-feira",
      isOpen: true,
      openTime: "08:00",
      closeTime: "21:00",
    },
    { day: "Terça-feira", isOpen: true, openTime: "08:00", closeTime: "21:00" },
    {
      day: "Quarta-feira",
      isOpen: true,
      openTime: "08:00",
      closeTime: "21:00",
    },
    {
      day: "Quinta-feira",
      isOpen: true,
      openTime: "08:00",
      closeTime: "21:00",
    },
    { day: "Sexta-feira", isOpen: true, openTime: "08:00", closeTime: "21:00" },
    { day: "Sábado", isOpen: true, openTime: "09:00", closeTime: "18:00" },
    { day: "Domingo", isOpen: false, openTime: "09:00", closeTime: "18:00" },
  ];

  // For dynamic schedule filtering shown to visitor
  const getSelectedDayHourSlots = (offsetIdx: number) => {
    const dayObj = daysOfWeek[offsetIdx];
    if (!dayObj) return [];

    // Find matching business hour configuration
    const config = activeHours.find(
      (h) =>
        h.day.toLowerCase().replace("-feira", "") ===
        dayObj.shortLabel.toLowerCase(),
    );

    if (!config || !config.isOpen) {
      return []; // empty if closed
    }

    const start = parseInt(config.openTime.split(":")[0]) || 8;
    const end = parseInt(config.closeTime.split(":")[0]) || 18;

    const slots = [];
    for (let h = start; h <= end; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
    }
    return slots;
  };

  const timesInDay = getSelectedDayHourSlots(selectedDayOffset);

  // Fallback overarching slots for dialog selects
  const timesInDaySelectable = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  // Match day indices
  const mapDayToName = (offset: number) => {
    if (offset >= 0 && offset < daysOfWeek.length) {
      return daysOfWeek[offset].dateStr;
    }
    return "2026-05-24";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and View Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-2">
            <span>Ecosystem</span>
            <span className="material-symbols-outlined text-sm text-gold">
              chevron_right
            </span>
            <span className="text-primary font-bold">Agenda</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
            Agenda Integrada
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">
            Controle de salas, especialistas de estética e disponibilidade de
            procedimentos.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gold/15 shadow-sm overflow-x-auto shrink-0 max-w-full">
          {(["Daily", "Weekly", "Monthly"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-5 py-2 font-bold text-xs rounded-lg whitespace-nowrap active:scale-95 transition-smooth
              ${
                viewType === type
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {type === "Daily"
                ? "Diário"
                : type === "Weekly"
                  ? "Semanal"
                  : "Mensal"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view wrapper */}
      {viewType === "Weekly" ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {daysOfWeek.map((dayObj, dIndex) => {
            const isToday = dayObj.isToday;
            // Filtrar agendamentos desse dia específico
            const formattedDayStr = mapDayToName(dIndex);
            const dayAppointments = appointments.filter(
              (a) => a.date === formattedDayStr,
            );

            return (
              <div
                key={dayObj.name}
                className={`space-y-4 rounded-xl p-3 border transition-smooth
                ${
                  isToday
                    ? "bg-white border-[#C5A059] shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-[#C5A059]/30"
                    : "bg-white/50 border-[#C5A059]/15"
                }`}
              >
                {/* Header do Dia */}
                <div className="text-center py-2 border-b border-gold/5">
                  <p
                    className={`text-2xs font-extrabold uppercase tracking-widest
                    ${isToday ? "text-gold-dark font-black" : "text-on-surface-variant"}`}
                  >
                    {dayObj.name}
                  </p>
                  <p
                    className={`font-sans text-3xl font-extrabold mt-1
                    ${isToday ? "text-primary-dark font-black" : "text-primary/70"}`}
                  >
                    {dayObj.day}
                  </p>
                  {isToday && (
                    <div className="w-1.5 h-1.5 bg-gold-dark mx-auto rounded-full mt-1.5 animate-bounce"></div>
                  )}
                </div>

                {/* Conteúdo do dia (Slots de compromissos) */}
                <div className="space-y-3 min-h-[400px] flex flex-col">
                  {dayAppointments.length > 0 ? (
                    dayAppointments.map((a) => {
                      const isHeadSPA = a.type === "Head SPA";
                      return (
                        <div
                          key={a.id}
                          className={`p-4.5 rounded-xl border transition-smooth text-left relative group
                          ${
                            isHeadSPA
                              ? "bg-primary/5 border-primary/10 hover:shadow-md"
                              : "bg-gold/10 border-gold/15 hover:border-gold-dark hover:shadow-md"
                          }`}
                        >
                          {/* Edit / Delete action buttons container */}
                          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 p-0.5 rounded shadow-2xs">
                            <button
                              onClick={() => {
                                setEditingAp(a);
                                setEditPtName(a.patientName);
                                setEditProcedure(a.procedure);
                                setEditTime(a.time);
                                setEditDate(a.date);
                                setEditProf(a.professional);
                              }}
                              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              title="Editar agendamento"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-xs font-bold leading-none">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => onDeleteAppointment(a.id)}
                              className="text-on-surface-variant hover:text-red-600 transition-colors cursor-pointer"
                              title="Remover agendamento"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-xs font-bold leading-none">
                                delete
                              </span>
                            </button>
                          </div>

                          <div className="flex justify-between items-start mb-2">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                              ${
                                isHeadSPA
                                  ? "bg-primary text-white"
                                  : "bg-[#fed488]/50 text-gold-dark"
                              }`}
                            >
                              {a.type}
                            </span>
                            <span className="text-[10px] font-bold text-on-surface-variant">
                              {a.time}
                            </span>
                          </div>

                          <h4
                            className={`font-bold text-[13px] leading-tight
                            ${isHeadSPA ? "text-primary-dark" : "text-gold-dark"}`}
                          >
                            {a.patientName}
                          </h4>
                          <p className="text-[11px] text-on-surface-variant font-medium mt-1.5">
                            {a.procedure}
                          </p>
                          <p className="text-[10px] text-on-surface-variant/70 italic mt-0.5">
                            Dr(a). {a.professional.split(" ")[1]}
                          </p>

                          {a.type === "Head SPA" && (
                            <div className="mt-3 flex items-center gap-1 text-[9px] font-extrabold text-primary uppercase bg-primary/10 w-fit px-1.5 py-0.5 rounded">
                              <span className="material-symbols-outlined text-[11px]">
                                payments
                              </span>
                              PAGO EM ADIANTO
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gold/10 rounded-2xl">
                      <span className="text-2xs text-on-surface-variant/40 text-center uppercase tracking-wider font-bold">
                        Vazio
                      </span>
                    </div>
                  )}

                  {/* Empty Slot Interactive Link */}
                  <button
                    onClick={() =>
                      onOpenAppointmentModalWithDetails(
                        formattedDayStr,
                        "12:00",
                      )
                    }
                    className="w-full border-2 border-dashed border-gold/10 hover:border-gold/40 py-3 rounded-xl hover:bg-white text-on-surface-variant hover:text-gold-dark transition-all flex items-center justify-center group active:scale-95"
                    title="Novo agendamento para este dia"
                  >
                    <span className="material-symbols-outlined text-gold group-hover:scale-110 transition-transform font-bold text-lg">
                      add_circle
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewType === "Daily" ? (
        /* Real high-fidelity Daily (Diário) View */
        <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-primary-dark">
                Programação do Dia
              </h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Selecione o dia da semana para detalhar os horários livres e
                ativos.
              </p>
            </div>
            {/* Quick horizontal week switcher */}
            <div className="flex bg-bg-base p-1 rounded-xl border border-gold/10 gap-1.5 overflow-x-auto max-w-full">
              {daysOfWeek.map((dayObj, idx) => (
                <button
                  key={dayObj.name}
                  onClick={() => setSelectedDayOffset(idx)}
                  className={`px-3 py-1.5 rounded-lg text-2xs font-bold transition-all whitespace-nowrap active:scale-95
                  ${
                    selectedDayOffset === idx
                      ? "bg-[#3d4c3a] text-white"
                      : "text-on-surface-variant hover:text-primary hover:bg-gold/5"
                  }`}
                >
                  {dayObj.label.split(" ")[0]} {dayObj.day}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gold/10">
            {timesInDay.map((timeStr) => {
              const formattedDayStr = mapDayToName(selectedDayOffset);
              // Find matching appointment for this day and hour
              const matchedAp = appointments.find(
                (a) =>
                  a.date === formattedDayStr &&
                  a.time.startsWith(timeStr.substring(0, 3)),
              );

              return (
                <div
                  key={timeStr}
                  className="py-4.5 flex flex-col sm:flex-row sm:items-center gap-4 group justify-between"
                >
                  <div className="flex items-center gap-4 min-w-[100px]">
                    <span className="font-mono text-sm font-extrabold text-[#775a19]">
                      {timeStr}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                  </div>

                  <div className="flex-1">
                    {matchedAp ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gold/5 border border-gold/15 rounded-xl p-4 gap-4 transition-all group-hover:border-gold-dark">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-extrabold bg-[#fed488] text-gold-dark px-2 py-0.5 rounded-full">
                              {matchedAp.type}
                            </span>
                            <span className="text-2xs font-bold text-on-surface-variant">
                              Profissional: Dr(a).{" "}
                              {matchedAp.professional.split(" ")[1] ||
                                matchedAp.professional}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-primary-dark">
                            {matchedAp.patientName}
                          </h4>
                          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                            {matchedAp.procedure} • Duração:{" "}
                            {matchedAp.duration}
                          </p>
                        </div>

                        <div className="flex gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingAp(matchedAp);
                              setEditPtName(matchedAp.patientName);
                              setEditProcedure(matchedAp.procedure);
                              setEditTime(matchedAp.time);
                              setEditDate(matchedAp.date);
                              setEditProf(matchedAp.professional);
                            }}
                            className="p-2 bg-white border border-gold/20 rounded-lg hover:border-gold-dark text-on-surface-variant hover:text-primary active:scale-95 transition-smooth cursor-pointer"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-xs leading-none font-bold">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => onDeleteAppointment(matchedAp.id)}
                            className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 active:scale-95 transition-smooth cursor-pointer"
                            title="Remover"
                          >
                            <span className="material-symbols-outlined text-xs leading-none font-bold">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-on-surface-variant/50 font-bold tracking-wide italic p-2 rounded-xl group-hover:bg-bg-base/30 transition-colors flex items-center justify-between">
                        <span>Horário Disponível para Procedimento</span>
                        <button
                          onClick={() =>
                            onOpenAppointmentModalWithDetails(
                              formattedDayStr,
                              timeStr,
                            )
                          }
                          className="px-3 py-1.5 bg-gold/10 hover:bg-gold hover:text-white rounded-lg text-gold-dark text-2xs font-extrabold transition-all duration-200 tracking-wider flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs font-bold">
                            add
                          </span>
                          RESERVAR
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Real high-fidelity Monthly (Mensal) Calendar Grid View */
        <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-primary-dark">
                Calendário Mensal • Maio 2026
              </h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Visão multifuncional das ocupações estéticas de alta
                performance.
              </p>
            </div>
            <div className="flex bg-[#3d4c3a]/5 p-2 rounded-xl border border-gold/10 items-center justify-center font-bold text-xs text-[#3d4c3a] gap-2">
              <span className="material-symbols-outlined text-sm">
                calendar_month
              </span>
              <span>Total de {appointments.length} Sessões Ativas</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-2xs font-extrabold text-primary-dark uppercase tracking-wider bg-bg-base py-2 rounded-lg">
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>

          {/* Grid representation of May 1st to 31st (Starting Friday, ending Sunday in 2026) */}
          <div className="grid grid-cols-7 gap-2.5">
            {/* Pad the starting week empty slots (May 1st, 2026 starts on Friday, so Monday, Tuesday, Wednesday, Thursday are empty) */}
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="bg-bg-base/15 rounded-xl border border-dashed border-gold/5 aspect-square"
              />
            ))}

            {Array.from({ length: 31 }).map((_, idx) => {
              const dayNum = idx + 1;
              // format as '2026-05-XX'
              const paddedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
              const formattedDateStr = `2026-05-${paddedDay}`;
              const dayAps = appointments.filter(
                (a) => a.date === formattedDateStr,
              );

              const isToday = new Date().getDate() === dayNum; // Live dynamic today highlight
              const isSelected =
                mapDayToName(selectedDayOffset) === formattedDateStr;

              return (
                <button
                  key={dayNum}
                  onClick={() => {
                    // Update offset if within daysOfWeek bounds
                    const matchedOffset = daysOfWeek.findIndex(
                      (d) => d.day === paddedDay,
                    );
                    if (matchedOffset !== -1) {
                      setSelectedDayOffset(matchedOffset);
                    }
                  }}
                  className={`p-2.5 rounded-xl border aspect-square flex flex-col justify-between items-start transition-smooth text-left hover:shadow-xs group hover:border-gold-dark cursor-pointer relative
                  ${
                    isToday
                      ? "bg-[#3d4c3a]/10 border-[#3d4c3a] ring-1 ring-[#3d4c3a]/25"
                      : isSelected
                        ? "bg-gold/10 border-gold-dark ring-0"
                        : "bg-[#faf9f6]/30 border-gold/12"
                  }`}
                >
                  <span
                    className={`text-xs font-extrabold font-mono ${isToday ? "text-[#3d4c3a]" : "text-primary"}`}
                  >
                    {dayNum}
                  </span>

                  {dayAps.length > 0 ? (
                    <div className="w-full flex flex-wrap gap-1 mt-1">
                      {/* Show visual dots for appointments */}
                      {dayAps.slice(0, 3).map((ap) => (
                        <div
                          key={ap.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            ap.type === "Head SPA"
                              ? "bg-primary"
                              : "bg-[#C5A059]"
                          }`}
                          title={`${ap.patientName} - ${ap.procedure}`}
                        />
                      ))}
                      {dayNum === 24 && (
                        <span className="text-[8px] font-black leading-none block w-full mt-0.5 text-primary-dark">
                          {dayAps.length} Atend.
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="material-symbols-outlined text-[10px] text-gold/30 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 right-2">
                      add_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick schedule panel from selected date cell */}
          <div className="bg-[#faf9f6] border border-gold/15 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gold/10 text-gold-dark rounded-xl">
                <span className="material-symbols-outlined font-bold">
                  calendar_month
                </span>
              </div>
              <div>
                <p className="text-xs font-black text-primary-dark">
                  Sessões de{" "}
                  {daysOfWeek[selectedDayOffset]?.label || "Data Selecionada"}{" "}
                  (Maio {daysOfWeek[selectedDayOffset]?.day})
                </p>
                <div className="flex gap-2 flex-wrap mt-0.5 text-2xs text-on-surface-variant font-medium">
                  <span>
                    {
                      appointments.filter(
                        (a) => a.date === mapDayToName(selectedDayOffset),
                      ).length
                    }{" "}
                    agendamentos registrados
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                onOpenAppointmentModalWithDetails(
                  mapDayToName(selectedDayOffset),
                  "12:00",
                )
              }
              className="px-5 py-2 bg-[#3d4c3a] text-white rounded-lg text-2xs font-extrabold uppercase tracking-widest active:scale-95 hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">
                event_available
              </span>
              Agendar p/ Este Dia
            </button>
          </div>
        </div>
      )}

      {/* Capacity tracker footer */}
      <footer className="bg-primary text-white rounded-xl p-6 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-6 border border-[#C5A059]/30 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4">
          <span className="material-symbols-outlined text-[120px] opacity-10">
            analytics
          </span>
        </div>
        <div className="space-y-2 relative z-10 text-center sm:text-left">
          <h3 className="text-gold font-bold text-xs uppercase tracking-wider">
            Limite de Atendimento da Nossa Agenda
          </h3>
          <p className="text-sm font-semibold max-w-md text-[#abbca5]">
            Nossa agenda registra atualmente uma taxa de ocupação de{" "}
            <b className="text-white">
              {Math.min(100, Math.round((appointments.length / 6) * 100))}%
            </b>{" "}
            de acordo com os atendimentos agendados.
          </p>
        </div>
        <div className="w-full sm:w-64 space-y-2 relative z-10">
          <div className="flex justify-between items-center text-xs font-bold text-gold">
            <span>Ocupação da Agenda</span>
            <span>
              {Math.min(100, Math.round((appointments.length / 6) * 100))}%
            </span>
          </div>
          <div className="w-full bg-primary-dark h-2 rounded-full overflow-hidden">
            <div
              className="bg-gold h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((appointments.length / 6) * 100))}%`,
              }}
            ></div>
          </div>
        </div>
      </footer>

      {/* Editing Appointment dialog block sheet */}
      {editingAp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-gold/12 pb-3">
              <h3 className="text-lg font-bold text-primary-dark">
                Remarcar / Editar Agendamento
              </h3>
              <button
                onClick={() => setEditingAp(null)}
                className="text-on-surface-variant hover:text-red-500 font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditApSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Nome do Paciente
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clara Ribeiro"
                  value={editPtName}
                  onChange={(e) => setEditPtName(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Ritual de Procedimento / Serviço
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Head SPA Completo"
                  value={editProcedure}
                  onChange={(e) => setEditProcedure(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Horário
                  </label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    {timesInDaySelectable.map((timeStr) => (
                      <option key={timeStr} value={timeStr}>
                        {timeStr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Data Agendada
                  </label>
                  <select
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d.dateStr} value={d.dateStr}>
                        {d.shortLabel} ({d.day}/{d.dateStr.split("-")[1]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Especialista Atribuído
                </label>
                <select
                  value={editProf}
                  onChange={(e) => setEditProf(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                >
                  <option value="Dra. Sandra Ramos">Dra. Sandra Ramos</option>
                  <option value="Dra. Elenice Silva">Dra. Elenice Silva</option>
                  <option value="Dra. Amanda Cavalcanti">
                    Dra. Amanda Cavalcanti
                  </option>
                  <option value="Dr. Gabriel Castelo">
                    Dr. Gabriel Castelo
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingAp(null)}
                  className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
