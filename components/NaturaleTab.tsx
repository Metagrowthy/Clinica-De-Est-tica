"use client";

import React, { useState } from "react";
import { Transaction } from "../types/erp";

interface NaturaleTabProps {
  transactions: Transaction[];
  onAddTransaction: (newTx: Omit<Transaction, "id" | "dateStr">) => void;
  onUpdateTransaction?: (updated: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
}

export default function NaturaleTab({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: NaturaleTabProps) {
  const [showVendaModal, setShowVendaModal] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [productName, setProductName] = useState("Vela Lavanda & Sândalo");
  const [saleValue, setSaleValue] = useState("");

  // Local state for stock indicators
  const [serumStock, setSerumStock] = useState(12); // low alert represents 12%

  // Compute stats based on ledger
  const productSales = transactions.filter(
    (t) => t.category === "PRODUTOS" && t.value > 0,
  );
  const totalSpend = productSales.reduce((sum, s) => sum + s.value, 0);
  const ticketMedio =
    productSales.length > 0 ? totalSpend / productSales.length : 185;

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !saleValue) return;

    onAddTransaction({
      description: `PDV Venda: ${productName} (${buyerName})`,
      type: "Venda",
      category: "PRODUTOS",
      value: parseFloat(saleValue),
      status: "Concluído",
    });

    // Reset fields
    setBuyerName("");
    setSaleValue("");
    setShowVendaModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-2">
            <span>Ecosystem</span>
            <span className="material-symbols-outlined text-sm text-gold">
              chevron_right
            </span>
            <span className="text-primary font-bold">Benessere Naturale</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
            Benessere Naturale • Vendas
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">
            Gestão de vendas de produtos cosméticos orgânicos, linha de sais e
            óleos essenciais exclusivos.
          </p>
        </div>
        <button
          onClick={() => setShowVendaModal(true)}
          className="px-6 py-3 bg-gradient-gold-button text-white rounded-xl font-bold text-xs tracking-wider uppercase shadow-md active:scale-95 transition-smooth shrink-0"
        >
          Lançar Nova Venda
        </button>
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-on-surface-variant font-extrabold uppercase tracking-widest block">
                Faturamento Total Vendas
              </span>
              <h3 className="text-2xl font-extrabold text-primary-dark mt-1">
                R${" "}
                {(18850 + totalSpend).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <span className="p-3 bg-gold/10 text-gold-dark rounded-xl material-symbols-outlined font-bold">
              storefront
            </span>
          </div>
          <div>
            <div className="flex justify-between text-2xs font-bold text-on-surface-variant mb-1 uppercase tracking-wide">
              <span>Meta Trimestral de Sais</span>
              <span>82%</span>
            </div>
            <div className="w-full bg-bg-base h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-gold-button h-full w-[82%] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm flex justify-between items-start">
          <div>
            <span className="text-[11px] text-on-surface-variant font-extrabold uppercase tracking-widest block">
              Ticket Médio de Varejo
            </span>
            <h3 className="text-2xl font-extrabold text-primary-dark mt-1">
              R${" "}
              {ticketMedio.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
            <p className="text-[10px] text-primary font-bold mt-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>
              +12% vs mês anterior
            </p>
          </div>
          <span className="p-3 bg-primary/10 text-primary-dark rounded-xl material-symbols-outlined">
            receipt_long
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm flex justify-between items-start">
          <div>
            <span className="text-[11px] text-on-surface-variant font-extrabold uppercase tracking-widest block">
              Categoria Top de Giro
            </span>
            <h3 className="text-2xl font-extrabold text-[#775a19] mt-1">
              Essential Oils
            </h3>
            <p className="text-2xs text-on-surface-variant font-bold mt-2 uppercase tracking-wide">
              640 unidades vendidas este trimestre
            </p>
          </div>
          <span className="p-3 bg-[#c8c6c6]/40 text-primary-dark rounded-xl material-symbols-outlined">
            auto_awesome
          </span>
        </div>
      </div>

      {/* Main Grid: Últimas Vendas & Maiores Investidores */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Últimas Vendas */}
        <section className="col-span-1 lg:col-span-8 bg-white border border-gold/15 rounded-2xl shadow-sm overflow-hidden text-left">
          <div className="p-6 border-b border-gold/10 bg-bg-base/30">
            <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">
                local_mall
              </span>
              Últimas Vendas de Varejo
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest border-b border-gold/5 bg-bg-base/20">
                  <th className="px-6 py-4">Data/Hora</th>
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Produtos</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10 text-xs">
                {productSales
                  .reverse()
                  .slice(0, 5)
                  .map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-bg-base/30 transition-smooth font-medium"
                    >
                      <td className="px-6 py-4.5 text-on-surface-variant font-bold">
                        {tx.dateStr}
                      </td>
                      <td className="px-6 py-4.5 font-bold text-primary-dark">
                        {tx.description.includes("(")
                          ? tx.description.split("(")[1].replace(")", "")
                          : "Paciente Convidado"}
                      </td>
                      <td className="px-6 py-4.5 text-primary text-xs">
                        {tx.description
                          .split("PDV Venda:")[1]
                          ?.split("(")[0]
                          ?.trim() || "Aromatizadores Aura"}
                      </td>
                      <td className="px-6 py-4.5 text-right font-extrabold text-primary-dark">
                        R${" "}
                        {tx.value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary-dark">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Concluído
                          </span>
                          {onDeleteTransaction && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Deseja realmente remover esta venda?",
                                  )
                                ) {
                                  onDeleteTransaction(tx.id);
                                }
                              }}
                              className="p-1 px-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remover Venda"
                            >
                              <span className="material-symbols-outlined text-xs">
                                delete
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                {/* Fallback Static records if state is clean */}
                <tr className="hover:bg-bg-base/30 transition-smooth font-medium">
                  <td className="px-6 py-4.5 text-on-surface-variant font-bold">
                    Hoje, 11:15
                  </td>
                  <td className="px-6 py-4.5 font-bold text-primary-dark font-sans">
                    Heloisa Valente
                  </td>
                  <td className="px-6 py-4.5 text-primary text-xs">
                    Kit Aroma Relax + Vela Canela
                  </td>
                  <td className="px-6 py-4.5 text-right font-extrabold text-primary-dark">
                    R$ 540,00
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary-dark">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Concluído
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-bg-base/30 transition-smooth font-medium">
                  <td className="px-6 py-4.5 text-on-surface-variant font-bold">
                    Ontem, 16:40
                  </td>
                  <td className="px-6 py-4.5 font-bold text-primary-dark">
                    Ricardo Martins
                  </td>
                  <td className="px-6 py-4.5 text-primary">
                    Serum Facial Regenerador Ouro
                  </td>
                  <td className="px-6 py-4.5 text-right font-extrabold text-primary-dark">
                    R$ 380,00
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary-dark">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Concluído
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Maiores Investidores */}
        <aside className="col-span-1 lg:col-span-4 bg-white border border-gold/15 rounded-2xl p-6 shadow-sm text-left space-y-6">
          <h3 className="text-xs font-bold text-primary-dark uppercase tracking-widest border-b border-gold/5 pb-2.5">
            Maiores Investidores em Cosméticos
          </h3>
          <div className="space-y-4.5">
            <div className="flex justify-between items-center bg-bg-base/50 p-3 rounded-xl border border-gold/5">
              <div>
                <p className="font-extrabold text-sm text-primary-dark">
                  Heloisa Valente
                </p>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-gold/20 text-[#775a19] rounded uppercase tracking-wider">
                  VIP • Gold Tier
                </span>
              </div>
              <span className="font-extrabold text-sm text-primary">
                R$ 18.420,00
              </span>
            </div>
            <div className="flex justify-between items-center bg-bg-base/50 p-3 rounded-xl border border-gold/5">
              <div>
                <p className="font-extrabold text-sm text-primary-dark">
                  Ricardo Martins
                </p>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary-dark rounded uppercase tracking-wider">
                  Paciente Mensal
                </span>
              </div>
              <span className="font-extrabold text-sm text-primary">
                R$ 12.150,00
              </span>
            </div>
            <div className="flex justify-between items-center bg-bg-base/50 p-3 rounded-xl border border-gold/5">
              <div>
                <p className="font-extrabold text-sm text-primary-dark">
                  Beatriz Mendes
                </p>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary-dark rounded uppercase tracking-wider">
                  Paciente New Gen
                </span>
              </div>
              <span className="font-extrabold text-sm text-primary">
                R$ 9.880,00
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Stock alert ribbons */}
      <section className="bg-white border border-gold/15 rounded-2xl p-6.5 text-left grid grid-cols-1 sm:grid-cols-4 gap-6 items-center">
        <div className="sm:col-span-2 space-y-1">
          <div className="flex items-center gap-1.5 text-red-600 font-extrabold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">
              warning_amber
            </span>
            Aviso de Estoque Mínimo
          </div>
          <h4 className="font-extrabold text-primary-dark text-base">
            Serum Regenerador (Essential)
          </h4>
          <p className="text-xs text-on-surface-variant font-medium">
            O estoque clínico encontra-se operacionalmente abaixo do limite
            tolerável de segurança.
          </p>
        </div>
        <div>
          <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">
            Giro Médio
          </span>
          <span className="font-extrabold text-primary-dark text-lg">
            12 Dias
          </span>
        </div>
        <div>
          <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">
            Margem de Lucro
          </span>
          <span className="font-extrabold text-primary-dark text-lg">64%</span>
        </div>
      </section>

      {/* Nova Venda PDV Modal */}
      {showVendaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/12 pb-3">
              <h3 className="text-lg font-bold text-primary-dark">
                Lançar Nova Venda no PDV
              </h3>
              <button
                onClick={() => setShowVendaModal(false)}
                className="text-on-surface-variant hover:text-red-500 font-bold"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">
                  Paciente Comprador
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Heloisa Valente"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">
                  Linha do Produto Cosmético
                </label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Serum Facial Regenerador Ouro">
                    Serum Facial Regenerador Ouro (R$ 380)
                  </option>
                  <option value="Vela Lavanda & Sândalo">
                    Vela Lavanda & Sândalo (R$ 89)
                  </option>
                  <option value="Aromatizador Aromas de Canela Ouro">
                    Aromatizador Aromas de Canela Ouro (R$ 115)
                  </option>
                  <option value="Kit Completo Sais de Banho Algas">
                    Kit Completo Sais de Banho Algas (R$ 195)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase mb-1">
                  Valor Final Comercializado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="150.00"
                  value={saleValue}
                  onChange={(e) => setSaleValue(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowVendaModal(false)}
                  className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md"
                >
                  Confirmar PDV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
