"use client";

import React, { useState } from "react";
import { Transaction, FixedExpense } from "../types/erp";
import { DRE_CATEGORIES, getDreSubCategoriesList } from "../lib/dre";
import ContasFixasTab from "./ContasFixasTab";
import ConciliacaoTab from "./ConciliacaoTab";

interface FinanceiroTabProps {
  transactions: Transaction[];
  fixedExpenses?: FixedExpense[];
  onAddTransaction: (newTx: Omit<Transaction, "id" | "dateStr">) => void;
  onDeleteTransaction?: (id: string) => void;
  onUpdateTransaction?: (updated: Transaction) => void;
  onAddFixedExpense?: (newFx: FixedExpense) => void;
  onDeleteFixedExpense?: (id: string) => void;
}

export default function FinanceiroTab({
  transactions,
  fixedExpenses = [],
  onAddTransaction,
  onDeleteTransaction,
  onUpdateTransaction,
  onAddFixedExpense,
  onDeleteFixedExpense,
}: FinanceiroTabProps) {
  const [activeTab, setActiveTab] = useState<"dre" | "fixas" | "banco">("dre");
  const [viewMode, setViewMode] = useState<"simplificada" | "detalhada">("simplificada");

  // Lançamento Rápido State
  const [desc, setDesc] = useState("");
  const [val, setVal] = useState("");
  const [cat, setCat] = useState<
    "PROCEDIMENTOS" | "INSUMOS" | "PRODUTOS" | "ESTRUTURA"
  >("PROCEDIMENTOS");
  const [type, setType] = useState<"Entrada" | "Saída">("Entrada");
  const [dreSubCat, setDreSubCat] = useState("");

  const dreSubCategoriesList = getDreSubCategoriesList();

  const handleQuickLedger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !val) return;

    const numericValue = parseFloat(val);
    const finalVal = type === "Entrada" ? numericValue : -numericValue;

    // Detect general category
    let inferredDreCat: "RECEITA_OPERACIONAL_BRUTA" | "DEDUCOES_DE_RECEITA" | "CUSTOS_VARIAVEIS" | "DESPESAS_FIXAS" | "RESULTADO_FINAL" | undefined;
    
    if (dreSubCat) {
       for (const [key, arr] of Object.entries(DRE_CATEGORIES)) {
          if (arr.includes(dreSubCat)) {
             inferredDreCat = key as any;
             break;
          }
       }
    }

    onAddTransaction({
      description: desc,
      type: type === "Entrada" ? "Serviço" : "Despesa",
      category: cat,
      value: finalVal,
      status: "Concluído",
      dreCategory: inferredDreCat,
      dreSubCategory: dreSubCat || undefined,
    });

    setDesc("");
    setVal("");
    setDreSubCat("");
  };

  // Live Balance (Caixa Real)
  const liveBalance = transactions.reduce((sum, t) => sum + t.value, 0);

  // --- DRE CALCULATIONS ---
  const aggregate = (subCats: string[], factor = 1) => 
    transactions.filter(t => t.dreSubCategory && subCats.includes(t.dreSubCategory))
                .reduce((sum, t) => sum + (Math.abs(t.value) * factor), 0);

  const aggregateFixed = (subCats: string[]) => 
    fixedExpenses.filter(f => f.dreSubCategory && subCats.includes(f.dreSubCategory))
                 .reduce((sum, f) => sum + Math.abs(f.value), 0);

  // Computations from embedded attributes
  const computedTaxes = transactions.reduce((sum, t) => sum + (t.taxAmount || 0), 0);
  const computedCommissions = transactions.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
  const computedMaterialCost = transactions.reduce((sum, t) => sum + (t.costMaterial || 0), 0);

  // 1. RECEITA BRUTA
  const recInjetaveis = aggregate(["Receita Injetáveis"]);
  const recSpaBemEstar = aggregate(["Receita SPA e Bem-Estar"]);
  const recPacotes = aggregate(["Receita de Pacotes ou Combos SPA /Injetaveis"]);
  const recVendaProdutos = aggregate(["Receita Venda Produtos (Home Care)"]);

  const ungroupedReceitaProcedimentos = transactions.filter(t => !t.dreSubCategory && t.category === "PROCEDIMENTOS" && t.value > 0).reduce((sum, t) => sum + t.value, 0);
  const ungroupedReceitaProdutos = transactions.filter(t => !t.dreSubCategory && t.category === "PRODUTOS" && t.value > 0).reduce((sum, t) => sum + t.value, 0);

  const totalReceitaBruta = recInjetaveis + recSpaBemEstar + recPacotes + recVendaProdutos + ungroupedReceitaProcedimentos + ungroupedReceitaProdutos;

  // 2. DEDUÇÕES DE RECEITA
  const impostoFaturamento = aggregate(["Impostos sobre Faturamento"]) + computedTaxes;
  const txCartao = aggregate(["Taxas de Cartão/Parcelamento", "Taxa de antecipação do cartão de credito"]);
  const comissoesVendas = aggregate(["Comissões de Vendas"]) + computedCommissions;

  const totalDeducoes = impostoFaturamento + txCartao + comissoesVendas;

  // 3. RECEITA LÍQUIDA
  const receitaLiquida = totalReceitaBruta - totalDeducoes;

  // 4. CUSTOS VARIÁVEIS (CPV)
  const custoInjetaveis = aggregate(["Biomateriais e Insumos Injetáveis"]);
  const custoSpa = aggregate(["Cosméticos e Insumos SPA"]);
  const custoPacotes = aggregate(["Pacotes ou Combos SPA/Injetáveis"]);
  const custoDescartaveis = aggregate(["Descartáveis / Lavanderia/ Insumos de vela"]);
  
  const ungroupedCustos = transactions.filter(t => !t.dreSubCategory && t.category === "INSUMOS" && t.value < 0).reduce((sum, t) => sum + Math.abs(t.value), 0);
  const totalCustosVariaveis = custoInjetaveis + custoSpa + custoPacotes + custoDescartaveis + computedMaterialCost + ungroupedCustos;

  // 5. MARGEM DE CONTRIBUIÇÃO
  const margemContribuicao = receitaLiquida - totalCustosVariaveis;

  // 6. DESPESAS FIXAS (OPERACIONAIS)
  const despesasFixasAgregadas = aggregate(DRE_CATEGORIES.DESPESAS_FIXAS) + aggregateFixed(DRE_CATEGORIES.DESPESAS_FIXAS);
  const ungroupedDespesasFixas = transactions.filter(t => !t.dreSubCategory && t.category === "ESTRUTURA" && t.value < 0).reduce((sum, t) => sum + Math.abs(t.value), 0);
  const totalDespesasFixas = despesasFixasAgregadas + ungroupedDespesasFixas;

  // 7. EBITDA
  const ebitda = margemContribuicao - totalDespesasFixas;

  // 8. RESULTADO FINAL (Não operacionais)
  const despesasNaoOperacionais = aggregate(DRE_CATEGORIES.RESULTADO_FINAL) + aggregateFixed(DRE_CATEGORIES.RESULTADO_FINAL);

  // 9. LUCRO LÍQUIDO
  const lucroLiquido = ebitda - despesasNaoOperacionais;
  const margemLiquida = totalReceitaBruta > 0 ? (lucroLiquido / totalReceitaBruta) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-2">
            <span>Ecosystem</span>
            <span className="material-symbols-outlined text-sm text-gold">chevron_right</span>
            <span className="text-primary font-bold">Financeiro</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-primary-dark">Fluxo de Caixa & DRE</h1>
        </div>
        <div className="flex items-center gap-3">
           <button
             onClick={() => setViewMode("simplificada")}
             className={`px-4 py-2 font-bold text-xs rounded-xl transition ${viewMode === "simplificada" ? "bg-primary text-white shadow-md" : "bg-bg-base/50 text-neutral-500 hover:bg-bg-base"}`}
           >
             Visão Simplificada
           </button>
           <button
             onClick={() => setViewMode("detalhada")}
             className={`px-4 py-2 font-bold text-xs rounded-xl transition ${viewMode === "detalhada" ? "bg-primary text-white shadow-md" : "bg-bg-base/50 text-neutral-500 hover:bg-bg-base"}`}
           >
             Visão Detalhada
           </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 sm:gap-6 border-b border-gold/15 pb-2 mb-6">
         <button
            onClick={() => setActiveTab("dre")}
            className={`pb-2 font-bold text-sm transition-all sm:text-base border-b-2 ${activeTab === "dre" ? "border-primary text-primary-dark" : "border-transparent text-neutral-400 hover:text-primary-dark"}`}
         >
            DRE & Lançamentos
         </button>
         <button
            onClick={() => setActiveTab("fixas")}
            className={`pb-2 font-bold text-sm transition-all sm:text-base border-b-2 ${activeTab === "fixas" ? "border-primary text-primary-dark" : "border-transparent text-neutral-400 hover:text-primary-dark"}`}
         >
            Despesas Fixas
         </button>
         <button
            onClick={() => setActiveTab("banco")}
            className={`pb-2 font-bold text-sm transition-all sm:text-base border-b-2 ${activeTab === "banco" ? "border-primary text-primary-dark" : "border-transparent text-neutral-400 hover:text-primary-dark"}`}
         >
            Conciliação (Extratos)
         </button>
      </div>

      {activeTab === "dre" && (
        <>
          {/* Simplified KPI Performance summary */}
          {viewMode === "simplificada" && (
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Faturamento Operacional Bruto</span>
            <h4 className="text-2xl font-extrabold text-primary-dark mt-1">R$ {totalReceitaBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Custos Variáveis & Deduções</span>
            <h4 className="text-2xl font-extrabold text-red-700 mt-1">-R$ {(totalDeducoes + totalCustosVariaveis).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h4>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Despesas Fixas & Outros</span>
            <h4 className="text-2xl font-extrabold text-red-700 mt-1">-R$ {(totalDespesasFixas + despesasNaoOperacionais).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h4>
          </div>
          <div className="bg-gradient-olive-button p-6 rounded-2xl border border-gold/30 shadow-md text-white">
            <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Lucro Líquido Real</span>
            <h4 className="text-2xl font-extrabold mt-1">R$ {lucroLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h4>
          </div>
        </section>
      )}

      {/* Core split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <section className="bg-white border border-gold/15 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gold/10 bg-bg-base/20">
              <h3 className="font-bold text-lg text-primary-dark">Historico Recente (Lançamentos)</h3>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-xs font-semibold">
                <thead>
                  <tr className="text-[10px] text-on-surface-variant font-bold uppercase bg-bg-base/30 border-b border-gold/5 text-left">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                    {onDeleteTransaction && <th className="px-4 py-4 text-center">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {transactions.slice().reverse().map(tx => (
                    <tr key={tx.id} className="hover:bg-bg-base/35">
                      <td className="px-6 py-4 text-on-surface-variant">{tx.dateStr.split(",")[0]}</td>
                      <td className="px-6 py-4 text-primary-dark">
                        {tx.description}
                        {tx.dreSubCategory && <span className="block text-[9px] text-[#785a1a] mt-0.5">{tx.dreSubCategory}</span>}
                      </td>
                      <td className={`px-6 py-4 text-right font-extrabold ${tx.value > 0 ? "text-primary" : "text-red-700"}`}>
                        {tx.value > 0 ? "+" : "-"} R$ {Math.abs(tx.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      {onDeleteTransaction && (
                        <td className="px-4 py-4 text-center">
                          <button onClick={() => onDeleteTransaction(tx.id)} className="text-red-500 p-1">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white border border-gold/15 rounded-2xl p-6 text-left shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-primary-dark border-b border-gold/10 pb-2">Lançamento Rápido</h4>
            <form onSubmit={handleQuickLedger} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-primary mb-1 uppercase">Descrição</label>
                <input type="text" required value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-bg-base/50 border border-gold/15 rounded-xl px-4 py-2 text-xs focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary mb-1 uppercase">Classificação DRE</label>
                <select value={dreSubCat} onChange={(e) => setDreSubCat(e.target.value)} className="w-full bg-bg-base/50 border border-gold/15 rounded-xl px-4 py-2 text-xs focus:outline-none">
                  <option value="">(Não classificado no DRE)</option>
                  {dreSubCategoriesList.map(catOpt => <option key={catOpt} value={catOpt}>{catOpt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary mb-1 uppercase">Categoria Base</label>
                <select value={cat} onChange={(e) => setCat(e.target.value as any)} className="w-full bg-bg-base/50 border border-gold/15 rounded-xl px-4 py-2 text-xs focus:outline-none">
                  <option value="PROCEDIMENTOS">Procedimentos / SPAs</option>
                  <option value="INSUMOS">Insumos (Custos)</option>
                  <option value="PRODUTOS">Produtos (Venda)</option>
                  <option value="ESTRUTURA">Despesa Fixa / Estrutura</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-primary mb-1 uppercase">Valor (R$)</label>
                <input type="number" step="0.01" required value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-bg-base/50 border border-gold/15 rounded-xl px-4 py-2 text-xs focus:outline-none" />
              </div>
              <div className="col-span-2 flex gap-2">
                <button type="submit" onClick={() => setType("Entrada")} className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold">Lançar Entrada (+)</button>
                <button type="submit" onClick={() => setType("Saída")} className="flex-1 py-2 bg-red-800 text-white rounded-xl text-xs font-bold">Lançar Saída (-)</button>
              </div>
            </form>
          </section>
        </div>

        {/* Detailed DRE */}
        <section className="col-span-12 lg:col-span-6 bg-white border border-gold/15 rounded-2xl p-6.5 text-left shadow-sm">
          <h3 className="font-extrabold text-lg text-primary-dark pb-4">Demonstrativo de Resultado do Exercício (DRE)</h3>
          
          <div className="space-y-3 text-xs leading-relaxed font-semibold">
            {/* 1. RECEITA OPERACIONAL BRUTA */}
            <div className="bg-bg-base/30 p-3 rounded-lg border border-gold/10">
              <div className="flex justify-between font-extrabold text-sm text-primary">
                <span>1. RECEITA OPERACIONAL BRUTA</span>
                <span>R$ {totalReceitaBruta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              {viewMode === "detalhada" && (
                <div className="pl-4 mt-2 space-y-1 text-on-surface-variant font-medium text-[10px]">
                  <div className="flex justify-between"><span>(+) Receita Injetáveis</span><span>R$ {recInjetaveis.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(+) Receita SPA e Bem-Estar</span><span>R$ {recSpaBemEstar.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(+) Receita de Pacotes</span><span>R$ {recPacotes.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(+) Receita Venda Produtos</span><span>R$ {recVendaProdutos.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(+) Atendimentos/Produtos S/ Classe</span><span>R$ {(ungroupedReceitaProcedimentos + ungroupedReceitaProdutos).toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                </div>
              )}
            </div>

            {/* 2. DEDUÇÕES DE RECEITA */}
            <div className="p-3">
              <div className="flex justify-between font-bold text-red-700">
                <span>2. DEDUÇÕES DE RECEITA</span>
                <span>-R$ {totalDeducoes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              {viewMode === "detalhada" && (
                <div className="pl-4 mt-1 space-y-1 text-on-surface-variant/80 font-medium text-[10px]">
                  <div className="flex justify-between"><span>(-) Impostos sobre Faturamento</span><span>-R$ {impostoFaturamento.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(-) Taxas de Cartão/Parcelamento</span><span>-R$ {txCartao.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(-) Comissões de Vendas</span><span>-R$ {comissoesVendas.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                </div>
              )}
            </div>

            {/* 3. RECEITA LÍQUIDA */}
            <div className="bg-[#fed488]/10 p-3 rounded-lg border-y border-gold/15">
              <div className="flex justify-between font-extrabold text-[#785a1a]">
                <span>3. RECEITA LÍQUIDA (1 - 2)</span>
                <span>R$ {receitaLiquida.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* 4. CUSTOS VARIÁVEIS */}
            <div className="p-3">
              <div className="flex justify-between font-bold text-red-700">
                <span>4. CUSTOS VARIÁVEIS (CPV)</span>
                <span>-R$ {totalCustosVariaveis.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              {viewMode === "detalhada" && (
                <div className="pl-4 mt-1 space-y-1 text-on-surface-variant/80 font-medium text-[10px]">
                  <div className="flex justify-between"><span>(-) Biomateriais e Insumos Injetáveis</span><span>-R$ {custoInjetaveis.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(-) Cosméticos e Insumos SPA</span><span>-R$ {custoSpa.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(-) Pacotes ou Combos SPA/Injetáveis</span><span>-R$ {custoPacotes.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(-) Descartáveis / Lavanderia / Insumos</span><span>-R$ {custoDescartaveis.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                  <div className="flex justify-between"><span>(-) Insumos Rateados s/ Classe</span><span>-R$ {(ungroupedCustos + computedMaterialCost).toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                </div>
              )}
            </div>

             {/* 5. MARGEM DE CONTRIBUIÇÃO */}
             <div className="bg-[#fed488]/10 p-3 rounded-lg border-y border-gold/15">
              <div className="flex justify-between font-extrabold text-[#785a1a]">
                <span>5. MARGEM DE CONTRIBUIÇÃO (3 - 4)</span>
                <span>R$ {margemContribuicao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* 6. DESPESAS FIXAS */}
            <div className="p-3">
              <div className="flex justify-between font-bold text-red-700">
                <span>6. DESPESAS FIXAS (OPERACIONAIS)</span>
                <span>-R$ {totalDespesasFixas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              {viewMode === "detalhada" && (
                <div className="pl-4 mt-1 space-y-1 text-on-surface-variant/80 font-medium text-[10px]">
                   {DRE_CATEGORIES.DESPESAS_FIXAS.map(subC => {
                      const val = aggregate([subC]) + aggregateFixed([subC]);
                      if (val === 0) return null;
                      return <div key={subC} className="flex justify-between"><span>(-) {subC}</span><span>-R$ {val.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                   })}
                   {ungroupedDespesasFixas > 0 && (
                      <div className="flex justify-between"><span>(-) Outras Despesas Estrutura s/ Classe</span><span>-R$ {ungroupedDespesasFixas.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                   )}
                </div>
              )}
            </div>

             {/* 7. EBITDA */}
             <div className="bg-primary/5 p-3 rounded-lg border-y border-primary/10">
              <div className="flex justify-between font-extrabold text-primary">
                <span>7. EBITDA (Lucro Operacional) (5 - 6)</span>
                <span>R$ {ebitda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* 8. RESULTADO FINAL */}
            <div className="p-3">
              <div className="flex justify-between font-bold text-red-700">
                <span>8. RESULTADO FINAL (Juros/Depreciação)</span>
                <span>-R$ {despesasNaoOperacionais.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
               {viewMode === "detalhada" && (
                <div className="pl-4 mt-1 space-y-1 text-on-surface-variant/80 font-medium text-[10px]">
                   {DRE_CATEGORIES.RESULTADO_FINAL.map(subC => {
                      const val = aggregate([subC]) + aggregateFixed([subC]);
                      if (val === 0) return null;
                      return <div key={subC} className="flex justify-between"><span>(-) {subC}</span><span>-R$ {val.toLocaleString("pt-BR", {minimumFractionDigits:2})}</span></div>
                   })}
                </div>
              )}
            </div>

            {/* 9. LUCRO LÍQUIDO */}
            <div className="bg-gradient-olive-button text-white p-4 rounded-xl mt-4 shadow-md">
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider block mb-1">
                9. LUCRO LÍQUIDO DO EXERCÍCIO
              </span>
              <div className="flex justify-between items-baseline font-black text-2xl">
                <span>R$ {lucroLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                <span className="text-xs tracking-wider bg-white/20 px-2 py-1 rounded-md">{margemLiquida.toFixed(1)}% Margem</span>
              </div>
            </div>

          </div>
        </section>
      </div>
      </>
      )}

      {activeTab === "fixas" && (
         <ContasFixasTab 
            fixedExpenses={fixedExpenses} 
            onAddFixedExpense={onAddFixedExpense || (() => {})} 
            onDeleteFixedExpense={onDeleteFixedExpense || (() => {})}
         />
      )}

      {activeTab === "banco" && (
         <ConciliacaoTab transactions={transactions} onAddTransaction={onAddTransaction} />
      )}
    </div>
  );
}
