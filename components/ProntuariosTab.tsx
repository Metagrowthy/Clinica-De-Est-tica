/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Patient,
  ClinicalEvolution,
  HeadSpaAnamnese,
  Appointment,
} from "../types/erp";

interface ProntuariosTabProps {
  patients: Patient[];
  appointments?: Appointment[];
  headSpaAnamneses?: HeadSpaAnamnese[];
  clinicaAnamneses?: any[];
  onAddEvolution: (
    patientId: string,
    newEvolution: Omit<ClinicalEvolution, "id">,
  ) => void;
  onAddPhoto: (
    patientId: string,
    type: "ANTES" | "DEPOIS" | "DETALHE",
    url: string,
  ) => void;
  onAddNewPatient?: (
    newPatient: Omit<Patient, "id" | "evolutions" | "photos">,
  ) => void;
  onDeletePatient?: (id: string) => void;
  onUpdatePatient?: (updatedPatient: Patient) => void;
  defaultPatientId?: string;
}

const cleanLabel = (key: string) => {
  let res = key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
  res = res.charAt(0).toUpperCase() + res.slice(1).toLowerCase();
  
  const dict: { [key: string]: string } = {
    nome: "Nome Completo",
    contato: "Contato / WhatsApp",
    phone: "Telefone",
    email: "E-mail",
    gastrointestinal: "Distúrbios Gastrointestinais",
    alergias: "Alergias Clínicas (Ativos/Estética)",
    alergia: "Possui Alergia?",
    alergia_qual: "Qual Alergia?",
    medicamentos: "Medicamentos em Uso Contínuo",
    medicacao: "Uso de Medicação?",
    medicacao_qual: "Qual Medicação?",
    gestante: "Gestante ou Lactante?",
    gestante_amamentando: "Gestante ou Lactante?",
    gestante_periodo: "Tempo de Gestação",
    cirurgias: "Cirurgias e Procedimentos Recentes",
    historico_pele: "Histórico de Pele / Rosácea",
    historico_pele_detalhes: "Detalhes do Histórico de Pele",
    historicopele: "Histórico de Pele",
    observacoes_clinicas: "Observações Clínicas Gerais",
    observacoesclinicas: "Observações Clínicas",
    created_at: "Preenchido Em",
    criado_em: "Criado Em",
    data_nascimento: "Data de Nascimento",
    idade: "Idade",
    cpf: "CPF",
  };
  return dict[key.toLowerCase()] || res;
};

