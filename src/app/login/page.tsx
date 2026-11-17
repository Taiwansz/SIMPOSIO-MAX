"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  LogIn,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { SEED_USERS } from "@/lib/veritas-engine/seed-data";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("matheus.santos");
  const [password, setPassword] = useState("Veritas@2026");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Se ja estiver logado, redireciona para o dashboard
  useEffect(() => {
    fetch("/api/state", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.currentUser && window.sessionStorage.getItem("veritas_logged_out") !== "1") {
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          identifier,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha na autenticação");
      }

      window.sessionStorage.removeItem("veritas_logged_out");
      setSuccessMsg(`Bem-vindo de volta, ${data.user.full_name}! Redirecionando...`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (userId: string) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          quickSwitchUserId: userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha no login demo");
      window.sessionStorage.removeItem("veritas_logged_out");
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-[#0A0A0A] px-4 py-12 text-[#F0EDE6]">
      {/* Brilho de fundo sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 left-1/2 h-[380px] w-[600px] -translate-x-1/2 rounded-full bg-[#C8B560]/[0.08] blur-[120px]"
      />

      <div className="relative w-full max-w-md">
        {/* Voltar para Home */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs text-[#F0EDE6]/50 transition hover:text-[#C8B560]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para a página inicial</span>
        </Link>

        {/* Card de Login em Apple Liquid Glass */}
        <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414]/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo e Titulo */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2A2A2A] font-display text-xl font-bold text-[#C8B560] shadow-md transition hover:scale-105"
            >
              T
            </Link>
            <h1 className="mt-4 font-display text-xl font-semibold tracking-wide text-[#F0EDE6]">
              Acesse a Thinka
            </h1>
            <p className="mt-1 text-xs text-[#F0EDE6]/50">
              Entre com suas credenciais institucionais ou escolha um perfil
            </p>
          </div>

          {errorMsg && (
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#C8B560]/30 bg-[#C8B560]/10 p-3.5 text-xs text-[#C8B560]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F0EDE6]/70">
                E-mail ou Usuário
              </label>
              <div className="relative mt-1.5">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ex: matheus.santos ou seu e-mail"
                  className="w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] py-3 pl-10 pr-4 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560] focus:ring-1 focus:ring-[#C8B560]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Senha
                </label>
                <span className="text-[11px] text-[#C8B560]/70 hover:underline cursor-pointer">
                  Esqueceu a senha?
                </span>
              </div>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C5C5C]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] py-3 pl-10 pr-4 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560] focus:ring-1 focus:ring-[#C8B560]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C8B560] py-3.5 text-xs font-semibold text-[#0A0A0A] shadow-md transition hover:bg-[#F0EDE6] active:scale-[0.98] disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? "Entrando..." : "Entrar na Plataforma"}</span>
            </button>
          </form>

          {/* Atalho Demo para Avaliacao Rapida da Banca */}
          <div className="mt-6 border-t border-[#2A2A2A] pt-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#C8B560]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Acesso Rápido para Avaliação (Banca)</span>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {SEED_USERS.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(u.id)}
                  className="rounded-xl border border-[#2A2A2A] bg-[#1E1E1E]/60 p-2 text-center transition hover:border-[#C8B560] active:scale-95"
                >
                  <div className="truncate text-[11px] font-semibold text-[#F0EDE6]">
                    {u.social_name || u.full_name.split(" ")[0]}
                  </div>
                  <div className="font-mono text-[9px] uppercase text-[#C8B560]">
                    {u.role}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Link para Cadastro */}
          <div className="mt-6 text-center text-xs text-[#F0EDE6]/50">
            Ainda não tem acesso?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-[#C8B560] transition hover:underline"
            >
              Criar uma conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
