import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThAthena MAX // Sovereign Epistemic OS — IV Simposio de IA UniMAX",
  description:
    "Infraestrutura cognitiva ativa com E-DAG O(V+E), Gemeo Bayesiano O(1), Inquisidor Socratico Adversarial e Avaliacoes Isomorficas SHA-256. Submissao oficial ao IV Simposio de Inteligencia Artificial da UniMAX.",
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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#060606] text-[#F1F5F9] antialiased selection:bg-[#C8B560]/25 selection:text-[#FFF2AC]">
        {children}
      </body>
    </html>
  );
}
