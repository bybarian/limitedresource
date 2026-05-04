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

  const response = await fetch("/api/ai/suggestions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ radarData, milestoneMap }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "無法連線至 AI 伺服器，請稍後再試。");
  }

  return response.json();
};
