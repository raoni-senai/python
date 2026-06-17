import { useState, useEffect } from "react";
import { UserProgress, CourseSection, Lesson } from "./types";
import { pythonCourseData } from "./data/lessons";
import { translations, Language } from "./data/translations";
import { getTranslatedCourseData } from "./data/lessonTranslations";
import Dashboard from "./components/Dashboard";
import LessonViewer from "./components/LessonViewer";
import Leaderboard from "./components/Leaderboard";
import CertificateHub from "./components/CertificateHub";
import {
  BookOpen,
  Trophy,
  Award,
  Sun,
  Moon,
  Compass,
  Sparkles,
  Zap,
  HelpCircle,
  Menu,
  X,
  PlusCircle,
  Home,
  CheckCircle,
  Play
} from "lucide-react";

export const CLASS_STUDENTS = [
  "ALICE CUNHA DE ANDRADE",
  "ASLAN DANICH LAVECKAS RODRIGUES",
  "BRENO CEZARETTO",
  "DULCE MARIA DE FATIMA DA SILVA",
  "EDUARDO GOMES NASCIMENTO DE SOUZA",
  "ERICK MATHEUS FLAUSINO DA CRUZ",
  "FELIPE GUILHERME DO PRADO CALABREZ",
  "GABRIEL HENRIQUE DE ARAUJO IENO",
  "GABRIEL PONCIANO MANCILHA",
  "GUILHERME ROBLEDILHO SILVA",
  "GUSTAVO CAMPOS DOS REIS",
  "GUSTAVO HENRIQUE DA SILVA CASTRO",
  "GUSTAVO HENRIQUE RAMOS DE PAULA",
  "HEITOR COSTA GOMES",
  "JOÃO PEDRO RIBEIRO FERNANDES",
  "JOÃO VICTOR SOUZA SANTOS",
  "JORGE CHAFIC MOGAMES MORAES",
  "JULIA PEREIRA ALVES DA SILVA",
  "KAMILY DE MOURA OLIVEIRA",
  "LÍVIA DE PAULA RIBEIRO FEITAL MENDES",
  "LUÍS FELIPE VIEIRA CONCEIÇÃO",
  "MARIA CLARA RIBEIRO JUNHO FERREIRA",
  "MARIA EDUARDA MORRONI CRUZ",
  "MIGUEL BARROS SOBRINHO",
  "MIGUEL OLIVEIRA BUCHERI",
  "PABLO EMANOEL CANDIDO CARDOSO GOMES",
  "PABLO GONÇALVES CASTELO BRANCO",
  "PABLO VINÍCIUS FAGUNDES SANTOS",
  "PEDRO AUGUSTO BARBOSA DE FREITAS",
  "SARAH SANCHES PINHEIRO GONZAGA",
  "THALITA TEIXEIRA COMISSARIO",
  "YASMIN AUGUSTA ANJOS DA SILVA"
];

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("python_w3_darkMode");
    return saved ? saved === "true" : true; // Default to eye-safe dark theme
  });

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("python_w3_language");
    return (saved as Language) || "pt";
  });

  const t = translations[language];

  // Active view tab state: 'dashboard' | 'lessons' | 'leaderboard' | 'certificates' | 'playground'
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Selected lesson inside pathway state
  const [selectedLessonId, setSelectedLessonId] = useState<string>("intro");

  // Mobile menu toggle open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock / claim mechanism states
  const [claimedName, setClaimedName] = useState<string | null>(() => {
    return localStorage.getItem("python_w3_claimed_name");
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");

  const [useCustomName, setUseCustomName] = useState(false);
  const [typedCustomName, setTypedCustomName] = useState("");
  const [customNameError, setCustomNameError] = useState("");

  // User details state
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("python_w3_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback default
      }
    }
    return {
      userId: "user-101",
      username: "Python Apprentice",
      xp: 0,
      streak: 0,
      lastActive: null,
      completedLessons: [],
      completedQuizzes: [],
      milestonesReached: []
    };
  });

  // Sync claimed name block state
  useEffect(() => {
    if (claimedName && progress.username !== claimedName) {
      const isPredefined = CLASS_STUDENTS.includes(claimedName);
      const computedUserId = isPredefined 
        ? `student-${CLASS_STUDENTS.indexOf(claimedName) + 1}`
        : `dynamic-${claimedName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      setProgress(prev => ({
        ...prev,
        username: claimedName,
        userId: computedUserId
      }));
    }
  }, [claimedName]);

  const handleSelectStudent = (name: string) => {
    localStorage.setItem("python_w3_claimed_name", name);
    setClaimedName(name);
    const isPredefined = CLASS_STUDENTS.includes(name);
    const computedUserId = isPredefined 
      ? `student-${CLASS_STUDENTS.indexOf(name) + 1}`
      : `dynamic-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    setProgress({
      userId: computedUserId,
      username: name,
      xp: 0,
      streak: 1,
      lastActive: new Date().toISOString(),
      completedLessons: [],
      completedQuizzes: [],
      milestonesReached: []
    });
  };

  // Fetch real-time student state from server on username change
  useEffect(() => {
    if (progress.username && progress.username !== "Python Apprentice") {
      fetch("/api/students")
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.students)) {
            const serverUser = data.students.find(
              (s: any) => s.username.toUpperCase() === progress.username.toUpperCase()
            );
            if (serverUser) {
              setProgress({
                userId: serverUser.userId || `student-${Date.now()}`,
                username: serverUser.username,
                xp: typeof serverUser.xp === "number" ? serverUser.xp : 0,
                streak: typeof serverUser.streak === "number" ? serverUser.streak : 0,
                lastActive: serverUser.lastActive,
                completedLessons: Array.isArray(serverUser.completedLessons) ? serverUser.completedLessons : [],
                completedQuizzes: Array.isArray(serverUser.completedQuizzes) ? serverUser.completedQuizzes : [],
                milestonesReached: Array.isArray(serverUser.milestonesReached) ? serverUser.milestonesReached : [],
                certificateUuid: serverUser.certificateUuid
              });
            }
          }
        })
        .catch(err => console.error("Error fetching student profile:", err));
    }
  }, [progress.username]);

  // Sync to local storage AND remote node server on update
  useEffect(() => {
    localStorage.setItem("python_w3_progress", JSON.stringify(progress));
    
    if (progress.username && progress.username !== "Python Apprentice") {
      fetch("/api/students/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: progress.username,
          progress
        })
      })
      .then(res => res.json())
      .catch(err => console.error("Error syncing progress to server database:", err));
    }
  }, [progress]);

  // Apply visual theme to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("python_w3_darkMode", String(darkMode));
  }, [darkMode]);

  // Persist language state
  useEffect(() => {
    localStorage.setItem("python_w3_language", language);
  }, [language]);

  // Dynamic localized curriculum
  const courseData = getTranslatedCourseData(pythonCourseData, language);

  // Flattened list of lessons for quick retrieval and navigation indexes
  const allLessons: Lesson[] = courseData.flatMap((section) => section.lessons);
  const activeLessonIndex = allLessons.findIndex((l) => l.id === selectedLessonId);
  const currentLessonObj = allLessons[activeLessonIndex] || allLessons[0];

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab("lessons");
    setMobileMenuOpen(false);
  };

  const handleCompleteQuestionOrLesson = (lessonId: string, xpGained: number) => {
    setProgress((prev) => {
      const alreadyLessonDone = prev.completedLessons.includes(lessonId);
      const updatedLessons = alreadyLessonDone
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];

      // Streak logic
      let currentStreak = prev.streak;
      const todayString = new Date().toDateString();
      const lastActiveString = prev.lastActive ? new Date(prev.lastActive).toDateString() : "";
      
      if (lastActiveString !== todayString) {
        currentStreak += 1;
      }

      return {
        ...prev,
        xp: prev.xp + xpGained,
        completedLessons: updatedLessons,
        lastActive: new Date().toISOString(),
        streak: currentStreak
      };
    });
  };

  const handleUpdateUsername = (newName: string) => {
    setProgress((prev) => ({
      ...prev,
      username: newName || "Python Apprentice"
    }));
  };

  // Navigators
  const navigateNext = () => {
    if (activeLessonIndex < allLessons.length - 1) {
      setSelectedLessonId(allLessons[activeLessonIndex + 1].id);
    }
  };

  const navigatePrev = () => {
    if (activeLessonIndex > 0) {
      setSelectedLessonId(allLessons[activeLessonIndex - 1].id);
    }
  };

  if (!claimedName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-55 dark:bg-gray-950 p-4 transition-colors duration-300 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="absolute top-6 right-6 flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(l => l === "en" ? "pt" : "en")}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-xs font-bold font-sans transition-colors flex items-center gap-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-sm cursor-pointer"
            title={language === "en" ? "Mudar para Português" : "Switch to English"}
          >
            <span>{language === "en" ? "🇺🇸 EN" : "🇧🇷 PT"}</span>
          </button>
          
          {/* Theme switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-450 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 lg:border-gray-800/60 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6 flex flex-col items-center text-center relative z-10 animate-scaleUp">
          
          {/* Large brand identifier */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-lg transform rotate-3">
            <span className="font-mono font-extrabold text-[#74E39A] text-2xl">W3</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase">
              {t.app_title}
            </h1>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase">
              {language === "pt" ? "PORTAL DO ESTUDANTE" : "STUDENT LAB LOGIN"}
            </p>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {language === "pt" ? "Quem está acessando o laboratório hoje?" : "Who is entering the laboratory today?"}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed text-center max-w-sm">
              {t.onboarding_desc}
            </p>
          </div>

          {/* Student selection dropdown or custom name entry */}
          <div className="w-full space-y-3 pt-2 text-left">
            {!useCustomName ? (
              <>
                <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider font-mono">
                  {language === "pt" ? "Escolha seu nome na chamada" : "Claim your name on the roster"}
                </label>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      if (selectedName) {
                        handleSelectStudent(selectedName);
                      }
                    }}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800/80 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer shadow-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>{t.onboarding_select}</option>
                    {CLASS_STUDENTS.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <span className="text-[10px]">▼</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUseCustomName(true);
                    setTypedCustomName("");
                    setCustomNameError("");
                  }}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-4 text-center w-full block cursor-pointer transition-all"
                >
                  {language === "pt" ? "✨ Meu nome não está na chamada (Digitar Nome)" : "✨ My name is not on the roster (Type Name)"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectStudent(language === "pt" ? "VISITANTE" : "GUEST");
                  }}
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:underline mt-2.5 text-center w-full block cursor-pointer transition-all"
                >
                  {language === "pt" ? "👤 Entrar sem identificar (Acessar como Visitante)" : "👤 Enter anonymously (Access as Guest)"}
                </button>
              </>
            ) : (
              <>
                <label className="block text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider font-mono">
                  {language === "pt" ? "Digite seu nome completo ou apelido" : "Enter your full name or nickname"}
                </label>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={typedCustomName}
                    onChange={(e) => {
                      setTypedCustomName(e.target.value);
                      if (e.target.value.trim().length >= 3) {
                        setCustomNameError("");
                      }
                    }}
                    placeholder={language === "pt" ? "Ex: Lucas Santos..." : "E.g. Lucas Santos..."}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800/80 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
                    autoFocus
                  />
                  
                  {customNameError && (
                    <p className="text-[10px] text-rose-500 font-bold font-mono">{customNameError}</p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = typedCustomName.trim();
                        if (trimmed.length < 3) {
                          setCustomNameError(
                            language === "pt" 
                              ? "⚠️ Digite pelo menos 3 caracteres." 
                              : "⚠️ Enter at least 3 characters."
                          );
                          return;
                        }
                        handleSelectStudent(trimmed.toUpperCase());
                      }}
                      className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer text-center"
                    >
                      {language === "pt" ? "Entrar no Lab 🚀" : "Enter Lab 🚀"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomName(false);
                        setCustomNameError("");
                      }}
                      className="py-2.5 px-4 bg-gray-100 hover:bg-gray-250 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-750 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center"
                    >
                      {language === "pt" ? "Voltar" : "Back"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2 font-mono">
            <span>🛡️</span>
            <span>
              {language === "pt" 
                ? "Sem necessidade de login Google ou senhas." 
                : "No Google authentication or passwords required."}
            </span>
          </div>

        </div>
        
        {/* Footer brand snippet */}
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-6">
          W3Schools Python Simulator • {t.footer_tag}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      
      {/* Top Main W3Schools Header bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 shadow-sm" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo brand and subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md">
              <span className="font-mono font-extrabold text-[#74E39A] text-lg">W3</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-xs md:text-sm uppercase text-gray-900 dark:text-white">
                  {t.app_title}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-bold uppercase tracking-wide">
                  W3-Sim
                </span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{t.app_subtitle}</p>
            </div>
          </div>

          {/* Center navigation controls (Desktop large layout) */}
          <nav className="hidden lg:flex items-center gap-1.5 font-sans">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              {t.nav_dashboard}
            </button>
            <button
              onClick={() => {
                setActiveTab("lessons");
                setSelectedLessonId("intro");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "lessons"
                  ? "bg-indigo-600 text-white"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              {t.nav_syllabus}
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "leaderboard"
                  ? "bg-indigo-600 text-white"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              {t.nav_leaderboard}
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === "certificates"
                  ? "bg-indigo-600 text-white"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              {t.nav_certificates}
            </button>
          </nav>

          {/* Right toggle utilities (Streak tracking, light/dark buttons) */}
          <div className="flex items-center gap-3">
            
            {/* Lock-protected Student Profile Badge */}
            {claimedName ? (
              <div 
                className="py-1 px-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm relative group cursor-help select-none"
                title={t.desk_locked_msg}
                onClick={() => {
                  setIsAdminOpen(true);
                  setAdminPasswordInput("");
                  setAdminError("");
                  setAdminSuccess("");
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[110px] md:max-w-[150px] truncate">{claimedName}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">🔒</span>
                
                <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-gray-800 text-[10px] text-white px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 font-semibold">
                  {t.desk_locked_tooltip}
                </span>
              </div>
            ) : (
              /* Quick profile select dropdown for new users */
              <select
                value={CLASS_STUDENTS.includes(progress.username) ? progress.username : ""}
                onChange={(e) => {
                  const name = e.target.value;
                  if (name) {
                    handleSelectStudent(name);
                  }
                }}
                className="py-1 px-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-extrabold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[130px] md:max-w-[180px] truncate"
              >
                <option value="" disabled>{t.student_login}</option>
                {CLASS_STUDENTS.map(stName => (
                  <option key={stName} value={stName}>
                    {stName}
                  </option>
                ))}
              </select>
            )}

            {/* Quick point capsule */}
            <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-mono font-bold flex items-center gap-1">
              <Zap size={13} fill="currentColor" />
              <span>{progress.xp} {t.xp_short}</span>
            </div>

            {/* Quick streak flame */}
            <div className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-mono font-bold flex items-center gap-1">
              <span>🔥 {progress.streak}{t.streak_short}</span>
            </div>

            {/* Language Toggle Button */}
            <button
              onClick={() => setLanguage(l => l === "en" ? "pt" : "en")}
              className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-xs font-bold font-sans transition-colors flex items-center gap-1 cursor-pointer bg-white/50 dark:bg-gray-950/50 text-gray-700 dark:text-gray-300"
              title={language === "en" ? "Mudar para Português" : "Switch to English"}
            >
              <span>{language === "en" ? "🇺🇸 EN" : "🇧🇷 PT"}</span>
            </button>

            {/* Dark mode switcher button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Mobile menu drawer trigger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile drawer listing navigation tabs options */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 p-4 space-y-2 relative z-20">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenuOpen(false);
            }}
            className={`w-full py-2.5 px-4 text-left text-xs font-bold rounded-xl transition-all ${
              activeTab === "dashboard" ? "bg-indigo-600 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.nav_dashboard}
          </button>
          
          <button
            onClick={() => {
              setActiveTab("lessons");
              setSelectedLessonId("intro");
              setMobileMenuOpen(false);
            }}
            className={`w-full py-2.5 px-4 text-left text-xs font-bold rounded-xl transition-all ${
              activeTab === "lessons" ? "bg-indigo-600 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.nav_syllabus}
          </button>

          <button
            onClick={() => {
              setActiveTab("leaderboard");
              setMobileMenuOpen(false);
            }}
            className={`w-full py-2.5 px-4 text-left text-xs font-bold rounded-xl transition-all ${
              activeTab === "leaderboard" ? "bg-indigo-600 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.nav_leaderboard}
          </button>

          <button
            onClick={() => {
              setActiveTab("certificates");
              setMobileMenuOpen(false);
            }}
            className={`w-full py-2.5 px-4 text-left text-xs font-bold rounded-xl transition-all ${
              activeTab === "certificates" ? "bg-indigo-600 text-white" : "hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.nav_certificates}
          </button>
        </div>
      )}

      {/* Main Container Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Onboarding Student Selector Widget: Encourage selecting their authentic name from the 32 student directory */}
        {!claimedName && (
          <div className="bg-gradient-to-r from-indigo-600/10 via-indigo-500/5 to-emerald-500/10 border border-indigo-500/20 dark:border-indigo-500/30 rounded-2xl p-6 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Trophy size={24} className="animate-pulse" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-950 dark:text-white">{t.onboarding_title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl">
                  {t.onboarding_desc}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0 select-none">
              <select
                onChange={(e) => {
                  const selectedName = e.target.value;
                  if (selectedName) {
                    handleSelectStudent(selectedName);
                  }
                }}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none flex-grow"
                defaultValue=""
              >
                <option value="" disabled>{t.onboarding_select}</option>
                {CLASS_STUDENTS.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* View switching panel wrapper router */}
        {activeTab === "dashboard" && (
          <Dashboard
            progress={progress}
            courseSections={courseData}
            onSelectLesson={handleSelectLesson}
            onSelectTab={setActiveTab}
            language={language}
          />
        )}

        {activeTab === "lessons" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Sub-sidebar: Interactive syllabus indices tree */}
            <div className="md:col-span-3 space-y-4">
              <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 pb-2 border-b border-gray-100 dark:border-gray-900">
                  {t.lesson_syllabus_title}
                </h3>

                <div className="space-y-4">
                  {courseData.map((section) => (
                    <div key={section.id} className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                        {section.title}
                      </p>
                      
                      <div className="space-y-1 pl-1">
                        {section.lessons.map((lesson) => {
                          const isSelected = lesson.id === selectedLessonId;
                          const isDone = progress.completedLessons.includes(lesson.id);

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                setSelectedLessonId(lesson.id);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className={`w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                                isSelected
                                  ? "bg-indigo-600 text-white"
                                  : "bg-transparent text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900"
                              }`}
                            >
                              <span className="truncate pr-1">{lesson.title}</span>
                              {isDone ? (
                                <span className={isSelected ? "text-[#74E39A]" : "text-emerald-500"}>
                                  ✓
                                </span>
                              ) : (
                                <span className="opacity-40 text-[10px]">{t.lesson_uncompleted_check}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right content view wrapper */}
            <div className="md:col-span-9">
              <LessonViewer
                lesson={currentLessonObj}
                progress={progress}
                onCompleteLesson={handleCompleteQuestionOrLesson}
                onNavigateNext={navigateNext}
                onNavigatePrev={navigatePrev}
                hasPrev={activeLessonIndex > 0}
                hasNext={activeLessonIndex < allLessons.length - 1}
                language={language}
              />
            </div>

          </div>
        )}

        {activeTab === "leaderboard" && (
          <Leaderboard progress={progress} language={language} />
        )}

        {activeTab === "certificates" && (
          <CertificateHub
            progress={progress}
            totalLessons={allLessons.length}
            onUpdateUsername={handleUpdateUsername}
            language={language}
          />
        )}

        {activeTab === "playground" && (
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b pb-4 border-gray-100 dark:border-gray-900">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Compass size={20} className="text-indigo-600" />
                {t.sandbox_title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.sandbox_desc}
              </p>
            </div>

            <LessonViewer
              lesson={{
                id: "sandbox",
                title: language === "pt" ? "Área de Testes Python Livre" : "W3Schools Infinite Sandbox Playground",
                summary: language === "pt" ? "Experimente escrever seus próprios scripts" : "Experiment writing custom programs",
                contentMarkdown: language === "pt" 
                  ? "Boas-vindas! Use este espaço livre para criar seus próprios códigos sem limitações. Defina variáveis, condicionais, repetições, arrays ou listas livres e clique em **Executar Código** para ver o resultado instantaneamente no console."
                  : "Welcome! Use this space to write freeform scripts beyond lesson limits. Trigger variables declarations, dictionary arrays, conditional operations, or loops. Press **Run Code** to print stdout traces instantly.",
                estimatedMinutes: 10,
                examples: [
                  {
                    id: "sandbox-ex",
                    title: language === "pt" ? "Programa de Rascunho" : "Scratchpad Program",
                    code: "# Python Freeplay Lab\nscore = 450\nname = \"Alice\"\nprint(\"Debugging student:\", name)\n\nif score >= 400:\n    print(name, \"is eligible for Certified Graduation!\")\nelse:\n    print(\"Keep up the coding!\")",
                    explanation: language === "pt" ? "Um modelo limpo de teste para experimentar a linguagem." : "This is a clean template designed to enable random tests and experimental structures.",
                    expectedOutput: ""
                  }
                ],
                quizQuestions: []
              }}
              progress={progress}
              onCompleteLesson={() => {}}
              onNavigateNext={() => {}}
              onNavigatePrev={() => {}}
              hasPrev={false}
              hasNext={false}
              language={language}
            />
          </div>
        )}

      </main>

      {/* Humble aesthetic bottom block, following structural guidelines strictly */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 mt-16 py-8" id="footer-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-gray-300">W3Schools Python Simulator</span>
            <span>•</span>
            <span>{t.footer_tag}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{t.footer_curriculum}</span>
            <span>•</span>
            <button
              onClick={() => {
                setIsAdminOpen(true);
                setAdminPasswordInput("");
                setAdminError("");
                setAdminSuccess("");
              }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-all underline decoration-dotted flex items-center gap-1 cursor-pointer"
            >
              {t.instructor_desk}
            </button>
          </div>
        </div>
      </footer>

      {/* Secure Instructor / Administrator Admin Modal Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-3">
              <h3 className="text-sm font-extrabold text-gray-950 dark:text-white flex items-center gap-2">
                <span>{t.instructor_title}</span>
              </h3>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-200 transition-all text-xs font-bold p-1 cursor-pointer"
              >
                {t.instructor_close}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {t.instructor_desc}
            </p>

            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                {t.instructor_password_label}
              </label>
              <input
                type="password"
                placeholder={t.instructor_password_placeholder}
                value={adminPasswordInput}
                onChange={(e) => {
                  setAdminPasswordInput(e.target.value);
                  setAdminError("");
                  setAdminSuccess("");
                }}
                className="w-full px-4.5 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-950 dark:text-white"
              />
              {adminError && (
                <p className="text-xs text-rose-500 font-semibold">{adminError}</p>
              )}
              {adminSuccess && (
                <p className="text-xs text-emerald-500 font-semibold">{adminSuccess}</p>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-900 flex flex-col gap-2.5">
              
              {/* Option 1: Unlock/Reset current device desk student name */}
              <button
                onClick={async () => {
                  const pass = adminPasswordInput.trim().toLowerCase();
                  const valids = ["asus"];
                  if (!valids.includes(pass)) {
                    setAdminError(t.instructor_error);
                    return;
                  }
                  
                  // Reset local claim
                  localStorage.removeItem("python_w3_claimed_name");
                  localStorage.removeItem("python_w3_progress");
                  setClaimedName(null);
                  setProgress({
                    userId: "user-101",
                    username: "Python Apprentice",
                    xp: 0,
                    streak: 0,
                    lastActive: null,
                    completedLessons: [],
                    completedQuizzes: [],
                    milestonesReached: []
                  });
                  setAdminSuccess(t.instructor_released_success);
                  setAdminPasswordInput("");
                  setTimeout(() => {
                    setIsAdminOpen(false);
                  }, 1200);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {t.instructor_btn_unlock}
              </button>

              {/* Option 2: Reset entire leaderboard */}
              <button
                onClick={async () => {
                  const pass = adminPasswordInput.trim().toLowerCase();
                  const valids = ["asus"];
                  if (!valids.includes(pass)) {
                    setAdminError(t.instructor_error);
                    return;
                  }
                  
                  try {
                    const res = await fetch("/api/students/reset", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ password: pass })
                    });
                    const d = await res.json();
                    if (res.ok && d.success) {
                      setAdminSuccess(t.instructor_reset_success);
                      setAdminPasswordInput("");
                      setTimeout(() => {
                        setIsAdminOpen(false);
                      }, 1200);
                    } else {
                      setAdminError(d.message || "Leaderboard write permission denied.");
                    }
                  } catch (e) {
                     setAdminError("Unable to contact database server.");
                  }
                }}
                className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {t.instructor_btn_reset_all}
              </button>

              <button
                onClick={() => setIsAdminOpen(false)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                {t.instructor_cancel}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
