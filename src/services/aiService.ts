import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
  const milestoneMap = milestonesInfo.reduce((acc: any, m: any) => {
    acc[m.id] = { category: m.category, levels: m.levels };
    return acc;
  }, {});

  const dataStr = radarData.map(d => 
    `${d.milestone} (${milestoneMap[d.milestone]?.category || ''}): 首次評分 ${d.first.toFixed(1)}%, 演練一 ${d.ex1.toFixed(1)}%, 演練二 ${d.ex2.toFixed(1)}%`
  ).join('\n');

  const prompt = `
你是一位專業的緊急醫療教學專家。以下是一位學員在「侷限醫療」戰傷工作坊實戰演練中的表現數據（以 11 個 Milestone 為指標）。
數據包含首次工作坊 (Baseline)、第二次演練 (Exercise 1) 與第三次演練 (Exercise 2) 的得分百分比。

表現數據：
${dataStr}

Milestone 定義參考：
${JSON.stringify(milestoneMap, null, 2)}

請根據這些數據趨勢進行深入分析，並針對表現最差或成長最緩慢的 3 個項目提供具體的改進建議。
請以 JSON 格式回傳，結構為：
{
  "suggestions": [
    {
      "milestoneId": "Milestone ID",
      "milestoneTitle": "Milestone 分類名稱",
      "observation": "簡短描述在此項目的表現趨勢（例如：持續低迷、退步、或是進度緩慢）",
      "suggestion": "專業的改進面向建議",
      "actionableStep": "一個非常具體的練習步驟或行動方案"
    }
  ],
  "overallSummary": "一句話總結整體的成長優勢與核心待開發潛力"
}
`;

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
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
