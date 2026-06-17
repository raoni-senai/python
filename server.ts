import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Student database initialization
const DB_FILE = path.join(process.cwd(), "students_db.json");

interface StudentProgress {
  userId: string;
  username: string;
  xp: number;
  streak: number;
  lastActive: string | null;
  completedLessons: string[];
  completedQuizzes: string[];
  milestonesReached: string[];
  certificateUuid?: string;
}

// Supabase dynamic setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const isSupabaseConfigured = !!(supabaseUrl && supabaseKey && supabaseUrl !== "MY_SUPABASE_URL" && supabaseUrl.trim() !== "");

let supabase: any = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl!, supabaseKey!);
    console.log("Supabase Connection: Initialized successfully!");
  } catch (err) {
    console.error("Supabase Connection: Error creating client:", err);
  }
} else {
  console.log("Supabase Connection: Not configured. Running with local JSON fallback (students_db.json).");
}

/*
-- INSTRUCTION FOR THE USER (SUPABASE SQL SETUP):
-- Copy and run the following script inside the Supabase SQL Editor to create your database table:

CREATE TABLE IF NOT EXISTS students_progress (
  user_id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  streak INTEGER DEFAULT 0 NOT NULL,
  last_active TEXT,
  completed_lessons TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  completed_quizzes TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  milestones_reached TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  certificate_uuid TEXT
);

-- Turn on Row Level Security (RLS) or disable/write appropriate policies on table:
-- ALTER TABLE students_progress ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable full access to anon key in server environment" ON students_progress FOR ALL USING (true) WITH CHECK (true);
*/

function mapToStudentProgress(row: any): StudentProgress {
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

function mapToDBRow(progress: StudentProgress) {
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

const DEFAULT_STUDENTS: StudentProgress[] = [
  { "userId": "student-1", "username": "ALICE CUNHA DE ANDRADE", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-2", "username": "ASLAN DANICH LAVECKAS RODRIGUES", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-3", "username": "BRENO CEZARETTO", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-4", "username": "DULCE MARIA DE FATIMA DA SILVA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-5", "username": "EDUARDO GOMES NASCIMENTO DE SOUZA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-6", "username": "ERICK MATHEUS FLAUSINO DA CRUZ", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-7", "username": "FELIPE GUILHERME DO PRADO CALABREZ", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-8", "username": "GABRIEL HENRIQUE DE ARAUJO IENO", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-9", "username": "GABRIEL PONCIANO MANCILHA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-10", "username": "GUILHERME ROBLEDILHO SILVA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-11", "username": "GUSTAVO CAMPOS DOS REIS", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-12", "username": "GUSTAVO HENRIQUE DA SILVA CASTRO", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-13", "username": "GUSTAVO HENRIQUE RAMOS DE PAULA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-14", "username": "HEITOR COSTA GOMES", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-15", "username": "JOÃO PEDRO RIBEIRO FERNANDES", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-16", "username": "JOÃO VICTOR SOUZA SANTOS", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-17", "username": "JORGE CHAFIC MOGAMES MORAES", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-18", "username": "JULIA PEREIRA ALVES DA SILVA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-19", "username": "KAMILY DE MOURA OLIVEIRA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-20", "username": "LÍVIA DE PAULA RIBEIRO FEITAL MENDES", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-21", "username": "LUÍS FELIPE VIEIRA CONCEIÇÃO", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-22", "username": "MARIA CLARA RIBEIRO JUNHO FERREIRA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-23", "username": "MARIA EDUARDA MORRONI CRUZ", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-24", "username": "MIGUEL BARROS SOBRINHO", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-25", "username": "MIGUEL OLIVEIRA BUCHERI", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-26", "username": "PABLO EMANOEL CANDIDO CARDOSO GOMES", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-27", "username": "PABLO GONÇALVES CASTELO BRANCO", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-28", "username": "PABLO VINÍCIUS FAGUNDES SANTOS", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-29", "username": "PEDRO AUGUSTO BARBOSA DE FREITAS", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-30", "username": "SARAH SANCHES PINHEIRO GONZAGA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-31", "username": "THALITA TEIXEIRA COMISSARIO", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] },
  { "userId": "student-32", "username": "YASMIN AUGUSTA ANJOS DA SILVA", "xp": 0, "streak": 0, "lastActive": null, "completedLessons": [], "completedQuizzes": [], "milestonesReached": [] }
];

function readStudentsDB(): StudentProgress[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading students database file:", error);
  }
  // Initialize file with default student list
  writeStudentsDB(DEFAULT_STUDENTS);
  return DEFAULT_STUDENTS;
}

function writeStudentsDB(data: StudentProgress[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing students database file:", error);
  }
}

async function getStudents(): Promise<StudentProgress[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("students_progress")
        .select("*");
      
      if (error) {
        if (error.code === "P0001" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
          console.warn("⚠️ Supabase 'students_progress' table does not exist. Please run the table creation query. Falling back to local students_db.json file!");
        } else {
          console.error("Supabase dynamic error fetching students:", error.message || error);
        }
        return readStudentsDB();
      }
      return (data || []).map(mapToStudentProgress);
    } catch (err: any) {
      console.error("Unexpected error querying Supabase, falling back to local database:", err.message || err);
      return readStudentsDB();
    }
  }
  return readStudentsDB();
}

