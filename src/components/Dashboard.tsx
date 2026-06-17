import { useState } from "react";
import { UserProgress, CourseSection, Lesson } from "../types";
import { translations, Language } from "../data/translations";
import {
  Trophy,
  Flame,
  CheckCircle,
  Play,
  Award,
  BookOpen,
  HelpCircle,
  Compass,
  Calendar,
  Sparkles,
  Zap,
  Star
} from "lucide-react";

interface DashboardProps {
  progress: UserProgress;
  courseSections: CourseSection[];
  onSelectLesson: (lessonId: string) => void;
  onSelectTab: (tab: string) => void;
  language?: Language;
}

export default function Dashboard({
  progress,
  courseSections,
  onSelectLesson,
  onSelectTab,
  language = "en"
}: DashboardProps) {
  const t = translations[language];
  // Find standard lessons flattened
  const allLessons: Lesson[] = courseSections.flatMap((s) => s.lessons);
  const totalLessonsCount = allLessons.length;
  const completedCount = progress.completedLessons.length;
  const completionPercentage =
    totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  // Find next lesson to complete
  const nextLesson = allLessons.find((l) => !progress.completedLessons.includes(l.id)) || allLessons[0];

  // Dynamic user tier based on XP
  const getUserTier = (xp: number) => {
    if (xp >= 150) return { name: language === "pt" ? "Mestre Pythonista 🐍" : "Pro Pythonista 🐍", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    if (xp >= 75) return { name: language === "pt" ? "Programador Intermediário" : "Intermediate Byte-Sizer", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    return { name: language === "pt" ? "Iniciante Python" : "Python Initiate", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
  };

  const currentTier = getUserTier(progress.xp);

  // Daily challenges
  const dailyQuests = [
    { id: "q1", title: language === "pt" ? "Conclua sua primeira lição" : "Complete your first lesson", done: progress.completedLessons.length > 0, xp: 20 },
    { id: "q2", title: language === "pt" ? "Execute um código interativo" : "Demonstrate live code running", done: progress.completedQuizzes.length > 0, xp: 30 },
    { id: "q3", title: language === "pt" ? "Alcance mais de 100 XP totais" : "Reach over 100 XP overall", done: progress.xp >= 100, xp: 50 }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="dashboard-hub">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-950 via-gray-900 to-indigo-950 border border-gray-800 p-6 md:p-8 text-white shadow-xl dark:border-gray-800">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen size={240} className="text-white rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles size={13} />
            Python W3Schools Learning Pathway
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {language === "pt" ? "Olá" : "Hi"}, <span className="text-indigo-400 font-mono">{progress.username || (language === "pt" ? "Aluno de Python" : "Python Student")}</span>! {language === "pt" ? "Pronto para programar?" : "Ready to script?"}
          </h1>
          
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            {t.db_welcome_subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectLesson(nextLesson.id)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-medium text-sm rounded-xl inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-indigo-600/20 active:scale-95 text-white cursor-pointer"
              id="btn-resume-quest"
            >
              <Play size={16} fill="currentColor" />
              {completedCount === 0 ? (language === "pt" ? "Iniciar Primeira Lição" : "Start First Lesson") : (language === "pt" ? "Retomar de Onde Parou" : "Resume Learning Journey")}
            </button>
            <button
              onClick={() => onSelectTab("playground")}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 font-medium text-sm rounded-xl inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Compass size={16} />
              {language === "pt" ? "Abrir Área de Rascunho Livre" : "Open Live Playground"}
            </button>
          </div>
        </div>
      </div>

      {/* Main stats group */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="stats-section">
        {/* Stat Item 1 (XP) */}
        <div className="rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 p-4 shadow-sm flex items-center justify-between transition-all hover:border-indigo-500/45">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{language === "pt" ? "Pontuação Total" : "Total Score"}</p>
            <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{progress.xp} XP</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Award size={22} />
          </div>
        </div>

        {/* Stat Item 2 (Streak) */}
        <div className="rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 p-4 shadow-sm flex items-center justify-between transition-all hover:border-indigo-500/45">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{language === "pt" ? "Dias Consecutivos" : "Active Streak"}</p>
            <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
              {progress.streak} {progress.streak === 1 ? (language === "pt" ? "dia" : "day") : (language === "pt" ? "dias" : "days")}
            </p>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
            <Flame size={22} className={progress.streak > 0 ? "animate-pulse" : ""} />
          </div>
        </div>

        {/* Stat Item 3 (Completion Percentage) */}
        <div className="rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 p-4 shadow-sm flex items-center justify-between transition-all hover:border-indigo-500/45">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{language === "pt" ? "Progresso da Grade" : "Syllabus Progress"}</p>
            <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">{completionPercentage}%</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <CheckCircle size={22} />
          </div>
        </div>

        {/* Stat Item 4 (Current Tier) */}
        <div className="rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 p-4 shadow-sm flex items-center justify-between transition-all hover:border-indigo-500/45">
          <div className="space-y-1 w-2/3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{language === "pt" ? "Rank de Programador" : "Current Rank"}</p>
            <p className="text-sm font-bold truncate text-gray-900 dark:text-white">
              {currentTier.name}
            </p>
          </div>
          <div className={`px-2 py-1.5 rounded-lg border text-xs font-semibold ${currentTier.color}`}>
            🐍
          </div>
        </div>
      </div>

      {/* Progress & Milestone section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Path Map & Milestone) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Compass size={18} className="text-indigo-500" />
                Python Certification Pathway
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {completedCount} of {totalLessonsCount} Completed
              </span>
            </div>

            {/* Course Pathway Grid */}
            <div className="space-y-4">
              {courseSections.map((section) => {
                const completedInSec = section.lessons.filter((l) =>
                  progress.completedLessons.includes(l.id)
                ).length;
                const totalInSec = section.lessons.length;
                const secPercent = Math.round((completedInSec / totalInSec) * 100);

                return (
                  <div
                    key={section.id}
                    className="group border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {section.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-24 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${secPercent}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300 w-8 text-right">
                          {completedInSec}/{totalInSec}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 pt-3 border-t border-dashed border-gray-100 dark:border-gray-800">
                      {section.lessons.map((lesson) => {
                        const isDone = progress.completedLessons.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson.id)}
                            className={`p-2.5 rounded-lg text-left text-xs transition-all flex items-center justify-between border ${
                              isDone
                                ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                                : "bg-gray-50/50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            <span className="truncate pr-1">{lesson.title}</span>
                            {isDone ? (
                              <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                            ) : (
                              <BookOpen size={13} className="text-gray-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Sidecards: Streak calendar, Certifications progress, Quests) */}
        <div className="space-y-6">

          {/* Next Lesson / Milestone alert */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-900/10 border border-indigo-100 dark:border-indigo-950 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  {language === "pt" ? "Próxima Meta de Aprendizado" : "Upcoming Milestone Goal"}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white mt-1 text-sm md:text-base">
                  {nextLesson.title}
                </h3>
              </div>
              <span className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400">
                <Compass size={18} />
              </span>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 min-h-8">
              {nextLesson.summary} (~{nextLesson.estimatedMinutes} {language === "pt" ? "minutos" : "mins"})
            </p>

            <button
              onClick={() => onSelectLesson(nextLesson.id)}
              className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              {language === "pt" ? "Iniciar Lição Meta" : "Start Milestone Lesson"}
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          {/* Daily Quests Checkbox */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
              <Zap size={16} className="text-amber-500" />
              {language === "pt" ? "Missões Diárias de Estudo" : "Daily Study Quests"}
            </h3>

            <div className="space-y-3">
              {dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  className={`flex items-start gap-2.5 p-2 rounded-lg border transition-colors ${
                    quest.done
                      ? "bg-gray-50/50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60"
                      : "bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {quest.done ? (
                      <CheckCircle size={15} className="text-emerald-500" />
                    ) : (
                      <div className="w-[15px] h-[15px] rounded-full border border-gray-300 dark:border-gray-700 mt-0.5" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-300 truncate">
                      {quest.title}
                    </p>
                    <span className="text-[9px] font-mono font-medium text-amber-600 dark:text-amber-400">
                      +{quest.xp} {language === "pt" ? "XP Bônus" : "Bonus XP"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Certificate Status */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Award size={24} />
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.db_cert_card_title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t.db_cert_card_desc}
              </p>
            </div>

            <div className="pt-2">
              {progress.xp >= 400 ? (
                <button
                  onClick={() => onSelectTab("certificates")}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {t.db_claim_cert}
                </button>
              ) : (
                <div className="w-full py-1.5 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-lg text-xs font-medium">
                  {language === "pt" ? `Bloqueado (Progresso: ${progress.xp} / 400 XP)` : `Locked (Progress: ${progress.xp} / 400 XP)`}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
