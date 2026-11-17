"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import { UserRole } from "@/lib/veritas-engine/types";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("aluno");
  const [fullName, setFullName] = useState("");
  const [socialName, setSocialName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institution, setInstitution] = useState("Centro Universitário Max Planck (UniMAX)");
  const [course, setCourse] = useState("Ciência da Computação");
  const [specialization, setSpecialization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("A confirmação de senha não confere.");
      return;
    }
    if (!termsAccepted) {
      setErrorMsg("Você deve aceitar os termos de uso e política de privacidade.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          role,
          full_name: fullName,
          social_name: socialName,
          email,
          phone,
          birth_date: birthDate || "2004-05-10",
          username,
          password,
          institution,
          bio: `${role === "aluno" ? "Estudante" : role === "professor" ? "Docente" : "Gestor"} cadastrado na Thinka.`,
          terms_accepted: true,
          privacy_accepted: true,
          student_profile:
            role === "aluno"
              ? {
                  education_level: "Superior",
                  grade_year: "4o Semestre",
                  cohort_label: "Turma 2026",
                  shift: "Noturno",
                  course: course || "Ciência da Computação",
                  subjects_of_interest: ["Inteligência Artificial", "Sistemas Distribuídos"],
                  learning_goals: "Desenvolver autonomia técnica e defesa de autoria.",
                  academic_interests: "Pesquisa em IA e auditoria de modelos.",
                  registration_code: `RA-${Math.floor(10000000 + Math.random() * 90000000)}`,
                  advisor_teacher: "Profa. Helena Martins",
                }
              : undefined,
          teacher_profile:
            role === "professor"
              ? {
                  academic_degree: "Doutorado",
                  specialization: specialization || "Sistemas Inteligentes e Educação",
                  subjects_taught: ["Banco de Dados", "Algoritmos Avançados"],
                  professional_experience: "12 anos em docência universitária.",
                  professional_registry: "MEC-SP-84920",
                  linked_classes: [],
                  institutional_validation_code: "UNIMAX-DOC-2026",
                  availability: "Segunda a Quinta - Noturno",
                }
              : undefined,
          admin_profile:
            role === "administrador"
              ? {
                  institutional_email: email,
                  job_title: jobTitle || "Coordenador Acadêmico",
                  department: "Ciência da Computação",
                  access_level: "gestor_academico",
                  admin_permissions: ["classes.manage", "users.moderate", "metrics.read"],
                }
              : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha no cadastro");
      }

      window.sessionStorage.removeItem("veritas_logged_out");
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Erro no cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-[#0A0A0A] px-4 py-12 text-[#F0EDE6]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 left-1/2 h-[380px] w-[600px] -translate-x-1/2 rounded-full bg-[#C8B560]/[0.08] blur-[120px]"
      />

      <div className="relative w-full max-w-xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs text-[#F0EDE6]/50 transition hover:text-[#C8B560]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para a página inicial</span>
        </Link>

        <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414]/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2A2A2A] font-display text-xl font-bold text-[#C8B560] shadow-md transition hover:scale-105"
            >
              T
            </Link>
            <h1 className="mt-4 font-display text-xl font-semibold tracking-wide text-[#F0EDE6]">
              Crie sua Conta na Thinka
            </h1>
            <p className="mt-1 text-xs text-[#F0EDE6]/50">
              Escolha seu perfil acadêmico para personalizar sua experiência
            </p>
          </div>

          {/* Seletor de Perfil */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole("aluno")}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${
                role === "aluno"
                  ? "border-[#C8B560] bg-[#C8B560]/10 text-[#C8B560]"
                  : "border-[#2A2A2A] bg-[#1A1A1A] text-[#F0EDE6]/60 hover:border-[#5C5C5C]"
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span className="text-xs font-semibold">Aluno</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("professor")}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${
                role === "professor"
                  ? "border-[#C8B560] bg-[#C8B560]/10 text-[#C8B560]"
                  : "border-[#2A2A2A] bg-[#1A1A1A] text-[#F0EDE6]/60 hover:border-[#5C5C5C]"
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-xs font-semibold">Professor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("administrador")}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${
                role === "administrador"
                  ? "border-[#C8B560] bg-[#C8B560]/10 text-[#C8B560]"
                  : "border-[#2A2A2A] bg-[#1A1A1A] text-[#F0EDE6]/60 hover:border-[#5C5C5C]"
              }`}
            >
              <Shield className="h-5 w-5" />
              <span className="text-xs font-semibold">Administrador</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Nome de Usuário *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: matheus.computacao"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@unimax.edu.br"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(19) 99999-9999"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>
            </div>

            {/* Campos especificos por papel */}
            {role === "aluno" && (
              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Curso ou Série
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="ex: Ciência da Computação"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>
            )}

            {role === "professor" && (
              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Especialização / Área de Ensino
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="ex: Inteligência Artificial e Algoritmos"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>
            )}

            {role === "administrador" && (
              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Cargo Institucional
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="ex: Coordenador de Curso ou Gestor Acadêmico"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F0EDE6]/70">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className="mt-1 w-full rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-xs text-[#F0EDE6] placeholder-[#5C5C5C] outline-none transition focus:border-[#C8B560]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 pt-2 text-xs text-[#F0EDE6]/70 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 rounded accent-[#C8B560]"
              />
              <span>
                Li e aceito os Termos de Uso e a Política de Privacidade (LGPD).
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C8B560] py-3.5 text-xs font-semibold text-[#0A0A0A] shadow-md transition hover:bg-[#F0EDE6] active:scale-[0.98] disabled:opacity-50"
            >
              <UserPlus className="h-4 w-4" />
              <span>{loading ? "Criando Conta..." : "Criar Minha Conta"}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#F0EDE6]/50">
            Já possui uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#C8B560] transition hover:underline"
            >
              Entrar agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
