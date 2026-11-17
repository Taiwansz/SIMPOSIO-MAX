import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VERITAS — De Quem e a Resposta? | IV Simposio de IA UniMAX",
  description:
    "Plataforma de Raio-X de Falhas da IA, Prova de Autoria em 60s e Arena ao Vivo da Sala de Aula. IV Simposio de Inteligencia Artificial da UniMAX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-[100dvh] bg-[#0A0A0A] text-[#F0EDE6] antialiased selection:bg-[#C8B560]/25 selection:text-[#F0EDE6]">
        {children}
      </body>
    </html>
  );
}
