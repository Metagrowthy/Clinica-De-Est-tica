import { supabase } from "./supabase";
import {
  Appointment,
  Patient,
  CatalogItem,
  Transaction,
  Staff,
  FixedExpense,
} from "../types/erp";

interface TableStatus {
  exists: boolean;
  count: number;
  error?: string;
}

export interface SupabaseStatus {
  clinic_settings: TableStatus;
  appointments: TableStatus;
  patients: TableStatus;
  catalog_items: TableStatus;
  transactions: TableStatus;
  fixed_expenses: TableStatus;
  staff_list: TableStatus;
}

// 1. Check Row Counts & Table Existence
export async function getSupabaseStatus(): Promise<SupabaseStatus> {
  const status: any = {};
  const tables = [
    { key: "clinic_settings", name: "clinic_settings" },
    { key: "appointments", name: "appointments" },
    { key: "patients", name: "patients" },
    { key: "catalog_items", name: "catalog_items" },
    { key: "transactions", name: "transactions" },
    { key: "fixed_expenses", name: "fixed_expenses" },
    { key: "staff_list", name: "staff_list" },
  ];

  for (const t of tables) {
    try {
      const { count, error } = await supabase
        .from(t.name)
        .select("*", { count: "exact", head: true });

      if (error) {
        status[t.key] = { exists: false, count: 0, error: error.message };
      } else {
        status[t.key] = { exists: true, count: count || 0 };
      }
    } catch (err: any) {
      status[t.key] = {
        exists: false,
        count: 0,
        error: err.message || "Erro de conexão/tabela inexistente",
      };
    }
  }

  return status as SupabaseStatus;
}

// 2. Fetchers with silent fallbacks
export async function fetchClinicSettings(fallback: any) {
  try {
    const { data, error } = await supabase
      .from("clinic_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) return null;
    return {
      name: data.name,
      logoUrl: data.logo_url || "",
      logoType: data.logo_type || "elegant-monogram",
      cnpj: data.cnpj || "",
      email: data.email || "",
      tel: data.tel || "",
      address: data.address || "",
      segSex: data.seg_sex || "",
      sab: data.sab || "",
      dom: data.dom || "",
      businessHours: data.business_hours || fallback.businessHours,
    };
  } catch {
    return null;
  }
}

export async function fetchAppointments() {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("time", { ascending: true });

    if (error || !data) return null;
    return data.map((d: any) => ({
      id: d.id,
      patientName: d.patient_name,
      procedure: d.procedure,
      time: d.time,
      date: d.date,
      professional: d.professional,
      duration: d.duration,
      type: d.type,
      status: d.status,
    })) as Appointment[];
  } catch {
    return null;
  }
}

export async function fetchHeadSpaAnamneses() {
  try {
    const { data, error } = await supabase
      .from("head_spa_anamnese")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data;
  } catch (err) {
    console.warn(err);
    return [];
  }
}

export async function fetchClinicaAnamneses() {
  try {
    const { data, error } = await supabase
      .from("clinica_anamnese")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching clinica_anamnese:", error);
      return [];
    }
    
    console.log("Fetched clinica_anamnese records:", data?.length);
    if (!data) return [];
    return data;
  } catch (err) {
    console.error("Exception fetching clinica_anamnese:", err);
    return [];
  }
}

export async function fetchPatients() {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data) return null;
    return data.map((d: any) => {
      const rawClinica = d.anamnese_clinica || {};
      const { facialAssessment, bodyAssessment, rg, endereco, bairro, cidade, uf, email, ...restClinica } = rawClinica;

      return {
        id: d.id,
        name: d.name,
        tier: d.tier,
        lastVisit: d.last_visit,
        status: d.status,
        cpf: d.cpf,
        birthDate: d.birth_date,
        age: d.age,
        phone: d.phone,
        convenios: d.convenios,
        condicoesMedicas: d.condicoes_medicas,
        avatarUrl: d.avatar_url || undefined,
        evolutions: d.evolutions || [],
        photos: d.photos || [],
        signature: d.signature || undefined,
        rg: rg || undefined,
        endereco: endereco || undefined,
        bairro: bairro || undefined,
        cidade: cidade || undefined,
        uf: uf || undefined,
        email: email || undefined,
        anamneseClinica: Object.keys(restClinica).length > 0 ? restClinica : undefined,
        anamneseHeadSpa: d.anamnese_head_spa || undefined,
        facialAssessment: facialAssessment || undefined,
        bodyAssessment: bodyAssessment || undefined,
      };
    }) as Patient[];
  } catch {
    return null;
  }
}

