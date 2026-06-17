"use client";

import React, { useState, useEffect } from "react";
import {
  Appointment,
  Patient,
  CatalogItem,
  Transaction,
  FixedExpense,
  Staff,
  ClinicalEvolution,
  HeadSpaAnamnese,
} from "../types/erp";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  fetchClinicSettings,
  fetchAppointments,
  fetchPatients,
  fetchHeadSpaAnamneses,
  fetchClinicaAnamneses,
  fetchCatalogItems,
  fetchTransactions,
  fetchFixedExpenses,
  fetchStaffList,
  syncClinicSettings,
  syncUpsertAppointment,
  syncDeleteAppointment,
  syncUpsertPatient,
  syncDeletePatient,
  syncUpsertCatalogItem,
  syncDeleteCatalogItem,
  syncUpsertTransaction,
  syncDeleteTransaction,
  syncUpsertFixedExpense,
  syncDeleteFixedExpense,
  syncUpsertStaff,
  syncDeleteStaff,
  seedAllDatabase,
  getSupabaseStatus,
} from "../lib/supabaseSync";

// Import our modular tabs
import DashboardTab from "../components/DashboardTab";
import AgendaTab from "../components/AgendaTab";
import ProntuariosTab from "../components/ProntuariosTab";
import ServicosTab from "../components/ServicosTab";
import NaturaleTab from "../components/NaturaleTab";
import FinanceiroTab from "../components/FinanceiroTab";
import EquipeTab from "../components/EquipeTab";
import ConfiguracoesTab from "../components/ConfiguracoesTab";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [supabaseLoading, setSupabaseLoading] = useState<boolean>(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState<string>("");
  const [supabaseTableCounts, setSupabaseTableCounts] = useState<any>(null);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [sidebarMinimized, setSidebarMinimized] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [globalSelectedPatientId, setGlobalSelectedPatientId] =
    useState<string>("");

  // Dynamic Date Offsetter (0 = Monday, 1 = Tuesday, 2 = Wednesday, ..., 6 = Sunday)
  const getSchedulesOffsetDate = (dayOffset: number) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday ...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + mondayOffset + dayOffset);
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Clinic Brand Settings State
  const [clinicSettings, setClinicSettings] = useState({
    name: "Benessere Vita",
    logoUrl: "",
    logoType: "elegant-monogram" as "elegant-monogram" | "lotus" | "gold-seal",
    cnpj: "45.890.312/0001-44",
    email: "suporte@benesserevita.com.br",
    tel: "+55 (11) 3088-4411",
    address: "Alameda Lorena, 1045 - Jardins, São Paulo - SP",
    segSex: "08:00 às 21:00",
    sab: "09:00 às 18:00",
    dom: "Fechado",
    businessHours: [
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
  });

  // Active clinician profile login
  const [activeClinician, setActiveClinician] = useState<string>("");

  // Appointment creation states
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [newApPatient, setNewApPatient] = useState("");
  const [newApProcedure, setNewApProcedure] = useState(
    "Limpeza de Pele Diamond",
  );
  const [newApProfessional, setNewApProfessional] = useState("");
  const [newApDate, setNewApDate] = useState(getSchedulesOffsetDate(2)); // Wednesday of current week
  const [newApTime, setNewApTime] = useState("12:00");
  const [newApDuration, setNewApDuration] = useState("60");
  const [newApType, setNewApType] = useState<"Head SPA" | "Avaliação">(
    "Head SPA",
  );

  // Shared database mock states
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [patients, setPatients] = useState<Patient[]>([]);

  const [headSpaAnamneses, setHeadSpaAnamneses] = useState<HeadSpaAnamnese[]>([]);

  const [clinicaAnamneses, setClinicaAnamneses] = useState<any[]>([]);

  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    {
      id: "fx-1",
      description: "Aluguel",
      value: 5000,
      dreCategory: "DESPESAS_FIXAS",
      dreSubCategory: "Aluguel"
    },
    {
      id: "fx-2",
      description: "Internet e Telefone",
      value: 350,
      dreCategory: "DESPESAS_FIXAS",
      dreSubCategory: "Internet"
    },
    {
      id: "fx-3",
      description: "Depreciação Equipamentos",
      value: 1200,
      dreCategory: "RESULTADO_FINAL",
      dreSubCategory: "Depreciação de Equipamentos"
    }
  ]);

  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Load Supabase Database Elements on Mount
  useEffect(() => {
    async function loadSupabase() {
      if (!isSupabaseConfigured()) {
        setSupabaseStatusMsg("Não configurado nas variáveis de ambiente");
        return;
      }
      setSupabaseLoading(true);
      setSupabaseStatusMsg("Carregando dados do Supabase...");
      try {
        const counts = await getSupabaseStatus();
        setSupabaseTableCounts(counts);

        // Fetch Clinic settings
        const settings = await fetchClinicSettings(clinicSettings);
        if (settings) {
          setClinicSettings(settings);
        }

        // Fetch remaining tables
        const aps = await fetchAppointments();
        if (aps) setAppointments(aps);

        const pts = await fetchPatients();
        if (pts) setPatients(pts);

        const hs = await fetchHeadSpaAnamneses();
        if (hs) setHeadSpaAnamneses(hs);

        const ca = await fetchClinicaAnamneses();
        if (ca) setClinicaAnamneses(ca);

        const cats = await fetchCatalogItems();
        if (cats) {
          setCatalogItems(cats);
          if (cats.length > 0) {
            setNewApProcedure(cats[0].name);
          }
        }

        const txs = await fetchTransactions();
        if (txs) setTransactions(txs);

        const fxs = await fetchFixedExpenses();
        if (fxs) setFixedExpenses(fxs);

        const sft = await fetchStaffList();
        if (sft) {
          setStaffList(sft);
          if (sft.length > 0) {
            setActiveClinician(sft[0].name);
            setNewApProfessional(sft[0].name);
          }
        }

        setSupabaseStatusMsg("Supabase conectado com sucesso");
      } catch (err: any) {
        console.error("Erro de sincronização:", err);
        setSupabaseStatusMsg(`Erro de integração: ${err.message || err}`);
      } finally {
        setSupabaseLoading(false);
      }
    }
    loadSupabase();
  }, []);

  const handleSeedSupabase = async () => {
    setSupabaseLoading(true);
    setSupabaseStatusMsg("Populando tabelas no Supabase...");
    try {
      await seedAllDatabase({
        clinicSettings,
        appointments,
        patients,
        catalogItems,
        transactions,
        fixedExpenses,
        staffList,
      });
      // Refresh counts
      const counts = await getSupabaseStatus();
      setSupabaseTableCounts(counts);
      setSupabaseStatusMsg("Sincronização concluída com sucesso!");
      return true;
    } catch (err: any) {
      console.error(err);
      setSupabaseStatusMsg(
        `Erro ao sincronizar tabelas: ${err?.message || err}`,
      );
      return false;
    } finally {
      setSupabaseLoading(false);
    }
  };

  const handleRefreshCounts = async () => {
    try {
      const counts = await getSupabaseStatus();
      setSupabaseTableCounts(counts);
    } catch (e) {
      console.error(e);
    }
  };

  // Action callback handlers
  const handleAddNewAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApPatient) return;

    const newAp: Appointment = {
      id: `ap-${Date.now()}`,
      patientName: newApPatient,
      procedure: newApProcedure,
      time: newApTime,
      date: newApDate,
      professional: newApProfessional,
      duration: `${newApDuration}m`,
      type: newApType,
      status: "Agendado",
    };

    setAppointments([newAp, ...appointments]);
    syncUpsertAppointment(newAp);

    // Also trigger cash inflow if 'Head SPA' prepaid option was set
    if (newApType === "Head SPA") {
      const matchItem = catalogItems.find((ci) => ci.name === newApProcedure);
      const matchPrice = matchItem?.price || 280;
      const matchCost = matchItem?.costMaterial || 0;
      const matchTaxRate = matchItem?.taxRate || 0;
      const taxValue = (matchPrice * matchTaxRate) / 100;
      
      // Calculate commission (if staff exists)
      let commissionValue = 0;
      const actStaff = staffList.find(s => s.name === newApProfessional);
      if (actStaff) {
        // Commission over net price (Price - Tax)
        commissionValue = (matchPrice - taxValue) * actStaff.commissionRate;
      }

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        dateStr: "Hoje, Hora do Agendamento",
        description: `Serviço: ${newApProcedure} - ${newApPatient}`,
        type: "Serviço",
        category: "PROCEDIMENTOS",
        value: matchPrice,
        status: "Concluído",
        costMaterial: matchCost,
        taxAmount: taxValue,
        commissionAmount: commissionValue,
        dreCategory: "RECEITA_OPERACIONAL_BRUTA",
        dreSubCategory: matchItem?.category === "Harmonização" ? "Receita Injetáveis" : "Receita SPA e Bem-Estar"
      };

      setTransactions([newTx, ...transactions]);
      syncUpsertTransaction(newTx);
      
      // Attempt to credit commission to Staff 
      if (actStaff) {
        setStaffList(staffList.map(s => s.id === actStaff.id ? { ...s, earnedCommission: s.earnedCommission + commissionValue } : s));
        syncUpsertStaff({...actStaff, earnedCommission: actStaff.earnedCommission + commissionValue});
      }
    }

    // Reset fields
    setNewApPatient("");
    setAppointmentModalOpen(false);
  };

  const handleOpenAppointmentModalWithDetails = (day: string, time: string) => {
    setNewApDate(day);
    setNewApTime(time);
    setAppointmentModalOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
    syncDeleteAppointment(id);
  };

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments(
      appointments.map((a) => (a.id === updated.id ? updated : a)),
    );
    syncUpsertAppointment(updated);
  };

  const handleAddEvolutionAndTrack = (
    patientId: string,
    newEvo: Omit<ClinicalEvolution, "id">,
  ) => {
    setPatients(
      patients.map((p) => {
        if (p.id === patientId) {
          const freshEvo: ClinicalEvolution = {
            id: `ev-${Date.now()}`,
            ...newEvo,
          };
          const updatedPatient = {
            ...p,
            evolutions: [freshEvo, ...p.evolutions],
          };
          syncUpsertPatient(updatedPatient);
          return updatedPatient;
        }
        return p;
      }),
    );
  };

  const handleAddNewPatient = (
    newPatient: Omit<Patient, "id" | "evolutions" | "photos">,
  ) => {
    const freshPatient: Patient = {
      id: `pt-${Date.now()}`,
      evolutions: [],
      photos: [],
      ...newPatient,
    };
    setPatients([freshPatient, ...patients]);
    syncUpsertPatient(freshPatient);
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id));
    syncDeletePatient(id);
  };

  const handleUpdatePatient = (updated: Patient) => {
    setPatients(patients.map((p) => (p.id === updated.id ? updated : p)));
    syncUpsertPatient(updated);
  };

  const handleAddPatientPhotoAndTrack = (
    patientId: string,
    type: "ANTES" | "DEPOIS" | "DETALHE",
    url: string,
  ) => {
    setPatients(
      patients.map((p) => {
        if (p.id === patientId) {
          const updatedPatient = {
            ...p,
            photos: [
              ...p.photos,
              {
                id: `ph-${Date.now()}`,
                type,
                url,
              },
            ],
          };
          syncUpsertPatient(updatedPatient);
          return updatedPatient;
        }
        return p;
      }),
    );
  };

  const handleAddNewCatalogItemAndTrack = (
    newItem: Omit<CatalogItem, "id">,
  ) => {
    const ci: CatalogItem = {
      id: `cat-${Date.now()}`,
      ...newItem,
    };
    setCatalogItems([ci, ...catalogItems]);
    syncUpsertCatalogItem(ci);
  };

  const handleDeleteCatalogItem = (id: string) => {
    setCatalogItems(catalogItems.filter((item) => item.id !== id));
    syncDeleteCatalogItem(id);
  };

  const handleUpdateCatalogItem = (updated: CatalogItem) => {
    setCatalogItems(
      catalogItems.map((item) => (item.id === updated.id ? updated : item)),
    );
    syncUpsertCatalogItem(updated);
  };

  const handleAddTransactionAndTrack = (
    newTx: Omit<Transaction, "id" | "dateStr">,
  ) => {
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      dateStr:
        "Hoje, " +
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      ...newTx,
    };
    setTransactions([tx, ...transactions]);
    syncUpsertTransaction(tx);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
    syncDeleteTransaction(id);
  };

  const handleUpdateTransaction = (updated: Transaction) => {
    setTransactions(
      transactions.map((tx) => (tx.id === updated.id ? updated : tx)),
    );
    syncUpsertTransaction(updated);
  };

  const handleAddFixedExpense = (fx: FixedExpense) => {
    setFixedExpenses((prev) => [fx, ...prev]);
    if (isSupabaseConfigured()) {
      syncUpsertFixedExpense(fx);
    }
  };

  const handleDeleteFixedExpense = (id: string) => {
    setFixedExpenses((prev) => prev.filter((fx) => fx.id !== id));
    if (isSupabaseConfigured()) {
      syncDeleteFixedExpense(id);
    }
  };

  const handleAddNewStaffAndTrack = (
    newStaff: Omit<Staff, "id" | "earnedCommission">,
  ) => {
    const member: Staff = {
      id: `st-${Date.now()}`,
      earnedCommission: 0,
      ...newStaff,
    };
    setStaffList([...staffList, member]);
    syncUpsertStaff(member);
  };

  const handlePayCommissionAndTrack = (staffId: string) => {
    setStaffList(
      staffList.map((m) => {
        if (m.id === staffId) {
          const updatedMember = { ...m, earnedCommission: 0 };
          syncUpsertStaff(updatedMember);
          return updatedMember;
        }
        return m;
      }),
    );
  };

  const handleUpdateStaff = (updated: Staff) => {
    setStaffList(staffList.map((s) => (s.id === updated.id ? updated : s)));
    syncUpsertStaff(updated);
  };

  const handleDeleteStaff = (id: string) => {
    setStaffList(staffList.filter((s) => s.id !== id));
    syncDeleteStaff(id);
  };

  // Switchable Tab Routing Render
  const renderSelectedTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            appointments={appointments}
            transactions={transactions}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAppointmentModal={() => setAppointmentModalOpen(true)}
          />
        );
      case "agenda":
        return (
          <AgendaTab
            appointments={appointments}
            onOpenAppointmentModalWithDetails={
              handleOpenAppointmentModalWithDetails
            }
            onDeleteAppointment={handleDeleteAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            businessHours={clinicSettings.businessHours}
          />
        );
      case "crm":
        return (
          <ProntuariosTab
            patients={patients}
            appointments={appointments}
            headSpaAnamneses={headSpaAnamneses}
            clinicaAnamneses={clinicaAnamneses}
            onAddEvolution={handleAddEvolutionAndTrack}
            onAddPhoto={handleAddPatientPhotoAndTrack}
            onAddNewPatient={handleAddNewPatient}
            onDeletePatient={handleDeletePatient}
            onUpdatePatient={handleUpdatePatient}
            defaultPatientId={globalSelectedPatientId}
          />
        );
      case "catalogo":
        return (
          <ServicosTab
            catalogItems={catalogItems}
            onAddNewItem={handleAddNewCatalogItemAndTrack}
            onDeleteItem={handleDeleteCatalogItem}
            onUpdateItem={handleUpdateCatalogItem}
          />
        );
      case "naturale":
        return (
          <NaturaleTab
            transactions={transactions}
            onAddTransaction={handleAddTransactionAndTrack}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case "financeiro":
        return (
          <FinanceiroTab
            transactions={transactions}
            fixedExpenses={fixedExpenses}
            onAddTransaction={handleAddTransactionAndTrack}
            onDeleteTransaction={handleDeleteTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onAddFixedExpense={handleAddFixedExpense}
            onDeleteFixedExpense={handleDeleteFixedExpense}
          />
        );
      case "configuracoes":
        return (
          <ConfiguracoesTab
            clinicSettings={clinicSettings}
            onUpdateSettings={(settings) => {
              setClinicSettings(settings as any);
              syncClinicSettings(settings);
            }}
            supabaseLoading={supabaseLoading}
            supabaseStatusMsg={supabaseStatusMsg}
            supabaseTableCounts={supabaseTableCounts}
            onSeedSupabase={handleSeedSupabase}
            onRefreshCounts={handleRefreshCounts}
            staffList={staffList}
            onAddNewStaff={handleAddNewStaffAndTrack}
            onPayCommission={handlePayCommissionAndTrack}
            onUpdateStaff={handleUpdateStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        );
      default:
        return <div className="p-8">Selecione uma aba...</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf9f6]/95 text-[#1a1c1b]">
      {/* Sidebar Backdrop Overlay on Mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-primary/45 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 1. Left Lateral Sidebar (Premium Dark Olive Theme) */}
      <aside
        className={`fixed inset-y-0 left-0 bg-primary text-white z-40 transition-all duration-300 transform border-r border-[#C5A059]/20 flex flex-col justify-between md:relative md:translate-x-0 print:hidden overflow-hidden
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${sidebarMinimized ? "w-20" : "w-72"}`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Collapse Button */}
          <button
            onClick={() => setSidebarMinimized(!sidebarMinimized)}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10 hidden md:block"
          >
            <span className="material-symbols-outlined text-sm">
              {sidebarMinimized ? "menu" : "chevron_left"}
            </span>
          </button>

          {/* Brand Header */}
          <div className={`p-6 border-b border-[#C5A059]/15 flex flex-col items-center justify-center text-center gap-3 bg-[#3d4c3a]/50 transition-all ${sidebarMinimized ? "px-2" : ""}`}>
            {/* Logo display in sidebar */}
            {clinicSettings.logoUrl ? (
              <div className={`rounded-full border-1.5 border-[#C5A059] flex items-center justify-center overflow-hidden bg-white/10 shadow-lg shrink-0 transition-all ${sidebarMinimized ? "w-10 h-10" : "w-28 h-28"}`}>
                <img
                  referrerPolicy="no-referrer"
                  src={clinicSettings.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={`rounded-full border-1.5 border-[#C5A059] flex items-center justify-center bg-white/15 shadow-md relative overflow-hidden transition-all duration-300 hover:scale-105 shrink-0 ${sidebarMinimized ? "w-10 h-10" : "w-28 h-28"}`}>
                <div className="absolute inset-0 bg-gradient-gold-transparent opacity-10"></div>
                <span className={`material-symbols-outlined text-[#C5A059] font-extrabold select-none ${sidebarMinimized ? "text-xl" : "text-5xl"}`}>
                  {clinicSettings.logoType === "lotus"
                    ? "spa"
                    : clinicSettings.logoType === "gold-seal"
                      ? "workspace_premium"
                      : "diamond"}
                </span>
              </div>
            )}

            {!sidebarMinimized && (
              <div className="space-y-0.5">
                <h1 className="text-base md:text-lg font-black tracking-widest text-white font-sans uppercase">
                  {clinicSettings.name}
                </h1>
              </div>
            )}
          </div>

          {/* Navigation Links with larger text of 14px (text-sm) */}
          <nav className={`p-4 space-y-2.5 flex-1 ${sidebarMinimized ? "px-2" : ""}`}>
            {(
              [
                { id: "dashboard", label: "Dashboard", icon: "dashboard" },
                { id: "agenda", label: "Agenda", icon: "calendar_month" },
                {
                  id: "crm",
                  label: "CRM & Prontuários",
                  icon: "clinical_notes",
                },
                {
                  id: "catalogo",
                  label: "Catálogo de Serviços",
                  icon: "medical_services",
                },
                {
                  id: "naturale",
                  label: "Linha Cosmética",
                  icon: "shopping_bag",
                },
                {
                  id: "financeiro",
                  label: "Financeiro & DRE",
                  icon: "account_balance",
                },
                { id: "configuracoes", label: "Configurações", icon: "tune" },
              ] as const
            ).map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between py-3.5 pr-4 rounded-r-lg font-bold text-sm transition-all active:scale-98
                ${
                  activeTab === link.id
                    ? "bg-white/10 text-[#C5A059] border-l-4 border-[#C5A059] pl-3.5 shadow-sm font-extrabold"
                    : "text-white/70 hover:text-white hover:bg-white/5 pl-4 border-l-4 border-transparent font-bold"
                } ${sidebarMinimized ? "justify-center !pr-0 !pl-0 rounded-lg border-l-0 border-b-2 py-3" : ""}`}
                title={sidebarMinimized ? link.label : undefined}
              >
                <div className={`flex items-center gap-3 ${sidebarMinimized ? "justify-center w-full" : ""}`}>
                  <span className={`material-symbols-outlined ${sidebarMinimized ? "text-xl" : "text-lg"}`}>
                    {link.icon}
                  </span>
                  {!sidebarMinimized && <span className="text-left font-sans">{link.label}</span>}
                </div>
                {!sidebarMinimized && link.id === "agenda" && (
                  <span className="bg-[#C5A059] text-white px-2 py-0.5 text-2xs font-extrabold rounded-full border border-white/10">
                    {appointments.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User profile selection & copyright bottom (increased font size support) */}
        <div className="p-5 border-t border-white/5 space-y-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <label className="block text-2xs font-bold text-[#C5A059] uppercase tracking-widest mb-2">
              Profissional Ativo:
            </label>
            <select
              value={activeClinician}
              onChange={(e) => setActiveClinician(e.target.value)}
              className="w-full bg-primary-dark border-none rounded-lg p-2.5 text-xs font-bold text-white cursor-pointer focus:outline-none"
            >
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.name}>
                  {staff.name} ({staff.specialty})
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-white/45 text-center font-bold">
            &copy; 2026 {clinicSettings.name}.
          </p>
        </div>
      </aside>

      {/* 2. Main content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header navigation bar */}
        <header className="h-[72px] bg-white border-b border-gold/15 px-6 flex items-center justify-between shrink-0 relative z-10 shadow-sm print:hidden">
          {/* Mobile burger trigger */}
          <div className="flex items-center gap-3 md:gap-0">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 text-primary hover:bg-bg-base rounded-xl transition-smooth"
            >
              <span className="material-symbols-outlined text-2xl font-bold">
                menu
              </span>
            </button>
            <div className="relative max-w-lg hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gold text-lg z-10">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(e.target.value.length > 0);
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) {
                    setShowSearchDropdown(true);
                  }
                }}
                placeholder="Pesquisar prontuários ou agendamentos..."
                className="w-80 sm:w-96 md:w-[420px] bg-[#faf9f6]/80 text-[#1a1c1b] pl-10 pr-4 py-2 rounded-xl text-sm font-bold focus:outline-none border border-gold/15 focus:ring-1 focus:ring-gold/30 hover:bg-white relative z-10"
              />

              {/* Dynamic Results Popover */}
              {showSearchDropdown && (
                <>
                  {/* Overlay click catcher to dismiss */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSearchDropdown(false)}
                  />

                  <div className="absolute top-12 left-0 w-[420px] bg-white rounded-xl border border-gold/25 shadow-2xl overflow-hidden z-50 text-left font-sans animate-in slide-in-from-top-1.5 duration-150">
                    <div className="p-3 bg-bg-base border-b border-gold/10 flex justify-between items-center">
                      <span className="text-[10px] font-black text-gold-dark uppercase tracking-wider">
                        Resultados da Pesquisa
                      </span>
                      <button
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery("");
                        }}
                        className="text-on-surface-variant hover:text-red-500 font-extrabold text-2xs uppercase tracking-widest cursor-pointer"
                      >
                        Limpar
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-gold/10">
                      {/* Matching and searchable indexes */}
                      {(() => {
                        const trimmedQuery = searchQuery.toLowerCase().trim();
                        if (!trimmedQuery) return null;

                        // 1. Menu shortcuts
                        const menuOptions = [
                          {
                            label: "Painel Geral Dashboard",
                            tab: "dashboard",
                            keywords:
                              "home inicio draymetas relatorios faturamento hoje",
                          },
                          {
                            label: "Agenda Integrada & Horários",
                            tab: "agenda",
                            keywords:
                              "horas abertura fechamento semana diario mensal calendário agendar reserva salas",
                          },
                          {
                            label: "CRM & Prontuários (Ficha dos Pacientes)",
                            tab: "crm",
                            keywords:
                              "clientes pacientes anamnese histórico fotos evolução crm cpf",
                          },
                          {
                            label: "Catálogo de Serviços & Tratamentos",
                            tab: "catalogo",
                            keywords:
                              "preços protocolos rituais massagem facial corporal",
                          },
                          {
                            label: "Linha de Cosméticos Naturale",
                            tab: "naturale",
                            keywords:
                              "produtos cosméticos óleos cremes vendas sabonetes sais",
                          },
                          {
                            label: "Finanças e DRE Unidade",
                            tab: "financeiro",
                            keywords:
                              "lucros caixa dre despesas faturamento pagar receber",
                          },
                          {
                            label: "Equipe e Comissões Profissionais",
                            tab: "equipe",
                            keywords:
                              "médicos terapeutas comissão salários funcionários",
                          },
                          {
                            label: "Configurações de Sistema & Unidade",
                            tab: "configuracoes",
                            keywords:
                              "ajustes cnpj telefone whastapp logo email endereço",
                          },
                        ];

                        const matchedMenus = menuOptions.filter(
                          (m) =>
                            m.label.toLowerCase().includes(trimmedQuery) ||
                            m.keywords.includes(trimmedQuery),
                        );

                        // 2. Patients & CRM (including anamnese searches!)
                        const matchedPatients = patients.filter((p) => {
                          const nameMatches = p.name
                            .toLowerCase()
                            .includes(trimmedQuery);
                          const contactMatches =
                            (p.cpf && p.cpf.includes(trimmedQuery)) ||
                            (p.phone && p.phone.includes(trimmedQuery));

                          // also test anamnese properties!
                          const anamneseMatches =
                            Object.values(p.anamneseClinica || {}).some(
                              (v) =>
                                typeof v === "string" &&
                                v.toLowerCase().includes(trimmedQuery),
                            ) ||
                            Object.values(p.anamneseHeadSpa || {}).some(
                              (v) =>
                                typeof v === "string" &&
                                v.toLowerCase().includes(trimmedQuery),
                            );

                          return (
                            nameMatches || contactMatches || anamneseMatches
                          );
                        });

                        // 3. Appointments
                        const matchedAps = appointments.filter(
                          (a) =>
                            a.patientName
                              .toLowerCase()
                              .includes(trimmedQuery) ||
                            a.procedure.toLowerCase().includes(trimmedQuery) ||
                            a.professional.toLowerCase().includes(trimmedQuery),
                        );

                        // 4. Catalog / Services & Products
                        const matchedCatalog = catalogItems.filter(
                          (ci) =>
                            ci.name.toLowerCase().includes(trimmedQuery) ||
                            ci.description
                              .toLowerCase()
                              .includes(trimmedQuery) ||
                            ci.category.toLowerCase().includes(trimmedQuery),
                        );

                        if (
                          matchedMenus.length === 0 &&
                          matchedPatients.length === 0 &&
                          matchedAps.length === 0 &&
                          matchedCatalog.length === 0
                        ) {
                          return (
                            <div className="p-4 text-center text-xs text-on-surface-variant/70 font-bold">
                              Nenhum resultado encontrado para &quot;
                              {searchQuery}&quot;.
                            </div>
                          );
                        }

                        return (
                          <>
                            {/* ShortCuts / Menus */}
                            {matchedMenus.length > 0 && (
                              <div className="p-2 space-y-1.5 bg-white">
                                <span className="text-[9px] font-black text-gold-dark uppercase px-2 block mt-1">
                                  ATALHOS DO MENU
                                </span>
                                {matchedMenus.map((m) => (
                                  <button
                                    key={m.tab}
                                    type="button"
                                    onClick={() => {
                                      setActiveTab(m.tab);
                                      setShowSearchDropdown(false);
                                      setSearchQuery("");
                                    }}
                                    className="w-full text-left p-2 hover:bg-gold/10 rounded-lg flex items-center justify-between text-xs font-bold transition-all active:scale-98 cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="material-symbols-outlined text-[#3d4c3a] text-xs font-bold">
                                        navigation
                                      </span>
                                      <p className="text-primary-dark font-sans font-extrabold">
                                        {m.label}
                                      </p>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-gold-dark">
                                      chevron_right
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Patients / CRM with Anamneses */}
                            {matchedPatients.length > 0 && (
                              <div className="p-2 space-y-1.5 bg-white">
                                <span className="text-[9px] font-black text-[#3d4c3a] uppercase px-2 block mt-1">
                                  PACIENTES & ANAMNESE
                                </span>
                                {matchedPatients.map((p) => (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                      setGlobalSelectedPatientId(p.id);
                                      setActiveTab("crm");
                                      setShowSearchDropdown(false);
                                      setSearchQuery("");
                                    }}
                                    className="w-full text-left p-2 hover:bg-gold/10 rounded-lg flex items-center justify-between text-xs font-bold transition-all active:scale-98 cursor-pointer"
                                  >
                                    <div>
                                      <p className="text-primary-dark font-sans font-extrabold">
                                        {p.name}
                                      </p>
                                      <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                                        {p.tier} • {p.phone}
                                      </p>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-gold-dark">
                                      chevron_right
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Active Appointments */}
                            {matchedAps.length > 0 && (
                              <div className="p-2 space-y-1.5 bg-white">
                                <span className="text-[9px] font-black text-gold-dark uppercase px-2 block mt-1">
                                  AGENDAMENTOS DE ATENDIMENTO
                                </span>
                                {matchedAps.map((a) => (
                                  <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => {
                                      setActiveTab("agenda");
                                      setShowSearchDropdown(false);
                                      setSearchQuery("");
                                    }}
                                    className="w-full text-left p-2 hover:bg-gold/10 rounded-lg flex items-center justify-between text-xs font-bold transition-all active:scale-98 cursor-pointer"
                                  >
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-primary-dark font-sans font-extrabold">
                                          {a.patientName}
                                        </p>
                                        <span className="text-[9px] font-black bg-[#fed488]/40 border border-[#fed488] text-gold-dark px-1.5 py-0.2 rounded font-sans">
                                          {a.time}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                                        {a.procedure} • Dr(a). {a.professional}
                                      </p>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-gold-dark">
                                      chevron_right
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Catalog Treatments / Cosmetics */}
                            {matchedCatalog.length > 0 && (
                              <div className="p-2 space-y-1.5 bg-white">
                                <span className="text-[9px] font-black text-[#564e43] uppercase px-2 block mt-1">
                                  CATÁLOGO & SERVIÇOS
                                </span>
                                {matchedCatalog.map((ci) => (
                                  <button
                                    key={ci.id}
                                    type="button"
                                    onClick={() => {
                                      setActiveTab(
                                        ci.volumeOrWeight
                                          ? "naturale"
                                          : "catalogo",
                                      );
                                      setShowSearchDropdown(false);
                                      setSearchQuery("");
                                    }}
                                    className="w-full text-left p-2 hover:bg-gold/10 rounded-lg flex items-center justify-between text-xs font-bold transition-all active:scale-98 cursor-pointer"
                                  >
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-primary-dark font-sans font-extrabold">
                                          {ci.name}
                                        </p>
                                        <span className="text-[9px] font-black text-gold-dark">
                                          R$ {ci.price}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                                        {ci.category}{" "}
                                        {ci.duration
                                          ? `• ${ci.duration}min`
                                          : ""}
                                      </p>
                                    </div>
                                    <span className="material-symbols-outlined text-sm text-gold-dark">
                                      chevron_right
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Clinician Logged In profile button */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-extrabold text-primary-dark font-sans">
                {activeClinician}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-gold-button flex items-center justify-center font-black text-sm text-white shadow-md">
              {activeClinician
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
        </header>

        {/* Sub Routing Page Switch content frame */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {renderSelectedTab()}
        </main>
      </div>

      {/* 3. New Appointment Overlaid Sheet / Modal */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-200 text-left space-y-4">
            <div className="flex justify-between items-center border-b border-gold/12 pb-3">
              <h3 className="text-lg font-bold text-primary-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-gold font-bold">
                  calendar_month
                </span>
                Registrar Novo Agendamento
              </h3>
              <button
                onClick={() => setAppointmentModalOpen(false)}
                className="text-on-surface-variant hover:text-red-500 font-bold active:scale-95 transition-smooth"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddNewAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                  Nome do Paciente
                </label>
                <select
                  required
                  value={newApPatient}
                  onChange={(e) => setNewApPatient(e.target.value)}
                  className="w-full bg-bg-base/70 border border-gold/20 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="" disabled>Selecione um paciente cadastrado...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                    Ritual/Serviço
                  </label>
                  <select
                    value={newApProcedure}
                    onChange={(e) => setNewApProcedure(e.target.value)}
                    className="w-full bg-bg-base/70 border border-gold/20 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    {catalogItems
                      .filter((i) => i.type === "Serviço")
                      .map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} (R$ {s.price})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                    Profissional
                  </label>
                  <select
                    value={newApProfessional}
                    onChange={(e) => setNewApProfessional(e.target.value)}
                    className="w-full bg-bg-base/70 border border-gold/20 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    {staffList.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name} ({st.specialty.split(" ")[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={newApDate}
                    onChange={(e) => setNewApDate(e.target.value)}
                    className="w-full bg-bg-base/70 border border-gold/20 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                    Horário
                  </label>
                  <input
                    type="time"
                    required
                    value={newApTime}
                    onChange={(e) => setNewApTime(e.target.value)}
                    className="w-full bg-bg-base/70 border border-gold/20 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider font-sans">
                    Duração (Min)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="60"
                    value={newApDuration}
                    onChange={(e) => setNewApDuration(e.target.value)}
                    className="w-full bg-bg-base/70 border border-gold/20 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Class of Appointment Option buttons */}
              <div>
                <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                  Finalidade de Atendimento
                </label>
                <div className="flex bg-bg-base/50 p-1.5 rounded-xl border border-gold/10 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewApType("Head SPA")}
                    className={`flex-1 py-3 text-2xs font-extrabold uppercase rounded-lg tracking-wider transition-smooth active:scale-95
                    ${
                      newApType === "Head SPA"
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface-variant hover:text-primary-dark"
                    }`}
                  >
                    Head SPA (Adianto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewApType("Avaliação")}
                    className={`flex-1 py-3 text-2xs font-extrabold uppercase rounded-lg tracking-wider transition-smooth active:scale-95
                    ${
                      newApType === "Avaliação"
                        ? "bg-[#fed488]/40 text-[#775a19] shadow-sm"
                        : "text-on-surface-variant hover:text-primary-dark"
                    }`}
                  >
                    Avaliação Clínica
                  </button>
                </div>
              </div>

              {/* Action submission */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAppointmentModalOpen(false)}
                  className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold text-[#775a19]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md active:scale-95"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
