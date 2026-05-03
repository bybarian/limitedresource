import { Milestone, TeamMember, ResearchGap, TimelinePhase } from '../types';

export const RESEARCH_BACKGROUND = {
  characteristics: [
    "典型的高危險、低頻率 (High-risk, low-frequency) 任務",
    "具備高度不確定性、資源侷限與時間壓力",
    "要求即時整合臨床判斷與團隊協作能力"
  ],
  educationModel: "整合式教學模組 (高擬真模擬 + 翻轉教學)",
  kabchain: ["Knows (知識)", "Shows how (操作)", "Does (實踐)"]
};

export const RESEARCH_GAPS: ResearchGap[] = [
  {
    title: "缺乏整合式教學模式實證",
    content: "現有文獻多聚焦於單一教學策略，而非整合式設計。刻意練習雖有效，但其與翻轉學習的整合應用仍缺乏實證研究。",
    reference: "McGaghie WC 2011; Chen F 2017"
  },
  {
    title: "缺乏完整能力進展鏈驗證",
    content: "多數研究僅評估知識或短期表現，較少探討知識如何轉化為臨床行為與最終能力 (K→B→C)。",
    reference: "Young JQ 2014"
  },
  {
    title: "模擬評估轉化能力判斷不明確",
    content: "雖然模擬已廣泛應用，但其結果如何轉化為臨床勝任能力判斷 (CCC) 仍缺乏明確機制。",
    reference: "Ekpenyong A 2024"
  },
  {
    title: "缺乏縱向追蹤證據",
    content: "多數研究集中於訓練後立即成效，較少評估高風險低頻率任務的長期能力保留。",
    reference: "Rashid H 2024"
  }
];

export const OBJECTIVES = {
  primary: {
    title: "主要研究目標 (Primary Objective)",
    content: "評估結合「翻轉學習、工作坊與高擬真模擬」之整合式教學模式，在局限醫療（高危險、低頻率）情境中，是否較傳統講授式教學能顯著提升學員之整體能力表現（competency outcomes）。"
  },
  secondary: [
    { id: 1, content: "建立並驗證能力進展鏈 (K-A-B-C progression chain)，探討知識如何有效轉化為行為表現並提升至臨床勝任能力。" },
    { id: 2, content: "評估整合式教學模式對知識、自我信心、技能表現與團隊資源管理 (TRM) 之影響。" },
    { id: 3, content: "評估訓練成效之保留性 (retention)，探討追蹤模擬中臨床表現的持續性。" },
    { id: 4, content: "探討模擬評估資料 (checklist, global rating) 作為里程碑 (Milestone) 與 EPA 判斷之有效依據。" },
    { id: 5, content: "分析學習系統參與度與最終能力表現之關聯性。" }
  ]
};

export const HYPOTHESES = [
  { id: 1, title: "教學模式優越性", content: "整合式教學組在綜合能力表現上，顯著優於傳統講授組。" },
  { id: 2, title: "能力進展鏈成效", content: "新型模式能建立完整的能力進展鏈 (K→B→C)，有效將知識轉化為臨床實務。" },
  { id: 3, title: "訓練成效保留性", content: "學員在一個月後的追蹤模擬中，仍能維持高水準的臨床表現。" },
  { id: 4, title: "評估指標有效性", content: "模擬教學評分 (Checklist/Rating) 可作為里程碑進展的有效判斷依據。" }
];