export async function fetchCatalogItems() {
  try {
    const { data, error } = await supabase
      .from("catalog_items")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data) return null;
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      category: d.category,
      price: Number(d.price),
      duration: d.duration || undefined,
      description: d.description || "",
      volumeOrWeight: d.volume_or_weight || undefined,
      imageUrl: d.image_url || undefined,
      costMaterial: Number(d.cost_material) || undefined,
      taxRate: Number(d.tax_rate) || undefined,
    })) as CatalogItem[];
  } catch {
    return null;
  }
}

export async function fetchTransactions() {
  try {
    const { data, error } = await supabase.from("transactions").select("*");

    if (error || !data) return null;
    return data.map((d: any) => ({
      id: d.id,
      dateStr: d.date_str,
      description: d.description,
      type: d.type,
      category: d.category,
      value: Number(d.value),
      status: d.status,
      costMaterial: d.cost_material ? Number(d.cost_material) : undefined,
      taxAmount: d.tax_amount ? Number(d.tax_amount) : undefined,
      commissionAmount: d.commission_amount ? Number(d.commission_amount) : undefined,
      dreCategory: d.dre_category || undefined,
      dreSubCategory: d.dre_sub_category || undefined,
    })) as Transaction[];
  } catch {
    return null;
  }
}

export async function fetchFixedExpenses() {
  try {
    const { data, error } = await supabase.from("fixed_expenses").select("*");

    if (error || !data) return null;
    return data.map((d: any) => ({
      id: d.id,
      description: d.description,
      value: Number(d.value),
      dreCategory: d.dre_category,
      dreSubCategory: d.dre_sub_category,
    })) as FixedExpense[];
  } catch {
    return null;
  }
}

export async function fetchStaffList() {
  try {
    const { data, error } = await supabase
      .from("staff_list")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data) return null;
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      specialty: d.specialty,
      permission: d.permission,
      status: d.status,
      avatarUrl: d.avatar_url || undefined,
      commissionRate: Number(d.commission_rate),
      earnedCommission: Number(d.earned_commission),
    })) as Staff[];
  } catch {
    return null;
  }
}