async function saveStudentProgress(username: string, progress: any): Promise<{ success: boolean; student: StudentProgress; students: StudentProgress[] }> {
  const students = await getStudents();
  const idx = students.findIndex(s => s.username.toUpperCase() === username.toUpperCase());
  
  let updatedStudent: StudentProgress;
  
  if (idx > -1) {
    updatedStudent = {
      ...students[idx],
      xp: typeof progress.xp === "number" ? progress.xp : students[idx].xp,
      streak: typeof progress.streak === "number" ? progress.streak : students[idx].streak,
      lastActive: progress.lastActive || students[idx].lastActive,
      completedLessons: Array.isArray(progress.completedLessons) ? progress.completedLessons : students[idx].completedLessons,
      completedQuizzes: Array.isArray(progress.completedQuizzes) ? progress.completedQuizzes : students[idx].completedQuizzes,
      milestonesReached: Array.isArray(progress.milestonesReached) ? progress.milestonesReached : students[idx].milestonesReached,
      certificateUuid: progress.certificateUuid || students[idx].certificateUuid
    };
    students[idx] = updatedStudent;
  } else {
    const isPredefined = DEFAULT_STUDENTS.some(s => s.username.toUpperCase() === username.toUpperCase());
    const computedUserId = isPredefined 
      ? `student-${DEFAULT_STUDENTS.findIndex(s => s.username.toUpperCase() === username.toUpperCase()) + 1}`
      : `dynamic-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    
    updatedStudent = {
      userId: computedUserId,
      username: username,
      xp: progress.xp || 0,
      streak: progress.streak || 0,
      lastActive: progress.lastActive || null,
      completedLessons: progress.completedLessons || [],
      completedQuizzes: progress.completedQuizzes || [],
      milestonesReached: progress.milestonesReached || [],
      certificateUuid: progress.certificateUuid
    };
    students.push(updatedStudent);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const dbRow = mapToDBRow(updatedStudent);
      const { error } = await supabase
        .from("students_progress")
        .upsert(dbRow, { onConflict: "username" });
      
      if (error) {
        console.error("Failed to upsert student to Supabase:", error.message || error);
        writeStudentsDB(students);
      }
    } catch (err: any) {
      console.error("Unexpected error saving student to Supabase:", err.message || err);
      writeStudentsDB(students);
    }
  } else {
    writeStudentsDB(students);
  }

  return { success: true, student: updatedStudent, students };
}

async function resetStudentsProgress(): Promise<StudentProgress[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error: deleteError } = await supabase
        .from("students_progress")
        .delete()
        .neq("user_id", "");
      
      if (deleteError) {
        console.error("Failed to clear Supabase database on reset:", deleteError.message || deleteError);
      } else {
        const seedRows = DEFAULT_STUDENTS.map(mapToDBRow);
        const { error: seedError } = await supabase
          .from("students_progress")
          .insert(seedRows);
        if (seedError) {
          console.error("Failed to seed Supabase database on reset:", seedError.message || seedError);
        } else {
          console.log("Successfully reset and seeded Supabase database!");
        }
      }
    } catch (err: any) {
      console.error("Unexpected error resetting Supabase database:", err.message || err);
    }
  }
  writeStudentsDB(DEFAULT_STUDENTS);
  return DEFAULT_STUDENTS;
}

// Lazy initialize Gemini client to prevent crashing if the user hasn't loaded keys in UI secrets yet
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
    timezone: new Date().toISOString()
  });
});

// GET all students
app.get("/api/students", async (req, res) => {
  const students = await getStudents();
  res.json({ success: true, students });
});

// UPDATE single student progress
app.post("/api/students/save", async (req, res) => {
  const { username, progress } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, message: "Username parameter is required" });
  }

  const result = await saveStudentProgress(username, progress);
  res.json(result);
});

// RESET live leaderboard back to zero (Admin only)
app.post("/api/students/reset", async (req, res) => {
  const { password } = req.body;
  const validPasswords = ["asus"];
  
  if (!password || !validPasswords.includes(password.trim().toLowerCase())) {
    return res.status(403).json({ success: false, message: "Invalid or missing Admin Password." });
  }
  
  const students = await resetStudentsProgress();
  res.json({ success: true, students });
});

// AI Tutor proxy endpoint
app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { action, code, lessonTitle, query, userAnswers } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        success: false,
        message: "Gemini API key is not configured in Secrets. Enjoy our instant sandbox and local course features while the keys are setting up!"
      });
    }

    if (action === "explain_code") {
      const prompt = `You are a helpful Python Tutor for W3Schools. Explain this code snippet in a simple, friendly, easy-to-understand way for beginners. Keep it concise (no more than 3 paragraphs). Identify any possible syntax errors if any.
Lesson Topic: ${lessonTitle || "Variables & Syntax"}
Code:
\`\`\`python
${code}
\`\`\`
Include a quick breakdown of how variables change or what functions do step-by-step. Use beautiful markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      return res.json({
        success: true,
        heading: "AI Explanation Sidekick",
        content: response.text || "No response text found."
      });
    }

    if (action === "verify_project") {
      const prompt = `You are a Python script validator for a school classroom platform.
Analyze the following student's Python program to determine if it successfully and cleanly implements our School Grading System project.

Project Guidelines & Requirements:
1. Define three numeric variables score1, score2, and score3 representing test marks (any floats or integers, eg 8.0, 9.5, 9.5).
2. Calculate the mathematical average of these three test scores.
3. Print or output the average.
4. Correctly branch and output:
   - average exactly 10: "Perfect"
   - average between 8 and 9.9: "Very good"
   - average between 5 and 7.9: "Good"
   - average between 1 and 4.9: "Need to improve"

Student Python Code:
\`\`\`python
${code}
\`\`\`

Evaluate this code comprehensively against these 4 mock cases:
- Case A: score1=10, score2=10, score3=10 (average is 10) ➔ Output must trigger "Perfect".
- Case B: score1=8, score2=9, score3=10 (average is 9.0) ➔ Output must trigger "Very good".
- Case C: score1=6, score2=6.5, score3=7 (average is 6.5) ➔ Output must trigger "Good".
- Case D: score1=3, score2=3, score3=3 (average is 3.0) ➔ Output must trigger "Need to improve".

You must respond in a valid JSON schema with:
1. "passed": boolean (true if all project guidelines are fully met).
2. "feedback": string (A helpful, encouraging summary message in Portuguese explaining the test results and congrats/suggestions).
3. "checks": Array of 6 objects, each with:
   - "id": string ("syntax" | "average" | "perfect" | "very_good" | "good" | "improve")
   - "label": string (Description of the check in Portuguese, eg "Sem erros de sintaxe", "Cálculo correto da média", "Média 10 retorna 'Perfect'", "Média 8-9.9 retorna 'Very good'", "Média 5-7.9 retorna 'Good'", "Média 1-4.9 retorna 'Need to improve'")
   - "passed": boolean (whether this particular guideline check was passed by the code)

Do not write markdown boxes. Only output raw JSON matching this schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              passed: { type: Type.BOOLEAN },
              feedback: { type: Type.STRING },
              checks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    passed: { type: Type.BOOLEAN }
                  },
                  required: ["id", "label", "passed"]
                }
              }
            },
            required: ["passed", "feedback", "checks"]
          }
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      return res.json({
        success: true,
        ...result
      });
    }

    if (action === "evaluate_execution") {
      // Act as a secure simulated virtual machine for non-trivial queries
      const prompt = `Act as a reliable, secure, sandboxed Python 3 runtime interpreter.
Analyze the following Python program and simulate its exact output.
Identify any runtime or syntax errors if they exist.

Python Code:
\`\`\`python
${code}
\`\`\`

You must respond in a valid JSON schema with:
1. "output": A string containing the exact combined terminal console output including line breaks (e.g. print statements). If there is a syntax error or a division by zero error, output the Python stack trace error.
2. "isError": boolean showing if there is a crash/syntax error.
3. "visualStateTrace": An array of objects showing how variables changed step-by-step (e.g. {"step": index, "values": "x = 5"}).
4. "tutorialInsight": A single-sentence tip teaching them why this works.

Do not write markdown boxes. Only output raw JSON matching this schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              output: { type: Type.STRING },
              isError: { type: Type.BOOLEAN },
              visualStateTrace: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.INTEGER },
                    values: { type: Type.STRING }
                  },
                  required: ["step", "values"]
                }
              },
              tutorialInsight: { type: Type.STRING }
            },
            required: ["output", "isError", "visualStateTrace", "tutorialInsight"]
          }
        }
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      return res.json({
        success: true,
        ...result
      });
    }

    if (action === "suggest_challenge") {
      const prompt = `You are a creative W3Schools Python instructor. Set an interactive coding puzzle based on the topic "${lessonTitle}".
Create a short assignment to be coded.
Return in JSON format:
{
  "title": "A short engaging challenge title",
  "taskDescription": "Describe what they need to code clearly.",
  "startingCode": "The python template file containing placeholder",
  "solutionSnippet": "The golden python solution",
  "hints": "A helpful starting tip"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              taskDescription: { type: Type.STRING },
              startingCode: { type: Type.STRING },
              solutionSnippet: { type: Type.STRING },
              hints: { type: Type.STRING }
            },
            required: ["title", "taskDescription", "startingCode", "solutionSnippet", "hints"]
          }
        }
      });

      const result = JSON.parse((response.text || "{}").trim());
      return res.json({
        success: true,
        challenge: result
      });
    }

    // Default catch for plain tutor Q&A queries
    const tutorPrompt = `You are an AI Python Tutor. The student has a question while in a course:
Topic: ${lessonTitle || "Python programming basics"}
Current sandbox code:
\`\`\`python
${code || "# No code loaded"}
\`\`\`
Student's Question: "${query}"

Provide a concise, extremely friendly answer teaching them step-by-step. Keep code blocks small and focused.`;

    const qaResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: tutorPrompt
    });

    return res.json({
      success: true,
      content: qaResponse.text || "How else can I assist your Python studies today?"
    });

  } catch (error: any) {
    console.error("Error inside AI tutor endpoint:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred in our AI tutor middleware. Don't worry, you can continue coding inside the native interpreter console!",
      error: error?.message || error
    });
  }
});

// Setup Vite Dev server or Production static serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static distribution pipeline configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express application booted on environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Port binding active on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
