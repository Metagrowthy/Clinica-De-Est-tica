import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benessere Vita | ERP de Estética & Bem-estar Premium",
  description:
    "Sistema integrado premium Aura Wellness para a gestão de clínicas de estética, spas, prontuários, agendamentos, PDV e controle financeiro.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0..1,0"
        />
        <meta name="referrer" content="no-referrer" />
      </head>
      <body
        suppressHydrationWarning
        className="bg-bg-base text-[#1a1c1b] min-h-screen font-sans antialiased selection:bg-gold/30 selection:text-primary-dark"
      >
        {children}
      </body>
    </html>
  );
}
