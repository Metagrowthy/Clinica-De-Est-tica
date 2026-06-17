"use client";

import React, { useState } from "react";
import { FixedExpense } from "../types/erp";
import { DRE_CATEGORIES } from "../lib/dre";

interface ContasFixasTabProps {
  fixedExpenses: FixedExpense[];
  onAddFixedExpense: (newFx: FixedExpense) => void;
  onDeleteFixedExpense: (id: string) => void;
}

export default function ContasFixasTab({ fixedExpenses, onAddFixedExpense, onDeleteFixedExpense }: ContasFixasTabProps) {
  const [desc, setDesc] = useState("");
  const [val, setVal] = useState("");
  const [dreCategory, setDreCategory] = useState<"DESPESAS_FIXAS" | "RESULTADO_FINAL">("DESPESAS_FIXAS");
  const [dreSubCategory, setDreSubCategory] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !val || !dreSubCategory) return;
    
    const newEx: FixedExpense = {
       id: `fx-${Date.now()}`,
       description: desc,
       value: parseFloat(val),
       dreCategory,
       dreSubCategory
    };
    
    onAddFixedExpense(newEx);
    setDesc("");
    setVal("");
    setDreSubCategory("");
  };

  const handleDelete = (id: string) => {
    onDeleteFixedExpense(id);
  };

  const allowedSubCats = DRE_CATEGORIES[dreCategory] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      <section className="bg-white border border-gold/15 rounded-2xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-gold/10 bg-bg-base/20">
            <h3 className="font-bold text-lg text-primary-dark">Contas & Custos Fixos</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Valores que ocorrem mensalmente provisionados no DRE.</p>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-xs font-semibold">
               <thead>
                  <tr className="text-[10px] text-on-surface-variant font-bold uppercase bg-bg-base/30 border-b border-gold/5 text-left">
                     <th className="px-6 py-4">Descrição</th>
                     <th className="px-6 py-4 text-right">Valor Mensal</th>
                     <th className="px-4 py-4 text-center">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gold/10">
                  {fixedExpenses.length === 0 && (
                     <tr><td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">Nenhum custo fixo planejado ainda.</td></tr>
                  )}
                  {fixedExpenses.map(fx => (
                     <tr key={fx.id} className="hover:bg-bg-base/35">
                        <td className="px-6 py-4 text-primary-dark">
                           {fx.description}
                           <span className="block text-[9px] text-[#785a1a] mt-0.5">{fx.dreSubCategory}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-red-700">
                           - R$ {fx.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 text-center">
                           <button onClick={() => handleDelete(fx.id)} className="text-red-500 p-1">
                           <span className="material-symbols-outlined text-sm">delete</span>
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      <section className="bg-white border border-gold/15 rounded-2xl p-6 shadow-sm">
         <h4 className="text-sm font-bold text-primary-dark border-b border-gold/10 pb-2 mb-4">Adicionar Novo Custo Fixo</h4>
         <form onSubmit={handleAdd} className="space-y-4">
            <div>
               <label className="block text-[10px] font-bold text-primary mb-1 uppercase">Descrição</label>
               <input type="text" required value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-bg-base/50 border border-gold/15 rounded-xl px-4 py-2 text-xs focus:outline-none" />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-primary mb-1 uppercase">Grupo DRE</label>
               <select value={dreCategory} onChange={e => setDreCategory(e.target.value as any)} className="w-full bg-bg-base/50 border border-gold/15 rounded-xl px-4 py-2 text-xs focus:outline-none">
                  <option value="DESPESAS_FIXAS">Despesas Fixas (Aluguel, Conta...) </option>
                  <option value="RESULTADO_FINAL">Não Operacional (Depreciação, Juros...)</option>
               </select>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-primary mb-1 uppercase">Classificação (Linha do DRE)</label>
               <select required value={dreSubCategory} onChange={e => setDreSubCategory(e.target.value)} className="w-full bg-bg-base/50 border border-gold/15 rounded-xl px-4 py-2 text-xs focus:outline-none">
                  <option value="">(Selecione uma opção)</option>
                  {allowedSubCats.map(opt => <option key={opt} value={opt}>{opt}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-primary mb-1 uppercase">Valor Mensal (R$)</label>
               <input type="number" step="0.01" required value={val} onChange={e => setVal(e.target.value)} className="w-full bg-bg-base/50 border border-gold/15 rounded-xl px-4 py-2 text-xs focus:outline-none" />
            </div>
            <button type="submit" className="w-full py-2 bg-primary text-white rounded-xl text-xs font-bold mt-2">Salvar Planejamento Fixo</button>
         </form>
      </section>
    </div>
  );
}
