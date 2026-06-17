import { useState, useRef } from "react";
import { UserProgress, Certificate } from "../types";
import { translations, Language } from "../data/translations";
import { Award, CheckCircle, Download, Share2, Clipboard, Printer, Shield, Check, FileCheck, Star } from "lucide-react";

interface CertificateHubProps {
  progress: UserProgress;
  totalLessons: number;
  onUpdateUsername: (newName: string) => void;
  language?: Language;
}

export default function CertificateHub({
  progress,
  totalLessons,
  onUpdateUsername,
  language = "en"
}: CertificateHubProps) {
  const t = translations[language];
  const [recipient, setRecipient] = useState(progress.username || "");
  const [copiedCode, setCopiedCode] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const completedCount = progress.completedLessons.length;
  const isEligible = progress.xp >= 400;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 105)); // keep lessons info
  const xpPercent = Math.min(100, Math.round((progress.xp / 400) * 100));

  // Generate deterministic certificate metrics
  const uniqueCode = `W3-PY-${600 + progress.xp}-${(progress.username || "STUDENT").slice(0, 3).toUpperCase()}`;
  const currentDateString = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(uniqueCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="certification-room">
      {/* Visual Badge Card */}
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
          <Award size={48} className="animate-pulse" />
        </div>
        <div className="space-y-2 flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.cert_title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.cert_desc}
          </p>

          {/* Mini progress tracker */}
          <div className="pt-2 flex items-center justify-center md:justify-start gap-4">
            <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
              {progress.xp} / 400 XP ({xpPercent}%)
            </span>
          </div>
        </div>

        {isEligible ? (
          <div className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle size={15} /> {language === "pt" ? "Elegível" : "Eligible"}
          </div>
        ) : (
          <div className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
            {language === "pt" ? "Bloqueado" : "Locked"}
          </div>
        )}
      </div>

      {/* Settings Input (Adjust name on Certificate) */}
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          {t.cert_holder_title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {t.cert_holder_title}
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                onUpdateUsername(e.target.value);
              }}
              placeholder="e.g. Alice Lovelace"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => onUpdateUsername(recipient || "Pythonist Master")}
            className="py-2.5 px-4 text-xs font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all cursor-pointer"
          >
            {language === "pt" ? "Aplicar Alteração de Nome" : "Apply Name Changes"}
          </button>
        </div>
      </div>

      {/* Main Certificate Preview Canvas */}
      {isEligible ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">
              {language === "pt" ? "Credencial vetorial de alta fidelidade pronta para impressão:" : "Interactive print-ready high fidelity vector credential:"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer size={13} />
                {t.cert_print}
              </button>
              <button
                onClick={handleCopyCode}
                className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check size={13} className="text-emerald-500" /> : <Clipboard size={13} />}
                {copiedCode ? (language === "pt" ? "Copiado!" : "Copied!") : (language === "pt" ? "Copiar Código" : "Copy Serial")}
              </button>
            </div>
          </div>

          {/* Certificate Board style */}
          <div
            ref={printableRef}
            className="relative bg-amber-50/20 dark:bg-zinc-950 border-[14px] border-amber-800/40 dark:border-amber-950/60 rounded-3xl p-8 md:p-14 text-center space-y-8 select-none shadow-2xl dark:shadow-none"
            style={{
              backgroundImage: "radial-gradient(ellipse at center, rgba(235,166,45,0.02) 0%, rgba(0,0,0,0) 80%)",
            }}
          >
            {/* Elegant Corner Filigrees */}
            <div className="absolute top-4 left-4 text-amber-800/30 text-2xl font-serif">✥</div>
            <div className="absolute top-4 right-4 text-amber-800/30 text-2xl font-serif">✥</div>
            <div className="absolute bottom-4 left-4 text-amber-800/30 text-2xl font-serif">✥</div>
            <div className="absolute bottom-4 right-4 text-amber-800/30 text-2xl font-serif">✥</div>

            {/* Standard Certificate Title */}
            <div className="space-y-2">
              <div className="flex justify-center mb-1">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
                  W3SCHOOLS PYTHON ADVOCATE BOARD
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif tracking-wide text-amber-900 dark:text-amber-200">
                {t.cert_preview_title}
              </h1>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                {language === "pt" ? "Premiado por Desempenho Excepcional em Programação de Computadores" : "Awarded for Outstanding Achievement in Computer Programming"}
              </p>
            </div>

            {/* Presentation Line */}
            <div className="space-y-1">
              <p className="text-sm font-serif italic text-gray-500 dark:text-gray-400">
                {language === "pt" ? "Este certificado é orgulhosamente apresentado e verificado para:" : "This is proudly presented and verified to:"}
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight underline decoration-amber-600/30 underline-offset-8 text-indigo-700 dark:text-indigo-400 font-mono py-2">
                {recipient || progress.username || "Python Student"}
              </h2>
            </div>

            {/* Paragraph body */}
            <div className="max-w-xl mx-auto">
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                {language === "pt" ? (
                  <>
                    que dominou com sucesso os fundamentos da <strong>Linguagem de Programação Python</strong> por meio de consoles de laboratório interativos, estruturas de compilação, desafios de algoritmo ao vivo e acumulando mais de <span className="font-bold text-amber-600 font-mono">{progress.xp} XP</span>. O candidato demonstrou habilidade sólida em variáveis, funções, lógica de comparação, loops iterativos e coleções de listas estruturadas.
                  </>
                ) : (
                  <>
                    who has successfully mastered the fundamentals of the **Python Programming Language** via interactive laboratory consoles, compiling structures, live algorithm challenges, and scoring over <span className="font-bold text-amber-600 font-mono">{progress.xp} XP</span>. This candidate demonstrated reliable skill across variables, functions, comparison logic, iterative loops, and structured list collections.
                  </>
                )}
              </p>
            </div>

            {/* Certificate Footer Seal details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-amber-800/20 items-center">
              {/* Left Sign */}
              <div className="text-center md:text-left space-y-1">
                <p className="text-xs font-serif italic text-gray-400 dark:text-gray-500">
                  {language === "pt" ? "Instrutor Líder W3Schools" : "W3Schools Lead Instructor"}
                </p>
                <div className="w-32 h-6 border-b border-gray-400 mx-auto md:mx-0 font-serif text-sm text-gray-400 tracking-wider">
                  &ldquo;Guido Rossum&rdquo;
                </div>
                <p className="text-[10px] text-gray-400">{language === "pt" ? "Reitor de Currículo Python" : "Python Curriculum Dean"}</p>
              </div>

              {/* Gold Seal Center */}
              <div className="flex flex-col items-center space-y-1">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border-4 border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg relative">
                  <Award size={36} fill="currentColor" className="text-amber-500" />
                  <Star size={12} className="absolute -top-1 text-yellow-400 animate-spin" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                  {language === "pt" ? "SELO OFICIAL DE GRADUAÇÃO" : "OFFICIAL GRADUATE SEAL"}
                </span>
              </div>

              {/* Right Sign details */}
              <div className="text-center md:text-right space-y-1">
                <p className="text-[10px] text-gray-400">{language === "pt" ? "Data de Emissão:" : "Date of Award:"}</p>
                <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                  {currentDateString}
                </p>
                <div className="inline-flex items-center gap-1 text-[9px] text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-md border border-blue-500/10 font-mono">
                  <Shield size={9} />
                  SECURE SEC-{uniqueCode}
                </div>
              </div>
            </div>

            {/* Mini secure notes */}
            <div className="pt-2">
              <p className="text-[9px] font-sans text-gray-400 select-none">
                {language === "pt"
                  ? "Esta qualificação acadêmica incorpora validação online integral. Os detalhes principais podem ser verificados dinamicamente referenciando o identificador serial seguro dentro do painel do banco de dados do curso."
                  : "This academic qualification incorporates full online validation. Key details can be verified dynamically by referencing the secure serial identifier inside the course dashboard database."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 border border-dashed rounded-2xl p-10 text-center space-y-4">
          <Award size={48} className="mx-auto text-gray-300 dark:text-gray-700 animate-pulse" />
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">{t.cert_locked_title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {t.cert_locked_desc}
          </p>
          <div className="w-full max-w-xs mx-auto bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden mt-2">
            <div className="bg-indigo-600 h-full" style={{ width: `${xpPercent}%` }} />
          </div>
          <span className="text-xs font-bold font-mono text-gray-400 mt-1 block">
            {xpPercent}% {language === "pt" ? "para 400 XP" : "toward 400 XP"} ({progress.xp} / 400 XP)
          </span>
        </div>
      )}
    </div>
  );
}
