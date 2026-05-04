import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 初始化 AI (留在伺服器端)
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on server");
    return new GoogleGenAI({ apiKey });
  };

  // AI 建議路由
  app.post("/api/ai/suggestions", async (req, res) => {
    try {
      const { radarData, milestoneMap } = req.body;
      const ai = getAI();

      const dataStr = radarData.map((d: any) => 
        `${d.milestone} (${milestoneMap[d.milestone]?.category || ''}): 首次評分 ${d.first.toFixed(1)}%, 演練一 ${d.ex1.toFixed(1)}%, 演練二 ${d.ex2.toFixed(1)}%`
      ).join('\n');

      const prompt = `
你是一位專業的緊急醫療教學專家。以下是一位學員在「侷限醫療」戰傷工作坊實戰演練中的表現數據。
數據包含首次工作坊 (Baseline)、第二次演練 (Exercise 1) 與第三次演練 (Exercise 2) 的得分百分比。

表現數據：
${dataStr}

Milestone 定義參考：
${JSON.stringify(milestoneMap, null, 2)}

請根據這些數據趨勢進行深入分析，並針對表現最差或成長最緩慢的 3 個項目提供具體的改進建議。
請以 JSON 格式回傳。
`;

      // 使用正確的 SDK 呼叫方式
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
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

      res.json(JSON.parse(response.text || '{}'));
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
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
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
