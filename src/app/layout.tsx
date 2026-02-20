import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RH Conecta Vagas",
  description: "Sistema de criação de posts profissionais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ADICIONADO crossOrigin="anonymous" ABAIXO: Isso resolve o erro de segurança */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Anton&family=Bebas+Neue&family=Caveat:wght@700&family=Dancing+Script:wght@700&family=Lobster&family=Lora:ital,wght@1,700&family=Merriweather:wght@900&family=Montserrat:wght@900&family=Oswald:wght@700&family=Pacifico&family=Playfair+Display:ital,wght@1,900&family=Raleway:wght@900&family=Roboto:wght@900&family=Satisfy&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}