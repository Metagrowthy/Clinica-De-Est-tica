export interface Appointment {
  id: string;
  patientName: string;
  procedure: string;
  time: string;
  date: string; // YYYY-MM-DD
  professional: string;
  duration: string;
  type: "Head SPA" | "Avaliação";
  status: "Confirmado" | "Em Atendimento" | "Agendado" | "Finalizado";
}

export interface HeadSpaAnamnese {
  id?: string;
  nome: string;
  cpf?: string;
  data_nascimento: string;
  data_atendimento?: string;
  contato: string;
  email?: string;
  endereco?: string;
  comorbidade?: boolean;
  comorbidade_qual?: string;
  alergia?: boolean;
  alergia_qual?: string;
  medicacao?: boolean;
  medicacao_qual?: string;
  pos_operatorio_oncologico?: boolean;
  gestante_amamentando?: boolean;
  gestante_periodo?: string;
  consome_alcool_fuma?: boolean;
  bebe_agua?: boolean;
  agua_litros_dia?: string;
  rotina_pele?: string;
  quimica_capilar?: boolean;
  quimica_capilar_qual?: string;
  queda_cabelo?: boolean;
  queda_cabelo_detalhes?: string;
  apliques_trancas_dreads?: boolean;
  apliques_tipo?: string;
  feridas_couro_cabeludo?: boolean;
  tipo_cabelo?: "Oleoso" | "Seco" | "Neutro" | "Misto";
  observacao_cabelo?: string;
  rotina_cabelo?: string;
  ansiedade?: boolean;
  estresse_elevado?: boolean;
  compulsao_alimentar?: boolean;
  sobrecarregado_esgotamento?: boolean;
  dor_cabeca_bruxismo?: boolean;
  busca_relaxamento?: boolean;
  vicio?: boolean;
  vicio_qual?: string;
  relacao_natureza_espiritualidade?: string;
  observacoes_adicionais?: string;
  created_at?: string;
}

export interface Patient {
  id: string;
  name: string;
  tier:
    | "CLIENTE DIAMANTE"
    | "Paciente VIP"
    | "Paciente Mensal"
    | "Paciente New Gen";
  lastVisit: string;
  status: "Ativo" | "Inativo";
  cpf: string;
  birthDate: string;
  age: number;
  phone: string;
  convenios?: string;
  condicoesMedicas?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  rg?: string;
  email?: string;
  avatarUrl?: string;
  evolutions: ClinicalEvolution[];
  photos: PatientPhoto[];
  signature?: string; // Signed electronically (consent)
  anamneseClinica?: AnamneseClinica;
  anamneseHeadSpa?: AnamneseHeadSpa;
  anamneseObservationClinica?: string;
  anamneseObservationHeadSpa?: string;
  facialAssessment?: FacialAssessment;
  bodyAssessment?: BodyAssessment;
}

export interface FacialAssessment {
  manchasPigmentares: {
    acromia: boolean;
    melasma: boolean;
    efelides: boolean;
    hipercromia: boolean;
    ausente: boolean;
  };
  manchasVasculares: {
    rosacea: boolean;
    hematoma: boolean;
    eritema: boolean;
    teleangectasias: boolean;
    petequias: boolean;
    ausente: boolean;
  };
  formacoesSolidas: {
    ceratose: boolean;
    comedao: boolean;
    verrugas: boolean;
    papulas: boolean;
    necrose: boolean;
    nodulo: boolean;
    millium: boolean;
    acne: boolean;
    ausente: boolean;
  };
  lesoesPele: {
    fissura: boolean;
    descamacao: boolean;
    ulceracao: boolean;
    crosta: boolean;
    hiperqueratose: boolean;
    ausente: boolean;
  };
  sequelas: {
    atrofia: boolean;
    cicatriz: boolean;
    ausente: boolean;
  };
  outros: string;
  tipoCutaneo: {
    hidratacao: "Normal" | "Desidratada" | "";
    oleosidade: "Alipica" | "Lipídica" | "Seborreica" | "Normal" | "";
    espessura: "Espessa" | "Fina" | "Normal" | "";
    fototipo: "I" | "II" | "III" | "IV" | "V" | "";
  };
  caracteristicas: {
    semRugas: boolean;
    rugasDinamicas: boolean;
    rugasEstaticas: boolean;
    sulcos: boolean;
    flacidez: boolean;
    fotoenvelhecimento: boolean;
  };
  escalaGlogau: "Tipo 1" | "Tipo 2" | "Tipo 3" | "Tipo 4" | "";
  sugestaoTratamento: string;
  markers?: Array<{ x: number; y: number; note?: string; type?: string }>;
}

