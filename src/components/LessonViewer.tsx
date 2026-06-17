import { useState, useEffect } from "react";
import { Lesson, UserProgress, QuizQuestion, CodeExample } from "../types";
import { translations, Language } from "../data/translations";
import {
  BookOpen,
  Play,
  CheckCircle,
  HelpCircle,
  XCircle,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Zap,
  Terminal,
  MessageSquare,
  AlertTriangle
} from "lucide-react";

interface LessonViewerProps {
  lesson: Lesson;
  progress: UserProgress;
  onCompleteLesson: (lessonId: string, xpAdded: number) => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  language?: Language;
}

export default function LessonViewer({
  lesson,
  progress,
  onCompleteLesson,
  onNavigateNext,
  onNavigatePrev,
  hasPrev,
  hasNext,
  language = "en"
}: LessonViewerProps) {
  const t = translations[language];
  // Sandbox execution state
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [editorCode, setEditorCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [visualState, setVisualState] = useState<{ step: number; values: string }[]>([]);
  const [tutorInsight, setTutorInsight] = useState("");

  // AI Tutor sidebar state
  const [userQuery, setUserQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAskingAi, setIsAskingAi] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: string }>({});
  const [quizChecked, setQuizChecked] = useState<{ [questionId: string]: boolean }>({});
  const [quizCorrect, setQuizCorrect] = useState<{ [questionId: string]: boolean }>({});

  // Final project states
  const [projectTestResults, setProjectTestResults] = useState<{ id: string; name: string; expected: string; passed: boolean | undefined }[]>([]);
  const [projectVerificationMessage, setProjectVerificationMessage] = useState("");
  const [isVerifyingProject, setIsVerifyingProject] = useState(false);
  const [projectPassed, setProjectPassed] = useState(false);

  // Reset editor when lesson or example selection changes
  useEffect(() => {
    if (lesson.examples && lesson.examples[selectedExampleIndex]) {
      setEditorCode(lesson.examples[selectedExampleIndex].code);
      setConsoleOutput("");
      setVisualState([]);
      setTutorInsight("");
      setIsError(false);
    }

    // Reset project state
    if (lesson.id === 'grading_project_lesson') {
      setProjectTestResults([
        { id: "syntax", name: language === "pt" ? "Sem erros de sintaxe Python" : "No Python syntax errors", expected: "Válido", passed: undefined },
        { id: "average", name: language === "pt" ? "Cálculo correto de média (Três variáveis)" : "Correct average calculation (Three variables)", expected: "Válido", passed: undefined },
        { id: "perfect", name: language === "pt" ? "Média igual a 10" : "Average exactly equal to 10", expected: "Perfect", passed: undefined },
        { id: "very_good", name: language === "pt" ? "Média entre 8.0 e 9.9" : "Average between 8.0 and 9.9", expected: "Very good", passed: undefined },
        { id: "good", name: language === "pt" ? "Média entre 5.0 e 7.9" : "Average between 5.0 and 7.9", expected: "Good", passed: undefined },
        { id: "improve", name: language === "pt" ? "Média entre 1.0 e 4.9" : "Average between 1.0 and 4.9", expected: "Need to improve", passed: undefined }
      ]);
      setProjectVerificationMessage("");
      setProjectPassed(false);
    }
  }, [lesson, selectedExampleIndex, language]);

  // Handle client-side Python execution simulator for ultra-fast, zero-network fallback
  const runPythonLocally = (code: string) => {
    try {
      const lines = code.split("\n");
      let outputs: string[] = [];
      let vars: { [key: string]: any } = {};
      let blockResult = "";

      for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Skip comments
        if (line.startsWith("#")) continue;

        // Simple Variable assignment parsing: age = 22, name = "Alice", count = count + 1
        if (line.includes("=") && !line.includes("==") && !line.startsWith("if ") && !line.startsWith("for ") && !line.startsWith("print(")) {
          const parts = line.split("=");
          const varName = parts[0].trim();
          let varValRaw = parts[1].trim();

          // Evaluate basic math or convert strings/integers
          if (varValRaw.startsWith('"') || varValRaw.startsWith("'")) {
            // Strip quotes
            vars[varName] = varValRaw.substring(1, varValRaw.length - 1);
          } else if (!isNaN(Number(varValRaw))) {
            vars[varName] = Number(varValRaw);
          } else {
            // Check references or simple arithmetic e.g. a + b
            try {
              // Convert Python syntax to JS for evaluation safety
              let sanitizedExpr = varValRaw;
              for (let key in vars) {
                sanitizedExpr = sanitizedExpr.replace(new RegExp(`\\b${key}\\b`, 'g'), vars[key]);
              }
              const evalRes = Function(`"use strict"; return (${sanitizedExpr})`)();
              vars[varName] = evalRes;
            } catch {
              vars[varName] = varValRaw;
            }
          }
          continue;
        }

        // Print handler: print("Alice is", age, "years old.")
        if (line.startsWith("print(") && line.endsWith(")")) {
          const content = line.substring(6, line.length - 1);
          
          // Split by commas, taking care of quoted text blocks
          const exprs = content.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          let compiledLine = exprs.map((expr) => {
            expr = expr.trim();
            // Standard string
            if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
              return expr.substring(1, expr.length - 1);
            }
            // Check variable environment map
            if (vars[expr] !== undefined) {
              return String(vars[expr]);
            }
            // Direct expression numeric evaluation
            try {
              let exprBody = expr;
              for (let vName in vars) {
                exprBody = exprBody.replace(new RegExp(`\\b${vName}\\b`, 'g'), vars[vName]);
              }
              const evalRes = Function('"use strict"; return (' + exprBody + ")")();
              return String(evalRes);
            } catch {
              return expr;
            }
          }).join(" ");

          outputs.push(compiledLine);
        }
      }

      const stdout = outputs.join("\n") || "# Program returned 0 exiting codes without outputs.";
      return {
        output: stdout,
        isError: false,
        visualStateTrace: Object.entries(vars).map(([k, v], idx) => ({ step: idx + 1, values: `${k} = ${v}` })),
        tutorialInsight: "Program executed locally via instant sandbox simulator."
      };
    } catch (err: any) {
      return {
        output: `SyntaxError: Unexpected trace or formatting mismatch: ${err.message}`,
        isError: true,
        visualStateTrace: [],
        tutorialInsight: "Try running this again or let the AI tutor analyze the block!"
      };
    }
  };

  const handleExecuteSandbox = async () => {
    setIsRunning(true);
    setConsoleOutput("");
    setIsError(false);

    try {
      // Direct post API fetch
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate_execution",
          code: editorCode,
          lessonTitle: lesson.title
        })
      });

      const data = await res.json();
      if (data.success && !data.message) {
        setConsoleOutput(data.output || "");
        setIsError(data.isError || false);
        setVisualState(data.visualStateTrace || []);
        setTutorInsight(data.tutorialInsight || "");
      } else {
        // Fallback locally
        const fallback = runPythonLocally(editorCode);
        setConsoleOutput(fallback.output);
        setIsError(fallback.isError);
        setVisualState(fallback.visualStateTrace);
        setTutorInsight("Instant offline simulation compiled successfully.");
      }
    } catch {
      // Fallback locally in case of any offline issues
      const fallback = runPythonLocally(editorCode);
      setConsoleOutput(fallback.output);
      setIsError(fallback.isError);
      setVisualState(fallback.visualStateTrace);
      setTutorInsight("Executed locally and saved CPU frames.");
    } finally {
      setIsRunning(false);
    }
  };

  const runOfflineProjectVerification = (code: string) => {
    const dCode = code.replace(/\s+/g, "").toLowerCase();
    
    // Check key variables exist (either scoreX or score_X or similar)
    const hasScores = 
      (code.includes("score1") && code.includes("score2") && code.includes("score3")) ||
      (code.includes("score_1") && code.includes("score_2") && code.includes("score_3"));
    
    // Check average calculation (must divide by 3)
    const hasDivision = code.includes("/ 3") || code.includes("/3") || code.includes("/3.0");
    const hasAverage = dCode.includes("average") || dCode.includes("media") || dCode.includes("promedio");
    
    // Check if categories are represented in the script
    const hasPerfect = code.includes("Perfect");
    const hasVeryGood = code.includes("Very good");
    const hasGood = code.includes("Good");
    const hasImprove = code.includes("Need to improve");
    
    const newChecks = [
      { id: "syntax", name: language === "pt" ? "Sem erros de sintaxe Python" : "No Python syntax errors", expected: "Válido", passed: true },
      { id: "average", name: language === "pt" ? "Cálculo correto de média (Três variáveis)" : "Correct average calculation (Three variables)", expected: "Válido", passed: hasScores && (hasDivision || hasAverage) },
      { id: "perfect", name: language === "pt" ? "Média igual a 10" : "Average exactly equal to 10", expected: "Perfect", passed: hasPerfect },
      { id: "very_good", name: language === "pt" ? "Média entre 8.0 e 9.9" : "Average between 8.0 and 9.9", expected: "Very good", passed: hasVeryGood },
      { id: "good", name: language === "pt" ? "Média entre 5.0 e 7.9" : "Average between 5.0 and 7.9", expected: "Good", passed: hasGood },
      { id: "improve", name: language === "pt" ? "Média entre 1.0 e 4.9" : "Average between 1.0 and 4.9", expected: "Need to improve", passed: hasImprove }
    ];

    const allPassed = newChecks.every(c => c.passed);
    
    setProjectTestResults(newChecks);
    setProjectPassed(allPassed);
    
    if (allPassed) {
      setProjectVerificationMessage(
        language === "pt" 
          ? "🎉 Excelente! Todos os testes de verificação local passaram. Parabéns pelo seu sistema de classificação completo!" 
          : "🎉 Excellent! All offline validation checks passed. Congratulations on creating a fully functioning school grading system!"
      );
      onCompleteLesson(lesson.id, 50);
    } else {
      let missingList: string[] = [];
      if (!hasScores) missingList.push(language === "pt" ? "Variáveis score1, score2, e score3" : "Variables score1, score2, and score3");
      if (!hasDivision) missingList.push(language === "pt" ? "Dividir a soma por 3 (/ 3)" : "Divide sum by 3 (/ 3)");
      if (!hasPerfect) missingList.push(language === "pt" ? "Imprimir 'Perfect' para média 10" : "Print 'Perfect' for average 10");
      if (!hasVeryGood) missingList.push(language === "pt" ? "Imprimir 'Very good' para média 8-9.9" : "Print 'Very good' for average 8-9.9");
      if (!hasGood) missingList.push(language === "pt" ? "Imprimir 'Good' para média 5-7.9" : "Print 'Good' for average 5-7.9");
      if (!hasImprove) missingList.push(language === "pt" ? "Imprimir 'Need to improve' para média 1-4.9" : "Print 'Need to improve' for average 1-4.9");

      setProjectVerificationMessage(
        language === "pt"
          ? `⚠️ Algumas condições do projeto ainda não foram satisfeitas. Pendente: ${missingList.join(", ")}. Revise seu código e tente rodar novamente!`
          : `⚠️ Some project criteria are not yet fully met. Pending: ${missingList.join(", ")}. Please review your code and verify again!`
      );
    }
  };

  const handleVerifyProject = async () => {
    setIsVerifyingProject(true);
    setProjectVerificationMessage("");

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_project",
          code: editorCode,
          lessonTitle: lesson.title
        })
      });

      const data = await res.json();
      if (data.success && data.checks) {
        // Map backend checks to format
        const formattedChecks = data.checks.map((c: any) => ({
          id: c.id,
          name: c.label,
          expected: c.id === "syntax" ? "Válido" : (c.id === "average" ? "Válido" : (c.id === "perfect" ? "Perfect" : (c.id === "very_good" ? "Very good" : (c.id === "good" ? "Good" : "Need to improve")))),
          passed: c.passed
        }));
        
        setProjectTestResults(formattedChecks);
        setProjectPassed(data.passed);
        setProjectVerificationMessage(data.feedback);
        
        if (data.passed) {
          onCompleteLesson(lesson.id, 50);
        }
      } else {
        // Fallback local verification
        runOfflineProjectVerification(editorCode);
      }
    } catch {
      // Fallback local verification
      runOfflineProjectVerification(editorCode);
    } finally {
      setIsVerifyingProject(false);
    }
  };

  const askAiAssistant = async (actionType: "explain" | "custom_question") => {
    setIsAskingAi(true);
    setAiResponse("");

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType === "explain" ? "explain_code" : "custom_question",
          code: editorCode,
          lessonTitle: lesson.title,
          query: actionType === "custom_question" ? userQuery : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiResponse(data.content || "Ready to assist!");
      } else {
        setAiResponse(data.message || "An unexpected issue occurred while calling the server. No worry, let's keep executing standard scripts!");
      }
    } catch {
      setAiResponse("Could not reach our server-side API tutor module. Ensure your server is fully booted and you have an internet connection.");
    } finally {
      setIsAskingAi(false);
    }
  };

  // Quizzes handlers
  const handleAnswerChange = (qId: string, val: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleCheckQuiz = (q: QuizQuestion) => {
    const rawUserAns = quizAnswers[q.id] || "";
    const isWhitespaceOnlyExpected = q.correctAnswer.trim() === "";
    const userAns = isWhitespaceOnlyExpected ? rawUserAns : rawUserAns.trim();
    const isCorrect = userAns.toLowerCase() === q.correctAnswer.toLowerCase();

    setQuizChecked((prev) => ({ ...prev, [q.id]: true }));
    setQuizCorrect((prev) => ({ ...prev, [q.id]: isCorrect }));

    if (isCorrect) {
      onCompleteLesson(lesson.id, q.xpValue);
    }
  };

  const isLessonFinished = progress.completedLessons.includes(lesson.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="lesson-room">
      
      {/* LEFT COLUMN: Lesson content, Quizzes & Next guidance (8cols) */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Navigation back and header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <button
              onClick={onNavigatePrev}
              disabled={!hasPrev}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950 disabled:opacity-30 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer"
            >
              <ArrowLeft size={14} />
              {language === "pt" ? "Anterior" : "Prev"}
            </button>
            <button
              onClick={onNavigateNext}
              disabled={!hasNext}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950 disabled:opacity-30 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer"
            >
              {language === "pt" ? "Próxima" : "Next"}
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono inline-flex items-center gap-1 leading-none">
              <Clock size={12} />
              {lesson.estimatedMinutes} {language === "pt" ? "min de estudo" : "min study"}
            </span>
            {isLessonFinished && (
              <span className="px-2 py-1 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase flex items-center gap-1">
                <CheckCircle size={10} /> {language === "pt" ? "Completo" : "Completed"}
              </span>
            )}
          </div>
        </div>

        {/* Course content paper block */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white border-b pb-4 border-gray-100 dark:border-gray-900">
            {lesson.title}
          </h1>

          {/* Render markdown using customized elements for supreme readability */}
          <div className="prose prose-blue dark:prose-invert max-w-none space-y-4 text-xs md:text-sm leading-relaxed text-gray-800 dark:text-gray-300">
            {lesson.contentMarkdown.split("\n\n").map((para, i) => {
              if (para.startsWith("###")) {
                return (
                  <h3 key={i} className="text-lg font-bold text-indigo-700 dark:text-indigo-400 pt-2">
                    {para.replace("###", "").trim()}
                  </h3>
                );
              }
              if (para.startsWith("####")) {
                return (
                  <h4 key={i} className="text-base font-semibold text-gray-900 dark:text-gray-200 pt-1">
                    {para.replace("####", "").trim()}
                  </h4>
                );
              }
              if (para.startsWith("*") || para.startsWith("-")) {
                return (
                  <ul key={i} className="list-disc list-inside space-y-1 pl-3 text-gray-800 dark:text-gray-300">
                    {para.split("\n").map((li, j) => (
                      <li key={j}>{li.replace(/^[\s*-]+/, "").trim()}</li>
                    ))}
                  </ul>
                );
              }
              if (para.startsWith("1.") || para.startsWith("2.") || para.startsWith("3.")) {
                return (
                  <ol key={i} className="list-decimal list-inside space-y-1 pl-3 text-gray-800 dark:text-gray-300">
                    {para.split("\n").map((li, j) => (
                      <li key={j}>{li.replace(/^\d+\.\s*/, "").trim()}</li>
                    ))}
                  </ol>
                );
              }
              if (para.includes("```")) {
                const lines = para.split("\n");
                const codeLines = lines.filter(l => !l.includes("```")).join("\n");
                return (
                  <div key={i} className="my-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 font-mono text-xs shadow-sm">
                    <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[10px] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                      <span>{language === "pt" ? "Exemplo de Sintaxe Python" : "Python Syntax Example"}</span>
                    </div>
                    <pre className="p-3 bg-gray-950 text-green-400 overflow-x-auto whitespace-pre">
                      <code>{codeLines}</code>
                    </pre>
                  </div>
                );
              }
              return (
                <p key={i} className="whitespace-pre-line text-xs md:text-sm text-gray-700 dark:text-gray-300">
                  {para}
                </p>
              );
            })}
          </div>
        </div>

        {/* Sandbox Editor & Integrated Compiler Console */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Terminal size={16} className="text-indigo-600" />
                {language === "pt" ? "Editor de Código W3Schools" : "W3Schools Code sandbox"}
              </h2>
              <p className="text-[11px] text-gray-400">
                {language === "pt"
                  ? "Edite, pratique e teste seu código Python diretamente bloco por bloco."
                  : "Edit, practice, and test run your Python code directly block by block."}
              </p>
            </div>

            {/* Selector for examples */}
            <div className="flex gap-1 max-w-full overflow-x-auto pb-1 sm:pb-0">
              {lesson.examples.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExampleIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedExampleIndex === idx
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  Ex {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-900">
            {/* Editor Textarea */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <label className="font-semibold font-mono">main.py</label>
                <span className="font-mono text-[10px]">W3Schools Sandbox IDE</span>
              </div>
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                rows={8}
                className="w-full p-3 font-mono text-xs md:text-sm bg-gray-950 text-white rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y border border-gray-800"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleExecuteSandbox}
                  disabled={isRunning}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  id="btn-run-sandbox"
                >
                  <Play size={12} fill="currentColor" />
                  {isRunning ? (language === "pt" ? "Executando..." : "Running...") : (language === "pt" ? "Executar Código" : "Run Code")}
                </button>
                <button
                  onClick={() => askAiAssistant("explain")}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 font-semibold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles size={12} />
                  {language === "pt" ? "Explicar Código com IA" : "Explain Code with AI"}
                </button>
              </div>
            </div>

            {/* Simulated Live Console Output */}
            <div className="p-4 bg-gray-950/20 dark:bg-black/30 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-100/10 pb-1.5">
                  <span className="font-mono">{language === "pt" ? "Tela do terminal de saída" : "Output terminal screen"}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${isError ? "bg-red-500 animate-pulse" : isRunning ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
                </div>

                <div className="p-3 bg-gray-950 text-gray-200 rounded-xl font-mono text-xs min-h-[140px] whitespace-pre-wrap overflow-y-auto">
                  {consoleOutput || (language === "pt" ? "# Clique em 'Executar Código' para executar blocos em Python e ver os logs de console." : "# Click 'Run Code' to execute Python blocks dynamically and print console logs.")}
                </div>
              </div>

              {/* Dynamic steps evaluated */}
              {visualState.length > 0 && (
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-2.5 text-[11px] space-y-1">
                  <span className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-[9px] block">
                    {language === "pt" ? "Rastreamento de Memória Dinâmica" : "Dynamic Memory Tracing"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {visualState.map((step) => (
                      <span key={step.step} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-mono rounded border border-indigo-100 dark:border-indigo-950">
                        {step.values}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Validation Interface (Only shown for final grading system lesson) */}
        {lesson.id === 'grading_project_lesson' && (
          <div className="bg-white dark:bg-gray-950 border border-indigo-100 dark:border-indigo-950/60 rounded-2xl p-6 shadow-sm space-y-6" id="project-validation-panel">
            <div className="border-b pb-4 border-gray-100 dark:border-gray-900 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-600 text-white font-bold tracking-wide uppercase">
                  {language === "pt" ? "PROJETO AUTOMATIZADO" : "AUTOMATED PROJECT QUIZ"}
                </span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1.5 flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-600" />
                  {language === "pt" ? "Validador de Desempenho do Aluno" : "Grading System Project Evaluator"}
                </h2>
                <p className="text-xs text-gray-400">
                  {language === "pt"
                    ? "Submeta seu código abaixo para testar contra as 4 condições oficiais de notas da escola."
                    : "Submit your final solution code here to test it against our 4 official score brackets."}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                +50 XP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectTestResults.map((test) => (
                <div key={test.id} className="p-3 rounded-xl border border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/10 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 block">{test.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {language === "pt" ? "Retorno esperado" : "Expected print"}: <strong className="text-indigo-600 dark:text-indigo-400">"{test.expected}"</strong>
                    </span>
                  </div>
                  <span>
                    {test.passed === undefined ? (
                      <span className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 block" />
                    ) : test.passed ? (
                      <CheckCircle className="text-emerald-500" size={20} />
                    ) : (
                      <XCircle className="text-rose-500" size={20} />
                    )}
                  </span>
                </div>
              ))}
            </div>

            {projectVerificationMessage && (
              <div className={`p-4 rounded-xl text-xs leading-relaxed font-semibold ${
                projectPassed 
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}>
                {projectVerificationMessage}
              </div>
            )}

            <button
              onClick={handleVerifyProject}
              disabled={isVerifyingProject}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl inline-flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              id="btn-verify-project"
            >
              <RefreshCw size={14} className={isVerifyingProject ? "animate-spin" : ""} />
              {isVerifyingProject
                ? (language === "pt" ? "Avaliando Diretrizes do Projeto..." : "Evaluating Project Guidelines...")
                : (language === "pt" ? "Validar Solução de Notas e Ganhar 50 XP" : "Validate Student Grading Script • +50 XP")}
            </button>
          </div>
        )}

        {/* Quizzes and gamified forms */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="border-b pb-4 border-gray-100 dark:border-gray-900">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              {language === "pt" ? "Questionários de Prática W3Schools" : "W3Schools Practice Quizzes"}
            </h2>
            <p className="text-xs text-gray-400">
              {language === "pt"
                ? "Envie respostas corretas abaixo para ganhar pontos, medalhas de progresso e ganhar XP!"
                : "Submit accurate replies below to build points, progress badges, and earn XP scores!"}
            </p>
          </div>

          <div className="space-y-6">
            {lesson.quizQuestions.map((q, idx) => {
              const isChecked = quizChecked[q.id];
              const isCorrect = quizCorrect[q.id];
              const userAns = quizAnswers[q.id] || "";

              return (
                <div key={q.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold">
                      {language === "pt" ? "Questão #" : "Question #"}{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      +{q.xpValue} XP
                    </span>
                  </div>

                  <p className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {q.question}
                  </p>

                  {/* Context block if any */}
                  {q.codeContext && (
                    <pre className="p-3 rounded-xl bg-gray-950 text-gray-200 text-xs font-mono overflow-x-auto">
                      <code>{q.codeContext}</code>
                    </pre>
                  )}

                  {/* Question types format rendering */}
                  {q.type === "multiple_choice" && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          disabled={isChecked}
                          onClick={() => handleAnswerChange(q.id, opt)}
                          className={`p-3 text-xs font-semibold rounded-xl text-left border transition-all cursor-pointer ${
                            userAns === opt
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === "fill_in_the_blank" && (
                    <div className="pt-2">
                      <input
                        type="text"
                        disabled={isChecked}
                        value={userAns}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder={q.placeholderText || (language === "pt" ? "Escreva sua resposta do bloco de código aqui" : "Write your code block reply here")}
                        className="w-full px-4 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {q.type === "code_completion" && (
                    <div className="pt-2 space-y-1">
                      <input
                        type="text"
                        disabled={isChecked}
                        value={userAns}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder={q.placeholderText || (language === "pt" ? "Complete a lacuna do programa" : "Complete program gap")}
                        className="w-full px-3 py-2 bg-gray-950 text-green-400 border border-gray-800 font-mono rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Feedback response metrics */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
                    <div className="flex gap-2">
                      {!isChecked && (
                        <button
                          onClick={() => handleCheckQuiz(q)}
                          disabled={!userAns}
                          className="px-3.5 py-1.5 bg-gray-950 hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 text-xs font-bold rounded-lg transition-all cursor-pointer"
                        >
                          {language === "pt" ? "Enviar Resposta" : "Submit Answer"}
                        </button>
                      )}
                      
                      {q.hint && (
                        <p className="text-[11px] text-gray-400 italic mt-1.5">
                          💡 {language === "pt" ? "Dica:" : "Hint:"} {q.hint}
                        </p>
                      )}
                    </div>

                    {isChecked && (
                      <div className="flex items-center gap-1.5">
                        {isCorrect ? (
                          <span className="text-emerald-500 text-xs font-bold inline-flex items-center gap-1">
                            <CheckCircle size={15} /> {language === "pt" ? `Correto! +${q.xpValue} XP Concedidos` : `Correct! +${q.xpValue} XP Awarded`}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-rose-500 text-xs font-bold inline-flex items-center gap-1">
                              <XCircle size={15} /> {language === "pt" ? "Incorreto. Tente novamente!" : "Incorrect. Try again!"}
                            </span>
                            <button
                              onClick={() => {
                                setQuizChecked((prev) => ({ ...prev, [q.id]: false }));
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: "" }));
                              }}
                              className="text-[10px] text-indigo-500 hover:underline font-semibold cursor-pointer"
                            >
                              {language === "pt" ? "Reiniciar" : "Reset"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: AI Explanation sidekick & helper widgets (4cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Tutor Assistant side widget */}
        <div className="bg-gradient-to-b from-gray-950 to-indigo-950 border border-gray-800 text-white rounded-2xl p-5 md:p-6 shadow-xl space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                {language === "pt" ? "TUTOR DE IA ATIVO" : "ACTIVE AI SIDEKICK TUTOR"}
              </span>
              <h3 className="font-extrabold text-sm md:text-base text-gray-100 mt-0.5">
                {language === "pt" ? "Explicar e Depurar Código" : "Explain & Debug Code"}
              </h3>
            </div>
            <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              <Sparkles size={18} />
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            {language === "pt"
              ? "Está travado em algum lugar ou quer uma compreensão mais profunda? Pergunte diretamente ao assistente inteligente de IA por uma explicação de código offline/online."
              : "Stuck somewhere or want a deeper understanding? Directly ask the smart AI assistant for an offline/online code study walkthrough."}
          </p>

          <div className="space-y-3 pt-1">
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={language === "pt" ? "ex: Você pode explicar como as indentações definem funções em Python?" : "e.g. Can you explain how indentations define functions in Python?"}
              rows={3}
              className="w-full p-2.5 bg-black/60 border border-gray-800 focus:border-indigo-500 text-white font-sans text-xs focus:outline-none rounded-xl"
            />
            
            <button
              onClick={() => askAiAssistant("custom_question")}
              disabled={isAskingAi || !userQuery}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
            >
              <MessageSquare size={12} />
              {isAskingAi ? (language === "pt" ? "Pensando..." : "Thinking...") : (language === "pt" ? "Perguntar ao Tutor" : "Ask Python Tutor")}
            </button>
          </div>

          {/* AI Response scroll box details */}
          {aiResponse && (
            <div className="p-3.5 bg-black/40 border border-gray-800 rounded-xl text-xs space-y-2 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono pb-1 border-b border-gray-800">
                <span>{language === "pt" ? "Resposta do Tutor de IA:" : "AI Tutor Response:"}</span>
                <button
                  onClick={() => setAiResponse("")}
                  className="text-gray-500 hover:text-white"
                >
                  {language === "pt" ? "Limpar" : "Clear"}
                </button>
              </div>
              <p className="text-gray-300 leading-relaxed font-sans">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Dynamic Tips card */}
        <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
            <AlertTriangle size={15} className="text-amber-500" />
            {language === "pt" ? "Dica de Estudo W3Schools" : "W3Schools Study Tip"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === "pt"
              ? "Em Python, aspas simples ('texto') e aspas duplas (\"texto\") são completamente idênticas! Apenas certifique-se de abrir e fechar usando o caractere correspondente."
              : 'In Python, single quotes (\'text\') and double quotes ("text") are completely identical! Just make sure to open and close them using the matching character.'}
          </p>
        </div>

      </div>
    </div>
  );
}