export default function ProntuariosTab({
  patients,
  appointments = [],
  headSpaAnamneses = [],
  clinicaAnamneses = [],
  onAddEvolution,
  onAddPhoto,
  onAddNewPatient,
  onDeletePatient,
  onUpdatePatient,
  defaultPatientId,
}: ProntuariosTabProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || "",
  );

  React.useEffect(() => {
    if (defaultPatientId && patients.some((p) => p.id === defaultPatientId)) {
      setSelectedPatientId(defaultPatientId);
    }
  }, [defaultPatientId, patients]);
  const [subTab, setSubTab] = useState<
    "timeline" | "info" | "anamneses" | "avaliacao" | "clinical" | "gallery"
  >("timeline");

  // New evolution record fields
  const [showEvolutionForm, setShowEvolutionForm] = useState(false);
  const [evoTitle, setEvoTitle] = useState("");
  const [evoDesc, setEvoDesc] = useState("");
  const [evoTagInput, setEvoTagInput] = useState("Preenchimento");

  // Anamneses Interactive/Editing States
  const [activeAnamneseSubSelected, setActiveAnamneseSubSelected] = useState<
    "clinica" | "headspa"
  >("clinica");
  const [isEditingAnamnese, setIsEditingAnamnese] = useState(false);

  // Anamnese Clínica Inputs states
  const [cliGastro, setCliGastro] = useState("");
  const [cliAlergias, setCliAlergias] = useState("");
  const [cliMedicamentos, setCliMedicamentos] = useState("");
  const [cliGestante, setCliGestante] = useState("");
  const [cliCirurgias, setCliCirurgias] = useState("");
  const [cliPele, setCliPele] = useState("");
  const [cliObs, setCliObs] = useState("");

  // Anamnese Head SPA Inputs states
  const [headQueda, setHeadQueda] = useState("");
  const [headCouro, setHeadCouro] = useState<
    "Oleoso" | "Seco" | "Misto" | "Sensível" | "Com Caspa" | "Saudável"
  >("Saudável");
  const [headLavagem, setHeadLavagem] = useState<
    "Diária" | "Dias Alternados" | "2x por semana" | "1x por semana" | "Rara"
  >("Dias Alternados");
  const [headQuimica, setHeadQuimica] = useState("");
  const [headEstresse, setHeadEstresse] = useState<"Baixo" | "Médio" | "Alto">(
    "Médio",
  );
  const [headDoencas, setHeadDoencas] = useState("");
  const [headObs, setHeadObs] = useState("");
  const [editAnamneseObsClinica, setEditAnamneseObsClinica] = useState("");
  const [editAnamneseObsHeadSpa, setEditAnamneseObsHeadSpa] = useState("");

  // Facial Assessment Form States
  const [facPigmentares, setFacPigmentares] = useState({
    acromia: false, melasma: false, efelides: false, hipercromia: false, ausente: false
  });
  const [facVasculares, setFacVasculares] = useState({
    rosacea: false, hematoma: false, eritema: false, teleangectasias: false, petequias: false, ausente: false
  });
  const [facSolidas, setFacSolidas] = useState({
    ceratose: false, comedao: false, verrugas: false, papulas: false, necrose: false, nodulo: false, millium: false, acne: false, ausente: false
  });
  const [facLesoes, setFacLesoes] = useState({
    fissura: false, descamacao: false, ulceracao: false, crosta: false, hiperqueratose: false, ausente: false
  });
  const [facSequelas, setFacSequelas] = useState({
    atrofia: false, cicatriz: false, ausente: false
  });
  const [facOutros, setFacOutros] = useState("");
  const [facTipoCutaneo, setFacTipoCutaneo] = useState({
    hidratacao: "" as "Normal" | "Desidratada" | "",
    oleosidade: "" as "Alipica" | "Lipídica" | "Seborreica" | "Normal" | "",
    espessura: "" as "Espessa" | "Fina" | "Normal" | "",
    fototipo: "" as "I" | "II" | "III" | "IV" | "V" | ""
  });
  const [facCaracteristicas, setFacCaracteristicas] = useState({
    semRugas: false, rugasDinamicas: false, rugasEstaticas: false, sulcos: false, flacidez: false, fotoenvelhecimento: false
  });
  const [facEscalaGlogau, setFacEscalaGlogau] = useState("" as "Tipo 1" | "Tipo 2" | "Tipo 3" | "Tipo 4" | "");
  const [facSugestaoTratamento, setFacSugestaoTratamento] = useState("");
  const [faceMarkers, setFaceMarkers] = useState<Array<{ x: number; y: number; note?: string; type?: string }>>([]);

  // Corporal Assessment Form States
  const [corpMedidas, setCorpMedidas] = useState({
    bracoD: { medida: "", inicioDate: "", finalDate: "" },
    bracoE: { medida: "", inicioDate: "", finalDate: "" },
    bustoTorax: { medida: "", inicioDate: "", finalDate: "" },
    estomago: { medida: "", inicioDate: "", finalDate: "" },
    cintura: { medida: "", inicioDate: "", finalDate: "" },
    barriga: { medida: "", inicioDate: "", finalDate: "" },
    quadril: { medida: "", inicioDate: "", finalDate: "" },
    culote: { medida: "", inicioDate: "", finalDate: "" },
    coxaSuperior: { medida: "", inicioDate: "", finalDate: "" },
    coxaInferior: { medida: "", inicioDate: "", finalDate: "" },
  });
  const [corpDistribuicaoGordura, setCorpDistribuicaoGordura] = useState("" as "Ginóide (pera)" | "Andróide (maça)" | "");
  const [corpCelulite, setCorpCelulite] = useState({
    grau1: false, grau2: false, grau3: false, grau4: false, grau5: false, regiao: ""
  });
  const [corpEstrias, setCorpEstrias] = useState({
    ausentes: false, rubras: false, albas: false, regiao: ""
  });
  const [corpFlacidezMuscular, setCorpFlacidezMuscular] = useState("" as "Ausente" | "Presente" | "");
  const [corpFlacidezTissular, setCorpFlacidezTissular] = useState("" as "Ausente" | "Presente" | "");
  const [corpFlacidezTissularRegiao, setCorpFlacidezTissularRegiao] = useState("");
  const [corpEdema, setCorpEdema] = useState("" as "Ausente" | "Presente" | "");
  const [corpEdemaDescricao, setCorpEdemaDescricao] = useState("");
  const [corpFibrose, setCorpFibrose] = useState("" as "Ausente" | "Presente" | "");
  const [corpFibroseRegiao, setCorpFibroseRegiao] = useState("");
  const [corpGorduraLocalizada, setCorpGorduraLocalizada] = useState("" as "Compacta" | "Flácida" | "");
  const [bodyMarkers, setBodyMarkers] = useState<Array<{ x: number; y: number; side?: "front" | "back" | "lateral"; note?: string; type?: string }>>([]);

  // Active section inside Avaliações Tab ("pele" | "corporal")
  const [activeAvaliacaoSubTab, setActiveAvaliacaoSubTab] = useState<"pele" | "corporal">("pele");
  const [selectedFaceMapType, setSelectedFaceMapType] = useState("Melasma");
  const [selectedBodyMapType, setSelectedBodyMapType] = useState("Celulite");
  const [showVisualPrintModal, setShowVisualPrintModal] = useState(false);

  // Electronic Signature state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consentSigned, setConsentSigned] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Create patient states
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [newPtName, setNewPtName] = useState("");
  const [newPtTier, setNewPtTier] = useState<Patient["tier"]>("Paciente VIP");
  const [newPtCpf, setNewPtCpf] = useState("");
  const [newPtBirthDate, setNewPtBirthDate] = useState("");
  const [newPtPhone, setNewPtPhone] = useState("");
  const [newPtStatus, setNewPtStatus] = useState<"Ativo" | "Inativo">("Ativo");

  // Edit patient states
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [editPtName, setEditPtName] = useState("");
  const [editPtTier, setEditPtTier] = useState<Patient["tier"]>("Paciente VIP");
  const [editPtCpf, setEditPtCpf] = useState("");
  const [editPtBirthDate, setEditPtBirthDate] = useState("");
  const [editPtPhone, setEditPtPhone] = useState("");
  const [editPtStatus, setEditPtStatus] = useState<"Ativo" | "Inativo">(
    "Ativo",
  );

  // Selected Patient computed details
  const activePatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Helper for normalizing phone digits for comparison
  const normalizeDigits = (str: string | undefined | null) => {
    if (!str) return "";
    return str.replace(/\D/g, "");
  };

  const activeHeadSpaAnamnese = activePatient
    ? headSpaAnamneses.find((a) => {
        const patientNameLower = activePatient.name.toLowerCase().trim();
        const recordNameLower = (a.nome || "").toLowerCase().trim();
        
        // Match 1: Exact Name Match
        if (recordNameLower === patientNameLower) return true;

        // Match 2: Phone and CPF normalization (Digits matching helper)
        const pPhone = normalizeDigits(activePatient.phone);
        const pCpf = normalizeDigits(activePatient.cpf);
        const rPhone1 = normalizeDigits(a.contato);
        const rCpf = normalizeDigits(a.cpf);
        
        if (pCpf && rCpf && pCpf !== "00000000000" && rCpf !== "00000000000" && pCpf.length > 5 && rCpf.length > 5 && (pCpf === rCpf || rCpf.includes(pCpf) || pCpf.includes(rCpf))) {
          return true;
        }

        const possiblePhones = [rPhone1].filter(Boolean);
        if (pPhone && possiblePhones.length > 0) {
          for (const rPhone of possiblePhones) {
            // strip '55' country prefix if one has it and the other doesn't
            const pPhoneClean = pPhone.startsWith("55") && pPhone.length > 10 ? pPhone.slice(2) : pPhone;
            const rPhoneClean = rPhone.startsWith("55") && rPhone.length > 10 ? rPhone.slice(2) : rPhone;
            if (pPhoneClean === rPhoneClean || pPhoneClean.includes(rPhoneClean) || rPhoneClean.includes(pPhoneClean)) {
              return true;
            }
          }
        }

        // Match 3: Name split matching
        const patientParts = patientNameLower.split(/\s+/).filter((part: string) => part.length > 2);
        const recordParts = recordNameLower.split(/\s+/).filter((part: string) => part.length > 2);
        if (patientParts.length > 0 && recordParts.length > 0) {
          const firstNameMatch = patientParts[0] === recordParts[0];
          const commonParts = patientParts.filter((part: string) => recordNameLower.includes(part));
          if (commonParts.length >= 2 || (firstNameMatch && commonParts.length >= 1)) {
            return true;
          }
        }

        return false;
      })
    : undefined;

  const activeClinicaAnamnese = activePatient
    ? clinicaAnamneses.find((a) => {
        const patientNameLower = activePatient.name.toLowerCase().trim();
        const recordNameLower = (a.nome || a.name || "").toLowerCase().trim();
        
        // Match 1: Exact Name Match
        if (recordNameLower === patientNameLower) return true;

        // Match 2: Phone and CPF normalization (Digits matching helper)
        const pPhone = normalizeDigits(activePatient.phone);
        const pCpf = normalizeDigits(activePatient.cpf);
        const rPhone1 = normalizeDigits(a.contato);
        const rPhone2 = normalizeDigits(a.phone);
        const rPhone3 = normalizeDigits(a.telefone);
        const rPhone4 = normalizeDigits(a.whatsapp);
        const rCpf = normalizeDigits(a.cpf);
        
        if (pCpf && rCpf && pCpf !== "00000000000" && rCpf !== "00000000000" && pCpf.length > 5 && rCpf.length > 5 && (pCpf === rCpf || rCpf.includes(pCpf) || pCpf.includes(rCpf))) {
          return true;
        }
        
        const possiblePhones = [rPhone1, rPhone2, rPhone3, rPhone4].filter(Boolean);
        if (pPhone && possiblePhones.length > 0) {
          for (const rPhone of possiblePhones) {
            // strip '55' country prefix if one has it and the other doesn't
            const pPhoneClean = pPhone.startsWith("55") && pPhone.length > 10 ? pPhone.slice(2) : pPhone;
            const rPhoneClean = rPhone.startsWith("55") && rPhone.length > 10 ? rPhone.slice(2) : rPhone;
            if (pPhoneClean === rPhoneClean || pPhoneClean.includes(rPhoneClean) || rPhoneClean.includes(pPhoneClean)) {
              return true;
            }
          }
        }

        // Match 3: Name split matching
        const patientParts = patientNameLower.split(/\s+/).filter((part: string) => part.length > 2);
        const recordParts = recordNameLower.split(/\s+/).filter((part: string) => part.length > 2);
        if (patientParts.length > 0 && recordParts.length > 0) {
          const firstNameMatch = patientParts[0] === recordParts[0];
          const commonParts = patientParts.filter((part: string) => recordNameLower.includes(part));
          if (commonParts.length >= 2 || (firstNameMatch && commonParts.length >= 1)) {
            return true;
          }
        }

        return false;
      })
    : undefined;

  React.useEffect(() => {
    if (activePatient) {
      setConsentSigned(!!activePatient.signature);
      setSignerName(activePatient.signature || "");
    }
  }, [activePatient]);

  const handleCreatePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPtName) return;

    if (onAddNewPatient) {
      onAddNewPatient({
        name: newPtName,
        tier: newPtTier,
        lastVisit: "Hoje",
        status: newPtStatus,
        cpf: newPtCpf || "000.000.000-00",
        birthDate: newPtBirthDate || "1995-01-01",
        age: newPtBirthDate
          ? new Date().getFullYear() - new Date(newPtBirthDate).getFullYear()
          : 30,
        phone: newPtPhone || "(11) 99999-9999",
      });
    }

    setNewPtName("");
    setNewPtCpf("");
    setNewPtBirthDate("");
    setNewPtPhone("");
    setShowCreatePatientModal(false);
  };

  const handleStartEditPatient = () => {
    if (!activePatient) return;
    setEditPtName(activePatient.name);
    setEditPtTier(activePatient.tier);
    setEditPtCpf(activePatient.cpf);
    setEditPtBirthDate(activePatient.birthDate);
    setEditPtPhone(activePatient.phone);
    setEditPtStatus(activePatient.status);
    setShowEditPatientModal(true);
  };

  const handleEditPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !editPtName) return;

    if (onUpdatePatient) {
      onUpdatePatient({
        ...activePatient,
        name: editPtName,
        tier: editPtTier,
        status: editPtStatus,
        cpf: editPtCpf,
        birthDate: editPtBirthDate,
        age: editPtBirthDate
          ? new Date().getFullYear() - new Date(editPtBirthDate).getFullYear()
          : activePatient.age,
        phone: editPtPhone,
      });
    }

    setShowEditPatientModal(false);
  };

  // Sync inputs dynamically when another patient is selected or loaded
  React.useEffect(() => {
    if (activePatient) {
      setCliGastro(activePatient.anamneseClinica?.gastrointestinal || "");
      setCliAlergias(activePatient.anamneseClinica?.alergias || "");
      setCliMedicamentos(activePatient.anamneseClinica?.medicamentos || "");
      setCliGestante(activePatient.anamneseClinica?.gestante || "");
      setCliCirurgias(activePatient.anamneseClinica?.cirurgias || "");
      setCliPele(activePatient.anamneseClinica?.historicoPele || "");
      setCliObs(activePatient.anamneseClinica?.observacoesClinicas || "");

      setHeadQueda(activePatient.anamneseHeadSpa?.quedaCabelo || "");
      setHeadCouro(activePatient.anamneseHeadSpa?.couroCabeludo || "Saudável");
      setHeadLavagem(
        activePatient.anamneseHeadSpa?.lavagemFrequencia || "Dias Alternados",
      );
      setHeadQuimica(activePatient.anamneseHeadSpa?.quimicaRecente || "");
      setHeadEstresse(activePatient.anamneseHeadSpa?.estresseNivel || "Médio");
      setHeadDoencas(activePatient.anamneseHeadSpa?.doencasCouro || "");
      setHeadObs(activePatient.anamneseHeadSpa?.observacoesHeadSpa || "");
      setEditAnamneseObsClinica(activePatient.anamneseObservationClinica || "");
      setEditAnamneseObsHeadSpa(activePatient.anamneseObservationHeadSpa || "");

      // Sync Facial and Body Assessments
      const fa = activePatient.facialAssessment || {
        manchasPigmentares: { acromia: false, melasma: false, efelides: false, hipercromia: false, ausente: false },
        manchasVasculares: { rosacea: false, hematoma: false, eritema: false, teleangectasias: false, petequias: false, ausente: false },
        formacoesSolidas: { ceratose: false, comedao: false, verrugas: false, papulas: false, necrose: false, nodulo: false, millium: false, acne: false, ausente: false },
        lesoesPele: { fissura: false, descamacao: false, ulceracao: false, crosta: false, hiperqueratose: false, ausente: false },
        sequelas: { atrofia: false, cicatriz: false, ausente: false },
        outros: "",
        tipoCutaneo: { hidratacao: "", oleosidade: "", espessura: "", fototipo: "" },
        caracteristicas: { semRugas: false, rugasDinamicas: false, rugasEstaticas: false, sulcos: false, flacidez: false, fotoenvelhecimento: false },
        escalaGlogau: "",
        sugestaoTratamento: "",
        markers: []
      };

      setFacPigmentares(fa.manchasPigmentares || { acromia: false, melasma: false, efelides: false, hipercromia: false, ausente: false });
      setFacVasculares(fa.manchasVasculares || { rosacea: false, hematoma: false, eritema: false, teleangectasias: false, petequias: false, ausente: false });
      setFacSolidas(fa.formacoesSolidas || { ceratose: false, comedao: false, verrugas: false, papulas: false, necrose: false, nodulo: false, millium: false, acne: false, ausente: false });
      setFacLesoes(fa.lesoesPele || { fissura: false, descamacao: false, ulceracao: false, crosta: false, hiperqueratose: false, ausente: false });
      setFacSequelas(fa.sequelas || { atrofia: false, cicatriz: false, ausente: false });
      setFacOutros(fa.outros || "");
      setFacTipoCutaneo(fa.tipoCutaneo || { hidratacao: "", oleosidade: "", espessura: "", fototipo: "" });
      setFacCaracteristicas(fa.caracteristicas || { semRugas: false, rugasDinamicas: false, rugasEstaticas: false, sulcos: false, flacidez: false, fotoenvelhecimento: false });
      setFacEscalaGlogau(fa.escalaGlogau || "");
      setFacSugestaoTratamento(fa.sugestaoTratamento || "");
      setFaceMarkers(fa.markers || []);

      const ba = activePatient.bodyAssessment || {
        medidas: {
          bracoD: { medida: "", inicioDate: "", finalDate: "" },
          bracoE: { medida: "", inicioDate: "", finalDate: "" },
          bustoTorax: { medida: "", inicioDate: "", finalDate: "" },
          estomago: { medida: "", inicioDate: "", finalDate: "" },
          cintura: { medida: "", inicioDate: "", finalDate: "" },
          barriga: { medida: "", inicioDate: "", finalDate: "" },
          quadril: { medida: "", inicioDate: "", finalDate: "" },
          culote: { medida: "", inicioDate: "", finalDate: "" },
          coxaSuperior: { medida: "", inicioDate: "", finalDate: "" },
          coxaInferior: { medida: "", inicioDate: "", finalDate: "" },
        },
        distribuicaoGordura: "",
        celulite: { grau1: false, grau2: false, grau3: false, grau4: false, grau5: false, regiao: "" },
        estrias: { ausentes: false, rubras: false, albas: false, regiao: "" },
        flacidezMuscular: "",
        flacidezTissular: "",
        flacidezTissularRegiao: "",
        edema: "",
        edemaDescricao: "",
        fibrose: "",
        fibroseRegiao: "",
        gorduraLocalizada: "",
        markers: []
      };

      setCorpMedidas(ba.medidas || {
        bracoD: { medida: "", inicioDate: "", finalDate: "" },
        bracoE: { medida: "", inicioDate: "", finalDate: "" },
        bustoTorax: { medida: "", inicioDate: "", finalDate: "" },
        estomago: { medida: "", inicioDate: "", finalDate: "" },
        cintura: { medida: "", inicioDate: "", finalDate: "" },
        barriga: { medida: "", inicioDate: "", finalDate: "" },
        quadril: { medida: "", inicioDate: "", finalDate: "" },
        culote: { medida: "", inicioDate: "", finalDate: "" },
        coxaSuperior: { medida: "", inicioDate: "", finalDate: "" },
        coxaInferior: { medida: "", inicioDate: "", finalDate: "" },
      });
      setCorpDistribuicaoGordura(ba.distribuicaoGordura || "");
      setCorpCelulite(ba.celulite || { grau1: false, grau2: false, grau3: false, grau4: false, grau5: false, regiao: "" });
      setCorpEstrias(ba.estrias || { ausentes: false, rubras: false, albas: false, regiao: "" });
      setCorpFlacidezMuscular(ba.flacidezMuscular || "");
      setCorpFlacidezTissular(ba.flacidezTissular || "");
      setCorpFlacidezTissularRegiao(ba.flacidezTissularRegiao || "");
      setCorpEdema(ba.edema || "");
      setCorpEdemaDescricao(ba.edemaDescricao || "");
      setCorpFibrose(ba.fibrose || "");
      setCorpFibroseRegiao(ba.fibroseRegiao || "");
      setCorpGorduraLocalizada(ba.gorduraLocalizada || "");
      setBodyMarkers(ba.markers || []);

      // Stop editing on patient switch to keep viewing consistent
      setIsEditingAnamnese(false);
    }
  }, [activePatient?.id]);

  const handleSaveAnamneseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !onUpdatePatient) return;

    onUpdatePatient({
      ...activePatient,
      anamneseClinica: {
        gastrointestinal: cliGastro,
        alergias: cliAlergias,
        medicamentos: cliMedicamentos,
        gestante: cliGestante,
        cirurgias: cliCirurgias,
        historicoPele: cliPele,
        observacoesClinicas: cliObs,
      },
      anamneseHeadSpa: {
        quedaCabelo: headQueda,
        couroCabeludo: headCouro,
        lavagemFrequencia: headLavagem,
        quimicaRecente: headQuimica,
        estresseNivel: headEstresse,
        doencasCouro: headDoencas,
        observacoesHeadSpa: headObs,
      },
      anamneseObservationClinica: editAnamneseObsClinica,
      anamneseObservationHeadSpa: editAnamneseObsHeadSpa,
    });

    setIsEditingAnamnese(false);
    triggerToast("Respostas da ficha atualizadas com sucesso!");
  };

  const handleSaveObservationOnly = () => {
    if (!activePatient || !onUpdatePatient) return;
    onUpdatePatient({
      ...activePatient,
      anamneseObservationClinica: editAnamneseObsClinica,
      anamneseObservationHeadSpa: editAnamneseObsHeadSpa,
    });
    triggerToast("Anotação do Especialista salva com sucesso!");
  };

  const handleSaveFacialAssessment = () => {
    if (!activePatient || !onUpdatePatient) return;
    onUpdatePatient({
      ...activePatient,
      facialAssessment: {
        manchasPigmentares: facPigmentares,
        manchasVasculares: facVasculares,
        formacoesSolidas: facSolidas,
        lesoesPele: facLesoes,
        sequelas: facSequelas,
        outros: facOutros,
        tipoCutaneo: facTipoCutaneo,
        caracteristicas: facCaracteristicas,
        escalaGlogau: facEscalaGlogau,
        sugestaoTratamento: facSugestaoTratamento,
        markers: faceMarkers,
      }
    });
    triggerToast("Avaliação da Pele Facial salva com sucesso!");
  };

  const handleSaveBodyAssessment = () => {
    if (!activePatient || !onUpdatePatient) return;
    onUpdatePatient({
      ...activePatient,
      bodyAssessment: {
        medidas: corpMedidas,
        distribuicaoGordura: corpDistribuicaoGordura,
        celulite: corpCelulite,
        estrias: corpEstrias,
        flacidezMuscular: corpFlacidezMuscular,
        flacidezTissular: corpFlacidezTissular,
        flacidezTissularRegiao: corpFlacidezTissularRegiao,
        edema: corpEdema,
        edemaDescricao: corpEdemaDescricao,
        fibrose: corpFibrose,
        fibroseRegiao: corpFibroseRegiao,
        gorduraLocalizada: corpGorduraLocalizada,
        markers: bodyMarkers,
      }
    });
    triggerToast("Avaliação Corporal salva com sucesso!");
  };

  const handleDeletePatientClick = () => {
    if (!activePatient) return;
    if (onDeletePatient) {
      onDeletePatient(activePatient.id);
      // Select remaining
      const remaining = patients.filter((p) => p.id !== activePatient.id);
      if (remaining.length > 0) {
        setSelectedPatientId(remaining[0].id);
      } else {
        setSelectedPatientId("");
      }
    }
  };

  const handleCreateEvolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evoTitle || !evoDesc) return;

    onAddEvolution(activePatient.id, {
      title: evoTitle,
      description: evoDesc,
      date: "22 DE MAIO, 2026", // Current mock date
      tags: evoTagInput.split(",").map((t) => t.trim()),
    });

    // Reset
    setEvoTitle("");
    setEvoDesc("");
    setShowEvolutionForm(false);
    triggerToast("Evolução do prontuário registrada com sucesso!");
  };

  const handleDeleteEvolution = (evoId: string) => {
    if (!activePatient || !onUpdatePatient) return;
    if (confirm("Deseja remover este registro clínico?")) {
      const updatedEvolutions = activePatient.evolutions.filter(
        (evo) => evo.id !== evoId,
      );
      onUpdatePatient({
        ...activePatient,
        evolutions: updatedEvolutions,
      });
      triggerToast("Registro clínico removido com sucesso!");
    }
  };

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editInfoName, setEditInfoName] = useState("");
  const [editInfoCpf, setEditInfoCpf] = useState("");
  const [editInfoBirth, setEditInfoBirth] = useState("");
  const [editInfoPhone, setEditInfoPhone] = useState("");
  const [editInfoConvenios, setEditInfoConvenios] = useState("");
  const [editInfoCondicoes, setEditInfoCondicoes] = useState("");
  const [editInfoRg, setEditInfoRg] = useState("");
  const [editInfoEndereco, setEditInfoEndereco] = useState("");
  const [editInfoBairro, setEditInfoBairro] = useState("");
  const [editInfoCidade, setEditInfoCidade] = useState("");
  const [editInfoUf, setEditInfoUf] = useState("");
  const [editInfoEmail, setEditInfoEmail] = useState("");

  const handleOpenEditInfo = () => {
    if (!activePatient) return;
    setEditInfoName(activePatient.name);
    setEditInfoCpf(activePatient.cpf);
    setEditInfoBirth(activePatient.birthDate);
    setEditInfoPhone(activePatient.phone);
    setEditInfoConvenios(activePatient.convenios || "");
    setEditInfoCondicoes(activePatient.condicoesMedicas || "");
    setEditInfoRg(activePatient.rg || "");
    setEditInfoEndereco(activePatient.endereco || "");
    setEditInfoBairro(activePatient.bairro || "");
    setEditInfoCidade(activePatient.cidade || "");
    setEditInfoUf(activePatient.uf || "");
    setEditInfoEmail(activePatient.email || "");
    setIsEditingInfo(true);
  };

  const handleSaveInfo = () => {
    if (!activePatient || !onUpdatePatient) return;
    onUpdatePatient({
      ...activePatient,
      name: editInfoName,
      cpf: editInfoCpf,
      birthDate: editInfoBirth,
      phone: editInfoPhone,
      convenios: editInfoConvenios,
      condicoesMedicas: editInfoCondicoes,
      rg: editInfoRg,
      endereco: editInfoEndereco,
      bairro: editInfoBairro,
      cidade: editInfoCidade,
      uf: editInfoUf,
      email: editInfoEmail,
    });
    setIsEditingInfo(false);
    triggerToast("Dados cadastrais atualizados com sucesso!");
  };

  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [photoCatInput, setPhotoCatInput] = useState<
    "ANTES" | "DEPOIS" | "DETALHE"
  >("ANTES");
  const [photoUploadFile, setPhotoUploadFile] = useState<File | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUploadFile || !activePatient) return;
    try {
      const base64Str = await fileToBase64(photoUploadFile);
      onAddPhoto(activePatient.id, photoCatInput, base64Str);
      triggerToast("Foto anexada com sucesso!");
      setPhotoUploadFile(null);
      setShowPhotoUploadModal(false);
    } catch {
      triggerToast("Erro ao processar imagem.");
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!activePatient || !onUpdatePatient) return;
    if (confirm("Deseja apagar esta foto do dossiê?")) {
      onUpdatePatient({
        ...activePatient,
        photos: activePatient.photos.filter((p) => p.id !== photoId),
      });
      triggerToast("Foto removida com sucesso!");
    }
  };

  const handlePrint = () => {
    setShowVisualPrintModal(true);
    if (typeof window !== "undefined") {
      setTimeout(() => {
        try {
          if (window.self !== window.top) {
            triggerToast("Dica: Visualize as informações completas no dossiê aberto na tela! Para imprimir em PDF/Físico, use uma nova guia.");
          }
          window.print();
        } catch(e) {
          console.error("Print blocked", e);
        }
      }, 500);
    }
  };

  const handleSignConsent = () => {
    if (!termsAccepted || !signerName.trim()) return;
    setConsentSigned(true);
    triggerToast(
      "Termo de consentimento assinado digitalmente com carimbo de ICP-Brasil!",
    );
  };

  const resetConsent = () => {
    setConsentSigned(false);
    setTermsAccepted(false);
    setSignerName("");
    triggerToast("Documento de consentimento liberado para nova assinatura.");
  };

  return (
    <>
      {activePatient && (
        <div className="hidden print:block bg-white print:p-0 min-h-screen text-black font-sans w-full max-w-4xl mx-auto">
          {/* Print Header */}
          <div className="text-center border-b-2 border-black pb-6 mb-8 mt-12">
            <h1 className="text-3xl font-bold uppercase tracking-widest text-[#C5A059]">
              Benessere Clínica
            </h1>
            <h2 className="text-xl font-semibold mt-2">
              Dossiê Completo de Prontuário
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Gerado em: {new Date().toLocaleString("pt-BR")} •{" "}
              {activePatient.name}
            </p>
          </div>

          {/* Patient Profile Basics */}
          <section className="mb-8 border-b border-gray-300 pb-8">
            <h3 className="text-sm font-extrabold tracking-widest uppercase mb-4 text-[#C5A059]">
              Dados Cadastrais
            </h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <span className="font-bold">Nome:</span> {activePatient.name}
              </div>
              <div>
                <span className="font-bold">CPF:</span> {activePatient.cpf}
              </div>
              <div>
                <span className="font-bold">Telefone:</span>{" "}
                {activePatient.phone}
              </div>
              <div>
                <span className="font-bold">Data Nasc.:</span>{" "}
                {activePatient.birthDate}
              </div>
              <div>
                <span className="font-bold">Convênios:</span>{" "}
                {activePatient.convenios || "Particular"}
              </div>
              <div>
                <span className="font-bold">Condições/Alergias:</span>{" "}
                {activePatient.condicoesMedicas || "Nenhuma informada"}
              </div>
            </div>
          </section>

          {/* Clinical History Timeline */}
          <section className="mb-8 border-b border-gray-300 pb-8">
            <h3 className="text-sm font-extrabold tracking-widest uppercase mb-4 text-[#C5A059]">
              Linha do Tempo / Evoluções
            </h3>
            {activePatient.evolutions.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma evolução registrada.
              </p>
            ) : (
              <div className="space-y-4">
                {activePatient.evolutions.map((evo) => (
                  <div
                    key={evo.id}
                    className="border border-gray-200 p-4 rounded-lg"
                  >
                    <div className="flex justify-between font-bold text-sm">
                      <span>
                        {evo.date} - {evo.title}
                      </span>
                      <span className="text-gray-500 font-normal shadow-sm px-2 py-0.5 rounded-full text-xs bg-gray-100">
                        {evo.tags.join(", ")}
                      </span>
                    </div>
                    <p className="text-sm mt-2 whitespace-pre-wrap">
                      {evo.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Anamneses */}
          <section className="mb-8 border-b border-gray-300 pb-8">
            <h3 className="text-sm font-extrabold tracking-widest uppercase mb-4 text-[#C5A059]">
              Anamnese Clínica
            </h3>
            {activePatient.anamneseClinica ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold block">Gastrointestinal:</span>{" "}
                  {activePatient.anamneseClinica.gastrointestinal ||
                    "Não preenchido ou nenhuma queixa registrada."}
                </div>
                <div>
                  <span className="font-bold block">Alergias:</span>{" "}
                  {activePatient.anamneseClinica.alergias ||
                    "Nenhuma alergia relevante relatada."}
                </div>
                <div>
                  <span className="font-bold block">Medicamentos:</span>{" "}
                  {activePatient.anamneseClinica.medicamentos ||
                    "Nenhum medicamento rotineiro em uso."}
                </div>
                <div>
                  <span className="font-bold block">Gestante/Lactante:</span>{" "}
                  {activePatient.anamneseClinica.gestante ||
                    "Não se aplica / Negado."}
                </div>
                <div>
                  <span className="font-bold block">Cirurgias/Estética:</span>{" "}
                  {activePatient.anamneseClinica.cirurgias ||
                    "Nenhuma intervenção estética recente registrada."}
                </div>
                <div>
                  <span className="font-bold block">Histórico de Pele:</span>{" "}
                  {activePatient.anamneseClinica.historicoPele ||
                    "Nenhum histórico crônico relatado."}
                </div>
                <div className="col-span-2">
                  <span className="font-bold block">Observações:</span>{" "}
                  {activePatient.anamneseClinica.observacoesClinicas ||
                    "Nenhuma diretriz ou observação registrada."}
                </div>
                {activePatient.anamneseObservationClinica && (
                  <div className="col-span-2 mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <span className="font-bold block mb-1">
                      Avaliação / Observação do Especialista (Clínica):
                    </span>
                    {activePatient.anamneseObservationClinica}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 text-sm">
                <p className="text-gray-500 mb-4">
                  Anamnese Clínica não preenchida.
                </p>
                {activePatient.anamneseObservationClinica && (
                  <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <span className="font-bold block mb-1">
                      Avaliação / Observação do Especialista (Clínica):
                    </span>
                    {activePatient.anamneseObservationClinica}
                  </div>
                )}
              </div>
            )}

            <h3 className="text-sm font-extrabold tracking-widest uppercase mb-4 mt-8 text-[#C5A059]">
              Anamnese Head SPA
            </h3>
            {activeHeadSpaAnamnese ? (
              <div className="flex flex-col gap-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold block">Diagnóstico:</span>{" "}
                    {activeHeadSpaAnamnese.tipo_cabelo || "Não preenchido"}
                  </div>
                  <div>
                    <span className="font-bold block">
                      Rotina de Cabelo (Secagem/Lavagem):
                    </span>{" "}
                    {activeHeadSpaAnamnese.rotina_cabelo || "Não preenchido"}
                  </div>
                  <div>
                    <span className="font-bold block">
                      Queda Excessiva ou Alopecia:
                    </span>{" "}
                    {activeHeadSpaAnamnese.queda_cabelo
                      ? `Sim. ${activeHeadSpaAnamnese.queda_cabelo_detalhes}`
                      : "Não"}
                  </div>
                  <div>
                    <span className="font-bold block">
                      Química Capilar (Coloração/Escova):
                    </span>{" "}
                    {activeHeadSpaAnamnese.quimica_capilar
                      ? `Sim. ${activeHeadSpaAnamnese.quimica_capilar_qual}`
                      : "Não"}
                  </div>
                  <div>
                    <span className="font-bold block">
                      Feridas ou Irritação no Couro:
                    </span>{" "}
                    {activeHeadSpaAnamnese.feridas_couro_cabeludo
                      ? "Sim"
                      : "Não"}
                  </div>
                  <div>
                    <span className="font-bold block">
                      Uso de Apliques, Tranças ou Dreads:
                    </span>{" "}
                    {activeHeadSpaAnamnese.apliques_trancas_dreads
                      ? "Sim"
                      : "Não"}
                  </div>
                </div>

                <div className="mt-2">
                  <span className="font-bold block mb-1">
                    Restrições ou Medicações Regulares:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {activeHeadSpaAnamnese.alergia && (
                      <span className="px-2 py-1 bg-red-50 text-red-700 font-bold border border-red-200 rounded">
                        Alérgico: {activeHeadSpaAnamnese.alergia_qual}
                      </span>
                    )}
                    {activeHeadSpaAnamnese.medicacao && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 font-bold border border-gray-200 rounded">
                        Meds: {activeHeadSpaAnamnese.medicacao_qual}
                      </span>
                    )}
                    {activeHeadSpaAnamnese.comorbidade && (
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 font-bold border border-amber-200 rounded">
                        Condição: {activeHeadSpaAnamnese.comorbidade_qual}
                      </span>
                    )}
                    {activeHeadSpaAnamnese.gestante_amamentando && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 font-bold border border-purple-200 rounded">
                        Gestante/Lactante:{" "}
                        {activeHeadSpaAnamnese.gestante_periodo}
                      </span>
                    )}
                    {activeHeadSpaAnamnese.pos_operatorio_oncologico && (
                      <span className="px-2 py-1 bg-rose-50 text-rose-700 font-bold border border-rose-200 rounded">
                        Pós-Op Oncológico
                      </span>
                    )}
                    {!activeHeadSpaAnamnese.alergia &&
                      !activeHeadSpaAnamnese.medicacao &&
                      !activeHeadSpaAnamnese.comorbidade &&
                      !activeHeadSpaAnamnese.gestante_amamentando &&
                      !activeHeadSpaAnamnese.pos_operatorio_oncologico && (
                        <span className="text-gray-500">
                          Nenhuma restrição assinalada.
                        </span>
                      )}
                  </div>
                </div>

                <div className="mt-2">
                  <span className="font-bold block mb-1">
                    Estado Emocional / Estilo de Vida:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {activeHeadSpaAnamnese.ansiedade && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded">
                        Ansiedade
                      </span>
                    )}
                    {activeHeadSpaAnamnese.estresse_elevado && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded">
                        Estresse Elevado
                      </span>
                    )}
                    {activeHeadSpaAnamnese.compulsao_alimentar && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded">
                        Compulsão Alimentar
                      </span>
                    )}
                    {activeHeadSpaAnamnese.sobrecarregado_esgotamento && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded">
                        Esgotamento / Burnout
                      </span>
                    )}
                    {activeHeadSpaAnamnese.dor_cabeca_bruxismo && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded">
                        Dor de Cabeça / Bruxismo
                      </span>
                    )}
                    {activeHeadSpaAnamnese.busca_relaxamento && (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded">
                        Busca Relaxamento Profundo
                      </span>
                    )}
                    {activeHeadSpaAnamnese.consome_alcool_fuma && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded">
                        Consome Álcool/Fuma
                      </span>
                    )}
                    {activeHeadSpaAnamnese.vicio && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded">
                        Vício: {activeHeadSpaAnamnese.vicio_qual}
                      </span>
                    )}
                    {!activeHeadSpaAnamnese.ansiedade &&
                      !activeHeadSpaAnamnese.estresse_elevado &&
                      !activeHeadSpaAnamnese.compulsao_alimentar &&
                      !activeHeadSpaAnamnese.sobrecarregado_esgotamento &&
                      !activeHeadSpaAnamnese.dor_cabeca_bruxismo &&
                      !activeHeadSpaAnamnese.busca_relaxamento &&
                      !activeHeadSpaAnamnese.consome_alcool_fuma &&
                      !activeHeadSpaAnamnese.vicio && (
                        <span className="text-gray-500">
                          Nenhum aspeto assinalado.
                        </span>
                      )}
                  </div>
                </div>

                <div className="mt-2">
                  <span className="font-bold block block mb-1">
                    Relação Espiritualidade & Natureza:
                  </span>
                  <p className="italic text-gray-700">
                    "
                    {activeHeadSpaAnamnese.relacao_natureza_espiritualidade ||
                      "Não preenchido."}
                    "
                  </p>
                </div>

                {(activeHeadSpaAnamnese.observacao_cabelo ||
                  activeHeadSpaAnamnese.observacoes_adicionais) && (
                  <div className="mt-2">
                    <span className="font-bold block block mb-1">
                      Observações Livres da Paciente:
                    </span>
                    <p className="italic text-gray-700">
                      "{activeHeadSpaAnamnese.observacao_cabelo}{" "}
                      {activeHeadSpaAnamnese.observacoes_adicionais}"
                    </p>
                  </div>
                )}

                {activePatient.anamneseObservationHeadSpa && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <span className="font-bold block mb-1">
                      Avaliação / Observação do Especialista (Head SPA):
                    </span>
                    {activePatient.anamneseObservationHeadSpa}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 text-sm">
                <p className="text-gray-500 mb-4">
                  Ficha Capilar Externa (Head SPA) não preenchida.
                </p>
                {activePatient.anamneseObservationHeadSpa && (
                  <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                    <span className="font-bold block mb-1">
                      Avaliação / Observação do Especialista (Head SPA):
                    </span>
                    {activePatient.anamneseObservationHeadSpa}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Facial Skin Assessment (Print) */}
          {activePatient.facialAssessment && (
            <section className="mb-8 border-b border-gray-300 pb-8 break-inside-avoid">
              <h3 className="text-sm font-extrabold tracking-widest uppercase mb-4 text-[#C5A059]">
                Avaliação da Pele Facial (Avaliação Profissional)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <span className="font-bold block">Manchas Pigmentares:</span>
                  <p>
                    {Object.entries(activePatient.facialAssessment.manchasPigmentares || {})
                      .filter(([_, val]) => val)
                      .map(([key]) => key.toUpperCase())
                      .join(", ") || "Nenhuma"}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Manchas por Alterações Vasculares:</span>
                  <p>
                    {Object.entries(activePatient.facialAssessment.manchasVasculares || {})
                      .filter(([_, val]) => val)
                      .map(([key]) => key.toUpperCase())
                      .join(", ") || "Nenhuma"}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Formações Sólidas:</span>
                  <p>
                    {Object.entries(activePatient.facialAssessment.formacoesSolidas || {})
                      .filter(([_, val]) => val)
                      .map(([key]) => key.toUpperCase())
                      .join(", ") || "Nenhuma"}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Lesões de Pele:</span>
                  <p>
                    {Object.entries(activePatient.facialAssessment.lesoesPele || {})
                      .filter(([_, val]) => val)
                      .map(([key]) => key.toUpperCase())
                      .join(", ") || "Nenhuma"}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Sequelas:</span>
                  <p>
                    {Object.entries(activePatient.facialAssessment.sequelas || {})
                      .filter(([_, val]) => val)
                      .map(([key]) => key.toUpperCase())
                      .join(", ") || "Nenhuma"}
                  </p>
                </div>
                {activePatient.facialAssessment.outros && (
                  <div>
                    <span className="font-bold block">Outros:</span>
                    <p>{activePatient.facialAssessment.outros}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                <span className="font-bold block mb-2 text-xs uppercase tracking-wide text-[#C5A059]">Classificação do Tipo Cutâneo</span>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="font-bold block">Hidratação:</span>
                    {activePatient.facialAssessment.tipoCutaneo?.hidratacao || "Não informada"}
                  </div>
                  <div>
                    <span className="font-bold block">Oleosidade:</span>
                    {activePatient.facialAssessment.tipoCutaneo?.oleosidade || "Não informada"}
                  </div>
                  <div>
                    <span className="font-bold block">Espessura:</span>
                    {activePatient.facialAssessment.tipoCutaneo?.espessura || "Não informada"}
                  </div>
                  <div>
                    <span className="font-bold block">Fototipo:</span>
                    {activePatient.facialAssessment.tipoCutaneo?.fototipo || "Não informado"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <span className="font-bold block">Características da Pele:</span>
                  <p>
                    {Object.entries(activePatient.facialAssessment.caracteristicas || {})
                      .filter(([_, val]) => val)
                      .map(([key]) => key.toUpperCase())
                      .join(", ") || "Nenhuma"}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Escala de Glogau:</span>
                  <p>{activePatient.facialAssessment.escalaGlogau || "Não preenchida"}</p>
                </div>
              </div>

              {activePatient.facialAssessment.sugestaoTratamento && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="font-bold block mb-1">Sugestão de Tratamento / Protocolo:</span>
                  <p className="italic">{activePatient.facialAssessment.sugestaoTratamento}</p>
                </div>
              )}
            </section>
          )}

          {/* Corporal Assessment (Print) */}
          {activePatient.bodyAssessment && (
            <section className="mb-8 border-b border-gray-300 pb-8 break-inside-avoid">
              <h3 className="text-sm font-extrabold tracking-widest uppercase mb-4 text-[#C5A059]">
                Avaliação Corporal (Avaliação Profissional)
              </h3>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-xs text-left border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border border-gray-200">Região</th>
                      <th className="p-2 border border-gray-200">Medida (cm aprox.)</th>
                      <th className="p-2 border border-gray-200">Início (data)</th>
                      <th className="p-2 border border-gray-200">Final (data)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(activePatient.bodyAssessment.medidas || {}).map(([key, d]: any) => {
                      const regionNames: { [key: string]: string } = {
                        bracoD: "Braço D",
                        bracoE: "Braço E",
                        bustoTorax: "Busto/ Tórax",
                        estomago: "Estômago",
                        cintura: "Cintura",
                        barriga: "Barriga",
                        quadril: "Quadril",
                        culote: "Culote",
                        coxaSuperior: "Coxa Superior",
                        coxaInferior: "Coxa Inferior",
                      };
                      return (
                        <tr key={key}>
                          <td className="p-2 border border-gray-200 font-bold">{regionNames[key] || key}</td>
                          <td className="p-2 border border-gray-200">{d.medida || "-"}</td>
                          <td className="p-2 border border-gray-200">{d.inicioDate || "-"}</td>
                          <td className="p-2 border border-gray-200">{d.finalDate || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-bold block">Distribuição de Gordura Corporal:</span>
                  <p>{activePatient.bodyAssessment.distribuicaoGordura || "-"}</p>
                </div>
                <div>
                  <span className="font-bold block">Celulite:</span>
                  <p>
                    {activePatient.bodyAssessment.celulite?.grau1 && " Grau 1"}
                    {activePatient.bodyAssessment.celulite?.grau2 && " Grau 2"}
                    {activePatient.bodyAssessment.celulite?.grau3 && " Grau 3"}
                    {activePatient.bodyAssessment.celulite?.grau4 && " Grau 4"}
                    {activePatient.bodyAssessment.celulite?.grau5 && " Grau 5"}
                    {activePatient.bodyAssessment.celulite?.regiao && ` (Região: ${activePatient.bodyAssessment.celulite.regiao})`}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Estrias:</span>
                  <p>
                    {activePatient.bodyAssessment.estrias?.ausentes && "Ausentes"}
                    {activePatient.bodyAssessment.estrias?.rubras && " Rubras (Vermelhas)"}
                    {activePatient.bodyAssessment.estrias?.albas && " Albas (Brancas)"}
                    {activePatient.bodyAssessment.estrias?.regiao && ` (Região: ${activePatient.bodyAssessment.estrias.regiao})`}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Flacidez Muscular:</span>
                  <p>{activePatient.bodyAssessment.flacidezMuscular || "-"}</p>
                </div>
                <div>
                  <span className="font-bold block">Flacidez Tissular:</span>
                  <p>
                    {activePatient.bodyAssessment.flacidezTissular || "-"} 
                    {activePatient.bodyAssessment.flacidezTissularRegiao && ` (Região: ${activePatient.bodyAssessment.flacidezTissularRegiao})`}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Edema:</span>
                  <p>
                    {activePatient.bodyAssessment.edema || "-"} 
                    {activePatient.bodyAssessment.edemaDescricao && ` (Desc: ${activePatient.bodyAssessment.edemaDescricao})`}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Fibrose:</span>
                  <p>
                    {activePatient.bodyAssessment.fibrose || "-"} 
                    {activePatient.bodyAssessment.fibroseRegiao && ` (Região: ${activePatient.bodyAssessment.fibroseRegiao})`}
                  </p>
                </div>
                <div>
                  <span className="font-bold block">Gordura Localizada:</span>
                  <p>{activePatient.bodyAssessment.gorduraLocalizada || "-"}</p>
                </div>
              </div>
            </section>
          )}

          {/* Gallery */}
          <section className="mb-8 border-b border-gray-300 pb-8">
            <h3 className="text-sm font-extrabold tracking-widest uppercase mb-4 text-[#C5A059]">
              Galeria (Antes e Depois)
            </h3>
            {activePatient.photos.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma foto anexada.</p>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {activePatient.photos.map((p) => (
                  <div key={p.id}>
                    <img
                      src={p.url}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      alt={p.type}
                    />
                    <p className="text-xs font-bold text-center mt-2 uppercase">
                      {p.type}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Signature */}
          {activePatient.signature && (
            <section className="mb-8 pt-8 break-inside-avoid">
              <h3 className="text-sm font-extrabold tracking-widest uppercase mb-6 text-center">
                Termo de Consentimento Livre e Esclarecido
              </h3>
              <p className="text-xs text-justify mb-8 max-w-2xl mx-auto">
                Atesto, por meio deste documento digital, reconhecido por aceite
                autoral, que fui devidamente instruído sobre a natureza dos
                procedimentos estéticos bem como sobre os protocolos da clínica.
                As anamneses supracitadas foram respondidas por mim.
              </p>
              {activePatient.signature.startsWith("data:image/") ? (
                <img
                  src={activePatient.signature}
                  alt="Assinatura"
                  className="h-32 object-contain mx-auto"
                />
              ) : (
                <div className="text-center font-bold italic border-b-2 border-black inline-block px-16 pb-1 mx-auto block">
                  {activePatient.signature}
                </div>
              )}
              <p className="text-center text-[10px] mt-2 uppercase font-mono tracking-widest">
                Assinatura Eletrônica Legal
              </p>
            </section>
          )}
        </div>
      )}

      <div className="print:hidden space-y-8 animate-in fade-in duration-300">
        {/* Page header and selector */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
              Prontuário Digital
            </h1>
            <p className="text-on-surface-variant font-medium mt-1">
              Central de inteligência clínica, acompanhamento e registro de
              consentimentos regulados.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <label className="text-xs font-bold text-primary-dark uppercase block tracking-wider shrink-0">
              Paciente CRM:
            </label>
            <div className="flex gap-2 items-center flex-1 md:flex-initial">
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="flex-1 md:w-64 bg-white border border-gold/20 rounded-xl px-4 py-2 font-semibold text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.tier})
                  </option>
                ))}
              </select>

              {/* CRM Toolbar action buttons config */}
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => setShowCreatePatientModal(true)}
                  className="w-10 h-10 bg-gold/15 text-gold-dark hover:bg-gold hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  title="Cadastrar Novo Paciente"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base font-bold">
                    person_add
                  </span>
                </button>

                {activePatient && (
                  <>
                    <button
                      onClick={handleStartEditPatient}
                      className="w-10 h-10 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
                      title="Editar Registro"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base font-bold">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={handleDeletePatientClick}
                      className="w-10 h-10 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
                      title="Excluir Registro"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base font-bold">
                        delete
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        {!activePatient ? (
          <div className="bg-white p-12 text-center rounded-xl border border-[#C5A059]/15 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            Carregando pacientes...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Patient Profile Summary Card */}
            {subTab === "timeline" && (
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-white border border-[#C5A059]/20 rounded-xl p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="flex flex-col items-center text-center relative z-10">
                    <label className="w-24 h-24 rounded-full overflow-hidden border-4 border-bg-base ring-2 ring-gold/25 shadow-md mb-4 bg-gold/10 flex items-center justify-center cursor-pointer group relative">
                      {activePatient.avatarUrl ? (
                        <img src={activePatient.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-primary font-bold group-hover:opacity-50 transition-opacity">
                          spa
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white">photo_camera</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && onUpdatePatient) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              if (e.target?.result) {
                                onUpdatePatient({
                                  ...activePatient,
                                  avatarUrl: e.target.result as string
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <h3 className="text-xl md:text-2xl font-extrabold text-primary-dark">
                      {activePatient.name}
                    </h3>

                  <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                    <div className="p-3.5 bg-bg-base/70 rounded-xl border border-[#C5A059]/10 text-left">
                      <p className="text-xs text-on-surface-variant uppercase font-extrabold tracking-wider">
                        Última Visita
                      </p>
                      <p className="text-sm font-extrabold text-primary-dark mt-1">
                        {activePatient.lastVisit}
                      </p>
                    </div>
                    <div className="p-3.5 bg-bg-base/70 rounded-xl border border-[#C5A059]/10 text-left">
                      <p className="text-xs text-on-surface-variant uppercase font-extrabold tracking-wider">
                        Inscrição
                      </p>
                      <span className="flex items-center gap-1.5 text-sm font-extrabold text-primary mt-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        {activePatient.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Fields */}
                <div className="mt-8 space-y-4 border-t border-[#C5A059]/15 pt-6">
                  <div className="flex items-center justify-between text-sm md:text-base leading-tight">
                    <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                      CPF
                    </span>
                    <span className="font-extrabold text-primary-dark">
                      {activePatient.cpf}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm md:text-base leading-tight">
                    <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                      Nascimento
                    </span>
                    <span className="font-extrabold text-primary-dark">
                      {activePatient.birthDate} ({activePatient.age} anos)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm md:text-base leading-tight">
                    <span className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                      WhatsApp
                    </span>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="font-extrabold text-[#775a19] hover:underline flex items-center gap-1 active:scale-95"
                    >
                      {activePatient.phone}
                      <span className="material-symbols-outlined text-xs">
                        open_in_new
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Practical Quick Actions */}
              <div className="bg-primary text-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#C5A059]/30">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#abbca5] mb-4">
                  Ações Rápidas de Prontuário
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSubTab("timeline");
                      setShowEvolutionForm(true);
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-smooth text-center active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined mb-1.5 text-gold text-lg">
                      history_edu
                    </span>
                    <span className="text-xs font-bold text-white">
                      Nova Evolução
                    </span>
                  </button>
                  <button
                    onClick={() => setShowPhotoUploadModal(true)}
                    className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-smooth text-center active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined mb-1.5 text-gold text-lg">
                      add_a_photo
                    </span>
                    <span className="text-xs font-bold text-white">
                      Anexar Foto
                    </span>
                  </button>
                  <button
                    onClick={() => setSubTab("clinical")}
                    className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-smooth text-center active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined mb-1.5 text-gold text-lg">
                      contract
                    </span>
                    <span className="text-xs font-bold text-white">
                      Consentimento
                    </span>
                  </button>
                  <button
                    onClick={() => setSubTab("info")}
                    className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-smooth text-center active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined mb-1.5 text-gold text-lg">
                      clinical_notes
                    </span>
                    <span className="text-xs font-bold text-white">
                      Resumo Clínico
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex flex-col items-center justify-center p-3 bg-[#C5A059] hover:bg-[#b08d4b] text-white rounded-xl transition-smooth text-center active:scale-95 cursor-pointer col-span-2 mt-1 shadow-lg shadow-[#C5A059]/20"
                  >
                    <span className="material-symbols-outlined mb-1.5 text-white text-lg">
                      print
                    </span>
                    <span className="text-xs font-bold text-white">
                      Imprimir Prontuário Completo
                    </span>
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* Right Column: Dynamic Tabs and Timelines */}
            <div className={`col-span-12 ${subTab === "timeline" ? "lg:col-span-8" : "lg:col-span-12"} space-y-6`}>
              {/* Tabs Selector Navigation */}
              <div className="bg-white border border-gold/15 rounded-2xl p-2.5 flex gap-2 overflow-x-auto hide-scrollbar shadow-sm">
                {(
                  [
                    { id: "timeline", label: "Linha do Tempo", icon: "route" },
                    { id: "info", label: "Dados Gerais", icon: "badge" },
                    {
                      id: "anamneses",
                      label: "Anamneses (Fichas)",
                      icon: "description",
                    },
                    {
                      id: "avaliacao",
                      label: "Avaliações (Pele / Corporal)",
                      icon: "health_and_safety",
                    },
                    {
                      id: "clinical",
                      label: "Assinatura & Consentimento",
                      icon: "signature",
                    },
                    {
                      id: "gallery",
                      label: "Antes & Depois",
                      icon: "add_photo_alternate",
                    },
                  ] as const
                ).map((tabObj) => (
                  <button
                    key={tabObj.id}
                    onClick={() => setSubTab(tabObj.id)}
                    className={`px-5 py-3 rounded-xl text-xs md:text-sm font-extrabold whitespace-nowrap flex items-center gap-2 transition-all active:scale-95 cursor-pointer
                  ${
                    subTab === tabObj.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-on-surface-variant hover:bg-bg-base hover:text-primary-dark"
                  }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {tabObj.icon}
                    </span>
                    {tabObj.label}
                  </button>
                ))}
              </div>

              {/* Timeline Tab */}
              {subTab === "timeline" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-bold text-primary-dark flex items-center gap-2">
                      <span className="material-symbols-outlined text-gold">
                        history
                      </span>
                      Evoluções Médicas e Estéticas
                    </h3>
                    <button
                      onClick={() => setShowEvolutionForm(!showEvolutionForm)}
                      className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08d4b] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-smooth"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">
                        add
                      </span>
                      {showEvolutionForm ? "Cancelar" : "Nova Evolução"}
                    </button>
                  </div>

                  {/* Inline Add Evolution Form */}
                  {showEvolutionForm && (
                    <form
                      onSubmit={handleCreateEvolution}
                      className="bg-white border border-gold/30 rounded-2xl p-6 shadow-md space-y-4 animate-in slide-in-from-top-4 duration-300"
                    >
                      <h4 className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gold/5 pb-2">
                        Registrar Novo Ensaio de Evolução
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-primary mb-2">
                            Procedimento Estético
                          </label>
                          <input
                            type="text"
                            required
                            value={evoTitle}
                            onChange={(e) => setEvoTitle(e.target.value)}
                            placeholder="Ex: Toxina Botulínica Corretiva"
                            className="w-full bg-bg-base/40 border border-gold/20 rounded-xl px-4.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-primary mb-2">
                            Categorias/Tags (separadas por vírgula)
                          </label>
                          <input
                            type="text"
                            value={evoTagInput}
                            onChange={(e) => setEvoTagInput(e.target.value)}
                            placeholder="Ex: Retoque, Harmonização, Facial"
                            className="w-full bg-bg-base/40 border border-gold/20 rounded-xl px-4.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-primary mb-2">
                            Observações e Prescrição Clínica
                          </label>
                          <textarea
                            required
                            value={evoDesc}
                            onChange={(e) => setEvoDesc(e.target.value)}
                            placeholder="Detalhamento do procedimento realizado, tolerância de dor, reações ou cuidados recomendados..."
                            rows={3}
                            className="w-full bg-bg-base/40 border border-gold/20 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowEvolutionForm(false)}
                          className="px-4 py-2 border border-gold/30 rounded-xl text-xs font-bold text-[#775a19]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#3d4c3a] text-white rounded-xl text-xs font-bold hover:shadow-md"
                        >
                          Salvar Anotação
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Evolution Lists */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gold/15">
                    {activePatient.evolutions.map((e, index) => (
                      <div key={e.id} className="relative select-text">
                        <div className="absolute -left-[20px] top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow-sm ring-4 ring-bg-base" />
                        <div className="bg-white border border-gold/15 rounded-2xl p-5 hover:border-gold/35 transition-smooth shadow-2xs">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                            <div>
                              <span className="text-[10px] font-extrabold text-gold-dark uppercase tracking-wider block">
                                {e.date}
                              </span>
                              <h4 className="font-extrabold text-[#1a1c1b] text-base">
                                {e.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary-dark rounded uppercase tracking-wider">
                                CONCLUÍDO
                              </span>
                              <button
                                onClick={() => handleDeleteEvolution(e.id)}
                                className="p-1 px-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                title="Remover Registro"
                              >
                                <span className="material-symbols-outlined text-[13px] font-bold leading-none">
                                  delete
                                </span>
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-4">
                            {e.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {e.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2.5 py-1 bg-bg-base text-[#1a1c1b]/70 border border-gold/10 rounded-lg text-xs"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Appointments History List */}
                  {(() => {
                    const patientAppointments = activePatient
                      ? appointments.filter((a) =>
                          a.patientName
                            .toLowerCase()
                            .includes(
                              activePatient.name.split(" ")[0].toLowerCase(),
                            ),
                        )
                      : [];
                    if (patientAppointments.length === 0) return null;

                    return (
                      <div className="pt-8 mt-8 border-t border-gold/15">
                        <h4 className="text-sm font-bold text-primary-dark flex items-center gap-2 mb-6 uppercase tracking-wider">
                          <span className="material-symbols-outlined text-gold">
                            calendar_month
                          </span>
                          Histórico de Sessões Agendadas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {patientAppointments.map((ap) => (
                            <div
                              key={ap.id}
                              className="bg-white border border-gold/10 p-4 rounded-xl flex items-start gap-4 hover:border-gold/30 transition-smooth"
                            >
                              <div className="p-3 bg-bg-base text-gold-dark rounded-xl h-full flex flex-col justify-center items-center font-mono">
                                <span className="text-xl font-bold">
                                  {ap.date.split("-")[2] ||
                                    ap.date.substring(0, 2)}
                                </span>
                                <span className="text-xs">
                                  {ap.date.split("-")[1]
                                    ? `${ap.date.split("-")[1]}/${ap.date.split("-")[0]}`
                                    : ""}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h5 className="text-sm font-bold text-primary-dark">
                                  {ap.procedure}
                                </h5>
                                <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1 mt-1">
                                  <span className="material-symbols-outlined text-[14px]">
                                    schedule
                                  </span>
                                  {ap.time}{" "}
                                  {ap.duration ? `• ${ap.duration}` : ""}
                                </p>
                                <div className="mt-2">
                                  <span
                                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${ap.status === "Confirmado" ? "bg-primary/10 text-primary-dark" : ap.status === "Finalizado" ? "bg-emerald-100 text-emerald-800" : ap.status === "Agendado" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}
                                  >
                                    {ap.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Anamneses Tab: Clínica e Head SPA */}
              {subTab === "anamneses" && (
                <div className="bg-white border border-gold/15 rounded-2xl p-6 relative overflow-hidden shadow-sm animate-in zoom-in-95 duration-150 text-left">
                  {/* Visual Supabase Integrator Accent */}
                  <div className="absolute top-0 right-0 p-3 bg-emerald-50 text-emerald-800 border-l border-b border-emerald-100 rounded-bl-xl flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Conexão Supabase Pronta
                  </div>

                  <div className="border-b border-gold/12 pb-4 mb-6">
                    <h3 className="text-xl font-extrabold text-primary-dark flex items-center gap-2">
                      <span className="material-symbols-outlined text-gold">
                        clinical_notes
                      </span>
                      Fichas de Anamneses Regulamentadas
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      Avaliações clínicas detalhadas para procedimentos de
                      estética facial e rituais do couro cabeludo (Head SPA).
                      Sincronizado dinamicamente.
                    </p>
                  </div>

                  {/* Sub-toggle picker for the two different anamneses */}
                  <div className="flex bg-bg-base p-1 rounded-xl border border-gold/10 max-w-md mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAnamneseSubSelected("clinica");
                        setIsEditingAnamnese(false);
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer
                    ${
                      activeAnamneseSubSelected === "clinica"
                        ? "bg-white text-primary-dark shadow-sm ring-1 ring-gold/10"
                        : "text-on-surface-variant hover:text-primary-dark"
                    }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        health_and_safety
                      </span>
                      Anamnese Clínica
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAnamneseSubSelected("headspa");
                        setIsEditingAnamnese(false);
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer
                    ${
                      activeAnamneseSubSelected === "headspa"
                        ? "bg-white text-primary-dark shadow-sm ring-1 ring-gold/10"
                        : "text-on-surface-variant hover:text-primary-dark"
                    }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        spa
                      </span>
                      Anamnese Head SPA
                    </button>
                  </div>

                  {!isEditingAnamnese ? (
                    /* Read Only Mode View */
                    <div className="space-y-6">
                      {activeAnamneseSubSelected === "clinica" ? (
                        /* Display Anamnese Clínica answers */
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-gold/5 p-3 rounded-xl border border-gold/12">
                            <span className="text-[10px] font-bold text-gold-dark tracking-wider uppercase">
                              Ficha Clínica Ativa • {activePatient.name}
                            </span>
                            <span className="text-2xs font-bold font-mono text-on-surface-variant bg-white px-2 py-0.5 rounded border border-gold/10">
                              Tabela: {activeClinicaAnamnese ? "clinica_anamnese" : "anamnese_clinica"}
                            </span>
                          </div>

                          {!activePatient.anamneseClinica && !activeClinicaAnamnese ? (
                            <div className="p-8 text-center text-on-surface-variant bg-bg-base/40 rounded-xl border border-gold/10 border-dashed">
                              <span className="material-symbols-outlined text-4xl mb-2 text-gold/50">
                                description
                              </span>
                              <p className="text-sm font-semibold">
                                Nenhuma ficha registrada no banco de dados para
                                este paciente.
                              </p>
                              <p className="text-xs mt-1 mb-4">
                                O paciente deve preencher e enviar o formulário
                                online de Anamnese Clínica.
                              </p>
                              
                              {/* Manual Linker Dropdown - Helps debug if DB actually has records */}
                              {clinicaAnamneses && clinicaAnamneses.length > 0 ? (
                                <div className="mt-4 p-4 border border-gold/20 rounded-xl bg-white text-left inline-block w-full max-w-md">
                                  <label className="text-xs font-bold text-primary-dark mb-2 block">
                                    Encontramos {clinicaAnamneses.length} ficha(s) totais na base, mas nenhuma com nome/CPF correspondente. Vincular manualmente?
                                  </label>
                                  <select 
                                    className="w-full bg-bg-base border border-gold/20 rounded-md px-3 py-2 text-xs font-bold text-primary-dark"
                                    onChange={(e) => {
                                      const selectedId = e.target.value;
                                      if (selectedId) {
                                        const selectedRecord = clinicaAnamneses.find(a => a.id === selectedId);
                                        if (selectedRecord && onUpdatePatient) {
                                          onUpdatePatient({
                                            ...activePatient,
                                            cpf: selectedRecord.cpf || activePatient.cpf,
                                            phone: selectedRecord.contato || activePatient.phone,
                                          });
                                          alert("Ficha vinculada! Atualizamos o número de contato do paciente para forçar o vínculo.");
                                        }
                                      }
                                    }}
                                  >
                                    <option value="">-- Selecionar ficha para forçar vínculo --</option>
                                    {clinicaAnamneses.map((ca, idx) => (
                                      <option key={ca.id || idx} value={ca.id}>
                                        {ca.nome} (Criada em: {ca.created_at ? new Date(ca.created_at).toLocaleDateString() : 'N/A'}) {ca.cpf ? ` - CPF: ${ca.cpf}` : ''}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <div className="mt-2 text-[10px] text-red-500 font-bold bg-red-50 py-1 px-3 rounded-full inline-block border border-red-100">
                                  A base de dados (clinica_anamnese) retornou 0 fichas.
                                </div>
                              )}
                            </div>
                          ) : (
                            (() => {
                              const anamneseData = activeClinicaAnamnese || activePatient.anamneseClinica || {};
                              
                              const excludeFields = [
                                "id", "paciente_id", "patient_id", "created_at", "updated_at", "criado_em", "updatedat", "createdat", "rg", "bairro", "cidade", "uf", "estado", "formulario_origem", "email", "endereco"
                              ];

                              const allEntries = Object.entries(anamneseData)
                                .filter(([key, value]) => {
                                  if (excludeFields.includes(key.toLowerCase())) return false;
                                  if (value === null || value === undefined || value === "") return false;
                                  return typeof value === "string" || typeof value === "boolean" || typeof value === "number";
                                });

                              const personalKeys = [
                                "nome", "nome_completo", "contato", "phone", "telefone", "whatsapp", "email", "e_mail", "cpf", "data_nascimento", "nascimento", "idade", "profissao", "endereco"
                              ];

                              const personalData = allEntries.filter(([key]) => personalKeys.includes(key.toLowerCase()));
                              const clinicalData = allEntries.filter(([key]) => !personalKeys.includes(key.toLowerCase()));

                              const dateVal = anamneseData.created_at || anamneseData.criado_em;
                              const formattedDate = dateVal 
                                ? new Date(dateVal).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })
                                : "Data de submissão não registrada";

                              const renderValue = (val: any) => {
                                if (typeof val === "boolean") {
                                  return val ? (
                                    <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold-dark border border-gold/20 px-2.5 py-1 rounded-full text-2xs font-extrabold w-fit">
                                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                                      Sim
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 border border-gray-100 px-2.5 py-1 rounded-full text-2xs font-medium w-fit">
                                      Não
                                    </span>
                                  );
                                }

                                const valStr = String(val).trim();
                                const valLower = valStr.toLowerCase();

                                if (valLower === "sim" || valLower === "s" || valLower === "yes" || valLower === "true") {
                                  return (
                                    <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold-dark border border-gold/20 px-2.5 py-1 rounded-full text-2xs font-extrabold w-fit">
                                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                                      Sim
                                    </span>
                                  );
                                }
                                if (valLower === "nao" || valLower === "não" || valLower === "n" || valLower === "no" || valLower === "false") {
                                  return (
                                    <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 border border-gray-100 px-2.5 py-1 rounded-full text-2xs font-medium w-fit">
                                      Não
                                    </span>
                                  );
                                }

                                return (
                                  <p className="text-xs font-extrabold text-primary-dark leading-relaxed whitespace-pre-line break-words">
                                    {valStr}
                                  </p>
                                );
                              };

                              const isFullWidthField = (key: string, val: any) => {
                                const k = key.toLowerCase();
                                const valStr = String(val);
                                if (valStr.length > 55) return true;
                                if (
                                  k.includes("observac") ||
                                  k.includes("conduta") ||
                                  k.includes("historico") ||
                                  k.includes("cirurgia") ||
                                  k.includes("medic") ||
                                  k.includes("alerg") ||
                                  k.includes("gastro") ||
                                  k.includes("queixa") ||
                                  k.includes("objetivo") ||
                                  k.includes("rotina") ||
                                  k.includes("cosmet")
                                ) {
                                  return true;
                                }
                                return false;
                              };

                              return (
                                <div className="space-y-6 text-left">
                                  {/* Info bar with dynamic gradients */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-gradient-to-r from-gold/8 via-gold/3 to-transparent border border-gold/15 shadow-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="material-symbols-outlined text-gold font-bold">verified_user</span>
                                      <span className="text-xs font-bold text-primary-dark">
                                        Ficha importada com sucesso da base de dados online
                                      </span>
                                    </div>
                                    <span className="text-2xs font-bold font-mono text-gold-dark bg-white px-2.5 py-1 rounded-full border border-gold/15">
                                      {formattedDate}
                                    </span>
                                  </div>

                                  {/* Section 2: Full Clinical Questionnaire (Unreduced / Dynamic Bento Grid) */}
                                  <div className="space-y-3">
                                    <h4 className="text-[10px] font-extrabold text-gold-dark tracking-widest uppercase flex items-center gap-1.5">
                                      <span className="material-symbols-outlined text-sm">assignment</span>
                                      Respostas Completas do Questionário Clínico
                                    </h4>
                                    
                                    {clinicalData.length === 0 ? (
                                      <div className="p-4 bg-bg-base/40 border border-gold/10 border-dashed rounded-xl text-center text-xs text-on-surface-variant">
                                        Sem respostas clínicas extras salvas para este questionário.
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {clinicalData.map(([key, value]) => {
                                          const label = cleanLabel(key);
                                          const fullWidth = isFullWidthField(key, value);
                                          const isObservation = key.toLowerCase().includes("observac") || key.toLowerCase().includes("conduta");
                                          
                                          return (
                                            <div
                                              key={key}
                                              className={`p-4 bg-gradient-to-br from-white/95 to-gold/[0.01] border ${
                                                isObservation 
                                                  ? "border-amber-300/30 bg-amber-50/20" 
                                                  : "border-gold/15"
                                              } rounded-2xl shadow-2xs relative overflow-hidden transition-smooth hover:shadow-xs hover:border-gold/30 ${
                                                fullWidth ? "col-span-1 md:col-span-2" : ""
                                              }`}
                                            >
                                              {/* Beautiful subtle transparent highlight */}
                                              <div className="absolute -right-6 -top-6 w-16 h-16 bg-gradient-to-br from-gold/5 to-transparent rounded-full pointer-events-none blur-xl" />
                                              
                                              <label className={`text-[10px] font-extrabold uppercase tracking-wide block mb-2 ${
                                                isObservation ? "text-amber-800" : "text-on-surface-variant"
                                              }`}>
                                                {label}
                                              </label>
                                              
                                              <div className={isObservation ? "text-amber-950 italic" : "text-primary-dark"}>
                                                {renderValue(value)}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()
                          )}
                        </div>
                      ) : (
                        /* Display Anamnese Head SPA answers */
                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-gold/5 p-3 rounded-xl border border-gold/12">
                            <span className="text-[10px] font-bold text-gold-dark tracking-wider uppercase">
                              Ficha Capilar Head SPA • {activePatient.name}
                            </span>
                            <span className="text-2xs font-bold font-mono text-on-surface-variant bg-white px-2 py-0.5 rounded border border-gold/10">
                              Tabela: head_spa_anamnese
                            </span>
                          </div>

                          {!activeHeadSpaAnamnese ? (
                            <div className="p-8 text-center text-on-surface-variant bg-bg-base/40 rounded-xl border border-gold/10 border-dashed">
                              <span className="material-symbols-outlined text-4xl mb-2 text-gold/50">
                                description
                              </span>
                              <p className="text-sm font-semibold">
                                Nenhuma ficha registrada no banco de dados para
                                este paciente.
                              </p>
                              <p className="text-xs mt-1">
                                O paciente deve preencher e enviar o formulário
                                online de Head SPA.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-bg-base/40 border border-gold/5 rounded-xl">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                  Diagnóstico do Couro Cabeludo
                                </label>
                                <p className="text-xs font-bold text-primary-dark leading-relaxed flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-gold"></span>
                                  {activeHeadSpaAnamnese.tipo_cabelo ||
                                    "Não informado"}
                                </p>
                              </div>

                              <div className="p-4 bg-bg-base/40 border border-gold/5 rounded-xl">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                  Rotina de Cabelo (Hidratação/Lavagem)
                                </label>
                                <p className="text-xs font-bold text-primary-dark leading-relaxed">
                                  {activeHeadSpaAnamnese.rotina_cabelo ||
                                    "Não informada"}
                                </p>
                              </div>

                              <div className="p-4 bg-bg-base/40 border border-gold/5 rounded-xl">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                  Apresenta Queda Excessiva ou Alopecia?
                                </label>
                                <p className="text-xs font-bold text-primary-dark leading-relaxed">
                                  {activeHeadSpaAnamnese.queda_cabelo
                                    ? `Sim. ${activeHeadSpaAnamnese.queda_cabelo_detalhes || ""}`
                                    : "Não relatado."}
                                </p>
                              </div>

                              <div className="p-4 bg-bg-base/40 border border-gold/5 rounded-xl">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                  Química Capilar (Coloração/Escova)?
                                </label>
                                <p className="text-xs font-bold text-primary-dark leading-relaxed">
                                  {activeHeadSpaAnamnese.quimica_capilar
                                    ? `Sim. ${activeHeadSpaAnamnese.quimica_capilar_qual || ""}`
                                    : "Livre de químicas."}
                                </p>
                              </div>

                              <div className="p-4 bg-bg-base/40 border border-gold/5 rounded-xl">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                  Feridas ou Irritação no Couro Cabeludo?
                                </label>
                                <p className="text-xs font-bold text-primary-dark leading-relaxed">
                                  {activeHeadSpaAnamnese.feridas_couro_cabeludo
                                    ? "Sim, possui."
                                    : "Não."}
                                </p>
                              </div>

                              <div className="p-4 bg-bg-base/40 border border-gold/5 rounded-xl">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                  Uso de Apliques, Tranças ou Dreads?
                                </label>
                                <p className="text-xs font-bold text-primary-dark leading-relaxed">
                                  {activeHeadSpaAnamnese.apliques_trancas_dreads
                                    ? `Sim. ${activeHeadSpaAnamnese.apliques_tipo || ""}`
                                    : "Não."}
                                </p>
                              </div>

                              <div className="p-4 bg-bg-base/40 border border-gold/5 rounded-xl col-span-1 md:col-span-2">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                  Restrições ou Medicações Regulares
                                </label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {activeHeadSpaAnamnese.alergia && (
                                    <span className="px-2 py-1 bg-red-50 text-red-700 font-bold text-2xs rounded border border-red-200">
                                      Alérgico:{" "}
                                      {activeHeadSpaAnamnese.alergia_qual}
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.medicacao && (
                                    <span className="px-2 py-1 bg-primary/10 text-primary-dark font-bold text-2xs rounded border border-primary/20">
                                      Meds:{" "}
                                      {activeHeadSpaAnamnese.medicacao_qual}
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.comorbidade && (
                                    <span className="px-2 py-1 bg-amber-50 text-amber-700 font-bold text-2xs rounded border border-amber-200">
                                      Condição:{" "}
                                      {activeHeadSpaAnamnese.comorbidade_qual}
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.gestante_amamentando && (
                                    <span className="px-2 py-1 bg-purple-50 text-purple-700 font-bold text-2xs rounded border border-purple-200">
                                      Gestante/Lactante:{" "}
                                      {activeHeadSpaAnamnese.gestante_periodo}
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.pos_operatorio_oncologico && (
                                    <span className="px-2 py-1 bg-rose-50 text-rose-700 font-bold text-2xs rounded border border-rose-200">
                                      Pós-Op Oncológico
                                    </span>
                                  )}
                                  {!activeHeadSpaAnamnese.alergia &&
                                    !activeHeadSpaAnamnese.medicacao &&
                                    !activeHeadSpaAnamnese.comorbidade &&
                                    !activeHeadSpaAnamnese.gestante_amamentando &&
                                    !activeHeadSpaAnamnese.pos_operatorio_oncologico && (
                                      <span className="text-xs font-medium text-on-surface-variant">
                                        Nenhuma restrição assinalada.
                                      </span>
                                    )}
                                </div>
                              </div>

                              <div className="p-4 bg-bg-base/40 border border-gold/5 rounded-xl col-span-1 md:col-span-2">
                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                                  Estado Emocional / Estilo de Vida
                                </label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {activeHeadSpaAnamnese.ansiedade && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-2xs rounded border border-slate-200">
                                      Ansiedade
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.estresse_elevado && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-2xs rounded border border-slate-200">
                                      Estresse Elevado
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.compulsao_alimentar && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-2xs rounded border border-slate-200">
                                      Compulsão Alimentar
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.sobrecarregado_esgotamento && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-2xs rounded border border-slate-200">
                                      Esgotamento / Burnout
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.dor_cabeca_bruxismo && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-2xs rounded border border-slate-200">
                                      Dor de Cabeça / Bruxismo
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.busca_relaxamento && (
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-bold text-2xs rounded border border-emerald-200">
                                      Busca Relaxamento Profundo
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.consome_alcool_fuma && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-2xs rounded border border-slate-200">
                                      Consome Álcool/Fuma
                                    </span>
                                  )}
                                  {activeHeadSpaAnamnese.vicio && (
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-2xs rounded border border-slate-200">
                                      Vício: {activeHeadSpaAnamnese.vicio_qual}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="p-4 bg-emerald-50/40 border border-emerald-200/40 rounded-xl col-span-1 md:col-span-2">
                                <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                                  Relação Espiritualidade & Natureza
                                </label>
                                <p className="text-xs font-medium text-emerald-950 leading-relaxed italic">
                                  &ldquo;
                                  {activeHeadSpaAnamnese.relacao_natureza_espiritualidade ||
                                    "Não preenchido."}
                                  &rdquo;
                                </p>
                              </div>

                              {(activeHeadSpaAnamnese.observacao_cabelo ||
                                activeHeadSpaAnamnese.observacoes_adicionais) && (
                                <div className="p-4 bg-amber-50/40 border border-amber-200/20 rounded-xl col-span-1 md:col-span-2">
                                  <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                                    Observações Livres da Paciente
                                  </label>
                                  <p className="text-xs font-medium text-amber-950 leading-relaxed italic">
                                    &ldquo;
                                    {
                                      activeHeadSpaAnamnese.observacao_cabelo
                                    }{" "}
                                    {
                                      activeHeadSpaAnamnese.observacoes_adicionais
                                    }
                                    &rdquo;
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action panel */}
                      <div className="pt-4 border-t border-gold/10 flex justify-between items-center flex-wrap gap-3">
                        <p className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-gold">
                            info
                          </span>
                          Campos formatados para linkagem no backend com
                          Supabase ou query externa.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsEditingAnamnese(true)}
                          className="px-5 py-2.5 gradient-gold-button text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:shadow-md cursor-pointer transition-all active:scale-95 border-none outline-none"
                        >
                          <span className="material-symbols-outlined text-sm">
                            edit_document
                          </span>
                          Editar Respostas Atuais
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode Form View */
                    <form
                      onSubmit={handleSaveAnamneseSubmit}
                      className="space-y-6"
                    >
                      <div className="bg-yellow-50/50 border border-yellow-200/50 p-4 rounded-xl">
                        <p className="text-xs text-amber-800 font-bold flex items-center gap-1.5 leading-relaxed text-left">
                          <span className="material-symbols-outlined text-base">
                            warning
                          </span>
                          Você está editando o prontuário de{" "}
                          {activePatient.name}. Alterações salvam e atualizam a
                          visualização do painel no banco.
                        </p>
                      </div>

                      {activeAnamneseSubSelected === "clinica" ? (
                        /* Editing Clinical form */
                        <div className="space-y-4 text-left">
                          <h4 className="text-xs font-extrabold text-gold-dark tracking-wider uppercase border-b border-gold/10 pb-2">
                            Editar Anamnese Clínica
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                                Distúrbios Gastrointestinais
                              </label>
                              <input
                                type="text"
                                value={cliGastro}
                                onChange={(e) => setCliGastro(e.target.value)}
                                placeholder="Frequência de gastrites, refluxos, etc."
                                className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                                Alergias Clínicas (Medicamentos/Estética)
                              </label>
                              <input
                                type="text"
                                value={cliAlergias}
                                onChange={(e) => setCliAlergias(e.target.value)}
                                placeholder="Ex: Alergia a sulfa, látex, fragrâncias..."
                                className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                                Medicamentos de Uso Contínuo
                              </label>
                              <input
                                type="text"
                                value={cliMedicamentos}
                                onChange={(e) =>
                                  setCliMedicamentos(e.target.value)
                                }
                                placeholder="Ex: Anti-hipertensivo, corticoides..."
                                className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                                Gestante ou Lactante?
                              </label>
                              <input
                                type="text"
                                value={cliGestante}
                                onChange={(e) => setCliGestante(e.target.value)}
                                placeholder="Ex: Não, ou Sim (meses)..."
                                className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                                Cirurgias e Procedimentos Estéticos Prévios
                              </label>
                              <input
                                type="text"
                                value={cliCirurgias}
                                onChange={(e) =>
                                  setCliCirurgias(e.target.value)
                                }
                                placeholder="Destaque liftings, preenchedores, implantes odontológicos recentes..."
                                className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                                Histórico de Pele (Rosácea, Queloides, Acne
                                Crônica)
                              </label>
                              <input
                                type="text"
                                value={cliPele}
                                onChange={(e) => setCliPele(e.target.value)}
                                placeholder="Frequência e histórico de irritabilidade, cicatrização espessa..."
                                className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                                Observações Clínicas Adicionais / Alertas de Cabine
                              </label>
                              <textarea
                                value={cliObs}
                                onChange={(e) => setCliObs(e.target.value)}
                                placeholder="Outros apontamentos para a Dra. responsável durante o tratamento..."
                                rows={3}
                                className="w-full bg-bg-base border border-gold/15 rounded-xl p-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Editing Head SPA form - Disabled because it reads from head_spa_anamnese */
                        <div className="space-y-4 text-left p-6 bg-gold/5 rounded-xl border border-gold/15">
                          <div className="flex flex-col items-center justify-center text-center">
                            <span className="material-symbols-outlined text-4xl text-gold mb-2">
                              cloud_sync
                            </span>
                            <h4 className="text-sm font-extrabold text-gold-dark tracking-wider uppercase mb-2">
                              Sincronização Externa Ativa
                            </h4>
                            <p className="text-xs text-on-surface-variant max-w-md">
                              A Ficha Capilar de Head SPA é preenchida
                              diretamente pelo paciente através do formulário
                              externo e conectada automaticamente a este
                              prontuário via banco de dados (tabela{" "}
                              <code>head_spa_anamnese</code>).
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-3 border-t border-gold/10">
                        <button
                          type="button"
                          onClick={() => setIsEditingAnamnese(false)}
                          className="px-5 py-2.5 border border-gold/20 rounded-xl text-xs font-bold cursor-pointer hover:bg-bg-base"
                        >
                          Cancelar Edição
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#3d4c3a] text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">
                            cloud_sync
                          </span>
                          Gravar no Prontuário
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Professional Observations Editor (Always Visible) */}
                  <div className="mt-8 bg-blue-50/50 border border-blue-200 p-6 rounded-xl relative">
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3 bg-blue-100 text-blue-800 border border-blue-200 text-[9px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[12px]">
                        medical_services
                      </span>
                      Anotação do Especialista (
                      {activeAnamneseSubSelected === "clinica"
                        ? "Clínica"
                        : "Head SPA"}
                      )
                    </div>

                    <div className="mb-3">
                      <h4 className="text-xs font-bold text-blue-900 tracking-wider uppercase">
                        Avaliação / Diagnóstico Clínico
                      </h4>
                      <p className="text-[10px] text-blue-800/60 font-medium">
                        Espaço liberado para a profissional anexar considerações
                        exclusivas.
                      </p>
                    </div>

                    <textarea
                      value={
                        activeAnamneseSubSelected === "clinica"
                          ? editAnamneseObsClinica
                          : editAnamneseObsHeadSpa
                      }
                      onChange={(e) =>
                        activeAnamneseSubSelected === "clinica"
                          ? setEditAnamneseObsClinica(e.target.value)
                          : setEditAnamneseObsHeadSpa(e.target.value)
                      }
                      placeholder={
                        activeAnamneseSubSelected === "clinica"
                          ? "Ex: Paciente apresenta rosácea grau II na região zigomática..."
                          : "Ex: Apresenta couro cabeludo com leve dermatite seborreica..."
                      }
                      rows={4}
                      className="w-full bg-white/70 border border-blue-200 rounded-xl p-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3 placeholder:border-blue-900/20 shadow-sm"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveObservationOnly}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[11px] font-bold shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          save
                        </span>
                        Salvar Anotação Individual
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Tab */}
              {subTab === "info" && (
                <div className="bg-white border border-gold/15 rounded-2xl p-6.5 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-gold">
                          badge
                        </span>
                        Ficha de Dados Cadastrais e Clínicos
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Conformidade LGPD para clínicas médicas.
                      </p>
                    </div>
                    {!isEditingInfo && (
                      <button
                        onClick={handleOpenEditInfo}
                        className="px-4 py-2 border border-gold/20 rounded-xl text-xs font-bold hover:bg-gold/5 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          edit
                        </span>
                        Editar
                      </button>
                    )}
                  </div>

                  {!isEditingInfo ? (
                    (() => {
                      const clinica = activeClinicaAnamnese as any;
                      const headspa = activeHeadSpaAnamnese as any;
                      const dynRg = activePatient.rg || clinica?.rg || headspa?.rg || "";
                      const dynEmail = activePatient.email || clinica?.email || headspa?.email || "";
                      const dynEndereco = activePatient.endereco || clinica?.endereco || headspa?.endereco || "";
                      const dynBairro = activePatient.bairro || clinica?.bairro || headspa?.bairro || "";
                      const dynCidade = activePatient.cidade || clinica?.cidade || headspa?.cidade || "";
                      const dynUf = activePatient.uf || clinica?.uf || headspa?.uf || "";
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gold/5 text-sm cursor-default">
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              Nome Completo
                            </label>
                            <p className="font-bold text-primary-dark">
                              {activePatient.name}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              Telefone / WhatsApp
                            </label>
                            <p className="font-semibold text-primary">
                              {activePatient.phone}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              Data Nascimento
                            </label>
                            <p className="font-semibold text-primary">
                              {activePatient.birthDate}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              CPF
                            </label>
                            <p className="font-semibold text-primary">
                              {activePatient.cpf}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              RG
                            </label>
                            <p className="font-semibold text-primary">
                              {dynRg || "Não informado"}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              E-mail
                            </label>
                            <p className="font-semibold text-primary">
                              {dynEmail || "Não informado"}
                            </p>
                          </div>
                          <div className="lg:col-span-2">
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              Endereço (Rua/Av)
                            </label>
                            <p className="font-semibold text-primary truncate">
                              {dynEndereco || "Não informado"}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              Bairro
                            </label>
                            <p className="font-semibold text-primary">
                              {dynBairro || "Não informado"}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              Cidade / UF
                            </label>
                            <p className="font-semibold text-primary">
                              {dynCidade ? `${dynCidade} - ${dynUf}` : "Não informado"}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              Convênios e Seguros
                            </label>
                            <p className="font-semibold text-primary">
                              {activePatient.convenios || "Particular"}
                            </p>
                          </div>
                          <div className="md:col-span-2 lg:col-span-3">
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1 font-sans">
                              Condições Médicas / Alergias
                            </label>
                            <p className="font-semibold text-primary">
                              {activePatient.condicoesMedicas ||
                                "Nenhuma condição relatada."}
                            </p>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="pt-4 border-t border-gold/5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            Nome Completo
                          </label>
                          <input
                            type="text"
                            value={editInfoName}
                            onChange={(e) => setEditInfoName(e.target.value)}
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            Telefone / WhatsApp
                          </label>
                          <input
                            type="text"
                            value={editInfoPhone}
                            onChange={(e) => setEditInfoPhone(e.target.value)}
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            Data Nascimento (YYYY-MM-DD)
                          </label>
                          <input
                            type="text"
                            value={editInfoBirth}
                            onChange={(e) => setEditInfoBirth(e.target.value)}
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            CPF
                          </label>
                          <input
                            type="text"
                            value={editInfoCpf}
                            onChange={(e) => setEditInfoCpf(e.target.value)}
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            Convênios e Seguros
                          </label>
                          <input
                            type="text"
                            value={editInfoConvenios}
                            onChange={(e) =>
                              setEditInfoConvenios(e.target.value)
                            }
                            placeholder="Ex: Particular, Bradesco Saúde Top..."
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            Condições Médicas / Alergias
                          </label>
                          <input
                            type="text"
                            value={editInfoCondicoes}
                            onChange={(e) =>
                              setEditInfoCondicoes(e.target.value)
                            }
                            placeholder="Ex: Alergia a iodo..."
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            RG
                          </label>
                          <input
                            type="text"
                            value={editInfoRg}
                            onChange={(e) => setEditInfoRg(e.target.value)}
                            placeholder="Ex: 50.123.456-7"
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            E-mail
                          </label>
                          <input
                            type="email"
                            value={editInfoEmail}
                            onChange={(e) => setEditInfoEmail(e.target.value)}
                            placeholder="Ex: paciente@email.com"
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            Endereço (Rua/Av)
                          </label>
                          <input
                            type="text"
                            value={editInfoEndereco}
                            onChange={(e) => setEditInfoEndereco(e.target.value)}
                            placeholder="Ex: Rua das Flores, 123"
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                            Bairro
                          </label>
                          <input
                            type="text"
                            value={editInfoBairro}
                            onChange={(e) => setEditInfoBairro(e.target.value)}
                            placeholder="Ex: Centro"
                            className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              Cidade
                            </label>
                            <input
                              type="text"
                              value={editInfoCidade}
                              onChange={(e) => setEditInfoCidade(e.target.value)}
                              placeholder="Ex: São Paulo"
                              className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark"
                            />
                          </div>
                          <div className="w-20">
                            <label className="text-[10px] text-on-surface-variant uppercase font-extrabold block mb-1">
                              UF
                            </label>
                            <input
                              type="text"
                              value={editInfoUf}
                              onChange={(e) => setEditInfoUf(e.target.value)}
                              placeholder="Ex: SP"
                              className="w-full bg-bg-base border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary-dark uppercase"
                              maxLength={2}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          onClick={() => setIsEditingInfo(false)}
                          className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold hover:bg-bg-base cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveInfo}
                          className="px-6 py-2 gradient-gold-button text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer"
                        >
                          Salvar Dados
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Avaliações Clínicas e Métricas (Pele / Corporal) */}
              {subTab === "avaliacao" && (
                <div className="space-y-6 animate-in zoom-in-95 duration-150">
                  {/* Internal Subtabs Selector */}
                  <div className="flex border-b border-gold/10 gap-2 mb-4 bg-white p-1 rounded-xl shadow-sm max-w-md">
                    <button
                      onClick={() => setActiveAvaliacaoSubTab("pele")}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeAvaliacaoSubTab === "pele"
                          ? "bg-primary-dark text-white shadow-sm"
                          : "text-on-surface-variant hover:bg-bg-base"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">face</span>
                      Avaliação Pele Facial
                    </button>
                    <button
                      onClick={() => setActiveAvaliacaoSubTab("corporal")}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeAvaliacaoSubTab === "corporal"
                          ? "bg-primary-dark text-white shadow-sm"
                          : "text-on-surface-variant hover:bg-bg-base"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">fitness_center</span>
                      Avaliação Corporal / Medidas
                    </button>
                  </div>

                  {activeAvaliacaoSubTab === "pele" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-x-auto">
                      {/* Left: Skin Checkboxes & Forms */}
                      <div className="lg:col-span-7 bg-white border border-gold/15 rounded-2xl p-6 space-y-6 shadow-sm">
                        <div className="border-b border-gold/10 pb-3 flex justify-between items-center">
                          <div>
                            <h3 className="text-base font-extrabold text-primary-dark flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-gold">face</span>
                              AVALIAÇÃO DA PELE FACIAL
                            </h3>
                            <p className="text-[10px] text-on-surface-variant">
                              Assinale as alterações detectadas no exame presencial.
                            </p>
                          </div>
                        </div>

                        {/* Pigmentares */}
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Manchas Pigmentares</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {Object.keys(facPigmentares).map((field) => (
                              <label
                                key={field}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer select-none transition ${
                                  facPigmentares[field as keyof typeof facPigmentares]
                                    ? "bg-primary-dark/5 border-primary-dark text-primary-dark font-bold text-[11px]"
                                    : "border-gold/15 text-on-surface hover:bg-[#FAF9F5] text-[11px]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="accent-primary-dark"
                                  checked={facPigmentares[field as keyof typeof facPigmentares]}
                                  onChange={(e) =>
                                    setFacPigmentares({
                                      ...facPigmentares,
                                      [field]: e.target.checked,
                                    })
                                  }
                                />
                                <span className="capitalize">{field}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Alterações Vasculares */}
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Manchas Vasculares</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                            {Object.keys(facVasculares).map((field) => (
                              <label
                                key={field}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer select-none transition ${
                                  facVasculares[field as keyof typeof facVasculares]
                                    ? "bg-primary-dark/5 border-primary-dark text-primary-dark font-bold text-[11px]"
                                    : "border-gold/15 text-on-surface hover:bg-[#FAF9F5] text-[11px]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="accent-primary-dark"
                                  checked={facVasculares[field as keyof typeof facVasculares]}
                                  onChange={(e) =>
                                    setFacVasculares({
                                      ...facVasculares,
                                      [field]: e.target.checked,
                                    })
                                  }
                                />
                                <span className="capitalize">{field === "teleangectasias" ? "Teleang." : field}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Formações Sólidas */}
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Formações Sólidas</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {Object.keys(facSolidas).map((field) => (
                              <label
                                key={field}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer select-none transition ${
                                  facSolidas[field as keyof typeof facSolidas]
                                    ? "bg-primary-dark/5 border-primary-dark text-primary-dark font-bold text-[11px]"
                                    : "border-gold/15 text-on-surface hover:bg-[#FAF9F5] text-[11px]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="accent-primary-dark"
                                  checked={facSolidas[field as keyof typeof facSolidas]}
                                  onChange={(e) =>
                                    setFacSolidas({
                                      ...facSolidas,
                                      [field]: e.target.checked,
                                    })
                                  }
                                />
                                <span className="capitalize">{field}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Lesões de Pele */}
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Lesões de Pele</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                            {Object.keys(facLesoes).map((field) => (
                              <label
                                key={field}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer select-none transition ${
                                  facLesoes[field as keyof typeof facLesoes]
                                    ? "bg-primary-dark/5 border-primary-dark text-primary-dark font-bold text-[11px]"
                                    : "border-gold/15 text-on-surface hover:bg-[#FAF9F5] text-[11px]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="accent-primary-dark"
                                  checked={facLesoes[field as keyof typeof facLesoes]}
                                  onChange={(e) =>
                                    setFacLesoes({
                                      ...facLesoes,
                                      [field]: e.target.checked,
                                    })
                                  }
                                />
                                <span className="capitalize">{field === "hiperqueratose" ? "Hiperquer." : field}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Sequelas */}
                        <div className="space-y-2.5">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Sequelas</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.keys(facSequelas).map((field) => (
                              <label
                                key={field}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer select-none transition ${
                                  facSequelas[field as keyof typeof facSequelas]
                                    ? "bg-primary-dark/5 border-primary-dark text-primary-dark font-bold text-[11px]"
                                    : "border-gold/15 text-on-surface hover:bg-[#FAF9F5] text-[11px]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="accent-primary-dark"
                                  checked={facSequelas[field as keyof typeof facSequelas]}
                                  onChange={(e) =>
                                    setFacSequelas({
                                      ...facSequelas,
                                      [field]: e.target.checked,
                                    })
                                  }
                                />
                                <span className="capitalize">{field}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Outros */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-gold uppercase tracking-wider block">Outros Achados ou Detalhes</label>
                          <input
                            type="text"
                            placeholder="Descreva aqui outros achados ou anotações..."
                            value={facOutros}
                            onChange={(e) => setFacOutros(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-gold/15 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-gold"
                          />
                        </div>

                        {/* Classificação Cutânea Rádio Grids */}
                        <div className="space-y-4 pt-3 border-t border-gold/10">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Classificação do Tipo Cutâneo</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Hidratação */}
                            <div>
                              <span className="text-xs font-bold text-primary-dark block mb-2">Hidratação</span>
                              <div className="flex gap-2">
                                {["Normal", "Desidratada"].map((h) => (
                                  <button
                                    key={h}
                                    type="button"
                                    onClick={() => setFacTipoCutaneo({ ...facTipoCutaneo, hidratacao: h as any })}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                                      facTipoCutaneo.hidratacao === h
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "border-gold/15 text-on-surface hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {h}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Oleosidade */}
                            <div>
                              <span className="text-xs font-bold text-primary-dark block mb-2">Oleosidade</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {["Alipica", "Lipídica", "Seborreica", "Normal"].map((o) => (
                                  <button
                                    key={o}
                                    type="button"
                                    onClick={() => setFacTipoCutaneo({ ...facTipoCutaneo, oleosidade: o as any })}
                                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition ${
                                      facTipoCutaneo.oleosidade === o
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "border-gold/15 text-on-surface hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {o}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Espessura */}
                            <div>
                              <span className="text-xs font-bold text-primary-dark block mb-2">Espessura</span>
                              <div className="flex gap-1.5">
                                {["Espessa", "Fina", "Normal"].map((e) => (
                                  <button
                                    key={e}
                                    type="button"
                                    onClick={() => setFacTipoCutaneo({ ...facTipoCutaneo, espessura: e as any })}
                                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold border transition ${
                                      facTipoCutaneo.espessura === e
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "border-gold/15 text-on-surface hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {e}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Fototipo */}
                            <div>
                              <span className="text-xs font-bold text-primary-dark block mb-2">Fototipo Cutâneo</span>
                              <div className="flex gap-1">
                                {["I", "II", "III", "IV", "V"].map((f) => (
                                  <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFacTipoCutaneo({ ...facTipoCutaneo, fototipo: f as any })}
                                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                      facTipoCutaneo.fototipo === f
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "border-gold/15 text-on-surface hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {f}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Características */}
                        <div className="space-y-2.5 pt-3 border-t border-gold/10">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Características da Pele</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { id: "semRugas", label: "Sem Rugas" },
                              { id: "rugasDinamicas", label: "Rugas Dinâmicas" },
                              { id: "rugasEstaticas", label: "Rugas Estáticas" },
                              { id: "sulcos", label: "Sulcos" },
                              { id: "flacidez", label: "Flacidez" },
                              { id: "fotoenvelhecimento", label: "Fotoenvelhecimento" },
                            ].map((item) => (
                              <label
                                key={item.id}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer select-none transition ${
                                  facCaracteristicas[item.id as keyof typeof facCaracteristicas]
                                    ? "bg-primary-dark/5 border-primary-dark text-primary-dark font-bold text-[11px]"
                                    : "border-gold/15 text-on-surface hover:bg-[#FAF9F5] text-[11px]"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="accent-primary-dark"
                                  checked={facCaracteristicas[item.id as keyof typeof facCaracteristicas]}
                                  onChange={(e) =>
                                    setFacCaracteristicas({
                                      ...facCaracteristicas,
                                      [item.id]: e.target.checked,
                                    })
                                  }
                                />
                                <span>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Escala de Glogau */}
                        <div className="space-y-2 pt-3 border-t border-gold/10">
                          <span className="text-xs font-extrabold text-gold uppercase tracking-wider block">Escala de Glogau</span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {["Tipo 1", "Tipo 2", "Tipo 3", "Tipo 4"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setFacEscalaGlogau(type as any)}
                                className={`py-2 rounded-xl text-xs font-bold border transition ${
                                  facEscalaGlogau === type
                                    ? "bg-primary-dark border-primary-dark text-white shadow-sm"
                                    : "border-gold/15 text-on-surface hover:bg-[#FAF9F5]"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sugestão de Tratamento */}
                        <div className="space-y-2 pt-3 border-t border-gold/10">
                          <label className="text-xs font-extrabold text-gold uppercase tracking-wider block">Sugestão de Tratamento / Protocolo</label>
                          <textarea
                            rows={3}
                            placeholder="Recomendações técnicas, home care e tratamentos sugeridos..."
                            value={facSugestaoTratamento}
                            onChange={(e) => setFacSugestaoTratamento(e.target.value)}
                            className="w-full bg-[#FAF9F5] border border-gold/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold leading-relaxed"
                          />
                        </div>

                        {/* Save Action */}
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={handleSaveFacialAssessment}
                            className="px-6 py-2.5 gradient-gold-button text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer transition flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-sm">save</span>
                            Salvar Avaliação Pele Facial
                          </button>
                        </div>
                      </div>

                      {/* Right: Face Mapping Diagram */}
                      <div className="lg:col-span-5 bg-white border border-gold/15 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="border-b border-gold/10 pb-3 mb-4">
                            <h3 className="text-base font-extrabold text-primary-dark flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-gold">map</span>
                              MAPEAMENTO FACIAL INTERATIVO
                            </h3>
                            <p className="text-[10px] text-on-surface-variant leading-normal">
                              Selecione uma alteração abaixo e <strong>clique no diagrama da face</strong> para pinar marcadores clínicos.
                            </p>
                          </div>

                          {/* Marker Type Selector */}
                          <div className="space-y-2 mb-4">
                            <span className="text-xs font-bold text-primary-dark block mb-1">Selecione o Marcador Clínico:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { name: "Melasma", colorClass: "bg-orange-500 border-orange-500 text-white" },
                                { name: "Acne", colorClass: "bg-red-500 border-red-500 text-white" },
                                { name: "Flacidez", colorClass: "bg-purple-500 border-purple-500 text-white" },
                                { name: "Ruga", colorClass: "bg-yellow-500 border-yellow-500 text-white" },
                                { name: "Cicatriz", colorClass: "bg-blue-500 border-blue-500 text-white" },
                                { name: "Outro", colorClass: "bg-amber-700 border-amber-700 text-white" },
                              ].map((m) => (
                                <button
                                  key={m.name}
                                  onClick={() => setSelectedFaceMapType(m.name)}
                                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                                    selectedFaceMapType === m.name
                                      ? m.colorClass + " shadow-sm scale-105"
                                      : "border-gold/20 text-on-surface-variant hover:bg-[#FAF9F5]"
                                  }`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  {m.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Face Canvas */}
                          <div
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
                              const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));
                              const note = prompt("Digite uma anotação opcional para esta demarcação clínica:") || "";
                              setFaceMarkers([...faceMarkers, { x, y, type: selectedFaceMapType, note }]);
                            }}
                            className="relative w-full border border-gold/15 rounded-xl overflow-hidden cursor-crosshair bg-[#FAF9F5] select-none p-1"
                          >
                            <svg viewBox="0 0 400 240" className="w-full h-auto text-gold/30 fill-none stroke-current stroke-1 pb-1">
                              {/* Left Face */}
                              <g transform="translate(10, 0)">
                                {/* Head Outline */}
                                <path d="M 100,30 C 60,30 50,60 50,110 C 50,160 80,210 100,210 C 120,210 150,160 150,110 C 150,60 140,30 100,30 Z" />
                                {/* Neck & Shoulders */}
                                <path d="M 80,205 C 80,225 60,230 40,235 M 120,205 C 120,225 140,230 160,235" />
                                {/* Ears */}
                                <path d="M 50,95 C 43,95 43,120 50,120 M 150,95 C 157,95 157,120 150,120" />
                                {/* Eyes */}
                                <path d="M 72,95 C 77,90 85,90 90,95 M 72,95 C 77,98 85,98 90,95" />
                                <path d="M 110,95 C 115,90 123,90 128,95 M 110,95 C 115,98 123,98 128,95" />
                                {/* Eyebrows */}
                                <path d="M 68,88 Q 80,80 92,88 M 108,88 Q 120,80 132,88" />
                                {/* Nose */}
                                <path d="M 100,95 L 100,135 C 100,140 95,142 95,145 C 100,148 105,145 105,145" />
                                {/* Mouth */}
                                <path d="M 82,165 Q 100,175 118,165 Q 100,157 82,165" />
                                {/* Hair outline */}
                                <path d="M 55,80 C 70,55 130,55 145,80" />
                              </g>
                              {/* Right Face (Side profile or similar) */}
                              <g transform="translate(190, 0)">
                                {/* Head Outline */}
                                <path d="M 100,30 C 60,30 50,60 50,110 C 50,160 80,210 100,210 C 120,210 150,160 150,110 C 150,60 140,30 100,30 Z" />
                                {/* Neck & Shoulders */}
                                <path d="M 80,205 C 80,225 60,230 40,235 M 120,205 C 120,225 140,230 160,235" />
                                {/* Ears */}
                                <path d="M 50,95 C 43,95 43,120 50,120 M 150,95 C 157,95 157,120 150,120" />
                                {/* Eyes */}
                                <path d="M 72,95 C 77,90 85,90 90,95 M 72,95 C 77,98 85,98 90,95" />
                                <path d="M 110,95 C 115,90 123,90 128,95 M 110,95 C 115,98 123,98 128,95" />
                                {/* Eyebrows */}
                                <path d="M 68,88 Q 80,80 92,88 M 108,88 Q 120,80 132,88" />
                                {/* Nose */}
                                <path d="M 100,95 L 100,135 C 100,140 95,142 95,145 C 100,148 105,145 105,145" />
                                {/* Mouth */}
                                <path d="M 82,165 Q 100,175 118,165 Q 100,157 82,165" />
                                {/* Hair outline */}
                                <path d="M 55,80 C 70,55 130,55 145,80" />
                              </g>
                            </svg>

                            {faceMarkers.map((marker, idx) => {
                              let bgCol = "bg-red-500 shadow-red-500/50";
                              if (marker.type === "Melasma") bgCol = "bg-orange-500 shadow-orange-500/50";
                              else if (marker.type === "Flacidez") bgCol = "bg-purple-500 shadow-purple-500/50";
                              else if (marker.type === "Ruga") bgCol = "bg-yellow-500 shadow-yellow-500/50";
                              else if (marker.type === "Cicatriz") bgCol = "bg-blue-500 shadow-blue-500/50";

                              return (
                                <div
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFaceMarkers(faceMarkers.filter((_, i) => i !== idx));
                                  }}
                                  className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white cursor-pointer group shadow-md ${bgCol} -translate-x-1/2 -translate-y-1/2`}
                                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                                >
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-5 bg-slate-900/95 text-white text-[9px] px-2 py-1 rounded shadow-lg scale-0 group-hover:scale-100 transition whitespace-nowrap z-30 font-sans leading-none pointer-events-none">
                                    <span className="font-bold uppercase tracking-wider block mb-0.5">{marker.type}</span>
                                    {marker.note && <span className="text-slate-300 italic">{marker.note}</span>}
                                    <span className="block mt-1 text-[8px] text-red-300 font-bold">Clique para remover</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Summary Legend */}
                        <div className="mt-4 bg-[#FAF9F5] rounded-xl border border-gold/10 p-3 text-[11px] text-on-surface-variant flex flex-col gap-2">
                          <span className="font-bold text-primary-dark">Lista de Marcadores ({faceMarkers.length}):</span>
                          {faceMarkers.length === 0 ? (
                            <p className="italic">Nenhum marcador adicionado. Clique acima para diagnosticar.</p>
                          ) : (
                            <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 font-sans">
                              {faceMarkers.map((marker, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-light-gray/5 pb-1">
                                  <span className="flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${
                                      marker.type === "Melasma" ? "bg-orange-500" :
                                      marker.type === "Flacidez" ? "bg-purple-500" :
                                      marker.type === "Ruga" ? "bg-yellow-500" :
                                      marker.type === "Cicatriz" ? "bg-blue-500" : "bg-red-500"
                                    }`} />
                                    <strong className="text-primary-dark">{marker.type}:</strong> {marker.note || "Sem anotação"}
                                  </span>
                                  <button
                                    onClick={() => setFaceMarkers(faceMarkers.filter((_, idx) => idx !== i))}
                                    className="text-red-500 hover:text-red-700 text-[10px] font-bold cursor-pointer"
                                  >
                                    Remover
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-x-auto">
                      {/* Left: Body form & Measures Table */}
                      <div className="lg:col-span-7 bg-white border border-gold/15 rounded-2xl p-6 space-y-6 shadow-sm">
                        <div className="border-b border-gold/10 pb-3 flex justify-between items-center">
                          <div>
                            <h3 className="text-base font-extrabold text-primary-dark flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-gold">fitness_center</span>
                              AVALIAÇÃO CORPORAL & MÉTRIAS
                            </h3>
                            <p className="text-[10px] text-on-surface-variant">
                              Insira as medidas do paciente (em cm) e as características estéticas corporais.
                            </p>
                          </div>
                        </div>

                        {/* Measures Table */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Tabela de Medidas Clínicas</h4>
                          <div className="overflow-x-auto border border-gold/10 rounded-xl bg-white shadow-inner">
                            <table className="w-full text-left border-collapse text-[11px]">
                              <thead>
                                <tr className="bg-[#FAF9F5] border-b border-gold/10 text-primary-dark font-extrabold text-[10px] uppercase tracking-wider">
                                  <th className="p-2.5">Região Corporal</th>
                                  <th className="p-2.5">Medida (cm aprox.)</th>
                                  <th className="p-2.5">Data Início</th>
                                  <th className="p-2.5">Data Final / Retorno</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(corpMedidas).map(([key, data]) => {
                                  const regionNames: { [key: string]: string } = {
                                    bracoD: "Braço Direito (D)",
                                    bracoE: "Braço Esquerdo (E)",
                                    bustoTorax: "Busto / Tórax",
                                    estomago: "Estômago",
                                    cintura: "Cintura",
                                    barriga: "Barriga / Abdômen",
                                    quadril: "Quadril",
                                    culote: "Culote",
                                    coxaSuperior: "Coxa Superior",
                                    coxaInferior: "Coxa Inferior",
                                  };
                                  return (
                                    <tr key={key} className="border-b border-gold/5 hover:bg-[#FAF9F5]/30">
                                      <td className="p-2 font-bold text-primary-dark">{regionNames[key] || key}</td>
                                      <td className="p-2">
                                        <input
                                          type="text"
                                          placeholder="Ex: 32"
                                          value={data.medida}
                                          onChange={(e) =>
                                            setCorpMedidas({
                                              ...corpMedidas,
                                              [key]: { ...data, medida: e.target.value },
                                            })
                                          }
                                          className="w-full bg-[#FAF9F5] border border-gold/15 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-gold"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <input
                                          type="date"
                                          value={data.inicioDate}
                                          onChange={(e) =>
                                            setCorpMedidas({
                                              ...corpMedidas,
                                              [key]: { ...data, inicioDate: e.target.value },
                                            })
                                          }
                                          className="w-full bg-[#FAF9F5] border border-gold/15 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-gold"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <input
                                          type="date"
                                          value={data.finalDate}
                                          onChange={(e) =>
                                            setCorpMedidas({
                                              ...corpMedidas,
                                              [key]: { ...data, finalDate: e.target.value },
                                            })
                                          }
                                          className="w-full bg-[#FAF9F5] border border-gold/15 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-gold"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Characteristics Form */}
                        <div className="space-y-4 pt-3 border-t border-gold/10">
                          <h4 className="text-xs font-extrabold text-gold uppercase tracking-wider">Características Clínicas Corporais</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Distribuição de gordura corporal */}
                            <div>
                              <span className="text-xs font-bold text-primary-dark block mb-2">Distribuição de Gordura Corporal</span>
                              <div className="flex gap-2">
                                {["Ginóide (pera)", "Andróide (maça)", "Normal"].map((d) => (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => setCorpDistribuicaoGordura(d as any)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                                      corpDistribuicaoGordura === d
                                        ? "bg-primary-dark border-primary-dark text-white shadow-sm"
                                        : "border-gold/15 text-on-surface hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Celulite (grau e regiao) */}
                            <div className="p-3.5 bg-[#FAF9F5] border border-gold/10 rounded-2xl space-y-2">
                              <span className="text-xs font-bold text-primary-dark block">Anomalia Celulite</span>
                              <div className="flex flex-wrap gap-1">
                                {["grau1", "grau2", "grau3", "grau4", "grau5"].map((grau, i) => (
                                  <label
                                    key={grau}
                                    className={`px-2.5 py-1.5 border rounded-lg cursor-pointer transition select-none flex items-center gap-1.5 text-[10px] font-bold ${
                                      corpCelulite[grau as keyof typeof corpCelulite]
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "bg-white border-gold/15 text-on-surface-variant hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!corpCelulite[grau as keyof typeof corpCelulite]}
                                      onChange={(e) =>
                                        setCorpCelulite({
                                          ...corpCelulite,
                                          [grau]: e.target.checked,
                                        })
                                      }
                                      className="hidden"
                                    />
                                    G{i + 1}
                                  </label>
                                ))}
                              </div>
                              <input
                                type="text"
                                placeholder="Região da celulite (Ex: Glúteo)"
                                value={corpCelulite.regiao}
                                onChange={(e) => setCorpCelulite({ ...corpCelulite, regiao: e.target.value })}
                                className="w-full bg-white border border-gold/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-gold"
                              />
                            </div>

                            {/* Estrias */}
                            <div className="p-3.5 bg-[#FAF9F5] border border-gold/10 rounded-2xl space-y-2">
                              <span className="text-xs font-bold text-primary-dark block">Estrias</span>
                              <div className="flex gap-1.5">
                                {[
                                  { id: "ausentes", label: "Ausente" },
                                  { id: "rubras", label: "Rubras (vermelhas)" },
                                  { id: "albas", label: "Albas (brancas)" },
                                ].map((item) => (
                                  <label
                                    key={item.id}
                                    className={`flex-1 py-1.5 border rounded-lg cursor-pointer text-center select-none text-[10px] font-bold transition flex items-center justify-center gap-1.5 ${
                                      corpEstrias[item.id as keyof typeof corpEstrias]
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "bg-white border-gold/15 text-on-surface hover:bg-slate-55"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="accent-primary-dark hidden"
                                      checked={!!corpEstrias[item.id as keyof typeof corpEstrias]}
                                      onChange={(e) =>
                                        setCorpEstrias({
                                          ...corpEstrias,
                                          [item.id]: e.target.checked,
                                        })
                                      }
                                    />
                                    {item.label}
                                  </label>
                                ))}
                              </div>
                              <input
                                type="text"
                                placeholder="Região das estrias (Ex: Coxa)"
                                value={corpEstrias.regiao}
                                onChange={(e) => setCorpEstrias({ ...corpEstrias, regiao: e.target.value })}
                                className="w-full bg-white border border-gold/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-gold"
                              />
                            </div>

                            {/* Flacidez Muscular */}
                            <div>
                              <span className="text-xs font-bold text-primary-dark block mb-2">Flacidez Muscular</span>
                              <div className="flex gap-2">
                                {["Ausente", "Presente"].map((m) => (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={() => setCorpFlacidezMuscular(m as any)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                                      corpFlacidezMuscular === m
                                        ? "bg-primary-dark border-primary-dark text-white shadow-sm"
                                        : "border-gold/15 text-on-surface hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {m}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Flacidez Tissular */}
                            <div className="p-3.5 bg-[#FAF9F5] border border-gold/10 rounded-2xl space-y-2">
                              <span className="text-xs font-bold text-primary-dark block">Flacidez Tissular (Pele)</span>
                              <div className="flex gap-2">
                                {["Ausente", "Presente"].map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setCorpFlacidezTissular(t as any)}
                                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                                      corpFlacidezTissular === t
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "bg-white border-gold/15 text-[#5F5236] hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                placeholder="Região da flacidez tissular (Ex: Abdômen)"
                                value={corpFlacidezTissularRegiao}
                                onChange={(e) => setCorpFlacidezTissularRegiao(e.target.value)}
                                className="w-full bg-white border border-gold/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-gold"
                              />
                            </div>

                            {/* Edema */}
                            <div className="p-3.5 bg-[#FAF9F5] border border-gold/10 rounded-2xl space-y-2">
                              <span className="text-xs font-bold text-primary-dark block">Edema</span>
                              <div className="flex gap-2">
                                {["Ausente", "Presente"].map((e) => (
                                  <button
                                    key={e}
                                    type="button"
                                    onClick={() => setCorpEdema(e as any)}
                                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                                      corpEdema === e
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "bg-white border-gold/15 text-[#5F5236] hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {e}
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                placeholder="Descreva os edemas detectados..."
                                value={corpEdemaDescricao}
                                onChange={(e) => setCorpEdemaDescricao(e.target.value)}
                                className="w-full bg-white border border-gold/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-gold"
                              />
                            </div>

                            {/* Fibrose */}
                            <div className="p-3.5 bg-[#FAF9F5] border border-gold/10 rounded-2xl space-y-2">
                              <span className="text-xs font-bold text-primary-dark block">Fibrose (Pós-operatório)</span>
                              <div className="flex gap-2">
                                {["Ausente", "Presente"].map((f) => (
                                  <button
                                    key={f}
                                    type="button"
                                    onClick={() => setCorpFibrose(f as any)}
                                    className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                                      corpFibrose === f
                                        ? "bg-primary-dark border-primary-dark text-white"
                                        : "bg-white border-gold/15 text-[#5F5236] hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {f}
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                placeholder="Região da fibrose (Ex: Pós-lipo)"
                                value={corpFibroseRegiao}
                                onChange={(e) => setCorpFibroseRegiao(e.target.value)}
                                className="w-full bg-white border border-gold/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-gold"
                              />
                            </div>

                            {/* Gordura Localizada */}
                            <div>
                              <span className="text-xs font-bold text-primary-dark block mb-2">Gordura Localizada</span>
                              <div className="flex gap-2">
                                {["Compacta", "Flácida"].map((g) => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => setCorpGorduraLocalizada(g as any)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                                      corpGorduraLocalizada === g
                                        ? "bg-primary-dark border-primary-dark text-white shadow-sm"
                                        : "border-gold/15 text-on-surface hover:bg-[#FAF9F5]"
                                    }`}
                                  >
                                    {g}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Save Action */}
                        <div className="flex justify-end pt-2 border-t border-gold/10">
                          <button
                            onClick={handleSaveBodyAssessment}
                            className="px-6 py-2.5 gradient-gold-button text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer transition flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-sm">save</span>
                            Salvar Avaliação Corporal
                          </button>
                        </div>
                      </div>

                      {/* Right: Body Mapping Interactive */}
                      <div className="lg:col-span-5 bg-white border border-gold/15 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="border-b border-gold/10 pb-3 mb-4">
                            <h3 className="text-base font-extrabold text-primary-dark flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-gold">map</span>
                              MAPEAMENTO CORPORAL INTERATIVO
                            </h3>
                            <p className="text-[10px] text-on-surface-variant leading-normal">
                              Selecione uma alteração abaixo e <strong>clique no diagrama do corpo</strong> para criar demarcações estéticas.
                            </p>
                          </div>

                          {/* Body Marker Type Selector */}
                          <div className="space-y-2 mb-4">
                            <span className="text-xs font-bold text-primary-dark block mb-1">Selecione o Marcador Corporal:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { name: "Celulite", colorClass: "bg-yellow-500 border-yellow-500 text-white" },
                                { name: "Gordura Localizada", colorClass: "bg-orange-500 border-orange-500 text-white" },
                                { name: "Estria", colorClass: "bg-purple-500 border-purple-500 text-white" },
                                { name: "Flacidez", colorClass: "bg-pink-500 border-pink-500 text-white" },
                                { name: "Fibrose", colorClass: "bg-blue-500 border-blue-500 text-white" },
                                { name: "Edema", colorClass: "bg-teal-500 border-teal-500 text-white" },
                              ].map((m) => (
                                <button
                                  key={m.name}
                                  onClick={() => setSelectedBodyMapType(m.name)}
                                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                                    selectedBodyMapType === m.name
                                      ? m.colorClass + " shadow-sm scale-105"
                                      : "border-gold/20 text-on-surface-variant hover:bg-[#FAF9F5]"
                                  }`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  {m.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Interactive Body Canvas element */}
                          <div
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
                              const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));
                              const note = prompt("Digite uma anotação opcional para esta demarcação corporal:") || "";
                              setBodyMarkers([...bodyMarkers, { x, y, type: selectedBodyMapType, note }]);
                            }}
                            className="relative w-full border border-gold/15 rounded-xl overflow-hidden cursor-crosshair bg-[#FAF9F5] select-none p-1"
                          >
                            <svg viewBox="0 0 540 280" className="w-full h-auto text-gold/30 fill-none stroke-current stroke-1 pb-1">
                              {/* Front View */}
                              <g transform="translate(10, 0)">
                                <text x="90" y="25" textAnchor="middle" className="text-[10px] font-bold fill-gold/60 stroke-none">Frente</text>
                                {/* Head */}
                                <ellipse cx="90" cy="50" rx="14" ry="18" />
                                {/* Neck */}
                                <path d="M 85,68 L 85,76 M 95,68 L 95,76" />
                                {/* Shoulders & Torso */}
                                <path d="M 55,80 C 65,76 115,76 125,80 L 120,110 C 115,130 115,145 120,165 C 118,175 110,185 105,188 L 105,255 M 55,80 L 60,110 C 65,130 65,145 60,165 C 62,175 70,185 75,188 L 75,255" />
                                {/* Breasts outline */}
                                <path d="M 75,112 C 80,123 90,123 90,112 M 105,112 C 100,123 90,123 90,112" />
                                {/* Arms */}
                                <path d="M 55,80 C 45,100 45,130 48,165 M 125,80 C 135,100 135,130 132,165" />
                                {/* Crotch line */}
                                <path d="M 90,185 L 90,195" />
                                {/* Leg gap */}
                                <path d="M 85,195 C 87,220 87,240 85,255 M 95,195 C 93,220 93,240 95,255" />
                                {/* Feet */}
                                <path d="M 75,255 L 70,260 L 85,260 Z M 105,255 L 110,260 L 95,260 Z" />
                              </g>

                              {/* Back View */}
                              <g transform="translate(180, 0)">
                                <text x="90" y="25" textAnchor="middle" className="text-[10px] font-bold fill-gold/60 stroke-none">Costas</text>
                                {/* Head */}
                                <ellipse cx="90" cy="50" rx="14" ry="18" />
                                {/* Hair */}
                                <path d="M 76,50 C 76,64 104,64 104,50" />
                                {/* Neck */}
                                <path d="M 85,68 L 85,76 M 95,68 L 95,76" />
                                {/* Shoulders & Torso */}
                                <path d="M 55,80 C 65,76 115,76 125,80 L 120,110 C 115,130 115,145 120,165 C 118,175 110,185 105,188 L 105,255 M 55,80 L 60,110 C 65,130 65,145 60,165 C 62,175 70,185 75,188 L 75,255" />
                                {/* Spine line */}
                                <path d="M 90,76 L 90,165" />
                                {/* Buttocks line */}
                                <path d="M 90,185 C 80,185 80,196 90,196 C 100,196 100,185 90,185" />
                                {/* Arms */}
                                <path d="M 55,80 C 45,100 45,130 48,165 M 125,80 C 135,100 135,130 132,165" />
                                {/* Leg gap */}
                                <path d="M 85,195 C 87,220 87,240 85,255 M 95,195 C 93,220 93,240 95,255" />
                                {/* Feet */}
                                <path d="M 75,255 L 70,260 L 85,260 Z M 105,255 L 110,260 L 95,260 Z" />
                              </g>

                              {/* Side View */}
                              <g transform="translate(350, 0)">
                                <text x="90" y="25" textAnchor="middle" className="text-[10px] font-bold fill-gold/60 stroke-none">Lateral</text>
                                {/* Head profile */}
                                <path d="M 90,32 C 80,32 75,40 75,50 C 75,60 85,68 90,68 C 95,68 98,60 98,50 Z" />
                                {/* Nose profile */}
                                <path d="M 75,48 H 71 L 75,52" />
                                {/* Neck */}
                                <path d="M 82,68 L 82,76 M 92,68 L 92,76" />
                                {/* Body profile containing breast and butt curve */}
                                <path d="M 82,76 C 70,95 65,110 65,125 C 65,140 75,150 75,170 C 75,180 82,190 85,194 L 85,255 L 94,255 L 96,194 Q 112,180 112,165 Q 112,150 94,140 C 94,110 92,90 92,76 Z" />
                                {/* Breast curve */}
                                <path d="M 75,98 C 62,105 62,118 75,120" />
                                {/* Buttocks curve */}
                                <path d="M 94,168 C 108,172 108,188 94,192" />
                                {/* Feet */}
                                <path d="M 85,255 L 80,260 H 98 L 94,255" />
                              </g>
                            </svg>

                            {bodyMarkers.map((marker, idx) => {
                              let bgCol = "bg-red-500 shadow-red-500/50";
                              if (marker.type === "Celulite") bgCol = "bg-yellow-500 shadow-yellow-500/50";
                              else if (marker.type === "Gordura Localizada") bgCol = "bg-orange-500 shadow-orange-500/50";
                              else if (marker.type === "Estria") bgCol = "bg-purple-500 shadow-purple-500/50";
                              else if (marker.type === "Flacidez") bgCol = "bg-pink-500 shadow-pink-500/50";
                              else if (marker.type === "Fibrose") bgCol = "bg-blue-500 shadow-blue-500/50";
                              else if (marker.type === "Edema") bgCol = "bg-teal-500 shadow-teal-500/50";

                              return (
                                <div
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBodyMarkers(bodyMarkers.filter((_, i) => i !== idx));
                                  }}
                                  className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white cursor-pointer group shadow-md ${bgCol} -translate-x-1/2 -translate-y-1/2`}
                                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                                >
                                  <div className="absolute left-1/2 -translate-x-1/2 bottom-5 bg-slate-900/95 text-white text-[9px] px-2 py-1 rounded shadow-lg scale-0 group-hover:scale-100 transition whitespace-nowrap z-30 font-sans leading-none pointer-events-none">
                                    <span className="font-bold uppercase tracking-wider block mb-0.5">{marker.type}</span>
                                    {marker.note && <span className="text-slate-300 italic">{marker.note}</span>}
                                    <span className="block mt-1 text-[8px] text-red-300 font-bold">Clique para remover</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Summary Legend */}
                        <div className="mt-4 bg-[#FAF9F5] rounded-xl border border-gold/10 p-3 text-[11px] text-on-surface-variant flex flex-col gap-2">
                          <span className="font-bold text-primary-dark">Lista de Marcadores Corporais ({bodyMarkers.length}):</span>
                          {bodyMarkers.length === 0 ? (
                            <p className="italic">Nenhum marcador adicionado. Clique acima para diagnosticar.</p>
                          ) : (
                            <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 font-sans">
                              {bodyMarkers.map((marker, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-light-gray/5 pb-1">
                                  <span className="flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${
                                      marker.type === "Celulite" ? "bg-yellow-500" :
                                      marker.type === "Gordura Localizada" ? "bg-orange-500" :
                                      marker.type === "Estria" ? "bg-purple-500" :
                                      marker.type === "Flacidez" ? "bg-pink-500" :
                                      marker.type === "Fibrose" ? "bg-blue-500" : "bg-teal-500"
                                    }`} />
                                    <strong className="text-primary-dark">{marker.type}:</strong> {marker.note || "Sem anotação"}
                                  </span>
                                  <button
                                    onClick={() => setBodyMarkers(bodyMarkers.filter((_, idx) => idx !== i))}
                                    className="text-red-500 hover:text-red-700 text-[10px] font-bold cursor-pointer"
                                  >
                                    Remover
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Assinatura / Consentimento */}
              {subTab === "clinical" && (
                <div className="bg-white border border-gold/15 rounded-2xl p-6.5 space-y-6 animate-in zoom-in-95 duration-150">
                  <div className="border-b border-gold/10 pb-4">
                    <h3 className="text-lg font-bold text-primary-dark flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-gold">
                        signature
                      </span>
                      Assinatura Eletrônica de Termo de Consentimento
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Consentimento legal para a realização de procedimentos
                      estéticos avançados.
                    </p>
                  </div>

                  {!consentSigned ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-bg-base/70 border border-gold/10 text-xs leading-relaxed text-on-surface-variant">
                        <p className="font-bold text-primary-dark mb-2">
                          UPLOAD DE TERMO ASSINADO
                        </p>
                        <p className="mb-2">
                          Selecione o documento físico escaneado ou PDF contendo
                          o termo de responsabilidade assinado pelo cliente.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="rounded text-primary focus:ring-primary border-gold/30 mt-0.5"
                          />
                          <span className="text-xs font-semibold text-on-surface-variant">
                            Declaro que o arquivo original está armazenado
                            fisicamente e confirmo a integridade do upload.
                          </span>
                        </label>

                        <div>
                          <label className="block text-xs font-bold text-primary mb-1">
                            Upload do Arquivo (PC/Celular)
                          </label>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                try {
                                  const base64Str = await fileToBase64(
                                    e.target.files[0],
                                  );
                                  setSignerName(base64Str); // reusing signerName state to hold the base64 string
                                } catch (err) {
                                  triggerToast("Erro ao processar arquivo.");
                                }
                              }
                            }}
                            className="w-full sm:w-80 bg-bg-base/40 border border-gold/20 rounded-xl px-4 py-2 text-xs font-bold file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!termsAccepted || !signerName.trim()) return;

                            if (activePatient && onUpdatePatient) {
                              onUpdatePatient({
                                ...activePatient,
                                signature: signerName, // Storing the file upload base64 here
                              });
                            }
                            setConsentSigned(true);
                            triggerToast(
                              "Termo de consentimento anexado com sucesso!",
                            );
                          }}
                          disabled={!termsAccepted || !signerName.trim()}
                          className="px-6 py-2.5 bg-[#3d4c3a] disabled:bg-on-surface-variant/20 disabled:text-on-surface-variant/50 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:shadow-md transition-all active:scale-95"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">
                            upload_file
                          </span>
                          {signerName.trim()
                            ? "Confirmar e Anexar Documento"
                            : "Selecione um Arquivo"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-[#3d4c3a]/5 border border-[#3d4c3a]/20 text-center space-y-4 animate-in zoom-in-95 duration-200">
                      <span className="material-symbols-outlined text-4xl text-primary font-extrabold">
                        request_quote
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-primary-dark">
                          Termo de Consentimento Anexado!
                        </h4>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">
                          O arquivo de assinatura do paciente está salvo na base
                          de dados. Registrado em{" "}
                          {new Date().toLocaleDateString("pt-BR")} via
                          Benessere-CRM.
                        </p>
                      </div>
                      {activePatient?.signature && (
                        <div className="mt-2">
                          {activePatient.signature.startsWith("data:image/") ? (
                            <img
                              src={activePatient.signature}
                              alt="Consentimento Assinado"
                              className="h-64 object-contain mx-auto rounded-xl border border-gold/20"
                            />
                          ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/20 rounded-xl bg-white text-xs font-bold text-primary-dark">
                              <span className="material-symbols-outlined text-green-600">
                                task
                              </span>
                              Documento PDF Armazenado
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          resetConsent();
                          if (activePatient && onUpdatePatient) {
                            onUpdatePatient({
                              ...activePatient,
                              signature: undefined,
                            });
                          }
                        }}
                        className="px-5 py-2 text-2xs bg-red-600/10 text-red-700 font-extrabold rounded-lg hover:bg-red-600/20 active:scale-95 transition-smooth mt-4"
                      >
                        Remover Arquivo Anexado
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Galeria Antes / Depois */}
              {subTab === "gallery" && (
                <div className="bg-white border border-gold/15 rounded-2xl p-6.5 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary-dark flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-gold">
                          gallery_thumbnail
                        </span>
                        Galeria Antes & Depois
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1 font-medium">
                        Evolução visual cronológica do progresso estético.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPhotoUploadModal(true)}
                      className="px-4 py-2 gradient-gold-button text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-sm">
                        add_photo_alternate
                      </span>
                      Registrar Foto Técnica
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {activePatient.photos.map((p) => (
                      <div
                        key={p.id}
                        className="aspect-square rounded-xl overflow-hidden border border-gold/10 relative group bg-bg-base"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          src={p.url}
                          alt={p.type}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div
                          className={`absolute bottom-2 left-2 px-2.5 py-0.5 text-[8px] font-bold rounded shadow-sm uppercase tracking-widest
                        ${p.type === "DEPOIS" ? "bg-[#775a19] text-white" : "bg-primary text-white"}`}
                        >
                          {p.type}
                        </div>
                        <button
                          onClick={() => handleDeletePhoto(p.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer"
                          title="Remover Foto"
                        >
                          <span className="material-symbols-outlined text-[10px]">
                            delete
                          </span>
                        </button>
                      </div>
                    ))}

                    {/* Add Simulator Box */}
                    <button
                      onClick={() => setShowPhotoUploadModal(true)}
                      className="aspect-square rounded-xl border-2 border-dashed border-gold/20 flex flex-col items-center justify-center text-on-surface-variant hover:bg-bg-base/30 hover:border-gold transition-colors"
                    >
                      <span className="material-symbols-outlined text-3xl text-gold-dark">
                        add_photo_alternate
                      </span>
                      <span className="text-[10px] font-bold mt-2">
                        ADICIONAR
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Creational/Add Patient Modal sheet */}
        {showCreatePatientModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4 text-left font-sans">
              <div className="flex justify-between items-center border-b border-gold/12 pb-3">
                <h3 className="text-lg font-bold text-primary-dark">
                  Novo Cadastro de Paciente
                </h3>
                <button
                  onClick={() => setShowCreatePatientModal(false)}
                  className="text-on-surface-variant hover:text-red-500 font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreatePatientSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Bezerra Cavalcanti"
                    value={newPtName}
                    onChange={(e) => setNewPtName(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                      Fidelização Tier
                    </label>
                    <select
                      value={newPtTier}
                      onChange={(e) => setNewPtTier(e.target.value as any)}
                      className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    >
                      <option value="CLIENTE DIAMANTE">Cliente Diamante</option>
                      <option value="Paciente VIP">Paciente VIP</option>
                      <option value="Paciente Mensal">Paciente Mensal</option>
                      <option value="Paciente New Gen">Paciente New Gen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                      Status Atendimento
                    </label>
                    <select
                      value={newPtStatus}
                      onChange={(e) => setNewPtStatus(e.target.value as any)}
                      className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                      C.P.F. Paciente
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 123.456.789-00"
                      value={newPtCpf}
                      onChange={(e) => setNewPtCpf(e.target.value)}
                      className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                      Celular / Whats
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: (11) 98765-4321"
                      value={newPtPhone}
                      onChange={(e) => setNewPtPhone(e.target.value)}
                      className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={newPtBirthDate}
                    onChange={(e) => setNewPtBirthDate(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowCreatePatientModal(false)}
                    className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer"
                  >
                    Criar Cadastro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Editing Patient Modal sheet */}
        {showEditPatientModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4 text-left font-sans">
              <div className="flex justify-between items-center border-b border-gold/12 pb-3">
                <h3 className="text-lg font-bold text-primary-dark">
                  Atualizar Ficha Cadastral
                </h3>
                <button
                  onClick={() => setShowEditPatientModal(false)}
                  className="text-on-surface-variant hover:text-red-500 font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleEditPatientSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Bezerra Cavalcanti"
                    value={editPtName}
                    onChange={(e) => setEditPtName(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                      Fidelização Tier
                    </label>
                    <select
                      value={editPtTier}
                      onChange={(e) => setEditPtTier(e.target.value as any)}
                      className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    >
                      <option value="CLIENTE DIAMANTE">Cliente Diamante</option>
                      <option value="Paciente VIP">Paciente VIP</option>
                      <option value="Paciente Mensal">Paciente Mensal</option>
                      <option value="Paciente New Gen">Paciente New Gen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                      Status Atendimento
                    </label>
                    <select
                      value={editPtStatus}
                      onChange={(e) => setEditPtStatus(e.target.value as any)}
                      className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                      C.P.F. Paciente
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 123.456.789-00"
                      value={editPtCpf}
                      onChange={(e) => setEditPtCpf(e.target.value)}
                      className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                      Celular / Whats
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: (11) 98765-4321"
                      value={editPtPhone}
                      onChange={(e) => setEditPtPhone(e.target.value)}
                      className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={editPtBirthDate}
                    onChange={(e) => setEditPtBirthDate(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowEditPatientModal(false)}
                    className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer"
                  >
                    Confirmar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Visual Toast Notification Overlay */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-[#3d4c3a] text-white border border-[#C5A059]/30 rounded-xl p-4 shadow-2xl z-55 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <span className="material-symbols-outlined text-gold font-bold">
              check_circle
            </span>
            <p className="text-xs font-bold font-sans">{toastMessage}</p>
          </div>
        )}

        {/* Photo Upload Modal */}
        {showPhotoUploadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4">
              <div className="flex justify-between items-center border-b border-gold/12 pb-3">
                <h3 className="text-lg font-bold text-primary-dark">
                  Anexar Foto Técnica
                </h3>
                <button
                  onClick={() => setShowPhotoUploadModal(false)}
                  className="text-on-surface-variant hover:text-red-500 font-bold"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form
                onSubmit={handleCreatePhoto}
                className="space-y-4 text-left"
              >
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                    Selecionar Arquivo (PC/Celular)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setPhotoUploadFile(e.target.files[0]);
                      }
                    }}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                    Estágio (Tag)
                  </label>
                  <select
                    value={photoCatInput}
                    onChange={(e) => setPhotoCatInput(e.target.value as any)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none"
                  >
                    <option value="ANTES">ANTES</option>
                    <option value="DEPOIS">DEPOIS</option>
                    <option value="DETALHE">DETALHE MACRO</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowPhotoUploadModal(false)}
                    className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md"
                  >
                    Anexar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* OSS visual print modal - pristine full-featured print dossier */}
        {showVisualPrintModal && activePatient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 print:p-0 print:bg-white print:backdrop-blur-none leading-none">
            <div className="bg-[#FAF9F5]/90 border border-gold/45 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl print:bg-white print:border-none print:shadow-none print:w-full print:h-auto print:max-w-none">
              
              {/* Header with actions - Hidden when printing */}
              <div className="p-4 bg-primary-dark text-[#F7F5EF] flex justify-between items-center rounded-t-3xl border-b border-gold/20 print:hidden shrink-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold">print_connect</span>
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">
                      Visualização Prontuário Clínico & Dossiê
                    </h3>
                    <p className="text-[10px] text-slate-300">
                      Paciente: {activePatient.name} • Status: {activePatient.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.print();
                      }
                    }}
                    className="px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    Imprimir (PDF)
                  </button>
                  <button
                    onClick={() => setShowVisualPrintModal(false)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition cursor-pointer"
                    title="Fechar"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>

              {/* Printable Document Folder - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white space-y-8 font-sans print:p-0 print:overflow-visible text-left">
                
                {/* Header Brand */}
                <div className="border-b-2 border-gold pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-primary-dark tracking-tight uppercase">
                      Prontuário de Avaliação e Cuidados
                    </h1>
                    <p className="text-xs text-gold font-bold tracking-widest uppercase">
                      Estética Integrada & Terapias Capilares
                    </p>
                    <p className="text-[10px] text-on-surface-variant/80 mt-1">
                      Visualização gerada em {new Date().toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-[10px] text-on-surface-variant font-mono space-y-0.5">
                    <p className="font-sans font-bold text-primary-dark uppercase text-xs">Clínica Essência & Harmonização</p>
                    <p>Ficha de Acompanhamento Multidisciplinar</p>
                    <p>Registro Autenticado N° PR-{activePatient.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                {/* Patient Information Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-gold uppercase tracking-widest border-b border-gold/20 pb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">person</span>
                    Identificação do Paciente
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Nome Completo</span>
                      <span className="text-primary-dark font-bold text-sm block">{activePatient.name}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">CPF</span>
                      <span className="text-on-surface font-bold block">{activePatient.cpf}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Data Nascimento (Idade)</span>
                      <span className="text-on-surface font-bold block">{activePatient.birthDate} ({activePatient.age} anos)</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Telefone</span>
                      <span className="text-on-surface font-bold block">{activePatient.phone}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Plano / Convênio</span>
                      <span className="text-on-surface font-bold block">{activePatient.convenios || "Particular"}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Condições Médicas</span>
                      <span className="text-on-surface font-bold block text-red-650">{activePatient.condicoesMedicas || "Nenhuma registrada"}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Estágio (Tier/Tag)</span>
                      <span className="text-on-surface font-bold block">{activePatient.tier}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-semibold block text-[10px] uppercase">Última Visita</span>
                      <span className="text-on-surface font-bold block">{activePatient.lastVisit || "Nenhuma"}</span>
                    </div>
                  </div>
                </div>

                {/* Anamnese Clínica answers if available */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black text-gold uppercase tracking-widest border-b border-gold/20 pb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">clinical_notes</span>
                    Anamnese Clínica & Ficha de Saúde
                  </h3>
                  {activePatient.anamneseClinica ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed bg-[#FAF9F5] p-4 rounded-2xl border border-gold/15">
                      <div>
                        <strong className="text-primary-dark">Problema Gastrointestinal:</strong> {activePatient.anamneseClinica.gastrointestinal || "Não"}
                      </div>
                      <div>
                        <strong className="text-primary-dark">Alergias ou Alimentos:</strong> {activePatient.anamneseClinica.alergias || "Indene/Sem sensibilidade"}
                      </div>
                      <div>
                        <strong className="text-primary-dark">Medicamentos em Uso:</strong> {activePatient.anamneseClinica.medicamentos || "Nenhum"}
                      </div>
                      <div>
                        <strong className="text-primary-dark">Gestante no Momento:</strong> {activePatient.anamneseClinica.gestante || "Não"}
                      </div>
                      <div>
                        <strong className="text-primary-dark">Cirurgias Anteriores:</strong> {activePatient.anamneseClinica.cirurgias || "Nenhuma relevante"}
                      </div>
                      <div>
                        <strong className="text-primary-dark font-black text-red-500">Histórico de Alteração de Pele:</strong> {activePatient.anamneseClinica.historicoPele || "Ausente"}
                      </div>
                      <div className="sm:col-span-2 border-t border-gold/10 pt-2 text-[#5F5236]">
                        <strong>Observações Clínicas Gerais do Especialista:</strong> {activePatient.anamneseClinica.observacoesClinicas || "Nenhuma observação clínica extra foi inserida."}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant italic">Nenhuma ficha de anamnese clínica geral preenchida para este paciente.</p>
                  )}
                </div>

                {/* Facial Assessment complete and graphic mapping */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-black text-gold uppercase tracking-widest border-b border-gold/20 pb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">face</span>
                    Dossiê da Pele Facial & Mapeamento
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs bg-white">
                    {/* Checkboxes parameters panel */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-loose">
                        
                        <div className="bg-[#FAF9F5]/40 border border-gold/10 p-3 rounded-xl">
                          <strong className="text-primary-dark block mb-1 text-[11px] uppercase tracking-wider font-extrabold text-gold">Manchas Pigmentares</strong>
                          <div className="flex flex-wrap gap-1">
                            {facPigmentares && Object.entries(facPigmentares).map(([f, checked]) => (
                              checked ? <span key={f} className="px-2 py-0.5 bg-primary-dark/5 text-primary-dark font-bold rounded text-[10px] capitalize border border-[#5F5236]/10">{f}</span> : null
                            ))}
                            {facPigmentares && !Object.values(facPigmentares).some(Boolean) && <span className="text-on-surface-variant/70 italic text-[10px]">Ausente / Sem alterações</span>}
                          </div>
                        </div>

                        <div className="bg-[#FAF9F5]/40 border border-gold/10 p-3 rounded-xl">
                          <strong className="text-primary-dark block mb-1 text-[11px] uppercase tracking-wider font-extrabold text-gold">Alterações Vasculares</strong>
                          <div className="flex flex-wrap gap-1">
                            {facVasculares && Object.entries(facVasculares).map(([f, checked]) => (
                              checked ? <span key={f} className="px-2 py-0.5 bg-primary-dark/5 text-primary-dark font-bold rounded text-[10px] capitalize border border-[#5F5236]/10">{f}</span> : null
                            ))}
                            {facVasculares && !Object.values(facVasculares).some(Boolean) && <span className="text-on-surface-variant/70 italic text-[10px]">Ausente / Sem alterações</span>}
                          </div>
                        </div>

                        <div className="bg-[#FAF9F5]/40 border border-gold/10 p-3 rounded-xl">
                          <strong className="text-primary-dark block mb-1 text-[11px] uppercase tracking-wider font-extrabold text-gold">Formações Sólidas</strong>
                          <div className="flex flex-wrap gap-1">
                            {facSolidas && Object.entries(facSolidas).map(([f, checked]) => (
                              checked ? <span key={f} className="px-2 py-0.5 bg-primary-dark/5 text-primary-dark font-bold rounded text-[10px] capitalize border border-[#5F5236]/10">{f}</span> : null
                            ))}
                            {facSolidas && !Object.values(facSolidas).some(Boolean) && <span className="text-on-surface-variant/70 italic text-[10px]">Ausente / Sem alterações</span>}
                          </div>
                        </div>

                        <div className="bg-[#FAF9F5]/40 border border-gold/10 p-3 rounded-xl">
                          <strong className="text-primary-dark block mb-1 text-[11px] uppercase tracking-wider font-extrabold text-gold">Lesões / Sequelas de Pele</strong>
                          <div className="flex flex-wrap gap-1">
                            {facLesoes && Object.entries(facLesoes).map(([f, checked]) => (
                              checked ? <span key={f} className="px-2 py-0.5 bg-primary-dark/5 text-primary-dark font-bold rounded text-[10px] capitalize border border-[#5F5236]/10">{f}</span> : null
                            ))}
                            {facSequelas && Object.entries(facSequelas).map(([f, checked]) => (
                              checked ? <span key={f + "seq"} className="px-2 py-0.5 bg-primary-dark/5 text-primary-dark font-bold rounded text-[10px] capitalize border border-[#5F5236]/10">{f}</span> : null
                            ))}
                            {(!facLesoes || !Object.values(facLesoes).some(Boolean)) && (!facSequelas || !Object.values(facSequelas).some(Boolean)) && <span className="text-on-surface-variant/70 italic text-[10px]">Sem lesões ou cicatrizes</span>}
                          </div>
                        </div>
                      </div>

                      {/* Classificacao text indicators */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#FAF9F5]/30 border border-gold/10 p-4 rounded-2xl">
                        <div>
                          <span className="text-on-surface-variant block text-[10px] font-bold uppercase">Hidratação</span>
                          <span className="text-primary-dark font-extrabold text-sm">{facTipoCutaneo?.hidratacao || "Normal"}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] font-bold uppercase">Oleosidade</span>
                          <span className="text-primary-dark font-extrabold text-sm">{facTipoCutaneo?.oleosidade || "Normal"}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] font-bold uppercase">Espessura</span>
                          <span className="text-primary-dark font-extrabold text-sm">{facTipoCutaneo?.espessura || "Normal"}</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant block text-[10px] font-bold uppercase">Fototipo</span>
                          <span className="text-primary-dark font-extrabold text-sm">Grau {facTipoCutaneo?.fototipo || "I"}</span>
                        </div>
                      </div>

                      {/* Outros and treatments */}
                      <div className="space-y-2">
                        {facOutros && (
                          <p className="text-xs text-on-surface bg-[#FAF9F5]/20 p-2.5 rounded-xl border border-gold/5 leading-relaxed">
                            <strong>Outros Achados:</strong> {facOutros}
                          </p>
                        )}
                        {facEscalaGlogau && (
                          <p className="text-xs text-on-surface leading-loose">
                            <strong>Escala de Glogau Associada:</strong> <span className="font-extrabold text-gold text-sm">{facEscalaGlogau}</span>
                          </p>
                        )}
                        {facSugestaoTratamento && (
                          <div className="p-3.5 bg-[#FAF9F5] border border-gold/15 rounded-2xl space-y-1">
                            <span className="text-[10px] font-bold uppercase text-gold block tracking-wider">Protocolo de Tratamento / Recomendação Técnica</span>
                            <p className="text-xs leading-relaxed text-slate-800 italic font-sans">{facSugestaoTratamento}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SVG Diagram with absolute marker indicators */}
                    <div className="lg:col-span-5 border border-gold/15 p-4 rounded-2xl bg-[#FAF9F5]/20 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-primary-dark text-center uppercase tracking-wider block mb-2">Demarcações de Anomalias Relevantes</span>
                      
                      <div className="relative w-full overflow-hidden bg-[#FAF9F5] rounded-xl border border-gold/10 p-1">
                        <svg viewBox="0 0 400 240" className="w-full h-auto text-gold/30 fill-none stroke-current stroke-1 pb-1">
                          {/* Left Face */}
                          <g transform="translate(10, 0)">
                            <path d="M 100,30 C 60,30 50,60 50,110 C 50,160 80,210 100,210 C 120,210 150,160 150,110 C 150,60 140,30 100,30 Z" />
                            <path d="M 80,205 C 80,225 60,230 40,235 M 120,205 C 120,225 140,230 160,235" />
                            <path d="M 50,95 C 43,95 43,120 50,120 M 150,95 C 157,95 157,120 150,120" />
                            <path d="M 72,95 C 77,90 85,90 90,95 M 72,95 C 77,98 85,98 90,95" />
                            <path d="M 110,95 C 115,90 123,90 128,95 M 110,95 C 115,98 123,98 128,95" />
                            <path d="M 68,88 Q 80,80 92,88 M 108,88 Q 120,80 132,88" />
                            <path d="M 100,95 L 100,135 C 100,140 95,142 95,145 C 100,148 105,145 105,145" />
                            <path d="M 82,165 Q 100,175 118,165 Q 100,157 82,165" />
                            <path d="M 55,80 C 70,55 130,55 145,80" />
                          </g>
                          {/* Right Face */}
                          <g transform="translate(190, 0)">
                            <path d="M 100,30 C 60,30 50,60 50,110 C 50,160 80,210 100,210 C 120,210 150,160 150,110 C 150,60 140,30 100,30 Z" />
                            <path d="M 80,205 C 80,225 60,230 40,235 M 120,205 C 120,225 140,230 160,235" />
                            <path d="M 50,95 C 43,95 43,120 50,120 M 150,95 C 157,95 157,120 150,120" />
                            <path d="M 72,95 C 77,90 85,90 90,95 M 72,95 C 77,98 85,98 90,95" />
                            <path d="M 110,95 C 115,90 123,90 128,95 M 110,95 C 115,98 123,98 128,95" />
                            <path d="M 68,88 Q 80,80 92,88 M 108,88 Q 120,80 132,88" />
                            <path d="M 100,95 L 100,135 C 100,140 95,142 95,145 C 100,148 105,145 105,145" />
                            <path d="M 82,165 Q 100,175 118,165 Q 100,157 82,165" />
                            <path d="M 55,80 C 70,55 130,55 145,80" />
                          </g>
                        </svg>

                        {faceMarkers.map((marker, idx) => {
                          let bgCol = "bg-red-500 shadow-red-500/50";
                          if (marker.type === "Melasma") bgCol = "bg-orange-500 shadow-orange-500/50";
                          else if (marker.type === "Flacidez") bgCol = "bg-purple-500 shadow-purple-500/50";
                          else if (marker.type === "Ruga") bgCol = "bg-yellow-500 shadow-yellow-500/50";
                          else if (marker.type === "Cicatriz") bgCol = "bg-blue-500 shadow-blue-500/50";

                          return (
                            <div
                              key={idx}
                              className={`absolute w-3 h-3 rounded-full border border-white shadow-md ${bgCol} -translate-x-1/2 -translate-y-1/2`}
                              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                            >
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-[9px] whitespace-nowrap rounded px-1.5 py-0.5 font-sans font-bold shadow-md z-30 pointer-events-none">
                                {marker.type} {marker.note && `(${marker.note})`}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-2 text-[10px] text-on-surface-variant italic leading-normal text-center">
                        Total de {faceMarkers.length} alterações assinaladas no mapeamento facial digital.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body Assessment and Table Measures */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-black text-gold uppercase tracking-widest border-b border-gold/20 pb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">fitness_center</span>
                    Dossiê Corporal & Antropometria
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs bg-white">
                    {/* Left: Table and form checks */}
                    <div className="lg:col-span-7 space-y-4">
                      
                      <div className="overflow-x-auto border border-gold/10 rounded-xl bg-white">
                        <table className="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-[#FAF9F5] border-b border-gold/10 text-primary-dark font-bold">
                              <th className="p-2">Região Corporal</th>
                              <th className="p-2">Medida (cm)</th>
                              <th className="p-2">Data Início</th>
                              <th className="p-2">Data Retorno / Aval Final</th>
                            </tr>
                          </thead>
                          <tbody>
                            {corpMedidas && Object.entries(corpMedidas).map(([key, data]: [string, any]) => {
                              const regionNames: { [key: string]: string } = {
                                bracoD: "Braço Direito (D)",
                                bracoE: "Braço Esquerdo (E)",
                                bustoTorax: "Busto / Tórax",
                                estomago: "Estômago",
                                cintura: "Cintura",
                                barriga: "Barriga / Abdômen",
                                quadril: "Quadril",
                                culote: "Culote",
                                coxaSuperior: "Coxa Superior",
                                coxaInferior: "Coxa Inferior",
                              };
                              return (
                                <tr key={key} className="border-b border-gold/5 text-slate-800">
                                  <td className="p-1.5 font-bold text-[#5F5236]">{regionNames[key] || key}</td>
                                  <td className="p-1.5 font-mono font-bold text-sm text-[#C5A059]">{data.medida ? `${data.medida} cm` : "-"}</td>
                                  <td className="p-1.5">{data.inicioDate || "-"}</td>
                                  <td className="p-1.5">{data.finalDate || "-"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Other parameters like celulite, estrias, flacidez */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-loose">
                        
                        <div className="bg-[#FAF9F5]/40 border border-gold/10 p-3 rounded-xl space-y-1">
                          <strong className="text-primary-dark block mb-1 text-[11px] uppercase tracking-wider font-extrabold text-gold">Edema & Distribuição</strong>
                          <p><strong>Distribuição de Gordura:</strong> {corpDistribuicaoGordura || "Ginóide"}</p>
                          <p><strong>Edema Estético:</strong> {corpEdema === "Presente" ? `Presente - Desc: ${corpEdemaDescricao || "Sinal de Godet positivo"}` : "Ausente"}</p>
                        </div>

                        <div className="bg-[#FAF9F5]/40 border border-gold/10 p-3 rounded-xl space-y-1">
                          <strong className="text-primary-dark block mb-1 text-[11px] uppercase tracking-wider font-extrabold text-gold">Alterações do Tecido</strong>
                          <p>
                            <strong>Celulite: </strong>
                            {corpCelulite && Object.entries(corpCelulite).filter(([k, v]) => k !== "regiao" && v).map(([k]) => k.toUpperCase().replace("GRAU", " Grau ")).join(", ") || "Ausente"}
                            {corpCelulite?.regiao && ` em: ${corpCelulite.regiao}`}
                          </p>
                          <p>
                            <strong>Flacidez Tissular: </strong>
                            {corpFlacidezTissular === "Presente" ? `Presente em: ${corpFlacidezTissularRegiao || "Região geral"}` : "Ausente"}
                          </p>
                        </div>

                        <div className="bg-[#FAF9F5]/40 border border-gold/10 p-3 rounded-xl space-y-1">
                          <strong className="text-primary-dark block mb-1 text-[11px] uppercase tracking-wider font-extrabold text-gold">Estrias & Cicatrizes</strong>
                          <p>
                            <strong>Análise Estrias: </strong>
                            {corpEstrias?.ausentes ? "Ausentes" : ""}
                            {corpEstrias?.rubras ? " Rubras/Vermelhas" : ""}
                            {corpEstrias?.albas ? " Albas/Brancas" : ""}
                            {corpEstrias?.regiao && ` (Nas regiões: ${corpEstrias.regiao})`}
                          </p>
                        </div>

                        <div className="bg-[#FAF9F5]/40 border border-gold/10 p-3 rounded-xl space-y-1">
                          <strong className="text-primary-dark block mb-1 text-[11px] uppercase tracking-wider font-extrabold text-gold">Flacidez Muscular & Fibrose</strong>
                          <p><strong>Flacidez Muscular:</strong> {corpFlacidezMuscular || "Ausente"}</p>
                          <p><strong>Gordura Localizada:</strong> {corpGorduraLocalizada || "Flácida"}</p>
                          {corpFibrose === "Presente" && (
                            <p className="text-red-650 font-bold"><strong>Fibrose Detectada:</strong> Presente em {corpFibroseRegiao || "região cirúrgica"}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: SVG Diagram output for body outlining and markers */}
                    <div className="lg:col-span-5 border border-gold/15 p-4 rounded-2xl bg-[#FAF9F5]/20 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-primary-dark text-center uppercase tracking-wider block mb-2">Demarcações Estéticas Corporais</span>

                      <div className="relative w-full overflow-hidden bg-[#FAF9F5] rounded-xl border border-gold/10 p-1">
                        <svg viewBox="0 0 540 280" className="w-full h-auto text-gold/30 fill-none stroke-current stroke-1 pb-1">
                          {/* Front View */}
                          <g transform="translate(10, 0)">
                            <text x="90" y="25" textAnchor="middle" className="text-[10px] font-bold fill-gold/60 stroke-none">Frente</text>
                            <ellipse cx="90" cy="50" rx="14" ry="18" />
                            <path d="M 85,68 L 85,76 M 95,68 L 95,76" />
                            <path d="M 55,80 C 65,76 115,76 125,80 L 120,110 C 115,130 115,145 120,165 C 118,175 110,185 105,188 L 105,255 M 55,80 L 60,110 C 65,130 65,145 60,165 C 62,175 70,185 75,188 L 75,255" />
                            <path d="M 75,112 C 80,123 90,123 90,112 M 105,112 C 100,123 90,123 90,112" />
                            <path d="M 55,80 C 45,100 45,130 48,165 M 125,80 C 135,100 135,130 132,165" />
                            <path d="M 90,185 L 90,195" />
                            <path d="M 85,195 C 87,220 87,240 85,255 M 95,195 C 93,220 93,240 95,255" />
                            <path d="M 75,255 L 70,260 L 85,260 Z M 105,255 L 110,260 L 95,260 Z" />
                          </g>

                          {/* Back View */}
                          <g transform="translate(180, 0)">
                            <text x="90" y="25" textAnchor="middle" className="text-[10px] font-bold fill-gold/60 stroke-none">Costas</text>
                            <ellipse cx="90" cy="50" rx="14" ry="18" />
                            <path d="M 76,50 C 76,64 104,64 104,50" />
                            <path d="M 85,68 L 85,76 M 95,68 L 95,76" />
                            <path d="M 55,80 C 65,76 115,76 125,80 L 120,110 C 115,130 115,145 120,165 C 118,175 110,185 105,188 L 105,255 M 55,80 L 60,110 C 65,130 65,145 60,165 C 62,175 70,185 75,188 L 75,255" />
                            <path d="M 90,76 L 90,165" />
                            <path d="M 90,185 C 80,185 80,196 90,196 C 100,196 100,185 90,185" />
                            <path d="M 55,80 C 45,100 45,130 48,165 M 125,80 C 135,100 135,130 132,165" />
                            <path d="M 85,195 C 87,220 87,240 85,255 M 95,195 C 93,220 93,240 95,255" />
                            <path d="M 75,255 L 70,260 L 85,260 Z M 105,255 L 110,260 L 95,260 Z" />
                          </g>

                          {/* Side View */}
                          <g transform="translate(350, 0)">
                            <text x="90" y="25" textAnchor="middle" className="text-[10px] font-bold fill-gold/60 stroke-none">Lateral</text>
                            <path d="M 90,32 C 80,32 75,40 75,50 C 75,60 85,68 90,68 C 95,68 98,60 98,50 Z" />
                            <path d="M 75,48 H 71 L 75,52" />
                            <path d="M 82,68 L 82,76 M 92,68 L 92,76" />
                            <path d="M 82,76 C 70,95 65,110 65,125 C 65,140 75,150 75,170 C 75,180 82,190 85,194 L 85,255 L 94,255 L 96,194 Q 112,180 112,165 Q 112,150 94,140 C 94,110 92,90 92,76 Z" />
                            <path d="M 75,98 C 62,105 62,118 75,120" />
                            <path d="M 94,168 C 108,172 108,188 94,192" />
                            <path d="M 85,255 L 80,260 H 98 L 94,255" />
                          </g>
                        </svg>

                        {bodyMarkers.map((marker, idx) => {
                          let bgCol = "bg-red-500 shadow-red-500/50";
                          if (marker.type === "Celulite") bgCol = "bg-yellow-500 shadow-yellow-500/50";
                          else if (marker.type === "Gordura Localizada") bgCol = "bg-orange-500 shadow-orange-500/50";
                          else if (marker.type === "Estria") bgCol = "bg-purple-500 shadow-purple-500/50";
                          else if (marker.type === "Flacidez") bgCol = "bg-pink-500 shadow-pink-500/50";
                          else if (marker.type === "Fibrose") bgCol = "bg-blue-500 shadow-blue-500/50";
                          else if (marker.type === "Edema") bgCol = "bg-teal-500 shadow-teal-500/50";

                          return (
                            <div
                              key={idx}
                              className={`absolute w-3 h-3 rounded-full border border-white shadow-md ${bgCol} -translate-x-1/2 -translate-y-1/2`}
                              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                            >
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-[9px] whitespace-nowrap rounded px-1.5 py-0.5 font-sans font-bold shadow-md z-30 pointer-events-none">
                                {marker.type} {marker.note && `(${marker.note})`}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-2 text-[10px] text-on-surface-variant italic leading-normal text-center">
                        Total de {bodyMarkers.length} alterações assinaladas no mapeamento corporal digital.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Signature Status */}
                <div className="pt-6 border-t border-gold/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="space-y-1 text-xs">
                    <strong className="text-primary-dark block text-[10px] uppercase tracking-wider">Assinatura Digital & Consentimento</strong>
                    <p className="text-on-surface-variant font-medium">ICP-Brasil Autenticado ID: 2901-AC-X92-SBPL</p>
                    <p className="text-[10px] italic text-[#5F5236]">Assinado eletronicamente por {activePatient.name} em conformidade com as regras clínicas.</p>
                  </div>
                  
                  {activePatient.signature ? (
                    <div className="border border-gold/25 p-3 rounded-xl bg-[#FAF9F5] text-center w-64">
                      {activePatient.signature.startsWith("data:image/") ? (
                        <img
                          src={activePatient.signature}
                          alt="Assinatura Eletrônica"
                          className="max-h-16 mx-auto object-contain bg-white rounded p-1"
                        />
                      ) : (
                        <div className="font-serif italic text-sm text-primary-dark font-bold font-mono h-12 flex items-center justify-center">
                          {activePatient.signature}
                        </div>
                      )}
                      <span className="text-[9px] uppercase tracking-widest text-gold font-bold block mt-2 border-t border-gold/10 pt-1.5">
                        Assinatura Registrada
                      </span>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-red-200 p-4 rounded-xl text-center text-red-500 font-bold bg-red-50/50 w-64 text-[10px] uppercase">
                      Pendente de Assinatura
                    </div>
                  )}
                </div>

                {/* Footer and Terms */}
                <div className="pt-6 border-t border-gold/10 text-[9px] text-on-surface-variant/80 text-center font-sans space-y-1">
                  <p>Documento gerado eletronicamente. A veracidade e guarda deste prontuário médico de acompanhamento estético é de inteira responsabilidade da clínica estipulante.</p>
                  <p>© {new Date().getFullYear()} Clínica Integrada de Estética Avançada e Capilar. Todos os direitos reservados de confidencialidade médica.</p>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
