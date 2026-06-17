import { useState, useEffect } from "react";
import { UserProgress, LeaderboardUser } from "../types";
import { translations, Language } from "../data/translations";
import { Trophy, Flame, Search, Filter, Zap, RefreshCw, Trash2, ShieldAlert } from "lucide-react";

interface LeaderboardProps {
  progress: UserProgress;
  language?: Language;
}

export default function Leaderboard({ progress, language = "en" }: LeaderboardProps) {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [students, setStudents] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [resetError, setResetError] = useState("");

  const fetchStudents = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (data.success && Array.isArray(data.students)) {
        const mapped: LeaderboardUser[] = data.students.map((st: any) => {
          const xp = typeof st.xp === "number" ? st.xp : 0;
          return {
            username: st.username,
            xp: xp,
            streak: typeof st.streak === "number" ? st.streak : 0,
            category: xp >= 150 ? "Pro Pythonista" : xp >= 75 ? "Intermediate Byte-Sizer" : "Python Initiate",
            avatarSeed: st.userId || "st",
            isCurrentUser: st.username.toUpperCase() === progress.username.toUpperCase()
          };
        });
        setStudents(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard students:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Poll for live real-time scores every 5 seconds so different student desks keep updating!
  useEffect(() => {
    fetchStudents();
    const interval = setInterval(() => {
      fetchStudents(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [progress.username]);

  const handleResetScores = async () => {
    if (!adminPasswordInput.trim()) {
      setResetError("Please enter the Admin Password.");
      return;
    }
    try {
      const res = await fetch("/api/students/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPasswordInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowConfirmReset(false);
        setAdminPasswordInput("");
        setResetError("");
        fetchStudents();
      } else {
        setResetError(data.message || "Incorrect Admin Password.");
      }
    } catch (err) {
      console.error("Error resetting class leaderboard:", err);
      setResetError("Failed to contact host server.");
    }
  };

  // Sort by XP score descending
  const sortedUsers = [...students].sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return a.username.localeCompare(b.username); // Alfabetical tie-breaker
  });

  // Categories list
  const categories = ["All", "Pro Pythonista", "Intermediate Byte-Sizer", "Python Initiate"];

  const getCatLabel = (cat: string) => {
    if (language === "pt") {
      if (cat === "All" || cat === "all") return "Todos";
      if (cat === "Pro Pythonista") return "Mestre Pythonista 🐍";
      if (cat === "Intermediate Byte-Sizer") return "Programador Intermediário";
      if (cat === "Python Initiate") return "Iniciante Python";
    }
    return cat;
  };

  // Filters
  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || user.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6" id="leaderboard-section">
      
      {/* Visual Header */}
      <div className="text-center py-6 space-y-2 border-b border-gray-100 dark:border-gray-800">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600/10 text-indigo-500 mb-2">
          <Trophy size={28} className="animate-bounce text-[#74E39A] dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center justify-center gap-2">
          {language === "pt" ? "Arena de Placar da Classe" : "Class Leaderboard Arena"}
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold uppercase animate-pulse">
            ● {language === "pt" ? "SINC EM TEMPO REAL" : "LIVE SYNC"}
          </span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          {language === "pt"
            ? "Cada computador está conectado! Resolva lições, complete desafios em Python e ganhe pontos. Os scores atualizam de forma instantânea para todos!"
            : "Every computer is connected! Solve lessons, complete python programming runs and earn points. Scores are updated instantly for everyone!"}
        </p>

        {/* Small controller cluster */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={() => fetchStudents()}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            disabled={isRefreshing}
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin text-indigo-500" : ""} />
            <span>{isRefreshing ? (language === "pt" ? "Sincronizando..." : "Syncing...") : (language === "pt" ? "Sincronizar Agora" : "Sync Now")}</span>
          </button>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-3 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Trash2 size={12} />
            <span>{language === "pt" ? "Zerar Todo XP" : "Reset All XP"}</span>
          </button>
        </div>
      </div>

      {/* Confirmation modal wrapper */}
      {showConfirmReset && (
        <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={24} />
            <div>
              <p className="text-sm font-bold text-gray-950 dark:text-white">
                {language === "pt" ? "Tem certeza de que deseja limpar todas as pontuações da classe?" : "Are you sure you want to clear all classroom scores?"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === "pt"
                  ? "Isso redefinirá o XP e a contagem de ofensivas (streaks) de volta para 0 de todos os 32 arquivos dos alunos. Essa ação não pode ser desfeita."
                  : "This resets XP and streak counts back to 0 for all 32 student files. This action cannot be undone."}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 pt-4 border-t border-red-500/10">
            <div className="w-full md:w-auto flex-grow max-w-sm">
              <label className="block text-[10px] uppercase font-bold text-red-500 tracking-wider mb-1">
                {language === "pt" ? "Digite a Senha de Admin" : "Enter Admin Password"}
              </label>
              <input
                type="password"
                placeholder={language === "pt" ? "Senha de Admin..." : "Admin Password..."}
                value={adminPasswordInput}
                onChange={(e) => {
                  setAdminPasswordInput(e.target.value);
                  setResetError("");
                }}
                className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-red-500/20 rounded-xl text-xs text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              {resetError && (
                <p className="text-[10px] text-red-500 font-bold mt-1">{resetError}</p>
              )}
            </div>
            
            <div className="flex gap-2 w-full md:w-auto shrink-0 select-none">
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  setAdminPasswordInput("");
                  setResetError("");
                }}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 text-xs font-semibold rounded-lg text-gray-700 dark:text-gray-300 w-full md:w-auto cursor-pointer"
              >
                {language === "pt" ? "Cancelar" : "Cancel"}
              </button>
              <button
                onClick={handleResetScores}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg w-full md:w-auto transition-all active:scale-95 cursor-pointer"
              >
                {language === "pt" ? "Reiniciar Banco Agora" : "Reset Database Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium Showcase with fluid rendering */}
      {!isLoading && sortedUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          {sortedUsers.slice(0, 3).map((user, idx) => {
            const podiumStyles = [
              { bg: "bg-amber-500/5 border-amber-500/20 text-amber-500 dark:bg-amber-950/10 dark:border-amber-900", icon: "🥇", label: language === "pt" ? "Ouro Classe" : "Class Gold" },
              { bg: "bg-slate-400/5 border-slate-400/20 text-slate-400 dark:bg-slate-900/10 dark:border-slate-800", icon: "🥈", label: language === "pt" ? "Prata Classe" : "Class Silver" },
              { bg: "bg-amber-700/5 border-amber-700/20 text-amber-700 dark:bg-amber-950/5 dark:border-amber-950", icon: "🥉", label: language === "pt" ? "Bronze Classe" : "Class Bronze" },
            ];
            const rankStyle = podiumStyles[idx] || podiumStyles[2];

            return (
              <div
                key={user.username}
                className={`rounded-2xl border p-5 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.03] ${
                  user.isCurrentUser ? "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-950 bg-indigo-50/10 dark:bg-indigo-950/10" : ""
                } ${rankStyle.bg}`}
              >
                <span className="absolute top-3 right-3 text-2xl filter drop-shadow">{rankStyle.icon}</span>
                <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-extrabold text-lg text-indigo-600 dark:text-indigo-400 border shadow shadow-indigo-500/10 mb-3">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white truncate max-w-[200px]" title={user.username}>
                  {user.username}
                </h3>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 mt-1 uppercase">
                  {getCatLabel(user.category)}
                </p>
                <div className="mt-3 flex items-center gap-3 font-mono font-bold text-xs">
                  <span className="px-2.5 py-1 bg-white/60 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200">
                    {user.xp} XP
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-rose-500">
                    <Flame size={12} fill="currentColor" />
                    {user.streak}{language === "pt" ? "d" : "d"}
                  </span>
                </div>
                {user.isCurrentUser && (
                  <span className="mt-2.5 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] uppercase tracking-widest font-bold">
                    {language === "pt" ? "Você" : "You"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Control panel filter & search */}
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder={language === "pt" ? "Buscar alunos..." : "Search students..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {getCatLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-2 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center gap-2">
            <RefreshCw className="animate-spin text-indigo-500" size={24} />
            <span>{language === "pt" ? "Carregando placar ao vivo..." : "Loading live scores..."}</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-900">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                // Find index in sorted list for rank
                const actualRank = sortedUsers.findIndex(u => u.username === user.username) + 1;

                return (
                  <div
                    key={user.username}
                    className={`flex items-center justify-between p-3.5 transition-colors ${
                      user.isCurrentUser
                        ? "bg-indigo-500/5 hover:bg-indigo-500/10 font-bold"
                        : "hover:bg-gray-50/50 dark:hover:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank position circles */}
                      <span className={`w-8 font-mono text-xs font-bold leading-none ${
                        actualRank === 1 ? "text-amber-500" : actualRank === 2 ? "text-slate-400" : actualRank === 3 ? "text-orange-500" : "text-gray-400"
                      }`}>
                        #{actualRank}
                      </span>

                      {/* Avatar preview initials */}
                      <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                            {user.username}
                          </p>
                          {user.isCurrentUser && (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-indigo-600 text-white font-bold tracking-wide">
                              {language === "pt" ? "VOCÊ" : "YOU"}
                            </span>
                          )}
                          {user.xp > 0 && (
                            <Zap size={11} className="text-amber-400" fill="currentColor" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                          {getCatLabel(user.category)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono font-bold">
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-white">{user.xp} XP</p>
                        <p className="text-[9px] text-gray-400 font-sans tracking-wide">{language === "pt" ? "Pontuação total" : "Combined total"}</p>
                      </div>
                      
                      <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-red-50 dark:bg-red-950/10 rounded-lg text-rose-500 text-xs">
                        <Flame size={12} fill="currentColor" />
                        {user.streak}{language === "pt" ? "d" : "d"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                {language === "pt" ? "Nenhum aluno encontrado correspondente ao seu critério." : "No students found matching your criteria."}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
