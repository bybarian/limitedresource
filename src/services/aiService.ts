import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  try {
    return process.env.GEMINI_API_KEY || '';
  } catch {
    return '';
  }
};

export interface RadarPoint {
  milestone: string;
  first: number;
  ex1: number;
  ex2: number;
}

export interface AISuggestion {
  milestoneId: string;
  milestoneTitle: string;
  observation: string;
  suggestion: string;
  actionableStep: string;
}

export const getImprovementSuggestions = async (radarData: RadarPoint[], milestonesInfo: any[]) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("找不到 Gemini API Key。如果是部署在 GitHub Pages，請確保已在 GitHub Repo Settings 的 Secrets 中設定 GEMINI_API_KEY，且在 Actions Workflow 檔案中有傳遞此環境變數。");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const milestoneMap = milestonesInfo.reduce((acc: any, m: any) => {
    acc[m.id] = { category: m.category, levels: m.levels };
    return acc;
  }, {});

  const dataStr = radarData.map(d => 
    `${d.milestone}: 首次評分 ${d.first.toFixed(1)}%, 演練一 ${d.ex1.toFixed(1)}%, 演練二 ${d.ex2.toFixed(1)}%`
  ).join('\n');

  const prompt = `你是一位專業的緊急醫療教學專家。以下是一位學員在「侷限醫療」戰傷工作坊實戰演練中的表現數據。
數據包含首次工作坊 (Baseline)、第二次演練 (Exercise 1) 與第三次演練 (Exercise 2) 的得分百分比。

表現數據：
${dataStr}

Milestone 定義：
${JSON.stringify(milestoneMap)}

請根據這些數據趨勢進行深入分析，針對表現最差或成長最緩慢的 3 個項目提供具體的改進建議，並以 JSON 格式回傳。`;

  try {
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

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
