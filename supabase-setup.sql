-- Script de Criação do Banco de Dados Supabase (PostgreSQL) para o ERP
-- Execute este script no SQL Editor do seu projeto Supabase.

-- Tabela: clinic_settings
CREATE TABLE IF NOT EXISTS public.clinic_settings (
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
  business_hours JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  procedure TEXT NOT NULL,
  time TEXT NOT NULL,
  date TEXT NOT NULL,
  professional TEXT NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: patients
CREATE TABLE IF NOT EXISTS public.patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  last_visit TEXT,
  status TEXT NOT NULL,
  cpf TEXT,
  birth_date TEXT,
  age TEXT,
  phone TEXT,
  convenios TEXT,
  condicoes_medicas TEXT,
  avatar_url TEXT,
  evolutions JSONB,
  photos JSONB,
  signature TEXT,
  anamnese_clinica JSONB,
  anamnese_head_spa JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: head_spa_anamnese
CREATE TABLE IF NOT EXISTS public.head_spa_anamnese (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT,
  nascimento TEXT,
  ocupacao TEXT,
  telefone TEXT,
  queixa_principal TEXT,
  historico_medico JSONB,
  tratamentos_anteriores TEXT,
  habitos_vida JSONB,
  avaliacao_couro JSONB,
  observacoes_pele TEXT,
  frequencia_lavagem TEXT,
  produtos_uso TEXT,
  alergias TEXT,
  medicamentos TEXT,
  assinatura_url TEXT,
  data_assinatura TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: clinica_anamnese
CREATE TABLE IF NOT EXISTS public.clinica_anamnese (
  id TEXT PRIMARY KEY,
  paciente_id TEXT,
  nome TEXT NOT NULL,
  data_nascimento TEXT,
  idade TEXT,
  rg TEXT,
  cpf TEXT,
  endereco TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  telefone TEXT,
  email TEXT,
  motivo_consulta TEXT,
  antecedentes_medicos JSONB,
  alergias_medicamentos TEXT,
  cirurgias_anteriores TEXT,
  medicamentos_uso_continuo TEXT,
  doencas_cronicas TEXT,
  historico_familiar TEXT,
  habitos_vida JSONB,
  frequencia_atividade_fisica TEXT,
  uso_protetor_solar TEXT,
  frequencia_protetor_solar TEXT,
  tratamentos_esteticos_anteriores TEXT,
  quais_tratamentos_esteticos TEXT,
  reacoes_adversas_esteticos TEXT,
  quais_reacoes_adversas TEXT,
  objetivos_expectativas TEXT,
  facial_assessment JSONB,
  body_assessment JSONB,
  assinatura TEXT,
  data_preenchimento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  date_str TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  value NUMERIC NOT NULL,
  status TEXT NOT NULL,
  cost_material NUMERIC,
  tax_amount NUMERIC,
  commission_amount NUMERIC,
  dre_category TEXT,
  dre_sub_category TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: fixed_expenses
CREATE TABLE IF NOT EXISTS public.fixed_expenses (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  value NUMERIC NOT NULL,
  dre_category TEXT NOT NULL,
  dre_sub_category TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: catalog_items
CREATE TABLE IF NOT EXISTS public.catalog_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration TEXT,
  description TEXT,
  volume_or_weight TEXT,
  image_url TEXT,
  cost_material NUMERIC,
  tax_rate NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: staff_list
CREATE TABLE IF NOT EXISTS public.staff_list (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialty TEXT NOT NULL,
  permission TEXT NOT NULL,
  status TEXT NOT NULL,
  avatar_url TEXT,
  commission_rate NUMERIC,
  earned_commission NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) e permitir public access anon para o prototipo ser facil
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for clinic_settings" ON public.clinic_settings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.head_spa_anamnese ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for head_spa_anamnese" ON public.head_spa_anamnese FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.clinica_anamnese ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for clinica_anamnese" ON public.clinica_anamnese FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.fixed_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for fixed_expenses" ON public.fixed_expenses FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for catalog_items" ON public.catalog_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.staff_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for staff_list" ON public.staff_list FOR ALL USING (true) WITH CHECK (true);

