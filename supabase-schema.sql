-- =====================================================================
-- BENESSERE VITA - SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor to bootstrap tables.
-- =====================================================================

-- 1. Clinic Settings Table
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

-- 2. Appointments Table (Agendamentos)
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  procedure TEXT NOT NULL,
  time TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  professional TEXT NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Head SPA' | 'Avaliação'
  status TEXT NOT NULL, -- 'Confirmado' | 'Em Atendimento' | 'Agendado' | 'Finalizado'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Patients Table (Prontuários e Pacientes)
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
  evolutions JSONB NOT NULL DEFAULT '[]'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  signature TEXT,
  anamnese_clinica JSONB DEFAULT '{}'::jsonb,
  anamnese_head_spa JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Catalog Items Table (Serviços e Produtos)
CREATE TABLE IF NOT EXISTS catalog_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Serviço' | 'Produto'
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration INTEGER, -- Em minutos para serviços
  description TEXT,
  volume_or_weight TEXT, -- Para produtos
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Transactions Table (Financeiro & DRE)
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  date_str TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Serviço' | 'Despesa' | 'Venda' | 'Fixa'
  category TEXT NOT NULL, -- 'PROCEDIMENTOS' | 'INSUMOS' | 'PRODUTOS' | 'ESTRUTURA'
  value NUMERIC NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Staff List Table (Equipe & Comissões)
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

-- Desabilita RLS por padrão para permitir conexão de testes e protótipo imediato.
-- Em produção, você pode definir regras RLS robustas no painel do Supabase.
ALTER TABLE clinic_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_list DISABLE ROW LEVEL SECURITY;
