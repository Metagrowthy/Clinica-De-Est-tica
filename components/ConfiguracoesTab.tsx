"use client";

import React, { useState } from "react";
import { Staff } from "../types/erp";
import EquipeTab from "./EquipeTab";

interface BusinessHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface ClinicSettings {
  name: string;
  logoUrl: string;
  logoType: "elegant-monogram" | "lotus" | "gold-seal";
  cnpj: string;
  email: string;
  tel: string;
  address: string;
  segSex: string;
  sab: string;
  dom: string;
  businessHours?: BusinessHour[];
}

interface ConfiguracoesTabProps {
  clinicSettings: ClinicSettings;
  onUpdateSettings: (settings: ClinicSettings) => void;
  supabaseLoading?: boolean;
  supabaseStatusMsg?: string;
  supabaseTableCounts?: any;
  onSeedSupabase?: () => Promise<boolean>;
  onRefreshCounts?: () => void;
  staffList?: Staff[];
  onAddNewStaff?: (newStaff: Omit<Staff, "id" | "earnedCommission">) => void;
  onPayCommission?: (staffId: string) => void;
  onUpdateStaff?: (updated: Staff) => void;
  onDeleteStaff?: (staffId: string) => void;
}

export default function ConfiguracoesTab({
  clinicSettings,
  onUpdateSettings,
  supabaseLoading = false,
  supabaseStatusMsg = "",
  supabaseTableCounts = null,
  onSeedSupabase,
  onRefreshCounts,
  staffList = [],
  onAddNewStaff,
  onPayCommission,
  onUpdateStaff,
  onDeleteStaff,
}: ConfiguracoesTabProps) {
  // Copied SQL state
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"perfil" | "horario" | "equipe">("perfil");

  // Business State Form
  const [clinicName, setClinicName] = useState(clinicSettings.name);
  const [cnpj, setCnpj] = useState(clinicSettings.cnpj);
  const [email, setEmail] = useState(clinicSettings.email);
  const [tel, setTel] = useState(clinicSettings.tel);
  const [address, setAddress] = useState(clinicSettings.address);
  const [logoUrl, setLogoUrl] = useState(clinicSettings.logoUrl);
  const [logoType, setLogoType] = useState<
    "elegant-monogram" | "lotus" | "gold-seal"
  >(clinicSettings.logoType);

  // Business Hours
  const [segSexState, setSegSexState] = useState(clinicSettings.segSex);
  const [sabState, setSabState] = useState(clinicSettings.sab);
  const [domState, setDomState] = useState(clinicSettings.dom);

  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(
    clinicSettings.businessHours || [
      {
        day: "Segunda-feira",
        isOpen: true,
        openTime: "08:00",
        closeTime: "21:00",
      },
      {
        day: "Terça-feira",
        isOpen: true,
        openTime: "08:00",
        closeTime: "21:00",
      },
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
      {
        day: "Sexta-feira",
        isOpen: true,
        openTime: "08:00",
        closeTime: "21:00",
      },
      { day: "Sábado", isOpen: true, openTime: "09:00", closeTime: "18:00" },
      { day: "Domingo", isOpen: false, openTime: "09:00", closeTime: "18:00" },
    ],
  );

  const [notifSaved, setNotifSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      name: clinicName,
      logoUrl: logoUrl,
      logoType: logoType,
      cnpj: cnpj,
      email: email,
      tel: tel,
      address: address,
      segSex: segSexState,
      sab: sabState,
      dom: domState,
      businessHours: businessHours,
    });
    setNotifSaved(true);
    setTimeout(() => {
      setNotifSaved(false);
    }, 3000);
  };

  const handleUpdateDayTime = (
    dayName: string,
    field: "openTime" | "closeTime",
    val: string,
  ) => {
    setBusinessHours((prev) =>
      prev.map((b) => (b.day === dayName ? { ...b, [field]: val } : b)),
    );
  };

  const handleToggleDayOpen = (dayName: string) => {
    setBusinessHours((prev) =>
      prev.map((b) => (b.day === dayName ? { ...b, isOpen: !b.isOpen } : b)),
    );
  };

  const hourOptions = Array.from({ length: 24 }).map((_, i) => {
    const hh = String(i).padStart(2, "0");
    return `${hh}:00`;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-2">
          <span>Ecosystem</span>
          <span className="material-symbols-outlined text-sm text-gold">
            chevron_right
          </span>
          <span className="text-primary font-extrabold">Configurações</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-dark">
          Configurações do Sistema
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant font-semibold mt-2 leading-relaxed">
          Ajustes globais de perfil, logo, horários operacionais do spa e
          parâmetros logísticos do ERP.
        </p>
      </div>

      {/* Save Success Alerts */}
      {notifSaved && (
        <div className="p-4 bg-primary/10 border border-primary/25 rounded-xl text-sm font-bold text-primary-dark flex items-center gap-2.5 animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined font-bold text-lg">
            verified
          </span>
          Todos os ajustes do perfil &ldquo;{clinicName}&rdquo; foram
          atualizados com sucesso e aplicados no sistema!
        </div>
      )}

      {/* Tabs Layout */}
      <div className="bg-white border border-gold/15 rounded-2xl p-2.5 flex gap-2 overflow-x-auto hide-scrollbar shadow-sm">
        {(
          [
            { id: "perfil", label: "Perfil Corporativo", icon: "store" },
            { id: "horario", label: "Horários de Atendimento", icon: "schedule" },
            { id: "equipe", label: "Equipe e Comissões", icon: "badge" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap
            ${
              activeTab === tab.id
                ? "bg-bg-base text-[#C5A059] shadow-sm border border-[#C5A059]/20"
                : "text-on-surface hover:bg-gold/5 border border-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 items-start">
        {/* Perfil do Negocio */}
        {activeTab === "perfil" && (
        <section className="bg-white border border-gold/15 rounded-2xl shadow-sm text-left p-6 md:p-8">
          <h3 className="font-extrabold text-xl text-primary-dark flex items-center gap-2 border-b border-gold/5 pb-4 mb-6">
            <span className="material-symbols-outlined text-gold text-2xl">
              store
            </span>
            Perfil Corporativo do Spa
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Logo Preview & Type Configurer */}
            <div className="bg-bg-base/60 p-5 rounded-xl border border-gold/10 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <label className="w-20 h-20 bg-primary text-gold rounded-full flex items-center justify-center font-extrabold text-2xl shadow-sm border-2 border-gold shrink-0 overflow-hidden cursor-pointer group relative">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo Prev"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-3xl font-bold group-hover:opacity-50 transition-opacity">
                      {logoType === "lotus"
                        ? "spa"
                        : logoType === "gold-seal"
                          ? "workspace_premium"
                          : "diamond"}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          if (e.target?.result) {
                            setLogoUrl(e.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="font-extrabold text-base md:text-lg text-primary-dark">
                    Logo no Cabeçalho da Sidebar
                  </h4>
                  <p className="text-xs md:text-sm text-on-surface-variant font-medium">
                    Selecione o estilo do ícone ou informe o link da imagem da
                    sua marca.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1.5">
                    Ícone Padrão Elegante
                  </label>
                  <select
                    value={logoType}
                    onChange={(e) => setLogoType(e.target.value as any)}
                    className="w-full bg-white border border-gold/15 rounded-xl px-4 py-3 text-xs md:text-sm font-bold focus:outline-none"
                  >
                    <option value="elegant-monogram">Diamante 💎</option>
                    <option value="lotus">Flor de Lótus 🌸</option>
                    <option value="gold-seal">Selo de Ouro Premium 🏅</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1.5">
                    URL do Logotipo Customizado (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://exemplo.com/sua_logo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full bg-white border border-gold/15 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-extrabold text-primary-dark uppercase tracking-wider mb-2">
                  Razão Comercial Unidade
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-3 text-xs md:text-sm font-extrabold focus:outline-none focus:ring-1 focus:ring-primary hover:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-primary-dark uppercase tracking-wider mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-3 text-xs md:text-sm font-extrabold focus:outline-none focus:ring-1 focus:ring-primary hover:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-primary-dark uppercase tracking-wider mb-2">
                  Contato Geral Atendimento
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-3 text-xs md:text-sm font-extrabold focus:outline-none focus:ring-1 focus:ring-primary hover:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-primary-dark uppercase tracking-wider mb-2">
                  WhatsApp / Telefone Recepção
                </label>
                <input
                  type="text"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-3 text-xs md:text-sm font-extrabold focus:outline-none focus:ring-1 focus:ring-primary hover:bg-white transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-primary-dark uppercase tracking-wider mb-2">
                  Endereço Unidade Física Jardins
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-3 text-xs md:text-sm font-extrabold focus:outline-none focus:ring-1 focus:ring-primary hover:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gold/5">
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#a3875e] text-white rounded-xl text-xs md:text-sm font-bold hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Salvar Definições Perfil
              </button>
            </div>
          </form>
        </section>
        )}

        {/* Horários */}
        {activeTab === "horario" && (
        <section className="bg-white border border-gold/15 rounded-2xl p-6 md:p-8 text-left shadow-sm">
          <h3 className="font-extrabold text-base md:text-lg text-primary-dark uppercase tracking-widest border-b border-gold/5 pb-3 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-xl">
              schedule
            </span>
            Horários de Abertura
          </h3>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessHours.map((bh) => (
                <div
                  key={bh.day}
                  className={`p-4 border rounded-xl leading-relaxed transition-all
                  ${
                    bh.isOpen
                      ? "bg-bg-base/30 border-gold/15 shadow-2xs"
                      : "bg-red-50/10 border-red-100/30"
                  }`}
                >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-extrabold text-primary-dark text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full
                          ${bh.isOpen ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}
                        />
                        {bh.day.replace("-feira", "")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleDayOpen(bh.day)}
                        className={`px-2.5 py-1 rounded-lg text-2xs font-extrabold uppercase transition-all active:scale-95 cursor-pointer
                        ${
                          bh.isOpen
                            ? "bg-emerald-100/60 text-emerald-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {bh.isOpen ? "Aberto" : "Fechado"}
                      </button>
                    </div>

                    {bh.isOpen ? (
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gold/5">
                        <div>
                          <span className="block text-[9px] font-extrabold text-gold-dark uppercase mb-1">
                            Abertura
                          </span>
                          <select
                            value={bh.openTime}
                            onChange={(e) =>
                              handleUpdateDayTime(
                                bh.day,
                                "openTime",
                                e.target.value,
                              )
                            }
                            className="w-full bg-white border border-gold/15 rounded-lg px-2 py-1.5 text-2xs md:text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {hourOptions.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <span className="block text-[9px] font-extrabold text-gold-dark uppercase mb-1">
                            Fechamento
                          </span>
                          <select
                            value={bh.closeTime}
                            onChange={(e) =>
                              handleUpdateDayTime(
                                bh.day,
                                "closeTime",
                                e.target.value,
                              )
                            }
                            className="w-full bg-white border border-gold/15 rounded-lg px-2 py-1.5 text-2xs md:text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {hourOptions.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] font-bold text-red-500/85 uppercase tracking-wider py-1 select-none flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs leading-none">
                          hotel_class
                        </span>
                        Sem atendimentos (Fechado)
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="mt-5 w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  save
                </span>
                Salvar Horários do Spa
              </button>
            </div>
        </section>
        )}

        {/* Integração Supabase - Display on Perfil Tab */}
        {activeTab === "perfil" && (
          <aside className="space-y-6">
            <div className="bg-gradient-gold-transparent backdrop-blur-md p-6 rounded-2xl border border-gold/25 text-left space-y-4 shadow-xs relative overflow-hidden">
              <h4 className="font-extrabold text-primary-dark text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059] text-xl animate-pulse">
                  database
                </span>
              Integração Supabase
            </h4>

            <p className="text-xs font-semibold text-on-surface-variant leading-relaxed">
              Persistência de dados dinâmica conectada diretamente com seu banco
              PostgreSQL no Supabase.
            </p>

            {/* Status Indicator */}
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-gold/10 text-xs font-semibold space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">
                  Conexão Supabase:
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase flex items-center gap-1
                  ${
                    supabaseStatusMsg.includes("sucesso")
                      ? "bg-emerald-100/70 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${supabaseStatusMsg.includes("sucesso") ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                  />
                  {supabaseStatusMsg.includes("sucesso") ? "Ativa" : "Pendente"}
                </span>
              </div>
              <div className="text-[11px] text-primary font-bold break-all leading-snug">
                {supabaseStatusMsg || "Conectando ao Supabase..."}
              </div>
            </div>

            {/* Tables Checklist */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider">
                  Tabelas & Registros
                </span>
                <button
                  onClick={onRefreshCounts}
                  type="button"
                  className="text-2xs font-extrabold text-gold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[12px] leading-none">
                    refresh
                  </span>
                  Atualizar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                {[
                  { name: "Definições Clínica", key: "clinic_settings" },
                  { name: "Agendamentos (Agenda)", key: "appointments" },
                  { name: "Prontuários / CRM", key: "patients" },
                  { name: "Procedimentos / Catálogo", key: "catalog_items" },
                  { name: "Transações Fin.", key: "transactions" },
                  { name: "Equipe / Staff", key: "staff_list" },
                ].map((item) => {
                  const state = supabaseTableCounts?.[item.key];
                  const exists = state?.exists;
                  const count = state?.count ?? 0;
                  const error = state?.error;

                  return (
                    <div
                      key={item.key}
                      className="bg-bg-base/40 p-2 border border-gold/5 rounded-lg space-y-1"
                    >
                      <div className="text-2xs text-on-surface-variant truncate font-semibold uppercase">
                        {item.name}
                      </div>
                      <div className="flex items-center justify-between text-xs font-extrabold">
                        {exists ? (
                          <span className="text-emerald-700">
                            {count} {count === 1 ? "linha" : "linhas"}
                          </span>
                        ) : (
                          <span
                            className="text-amber-600 flex items-center gap-0.5"
                            title={error}
                          >
                            <span className="text-xs">⚠️</span> Criar Tab
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Commands Panel */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  const sql = `-- =====================================================================
-- BENESSERE VITA - SUPABASE DATABASE SCHEMA
-- Execute este script no seu Supabase SQL Editor para criar as tabelas.
-- =====================================================================

CREATE TABLE IF NOT EXISTS clinic_settings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  logo_type TEXT,
  cnpj TEXT,
  email TEXT,
  tel TEXT,
  address TEXT,
  seg_sex TEXT,
  sab TEXT,
  dom TEXT,
  business_hours JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  procedure TEXT NOT NULL,
  time TEXT NOT NULL,
  date TEXT NOT NULL,
  professional TEXT NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  last_visit TEXT,
  status TEXT NOT NULL,
  cpf TEXT,
  birth_date TEXT,
  age INTEGER,
  phone TEXT,
  avatar_url TEXT,
  convenios TEXT,
  condicoes_medicas TEXT,
  evolutions JSONB NOT NULL DEFAULT '[]'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  signature TEXT,
  anamnese_clinica JSONB DEFAULT '{}'::jsonb,
  anamnese_head_spa JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration INTEGER,
  description TEXT,
  volume_or_weight TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  date_str TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  value NUMERIC NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_list (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialty TEXT NOT NULL,
  permission TEXT NOT NULL,
  status TEXT NOT NULL,
  avatar_url TEXT,
  commission_rate NUMERIC NOT NULL,
  earned_commission NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clinic_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_list DISABLE ROW LEVEL SECURITY;

ALTER TABLE patients ADD COLUMN IF NOT EXISTS convenios TEXT;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS condicoes_medicas TEXT;
`;
                  navigator.clipboard.writeText(sql);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className={`w-full py-2.5 border border-gold/30 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95
                  ${copiedSql ? "bg-emerald-50 border-emerald-300 text-emerald-800" : "bg-white text-primary-dark hover:bg-gold/5"}`}
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  {copiedSql ? "check_circle" : "content_copy"}
                </span>
                {copiedSql ? "Script Copiado!" : "Copiar Script SQL"}
              </button>

              <button
                type="button"
                disabled={supabaseLoading}
                onClick={async () => {
                  if (onSeedSupabase) {
                    const success = await onSeedSupabase();
                    if (success) {
                      setSyncSuccess("Dados sincronizados com sucesso!");
                      setTimeout(() => setSyncSuccess(null), 3500);
                    } else {
                      setSyncSuccess(
                        "Erro ao enviar dados. Verifique as tabelas.",
                      );
                      setTimeout(() => setSyncSuccess(null), 3500);
                    }
                  }
                }}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#a3875e] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {supabaseLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-sm font-bold">
                    publish
                  </span>
                )}
                {supabaseLoading
                  ? "Sincronizando..."
                  : "Enviar Dados Iniciais (Seed)"}
              </button>
            </div>

            {syncSuccess && (
              <div
                className={`p-2 rounded-lg text-[10px] font-bold text-center leading-relaxed transition-all animate-in fade-in duration-300
                ${syncSuccess.includes("sucesso") ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 text-red-800 border border-red-200"}`}
              >
                {syncSuccess}
              </div>
            )}

            <div className="text-[10px] font-semibold text-on-surface-variant leading-relaxed bg-[#C5A059]/5 p-2.5 rounded-xl border border-gold/10">
              <span className="font-extrabold text-gold-dark">Como usar:</span>{" "}
              Copie o Script SQL acima, vá na sua conta do Supabase em
              &rdquo;SQL Editor&rdquo;, execute o comando com Run e depois
              clique em &rdquo;Enviar Dados Iniciais (Seed)&rdquo;. Pronto!
            </div>
          </div>
        </aside>
        )}

        {/* Equipe Tab */}
        {activeTab === "equipe" && (
          <div className="col-span-12">
            <EquipeTab
              staffList={staffList}
              onAddNewStaff={onAddNewStaff || (() => {})}
              onPayCommission={onPayCommission || (() => {})}
              onUpdateStaff={onUpdateStaff}
              onDeleteStaff={onDeleteStaff}
            />
          </div>
        )}
      </div>
    </div>
  );
}
