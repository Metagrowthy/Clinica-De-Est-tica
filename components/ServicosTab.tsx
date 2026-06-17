"use client";

import React, { useState } from "react";
import { CatalogItem } from "../types/erp";

interface ServicosTabProps {
  catalogItems: CatalogItem[];
  onAddNewItem: (newItem: Omit<CatalogItem, "id">) => void;
  onDeleteItem?: (id: string) => void;
  onUpdateItem?: (updatedItem: CatalogItem) => void;
}

export default function ServicosTab({
  catalogItems,
  onAddNewItem,
  onDeleteItem,
  onUpdateItem,
}: ServicosTabProps) {
  const [activeSegment, setActiveSegment] = useState<
    "Procedimentos" | "Produtos"
  >("Procedimentos");
  const [itemSearch, setItemSearch] = useState("");

  // Creation modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState<
    | "Facial"
    | "Corporal"
    | "Harmonização"
    | "Massagem"
    | "Linha de Sais"
    | "Aromas"
  >("Facial");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemTax, setItemTax] = useState("");
  const [itemDuration, setItemDuration] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemVolume, setItemVolume] = useState("");
  const [itemImageStr, setItemImageStr] = useState("");

  // Editing state
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<
    | "Facial"
    | "Corporal"
    | "Harmonização"
    | "Massagem"
    | "Linha de Sais"
    | "Aromas"
  >("Facial");
  const [editPrice, setEditPrice] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editTax, setEditTax] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editVolume, setEditVolume] = useState("");
  const [editImageStr, setEditImageStr] = useState("");

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleStartEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditPrice(item.price.toString());
    setEditCost(item.costMaterial ? item.costMaterial.toString() : "");
    setEditTax(item.taxRate ? item.taxRate.toString() : "");
    setEditDuration(item.duration?.toString() || "");
    setEditDesc(item.description);
    setEditVolume(item.volumeOrWeight || "");
    setEditImageStr(item.imageUrl || "");
  };

  const handleEditItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editName || !editPrice) return;

    if (onUpdateItem) {
      onUpdateItem({
        ...editingItem,
        name: editName,
        category: editCategory,
        price: parseFloat(editPrice),
        costMaterial: editCost ? parseFloat(editCost) : undefined,
        taxRate: editTax ? parseFloat(editTax) : undefined,
        duration: editDuration ? parseInt(editDuration) : undefined,
        description: editDesc,
        volumeOrWeight: editVolume || undefined,
        imageUrl: editImageStr || editingItem.imageUrl,
      });
    }

    setEditingItem(null);
  };

  const handleAddNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;

    onAddNewItem({
      name: itemName,
      type: activeSegment === "Procedimentos" ? "Serviço" : "Produto",
      category: itemCategory,
      price: parseFloat(itemPrice),
      costMaterial: itemCost ? parseFloat(itemCost) : undefined,
      taxRate: itemTax ? parseFloat(itemTax) : undefined,
      duration: itemDuration ? parseInt(itemDuration) : undefined,
      description: itemDesc,
      volumeOrWeight: itemVolume || undefined,
      imageUrl:
        itemImageStr || `https://picsum.photos/seed/${itemName}/600/400`,
    });

    // Reset fields
    setItemName("");
    setItemPrice("");
    setItemCost("");
    setItemTax("");
    setItemDuration("");
    setItemDesc("");
    setItemVolume("");
    setItemImageStr("");
    setShowCreateModal(false);
  };

  // Filters based on search query & section select
  const filteredCatalog = catalogItems.filter((item) => {
    const isMatchingType =
      activeSegment === "Procedimentos"
        ? item.type === "Serviço"
        : item.type === "Produto";

    const isMatchingSearch =
      item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(itemSearch.toLowerCase());

    return isMatchingType && isMatchingSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
            Catálogo de Serviços
          </h1>
          <p className="text-on-surface-variant font-medium mt-1">
            Menu interativo de rituais, protocolos clínicos avançados e produtos
            exclusivos Aura Wellness.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-gold-button text-white rounded-xl font-bold text-xs tracking-wider uppercase shadow-md active:scale-95 hover:shadow-lg transition-all shrink-0"
        >
          Cadastrar Novo Item
        </button>
      </div>

      {/* Catálogo Navigation Segment & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-3 rounded-2xl border border-gold/15 shadow-sm">
        <div className="flex bg-bg-base p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveSegment("Procedimentos");
              setItemCategory("Facial");
            }}
            className={`px-5 py-2 rounded-lg font-bold text-xs transition-smooth active:scale-95
            ${
              activeSegment === "Procedimentos"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Protocolos e Serviços
          </button>
          <button
            onClick={() => {
              setActiveSegment("Produtos");
              setItemCategory("Linha de Sais");
            }}
            className={`px-5 py-2 rounded-lg font-bold text-xs transition-smooth active:scale-95
            ${
              activeSegment === "Produtos"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Linha Benessere Naturale
          </button>
        </div>

        {/* Instant Search input */}
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined text-gold-dark absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder={`Buscar por ${activeSegment === "Procedimentos" ? "serviços" : "sais, aromatizadores"}...`}
            value={itemSearch}
            onChange={(e) => setItemSearch(e.target.value)}
            className="w-full bg-bg-base/60 pl-11 pr-4 py-2.5 rounded-xl border border-gold/15 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
          />
        </div>
      </div>

      {/* Grid view Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCatalog.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gold/15 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-gold hover:shadow-md transition-smooth relative"
          >
            <div>
              {/* Card visual thumb using direct image tag or custom gradient for background */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  referrerPolicy="no-referrer"
                  src={
                    item.imageUrl || "https://picsum.photos/seed/spa/600/400"
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={item.name}
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#1a1c1b]/70 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase tracking-wider">
                  {item.category}
                </div>

                {/* Edit and Delete Actions Tray */}
                <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleStartEdit(item);
                    }}
                    className="p-1.5 bg-white/90 hover:bg-white text-primary rounded-lg shadow-sm backdrop-blur-sm cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
                    title="Editar Item"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xs font-bold leading-none">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (onDeleteItem) onDeleteItem(item.id);
                    }}
                    className="p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-lg shadow-sm backdrop-blur-sm cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
                    title="Excluir Item"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xs font-bold leading-none">
                      delete
                    </span>
                  </button>
                </div>
              </div>

              {/* Card body content */}
              <div className="p-5.5 text-left">
                <h3 className="font-extrabold text-primary-dark text-base tracking-tight leading-snug group-hover:text-gold-dark transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-2 leading-relaxed min-h-[36px] line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions pricing & info */}
            <div className="px-5.5 pb-5.5 pt-4.5 border-t border-gold/5 flex justify-between items-center bg-bg-base/10">
              <div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                  {item.duration
                    ? `${item.duration} Minutos`
                    : item.volumeOrWeight || "Exclusivo"}
                </span>
                <span className="text-base font-extrabold text-primary-dark">
                  R${" "}
                  {item.price.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <button
                className="w-9 h-9 bg-gold/10 text-gold-dark hover:bg-gold hover:text-white rounded-xl flex items-center justify-center transition-all duration-250 font-bold"
                title="Visualizar Detalhes"
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        ))}

        {filteredCatalog.length === 0 && (
          <div className="col-span-4 bg-white p-16 text-center border border-gold/15 rounded-3xl text-on-surface-variant space-y-4">
            <span className="material-symbols-outlined text-5xl text-gold-dark">
              mood_bad
            </span>
            <p className="text-sm font-bold">
              Nenhum item localizado no filtro atual.
            </p>
          </div>
        )}
      </div>

      {/* Register Item modal popup sheet */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/12 pb-3">
              <h3 className="text-lg font-bold text-primary-dark">
                Cadastrar Novo{" "}
                {activeSegment === "Procedimentos"
                  ? "Ritual de Procedimento"
                  : "Produto de Alta Glicemia"}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-on-surface-variant hover:text-red-500 font-bold"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddNewItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Massagem Sensorial Hot Stones"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as any)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {activeSegment === "Procedimentos" ? (
                      <>
                        <option value="Facial">Facial</option>
                        <option value="Corporal">Corporal</option>
                        <option value="Harmonização">Harmonização</option>
                        <option value="Massagem">Massagem</option>
                      </>
                    ) : (
                      <>
                        <option value="Linha de Sais">Linha de Sais</option>
                        <option value="Aromas">Aromas</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Preço Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="250.00"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Custo Insumos (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Op: 20.00"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Impostos / Taxas (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Op: 5.0"
                    value={itemTax}
                    onChange={(e) => setItemTax(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {activeSegment === "Procedimentos" ? (
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Duração Média (Minutos)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="60"
                    value={itemDuration}
                    onChange={(e) => setItemDuration(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Volume/Peso Mínimo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 250ml ou 1kg"
                    value={itemVolume}
                    onChange={(e) => setItemVolume(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Upload da Foto (Opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      try {
                        const base64 = await fileToBase64(e.target.files[0]);
                        setItemImageStr(base64);
                      } catch (err) {
                        console.error("Error uploading image");
                      }
                    }
                  }}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2 text-xs font-bold file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Breve Descrição Ritualística
                </label>
                <textarea
                  placeholder="Detalhamento das propriedades e benefícios que o paciente experimentará..."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl p-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md"
                >
                  Salvar Produto/Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing Item modal popup sheet */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gold/35 animate-in zoom-in-95 duration-150 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-gold/12 pb-3">
              <h3 className="text-lg font-bold text-primary-dark">
                Editar{" "}
                {editingItem.type === "Serviço"
                  ? "Ritual de Procedimento"
                  : "Produto"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-on-surface-variant hover:text-red-500 font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleEditItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Massagem Sensorial Hot Stones"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  >
                    {editingItem.type === "Serviço" ? (
                      <>
                        <option value="Facial">Facial</option>
                        <option value="Corporal">Corporal</option>
                        <option value="Harmonização">Harmonização</option>
                        <option value="Massagem">Massagem</option>
                      </>
                    ) : (
                      <>
                        <option value="Linha de Sais">Linha de Sais</option>
                        <option value="Aromas">Aromas</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Preço Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="250.00"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Custo Insumos (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Op: 20.00"
                    value={editCost}
                    onChange={(e) => setEditCost(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Impostos / Taxas (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Op: 5.0"
                    value={editTax}
                    onChange={(e) => setEditTax(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              {editingItem.type === "Serviço" ? (
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Duração Média (Minutos)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="60"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                    Volume/Peso Mínimo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 250ml ou 1kg"
                    value={editVolume}
                    onChange={(e) => setEditVolume(e.target.value)}
                    className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Upload da Foto (PC/Celular)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      try {
                        const base64 = await fileToBase64(e.target.files[0]);
                        setEditImageStr(base64);
                      } catch (err) {
                        console.error("Error uploading image");
                      }
                    }
                  }}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl px-4 py-2 text-xs font-bold file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-dark uppercase mb-1">
                  Breve Descrição Ritualística
                </label>
                <textarea
                  placeholder="Detalhamento das propriedades e benefícios que o paciente experimentará..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-bg-base border border-gold/15 rounded-xl p-4 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2 border border-gold/20 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:shadow-md cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
