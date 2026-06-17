"use client";

import React, { useState } from "react";
import { Transaction } from "../types/erp";

interface ConciliacaoTabProps {
  transactions: Transaction[];
  onAddTransaction: (newTx: Omit<Transaction, "id" | "dateStr">) => void;
}

export default function ConciliacaoTab({
  transactions,
  onAddTransaction,
}: ConciliacaoTabProps) {
  const [extratoRaw, setExtratoRaw] = useState("");
  const [parsedItems, setParsedItems] = useState<
    {
      id: string;
      date: string;
      desc: string;
      val: number;
      isEntry: boolean;
      imported: boolean;
    }[]
  >([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setExtratoRaw(text);
      parseExtratoText(text);
    };
    reader.readAsText(file);
  };

  const parseExtratoText = (text: string) => {
    if (
      text.toUpperCase().includes("OFXHEADER") ||
      text.toUpperCase().includes("<OFX>")
    ) {
      const parsed: any[] = [];
      const trnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
      let match;
      let i = 0;

      while ((match = trnRegex.exec(text)) !== null) {
        const trnBlock = match[1];

        let datePosted = "";
        const dateMatch = /<DTPOSTED>([^<\s]+)/i.exec(trnBlock);
        if (dateMatch) {
          const d = dateMatch[1].trim().substring(0, 8);
          if (d.length === 8) {
            datePosted = `${d.substring(6, 8)}/${d.substring(4, 6)}/${d.substring(0, 4)}`;
          } else {
            datePosted = d;
          }
        }

        let trnAmt = 0;
        const amtMatch = /<TRNAMT>([^<\s]+)/i.exec(trnBlock);
        if (amtMatch) trnAmt = parseFloat(amtMatch[1].trim().replace(",", "."));

        let memo = "";
        const memoMatch = /<MEMO>(.*?)(?:<|\r|\n)/i.exec(trnBlock);
        if (memoMatch) {
          memo = memoMatch[1].trim();
        } else {
          const parseName = /<NAME>(.*?)(?:<|\r|\n)/i.exec(trnBlock);
          if (parseName) memo = parseName[1].trim();
        }

        if (!isNaN(trnAmt)) {
          parsed.push({
            id: `ext-${Date.now()}-${i++}`,
            date: datePosted || "Hoje",
            desc: memo || "Lançamento",
            val: Math.abs(trnAmt),
            isEntry: trnAmt > 0,
            imported: false,
          });
        }
      }
      setParsedItems(parsed);
      return;
    }

    const lines = text.split("\n");
    const arr = lines
      .filter((l) => l.trim().length > 0)
      .map((l, i) => {
        const separator = l.includes(";") ? ";" : ",";
        const parts = l.split(separator);
        if (parts.length < 3) return null;

        const datePart = parts[0];
        const descPart = parts[1];
        let valPart = (parts[2] || "0")
          .replace(/"/g, "")
          .replace(/^R\$\s*/i, "")
          .trim();

        if (valPart.includes(",") && valPart.includes(".")) {
          if (valPart.lastIndexOf(",") > valPart.lastIndexOf(".")) {
            valPart = valPart.replace(/\./g, "").replace(",", ".");
          } else {
            valPart = valPart.replace(/,/g, "");
          }
        } else if (valPart.includes(",")) {
          valPart = valPart.replace(",", ".");
        }

        const val = parseFloat(valPart);
        if (isNaN(val)) return null;

        return {
          id: `ext-${Date.now()}-${i}`,
          date: datePart.replace(/"/g, "").trim(),
          desc: descPart.replace(/"/g, "").trim(),
          val: Math.abs(val),
          isEntry: val > 0,
          imported: false,
        };
      })
      .filter(Boolean) as any[];
    setParsedItems(arr);
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extratoRaw) return;
    parseExtratoText(extratoRaw);
  };

  const handleImport = (item: (typeof parsedItems)[0]) => {
    onAddTransaction({
      description: `Importado: ${item.desc}`,
      type: item.isEntry ? "Serviço" : "Despesa",
      category: item.isEntry ? "PROCEDIMENTOS" : "ESTRUTURA", // default grouping
      value: item.isEntry ? item.val : -item.val,
      status: "Concluído",
    });
    setParsedItems((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, imported: true } : p)),
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      <section className="bg-white border border-gold/15 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gold/10 pb-4 mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">
            account_balance
          </span>
          <div>
            <h4 className="font-bold text-lg text-primary-dark">
              Importar Extrato Bancário
            </h4>
            <p className="text-[10px] text-on-surface-variant font-medium">
              Faça o upload do extrato (OFX/CSV) para conciliação automática.
            </p>
          </div>
        </div>
        <form onSubmit={handleSimulateUpload} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-primary mb-1 uppercase">
              Cole aqui o CSV (Data;Descrição;Valor)
            </label>
            <textarea
              rows={6}
              value={extratoRaw}
              onChange={(e) => setExtratoRaw(e.target.value)}
              placeholder="Exemplo:&#10;14/05/2026;PIX Cliente Mario;250.00&#10;14/05/2026;Pagamento Energia;-120.50"
              className="w-full bg-bg-base/50 border border-gold/15 rounded-xl p-4 text-xs font-mono focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-olive-button text-white rounded-xl text-xs font-bold transition hover:opacity-90"
          >
            Analisar Extrato
          </button>
        </form>

        <div
          className="mt-6"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                const text = ev.target?.result as string;
                setExtratoRaw(text);
                parseExtratoText(text);
              };
              reader.readAsText(file);
            }
          }}
        >
          <input
            type="file"
            id="extrato-upload"
            accept=".csv,.ofx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="extrato-upload"
            className="border-2 border-dashed border-gold/30 rounded-xl p-6 text-center text-on-surface-variant/70 cursor-pointer hover:bg-gold/5 transition flex flex-col items-center"
          >
            <span className="material-symbols-outlined text-2xl mb-2">
              upload_file
            </span>
            <p className="text-xs font-bold">
              Arraste seu arquivo .CSV ou .OFX ou clique para procurar
            </p>
          </label>
        </div>
      </section>

      <section className="bg-white border border-gold/15 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gold/10 bg-bg-base/20">
          <h3 className="font-bold text-lg text-primary-dark">
            Resultado da Análise
          </h3>
          <p className="text-[10px] text-on-surface-variant font-medium mt-1">
            Revise e importe para o fluxo de caixa.
          </p>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto p-4 space-y-3">
          {parsedItems.length === 0 && (
            <div className="text-center py-8 text-on-surface-variant text-xs">
              Faça a análise de um extrato para ver os resultados.
            </div>
          )}
          {parsedItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-bg-base/30 border border-gold/15 rounded-xl p-4 gap-4"
            >
              <div className="flex-1">
                <p className="text-xs font-bold text-primary-dark">
                  {item.desc}
                </p>
                <p className="text-[10px] text-on-surface-variant font-medium tracking-wide mt-1">
                  DATA: {item.date}
                </p>
              </div>
              <div className="text-right flex items-center gap-4">
                <span
                  className={`text-sm font-black ${item.isEntry ? "text-primary" : "text-red-700"}`}
                >
                  {item.isEntry ? "+" : "-"} R$ {item.val.toFixed(2)}
                </span>
                {item.imported ? (
                  <span className="material-symbols-outlined text-green-600 text-lg">
                    check_circle
                  </span>
                ) : (
                  <button
                    onClick={() => handleImport(item)}
                    className="bg-primary/20 hover:bg-primary/30 text-primary-dark px-3 py-1.5 rounded-lg text-xs font-bold transition"
                  >
                    Importar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
