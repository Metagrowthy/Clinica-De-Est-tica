export const DRE_CATEGORIES = {
  RECEITA_OPERACIONAL_BRUTA: [
    "Receita Injetáveis",
    "Receita SPA e Bem-Estar",
    "Receita de Pacotes ou Combos SPA /Injetaveis",
    "Receita Venda Produtos (Home Care)",
  ],
  DEDUCOES_DE_RECEITA: [
    "Impostos sobre Faturamento",
    "Taxas de Cartão/Parcelamento",
    "Taxa de antecipação do cartão de credito",
    "Comissões de Vendas",
  ],
  CUSTOS_VARIAVEIS: [
    "Biomateriais e Insumos Injetáveis",
    "Cosméticos e Insumos SPA",
    "Pacotes ou Combos SPA/Injetáveis",
    "Descartáveis / Lavanderia/ Insumos de vela",
  ],
  DESPESAS_FIXAS: [
    "Folha Salarial - Pró Labore",
    "Aluguel",
    "Manutenção da sala",
    "Condominio/IPTU",
    "IPTU",
    "Investimento em Marketing e Tráfego Pago",
    "Energia",
    "Água",
    "Internet",
    "Telefone",
    "Taxa de limpeza",
    "Coleta - PGRSS",
    "Softwares e Contabilidade",
    "Taxa de Alvará",
    "Material de Escritório",
    "Capsula de café/ Chá/Açucar/Adoçantes",
  ],
  RESULTADO_FINAL: [
    "Depreciação de Equipamentos",
    "Juros/Despesas Financeiras 60X parcelas",
    "Seguro Fiança",
    "Seguro contra incêndio",
  ],
};

export function getDreSubCategoriesList(): string[] {
  let list: string[] = [];
  Object.values(DRE_CATEGORIES).forEach((arr) => {
    list = [...list, ...arr];
  });
  return list;
}
