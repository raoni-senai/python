import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

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
app.get("/api/students", (req, res) => {
  const students = readStudentsDB();
  res.json({ success: true, students });
});

// UPDATE single student progress
app.post("/api/students/save", (req, res) => {
  const { username, progress } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, message: "Username parameter is required" });
  }

  const students = readStudentsDB();
  const idx = students.findIndex(s => s.username.toUpperCase() === username.toUpperCase());
  
  if (idx > -1) {
    // Correctly updating the matching student progress properties
    students[idx] = {
      ...students[idx],
      xp: typeof progress.xp === "number" ? progress.xp : students[idx].xp,
      streak: typeof progress.streak === "number" ? progress.streak : students[idx].streak,
      lastActive: progress.lastActive || students[idx].lastActive,
      completedLessons: Array.isArray(progress.completedLessons) ? progress.completedLessons : students[idx].completedLessons,
      completedQuizzes: Array.isArray(progress.completedQuizzes) ? progress.completedQuizzes : students[idx].completedQuizzes,
      milestonesReached: Array.isArray(progress.milestonesReached) ? progress.milestonesReached : students[idx].milestonesReached,
      certificateUuid: progress.certificateUuid || students[idx].certificateUuid
    };
    writeStudentsDB(students);
    return res.json({ success: true, student: students[idx], students });
  } else {
    // If they change their name to something else, register them dynamically
    const newStudent: StudentProgress = {
      userId: `dynamic-${Date.now()}`,
      username: username,
      xp: progress.xp || 0,
      streak: progress.streak || 0,
      lastActive: progress.lastActive || null,
      completedLessons: progress.completedLessons || [],
      completedQuizzes: progress.completedQuizzes || [],
      milestonesReached: progress.milestonesReached || [],
      certificateUuid: progress.certificateUuid
    };
    students.push(newStudent);
    writeStudentsDB(students);
    return res.json({ success: true, student: newStudent, students });
  }
});

// RESET live leaderboard back to zero (Admin only)
app.post("/api/students/reset", (req, res) => {
  const { password } = req.body;
  const validPasswords = ["asus"];
  
  if (!password || !validPasswords.includes(password.trim().toLowerCase())) {
    return res.status(403).json({ success: false, message: "Invalid or missing Admin Password." });
  }
  
  writeStudentsDB(DEFAULT_STUDENTS);
  res.json({ success: true, students: DEFAULT_STUDENTS });
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
