import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 全域請求紀錄 (Debug 用)
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // 健康檢查與紀錄
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI 建議路由
  app.post("/api/ai/suggestions", async (req, res) => {
    console.log("Received AI suggestion request");
    try {
      const { radarData, milestoneMap } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        console.error("Missing GEMINI_API_KEY");
        return res.status(500).json({ error: "伺服器未設定 GEMINI_API_KEY" });
      }

      console.log("Initializing Gemini model...");
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    milestoneId: { type: Type.STRING },
                    milestoneTitle: { type: Type.STRING },
                    observation: { type: Type.STRING },
                    suggestion: { type: Type.STRING },
                    actionableStep: { type: Type.STRING }
                  },
                  required: ["milestoneId", "milestoneTitle", "observation", "suggestion", "actionableStep"]
                }
              },
              overallSummary: { type: Type.STRING }
            },
            required: ["suggestions", "overallSummary"]
          }
        }
      });

      const dataStr = radarData.map((d: any) => 
        `${d.milestone}: 首次 ${d.first.toFixed(1)}%, 演練一 ${d.ex1.toFixed(1)}%, 演練二 ${d.ex2.toFixed(1)}%`
      ).join('\n');

      const prompt = `分析學員在「侷限醫療」戰傷工作坊的表現數值。
表現數據：
${dataStr}

Milestone 定義：
${JSON.stringify(milestoneMap)}

請提供 3 個進步最慢項目的具體建議，並以 JSON 格式回傳。`;

      console.log("Generating AI content...");
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      console.log("AI Response received");
      res.json(JSON.parse(responseText || '{}'));
    } catch (error: any) {
      console.error("AI Route Error:", error);
      res.status(500).json({ error: error.message || "AI 生成過程發生錯誤" });
    }
  });

  // Vite 中間件處理 (開發環境)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // 靜態文件處理 (生產環境)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
