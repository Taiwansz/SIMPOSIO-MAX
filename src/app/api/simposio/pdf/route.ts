import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const candidates = [
    path.join(process.cwd(), "SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf"),
    path.join(process.cwd(), "public", "SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf"),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf"',
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  }

  return NextResponse.json(
    { error: "Arquivo oficial SUBMISSAO_EDITAL_IV_SIMPOSIO_IA.pdf nao encontrado." },
    { status: 404 }
  );
}