// 3. Sync Mutations (Single upserts/deletes)
export async function syncClinicSettings(settings: any) {
  try {
    await supabase.from("clinic_settings").upsert({
      id: "default",
      name: settings.name,
      logo_url: settings.logoUrl || null,
      logo_type: settings.logoType,
      cnpj: settings.cnpj,
      email: settings.email,
      tel: settings.tel,
      address: settings.address,
      seg_sex: settings.segSex,
      sab: settings.sab,
      dom: settings.dom,
      business_hours: settings.businessHours,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Fez fallback do Supabase sync:", err);
  }
}

export async function syncUpsertAppointment(ap: Appointment) {
  try {
    await supabase.from("appointments").upsert({
      id: ap.id,
      patient_name: ap.patientName,
      procedure: ap.procedure,
      time: ap.time,
      date: ap.date,
      professional: ap.professional,
      duration: ap.duration,
      type: ap.type,
      status: ap.status,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(err);
  }
}

export async function syncDeleteAppointment(id: string) {
  try {
    await supabase.from("appointments").delete().eq("id", id);
  } catch (err) {
    console.warn(err);
  }
}

export async function syncUpsertPatient(p: Patient) {
  try {
    const anamneseClinicaData = {
      ...(p.anamneseClinica || {}),
      facialAssessment: p.facialAssessment || null,
      bodyAssessment: p.bodyAssessment || null,
      rg: p.rg || null,
      endereco: p.endereco || null,
      bairro: p.bairro || null,
      cidade: p.cidade || null,
      uf: p.uf || null,
      email: p.email || null,
    };

    const { error } = await supabase.from("patients").upsert({
      id: p.id,
      name: p.name,
      tier: p.tier,
      last_visit: p.lastVisit || null,
      status: p.status,
      cpf: p.cpf || null,
      birth_date: p.birthDate || null,
      age: p.age || null,
      phone: p.phone || null,
      convenios: p.convenios || null,
      condicoes_medicas: p.condicoesMedicas || null,
      avatar_url: p.avatarUrl || null,
      evolutions: p.evolutions,
      photos: p.photos,
      signature: p.signature || null,
      anamnese_clinica: anamneseClinicaData,
      anamnese_head_spa: p.anamneseHeadSpa || {},
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("Supabase upsert error for patient:", JSON.stringify(error, null, 2), error);
    }
  } catch (err) {
    console.warn(err);
  }
}

export async function syncDeletePatient(id: string) {
  try {
    await supabase.from("patients").delete().eq("id", id);
  } catch (err) {
    console.warn(err);
  }
}

export async function syncUpsertCatalogItem(item: CatalogItem) {
  try {
    await supabase.from("catalog_items").upsert({
      id: item.id,
      name: item.name,
      type: item.type,
      category: item.category,
      price: item.price,
      duration: item.duration || null,
      description: item.description || "",
      volume_or_weight: item.volumeOrWeight || null,
      image_url: item.imageUrl || null,
      cost_material: item.costMaterial || null,
      tax_rate: item.taxRate || null,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(err);
  }
}

export async function syncDeleteCatalogItem(id: string) {
  try {
    await supabase.from("catalog_items").delete().eq("id", id);
  } catch (err) {
    console.warn(err);
  }
}

export async function syncUpsertTransaction(tx: Transaction) {
  try {
    await supabase.from("transactions").upsert({
      id: tx.id,
      date_str: tx.dateStr,
      description: tx.description,
      type: tx.type,
      category: tx.category,
      value: tx.value,
      status: tx.status,
      cost_material: tx.costMaterial || null,
      tax_amount: tx.taxAmount || null,
      commission_amount: tx.commissionAmount || null,
      dre_category: tx.dreCategory || null,
      dre_sub_category: tx.dreSubCategory || null,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(err);
  }
}

export async function syncDeleteTransaction(id: string) {
  try {
    await supabase.from("transactions").delete().eq("id", id);
  } catch (err) {
    console.warn(err);
  }
}

export async function syncUpsertFixedExpense(fx: FixedExpense) {
  try {
    await supabase.from("fixed_expenses").upsert({
      id: fx.id,
      description: fx.description,
      value: fx.value,
      dre_category: fx.dreCategory,
      dre_sub_category: fx.dreSubCategory,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(err);
  }
}

export async function syncDeleteFixedExpense(id: string) {
  try {
    await supabase.from("fixed_expenses").delete().eq("id", id);
  } catch (err) {
    console.warn(err);
  }
}

export async function syncUpsertStaff(st: Staff) {
  try {
    await supabase.from("staff_list").upsert({
      id: st.id,
      name: st.name,
      email: st.email,
      specialty: st.specialty,
      permission: st.permission,
      status: st.status,
      avatar_url: st.avatarUrl || null,
      commission_rate: st.commissionRate,
      earned_commission: st.earnedCommission,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(err);
  }
}

export async function syncDeleteStaff(id: string) {
  try {
    await supabase.from("staff_list").delete().eq("id", id);
  } catch (err) {
    console.warn(err);
  }
}

// 4. Seeder of default lists
export async function seedAllDatabase(data: {
  clinicSettings: any;
  appointments: Appointment[];
  patients: Patient[];
  catalogItems: CatalogItem[];
  transactions: Transaction[];
  fixedExpenses: FixedExpense[];
  staffList: Staff[];
}) {
  // Clinic Settings
  await syncClinicSettings(data.clinicSettings);

  // Appointments
  for (const ap of data.appointments) {
    await syncUpsertAppointment(ap);
  }

  // Patients
  for (const p of data.patients) {
    await syncUpsertPatient(p);
  }

  // Catalog
  for (const ci of data.catalogItems) {
    await syncUpsertCatalogItem(ci);
  }

  // Transactions
  for (const tx of data.transactions) {
    await syncUpsertTransaction(tx);
  }

  // FixedExpenses
  for (const fx of data.fixedExpenses) {
    await syncUpsertFixedExpense(fx);
  }

  // Staff
  for (const st of data.staffList) {
    await syncUpsertStaff(st);
  }
}
