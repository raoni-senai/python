import { createClient } from "@supabase/supabase-js";
import { UserProgress } from "../types";

const metaAny = import.meta as any;
const vUrl = metaAny.env ? metaAny.env.VITE_SUPABASE_URL : undefined;
const vKey = metaAny.env ? metaAny.env.VITE_SUPABASE_ANON_KEY : undefined;

const isSupabaseConfigured = !!(vUrl && vKey && vUrl !== "MY_VITE_SUPABASE_URL" && vUrl.trim() !== "");

let supabase: any = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(vUrl!, vKey!);
    console.log("Client-side Supabase initialized successfully.");
  } catch (err) {
    console.error("Client-side Supabase initialization error:", err);
  }
}

const DEFAULT_ST_STUDENTS: any[] = [
  { userId: "student-1", username: "ALICE CUNHA DE ANDRADE" },
  { userId: "student-2", username: "ASLAN DANICH LAVECKAS RODRIGUES" },
  { userId: "student-3", username: "BRENDA VITÓRIA SOUZA DO NASCIMENTO" },
  { userId: "student-4", username: "DAVI DE MELLO" },
  { userId: "student-5", username: "EMILLY RIBEIRO PIZZATO DOS SANTOS" },
  { userId: "student-6", username: "EDUARDA VITÓRIA VIEIRA PINTO" },
  { userId: "student-7", username: "GABRIEL DO LAGO BORBA" },
  { userId: "student-8", username: "GUILHERME FELIPE DE ALENCAR RIBEIRO" },
  { userId: "student-9", username: "GUSTAVO DA COSTA SANTOS" },
  { userId: "student-10", username: "GIANCARLO DE ASSIS CONSOLARO" },
  { userId: "student-11", username: "GUSTAVO SANTOS BRITO" },
  { userId: "student-12", username: "GUSTAVO SILVA DE SOUZA" },
  { userId: "student-13", username: "HELOYSA FONSECA FERREIRA" },
  { userId: "student-14", username: "IGOR SILVA SANTOS" },
  { userId: "student-15", username: "ISABELLE VITÓRIA DOS SANTOS MAFFEI" },
  { userId: "student-16", username: "JOÃO LORENZO VIEIRA PINTO" },
  { userId: "student-17", username: "JOÃO MAURÍCIO COSTA" },
  { userId: "student-18", username: "JULIA PEREIRA ALVES DA SILVA" },
  { userId: "student-19", username: "LEANDRO DOS SANTOS MENEGUELLI" },
  { userId: "student-20", username: "LOUREZO SILVA MARI" },
  { userId: "student-21", username: "MARIELA MAUÉS DE MORAES" },
  { userId: "student-22", username: "MATEUS FELIPE DO ESPIRITO SANTO COVOLAN" },
  { userId: "student-23", username: "PETERSON RAFAEL DOS ANJOS" },
  { userId: "student-24", username: "PIETRA BEATRIZ CARVALHO DE OLIVEIRA" },
  { userId: "student-25", username: "RAFAEL DE CARVALHO ALVES BRANCO" },
  { userId: "student-26", username: "RHAYAN LUCAS ROSA" },
  { userId: "student-27", username: "ROBERT DE FREITAS GONÇALVES DE SOUSA" },
  { userId: "student-28", username: "SABRINA ALVES DOS SANTOS" },
  { userId: "student-29", username: "SAMUEL COUTO ROCHA SANTOS" },
  { userId: "student-30", username: "VITOR DOS SANTOS DIAS" },
  { userId: "student-31", username: "WELLINGTON LEAL MATOS" },
  { userId: "student-32", username: "YAGO MACCARTHY SILVEIRA REIS" }
];

const LOCAL_FALLBACK_ROSTER: UserProgress[] = DEFAULT_ST_STUDENTS.map(s => ({
  userId: s.userId,
  username: s.username,
  xp: 0,
  streak: 0,
  lastActive: null,
  completedLessons: [],
  completedQuizzes: [],
  milestonesReached: []
}));

export function mapFromDB(row: any): UserProgress {
  return {
    userId: row.user_id,
    username: row.username,
    xp: typeof row.xp === "number" ? row.xp : Number(row.xp || 0),
    streak: typeof row.streak === "number" ? row.streak : Number(row.streak || 0),
    lastActive: row.last_active || null,
    completedLessons: Array.isArray(row.completed_lessons) ? row.completed_lessons : [],
    completedQuizzes: Array.isArray(row.completed_quizzes) ? row.completed_quizzes : [],
    milestonesReached: Array.isArray(row.milestones_reached) ? row.milestones_reached : [],
    certificateUuid: row.certificate_uuid || undefined
  };
}

export function mapToDB(progress: UserProgress) {
  return {
    user_id: progress.userId,
    username: progress.username,
    xp: progress.xp,
    streak: progress.streak,
    last_active: progress.lastActive,
    completed_lessons: progress.completedLessons,
    completed_quizzes: progress.completedQuizzes,
    milestones_reached: progress.milestonesReached,
    certificate_uuid: progress.certificateUuid || null
  };
}

export async function fetchAllStudents(): Promise<UserProgress[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("students_progress")
        .select("*");
      if (!error && data) {
        return data.map(mapFromDB);
      }
      console.warn("Direct Supabase query failed, attempting to request /api/students", error);
    } catch (e) {
      console.error("Direct Supabase query threw exception:", e);
    }
  }

  // Fallback to server API or local storage simulation
  try {
    const res = await fetch("/api/students");
    const data = await res.json();
    if (data.success && Array.isArray(data.students)) {
      return data.students;
    }
  } catch (err) {
    console.warn("API Server unreachable, loading backup values:", err);
  }

  return LOCAL_FALLBACK_ROSTER;
}

export async function saveProgress(username: string, progress: UserProgress): Promise<UserProgress> {
  if (isSupabaseConfigured && supabase) {
    try {
      const targetRow = mapToDB(progress);
      const { error } = await supabase
        .from("students_progress")
        .upsert(targetRow, { onConflict: "username" });
      
      if (!error) {
        console.log("Progress successfully upserted into Supabase directly!");
        return progress;
      }
      console.warn("Direct Supabase upsert failed, falling back to /api/students/save", error);
    } catch (e) {
      console.error("Direct Supabase upsert error:", e);
    }
  }

  try {
    const res = await fetch("/api/students/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, progress })
    });
    const data = await res.json();
    if (data.success && data.student) {
      return data.student;
    }
  } catch (err) {
    console.warn("API Server save unsuccessful:", err);
  }

  return progress;
}

export async function resetLeaderboard(password: string): Promise<UserProgress[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      if (password !== "asus") {
        throw new Error("Invalid password");
      }
      // Delete existing
      await supabase.from("students_progress").delete().neq("user_id", "");
      // Seed default
      const seedRows = LOCAL_FALLBACK_ROSTER.map(mapToDB);
      await supabase.from("students_progress").insert(seedRows);
      console.log("Supabase reset & seeded successfully.");
      return LOCAL_FALLBACK_ROSTER;
    } catch (e) {
      console.error("Supabase direct reset failed:", e);
    }
  }

  try {
    const res = await fetch("/api/students/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.students)) {
      return data.students;
    }
  } catch (err) {
    console.error("API Server reset unsuccessful:", err);
  }

  return LOCAL_FALLBACK_ROSTER;
}