export const MILESTONES: Milestone[] = [
  {
    id: "PC1",
    category: "緊急狀況穩定 (Emergency Stabilization)",
    iconName: "Activity",
    levels: {
      1: "辨識危急狀況需指導",
      2: "基本 MARCH 但順序不穩",
      3: "可依 MARCH 處理單一病人",
      4: "可同時處理多傷患並排序",
      5: "可在資源限制下優化策略並指導他人"
    }
  },
  {
    id: "PC2",
    category: "重點評估 (Focused Exam)",
    iconName: "Search",
    levels: {
      1: "無系統性評估",
      2: "ABC 評估但易遺漏",
      3: "完成 primary survey (MARCH/ABCDE)",
      4: "混亂中整合評估",
      5: "優化流程並帶領團隊"
    }
  },
  {
    id: "PC3",
    category: "診斷研究 (Diagnostic Studies)",
    iconName: "FlaskConical",
    levels: {
      1: "不知何時使用工具",
      2: "指導下使用",
      3: "能選擇適當工具",
      4: "資源限制下最佳策略",
      5: "建立替代診斷流程"
    }
  },
  {
    id: "PC4",
    category: "臨床診斷 (Diagnosis)",
    iconName: "Stethoscope",
    levels: {
      1: "無法辨識危急病況",
      2: "可辨識單一問題",
      3: "能整合傷情",
      4: "能優先排序決策",
      5: "多傷患與不確定下策略決策"
    }
  },
  {
    id: "PC5",
    category: "藥物治療 (Pharmacotherapy)",
    iconName: "Pill",
    levels: {
      1: "不熟悉用藥",
      2: "指導下使用",
      3: "正確使用 TXA/輸液",
      4: "執行 damage control resuscitation",
      5: "優化 resuscitation strategy"
    }
  },
  {
    id: "PC6",
    category: "動態再評估 (Reassessment)",
    iconName: "RefreshCw",
    levels: {
      1: "未再評估",
      2: "被動再評估",
      3: "定期 reassessment",
      4: "根據變化調整策略",
      5: "建立團隊再評估流程"
    }
  },
  {
    id: "PC7",
    category: "後送分流 (Disposition)",
    iconName: "Shuffle",
    levels: {
      1: "無法決定方向",
      2: "指導下轉送",
      3: "依 triage 決定 disposition",
      4: "災難情境 evacuation",
      5: "系統層級資源配置"
    }
  },
  {
    id: "ICS2",
    category: "溝通能力 (Communication)",
    iconName: "MessageSquare",
    levels: {
      1: "溝通混亂",
      2: "基本回報",
      3: "使用 closed-loop",
      4: "壓力下維持清晰溝通",
      5: "建立團隊溝通架構"
    }
  },
  {
    id: "ICS3",
    category: "領導能力 (Leadership)",
    iconName: "Users",
    levels: {
      1: "無法領導",
      2: "偶爾給指令",
      3: "能分配任務",
      4: "整合團隊並動態調整",
      5: "預測風險並有效領導"
    }
  },
  {
    id: "SBP2",
    category: "系統導航 (System Navigation)",
    iconName: "Navigation",
    levels: {
      1: "不理解系統",
      2: "指導下運作",
      3: "依流程運作",
      4: "壓力下維持系統",
      5: "優化災難流程"
    }
  },
  {
    id: "SBP3",
    category: "資源利用 (Resource Utilization)",
    iconName: "BarChart",
    levels: {
      1: "無法使用資源",
      2: "使用基本資源",
      3: "合理分配資源",
      4: "資源受限下優化",
      5: "系統層級資源決策"
    }
  }
];

export const COURSE_MAPPING = [
  { milestone: "PC1 穩定", course: "第3堂：MARCH-PAWS", methods: "初期生命救治核心流程" },
  { milestone: "PC2 評估", course: "第3堂：Primary survey", methods: "ABCDE/MARCH 系統性評估" },
  { milestone: "PC3 診斷", course: "第4-2堂：E-FAST", methods: "重點式超音波操作與判讀" },
  { milestone: "PC4 診斷", course: "第2堂：TECC/TCCC", methods: "戰傷醫療照護與傷情整合" },
  { milestone: "PC5 藥物", course: "第3堂：MARCH-PAWS", methods: "復甦液體與關鍵用藥" },
  { milestone: "PC6 再評估", course: "第3堂：MARCH reassessment", methods: "病情變化監測與動態調整" },
  { milestone: "PC7 處置", course: "第5堂：後送概論", methods: "傷患轉運、分流與後送決策" },
  { milestone: "ICS2 團隊", course: "第5堂：MIST / 9-line", methods: "結構化通報與團隊溝通" },
  { milestone: "ICS3 領導", course: "第2堂：指揮鏈", methods: "指揮體系與任務分配基礎" },
  { milestone: "SBP2 導航", course: "第1堂：韌性醫療系統", methods: "醫療體系應變框架" },
  { milestone: "SBP3 資源", course: "第1堂：資源配置", methods: "系統層級資源調度原則" }
];

export const TECHNIQUE_MAPPING = [
  { milestone: "PC1 穩定", technique: "止血帶、交界處止血、胸封、針減壓", tool: "實體耗材/模擬人" },
  { milestone: "PC2 評估", technique: "（間接）評估技巧", tool: "全身模擬人" },
  { milestone: "PC3 診斷", technique: "E-FAST 操作", tool: "攜帶型超音波" },
  { milestone: "PC5 藥物", technique: "IV/IO 建立、輸血流程（間接）", tool: "IO 鑽孔機" },
  { milestone: "PC7 處置", technique: "桌推演練（部分）", tool: "案例桌牌" },
  { milestone: "ICS2 溝通", technique: "團隊演練", tool: "情境空間" },
  { milestone: "ICS3 領導", technique: "分組任務", tool: "跨專業協作" },
  { milestone: "PC4 診斷", technique: "氣道處置與傷情判斷", tool: "氣道模具" }
];