export interface BodyAssessment {
  medidas: {
    bracoD: { medida: string; inicioDate: string; finalDate: string };
    bracoE: { medida: string; inicioDate: string; finalDate: string };
    bustoTorax: { medida: string; inicioDate: string; finalDate: string };
    estomago: { medida: string; inicioDate: string; finalDate: string };
    cintura: { medida: string; inicioDate: string; finalDate: string };
    barriga: { medida: string; inicioDate: string; finalDate: string };
    quadril: { medida: string; inicioDate: string; finalDate: string };
    culote: { medida: string; inicioDate: string; finalDate: string };
    coxaSuperior: { medida: string; inicioDate: string; finalDate: string };
    coxaInferior: { medida: string; inicioDate: string; finalDate: string };
  };
  distribuicaoGordura: "Ginóide (pera)" | "Andróide (maça)" | "";
  celulite: {
    grau1: boolean;
    grau2: boolean;
    grau3: boolean;
    grau4: boolean;
    grau5: boolean;
    regiao: string;
  };
  estrias: {
    ausentes: boolean;
    rubras: boolean;
    albas: boolean;
    regiao: string;
  };
  flacidezMuscular: "Ausente" | "Presente" | "";
  flacidezTissular: "Ausente" | "Presente" | "";
  flacidezTissularRegiao: string;
  edema: "Ausente" | "Presente" | "";
  edemaDescricao: string;
  fibrose: "Ausente" | "Presente" | "";
  fibroseRegiao: string;
  gorduraLocalizada: "Compacta" | "Flácida" | "";
  markers?: Array<{ x: number; y: number; side?: "front" | "back" | "lateral"; note?: string; type?: string }>;
}

export interface AnamneseClinica {
  gastrointestinal: string;
  alergias: string;
  medicamentos: string;
  gestante: string;
  cirurgias: string;
  historicoPele: string;
  observacoesClinicas: string;
}

export interface AnamneseHeadSpa {
  quedaCabelo: string;
  couroCabeludo:
    | "Oleoso"
    | "Seco"
    | "Misto"
    | "Sensível"
    | "Com Caspa"
    | "Saudável";
  lavagemFrequencia:
    | "Diária"
    | "Dias Alternados"
    | "2x por semana"
    | "1x por semana"
    | "Rara";
  quimicaRecente: string;
  estresseNivel: "Baixo" | "Médio" | "Alto";
  doencasCouro: string;
  observacoesHeadSpa: string;
}

export interface ClinicalEvolution {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

export interface PatientPhoto {
  id: string;
  type: "ANTES" | "DEPOIS" | "DETALHE";
  url: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  type: "Serviço" | "Produto";
  category:
    | "Facial"
    | "Corporal"
    | "Harmonização"
    | "Massagem"
    | "Linha de Sais"
    | "Aromas";
  price: number;
  duration?: number; // In minutes, if Service
  description: string;
  volumeOrWeight?: string; // If product
  imageUrl?: string;
  costMaterial?: number;  // Custo Direto (Insumos/Produtos)
  taxRate?: number;       // Impostos / Taxa de Cartão (%)
}

export interface FixedExpense {
  id: string;
  description: string;
  value: number;
  dreCategory: "DESPESAS_FIXAS" | "RESULTADO_FINAL";
  dreSubCategory: string;
}

export interface Transaction {
  id: string;
  dateStr: string; // e.g., 'Hoje, 14:30'
  description: string;
  type: "Serviço" | "Despesa" | "Venda" | "Fixa";
  category: "PROCEDIMENTOS" | "INSUMOS" | "PRODUTOS" | "ESTRUTURA";
  value: number; // Positive for income, negative for expense
  status: "Concluído" | "Pago" | "Agendado";
  costMaterial?: number; // Custo de Insumo na época da transação (reduz o Lucro Bruto)
  taxAmount?: number; // Imposto/Taxa na época da transação
  commissionAmount?: number; // Comissão gerada nesta transação
  dreCategory?: "RECEITA_OPERACIONAL_BRUTA" | "DEDUCOES_DE_RECEITA" | "CUSTOS_VARIAVEIS" | "DESPESAS_FIXAS" | "RESULTADO_FINAL";
  dreSubCategory?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  specialty: string;
  permission: "Especialista" | "Admin Unidade" | "Atendimento";
  status: "Ativo" | "Inativo";
  avatarUrl?: string;
  commissionRate: number; // e.g., 0.4 for 40%
  earnedCommission: number;
}