export const VR_MAPPING = [
  { milestone: "PC1 穩定", scenario: "單一傷患 MARCH 決策（初始處置）", target: "熱區快速處理" },
  { milestone: "PC2 評估", scenario: "單一傷患評估 decision", target: "暖區臨床整合" },
  { milestone: "PC3 診斷", scenario: "診斷 decision（何時做）", target: "危急影像提示" },
  { milestone: "PC4 診斷", scenario: "單一 + 多傷患 decision (整合判斷)", target: "複雜傷情綜合決策" },
  { milestone: "PC5 藥物", scenario: "resuscitation decision (TXA、輸血)", target: "復甦給藥時機" },
  { milestone: "PC6 再評估", scenario: "動態病況變化 (decision update)", target: "生命徵象演變反應" },
  { milestone: "PC7 處置", scenario: "後送決策 (priority / evacuation)", target: "撤離優先順序" },
  { milestone: "ICS2 溝通", scenario: "溝通 decision (通報)", target: "MIST/9-Line 精準度" },
  { milestone: "ICS3 領導", scenario: "指揮決策 (任務分配)", target: "資源管理與領導" },
  { milestone: "SBP2 導航", scenario: "事前準備 (流程建置)", target: "集結點與路徑規劃" },
  { milestone: "SBP3 資源", scenario: "檢傷 + 後送 (資源分配)", target: "大量傷患調度" }
];

export const INTEGRATED_SIM_MAPPING = [
  { milestone: "PC1 穩定", sim: "熱區止血、暖區持續止血與穩定" },
  { milestone: "PC2 評估", sim: "暖區完整評估 (ABCDE/MARCH)" },
  { milestone: "PC3 診斷", sim: "暖區 E-FAST 判讀" },
  { milestone: "PC4 診斷", sim: "複合傷情判斷 (shock、burn、TBI)" },
  { milestone: "PC5 藥物", sim: "暖區輸血、藥物給予" },
  { milestone: "PC6 再評估", sim: "持續 reassessment (vital change)" },
  { milestone: "PC7 處置", sim: "MEDEVAC 決策與撤離" },
  { milestone: "ICS2 溝通", sim: "closed-loop communication" },
  { milestone: "ICS3 領導", sim: "熱區/暖區團隊整合" },
  { milestone: "SBP2 導航", sim: "集結點建立與流程運作" },
  { milestone: "SBP3 資源", sim: "資源受限情境決策" }
];

export const TEAM: TeamMember[] = [
  { role: "VR 模組開發", members: "李宥霆、吳妍萱；外部專家：北慈陳玉龍主任、三總文大任醫師", iconName: "Cpu" },
  { role: "課程規劃與執行", members: "陳麗君、郭宇正、黃暐琇", iconName: "ClipboardList" },
  { role: "研究架構", members: "張昱、徐展鵬；外部專家：北醫吳人傑主任", iconName: "Layers" },
  { role: "資訊系統與 AI", members: "鍾睿元、陳信佑、劉家維", iconName: "Zap" },
  { role: "侷限醫療能力委員會", members: "鍾睿元、李宥霆、吳妍萱、陳玉龍、文大任", iconName: "Users" }
];

export const TIMELINE: TimelinePhase[] = [
  { title: "基礎知識建立 (Basic Knowledge)", start: 0, duration: 1, color: "bg-blue-400", dateLabel: "2026/04", iconName: "Book" },
  { 
    title: "認知與操作技能 + 整合模擬", 
    start: 0, 
    duration: 1, 
    color: "bg-teal-400", 
    dateLabel: "2026/04", 
    iconName: "Dumbbell",
    events: ["4/24 戰傷工作坊：基礎知識和技能訓練"]
  },
  { 
    title: "追蹤模擬與成效保留評估", 
    start: 1, 
    duration: 1, 
    color: "bg-orange-400", 
    dateLabel: "2026/05", 
    iconName: "RefreshCw",
    events: ["5/4 進行追蹤模擬訓練"]
  },
  { title: "VR 訓練系統整合應用", start: 2, duration: 2, color: "bg-red-400", dateLabel: "2026/06-07", iconName: "Glasses" }
];
