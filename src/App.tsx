/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { 
  Activity, 
  Target, 
  ClipboardCheck, 
  Users, 
  Calendar, 
  Map, 
  ChevronRight, 
  BookOpen, 
  Stethoscope, 
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Wind,
  ShieldAlert,
  Home,
  Biohazard,
  Search,
  FlaskConical,
  Pill,
  MessageSquare,
  BarChart,
  Building2,
  Globe,
  Cpu,
  ClipboardList,
  Layers,
  Zap,
  Book,
  Dumbbell,
  RefreshCw,
  Glasses,
  School,
  Wrench,
  Gamepad2,
  Shuffle,
  Navigation,
  Shield,
  ClipboardType,
  Info,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logout, handleFirestoreError, OperationType } from './firebase';
import { getImprovementSuggestions, AISuggestion } from './services/aiService';

import { 
  RESEARCH_GAPS, 
  RESEARCH_BACKGROUND, 
  MILESTONES, 
  TEAM, 
  TIMELINE,
  OBJECTIVES,
  HYPOTHESES,
  COURSE_MAPPING,
  TECHNIQUE_MAPPING,
  VR_MAPPING,
  INTEGRATED_SIM_MAPPING
} from './constants/data';

// --- 子組件 ---

const RelationshipDiagram = () => {
  return (
    <div className="watercolor-card p-8 bg-slate-50 border-none shadow-inner">
      <h3 className="text-xl font-extrabold text-slate-900 mb-10 text-center">能力轉化與教學資源流動圖</h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
        {/* Milestones Hub */}
        <div className="flex flex-col items-center gap-3 w-44">
          <div className="w-24 h-24 rounded-3xl bg-slate-900 text-white flex flex-col items-center justify-center font-bold shadow-xl">
             <Target size={24} className="mb-1" />
             <span className="text-xs">核心能力</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-black text-slate-900">核心里程碑</div>
            <div className="text-[10px] text-slate-500 font-bold">Core Milestones</div>
          </div>
        </div>

        <div className="hidden md:block">
          <ArrowRight className="text-slate-400" />
        </div>

        {/* The K-B-VR Loop */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm">
          {/* K */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#ffc000] text-black flex items-center justify-center font-black shadow-lg">K</div>
            <span className="text-[11px] font-black text-slate-800">知識內化</span>
          </div>
          {/* B */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#ed7d31] text-white flex items-center justify-center font-black shadow-lg">B</div>
            <span className="text-[11px] font-black text-slate-800">技術操作</span>
          </div>
          {/* VR */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#ed4848] text-white flex items-center justify-center font-black shadow-lg">VR</div>
            <span className="text-[11px] font-black text-slate-800">認知模擬</span>
          </div>
        </div>

        <div className="hidden md:block">
          <ArrowRight className="text-slate-400" />
        </div>

        {/* Integrated Sim */}
        <div className="flex flex-col items-center gap-3 w-44">
          <div className="w-24 h-24 rounded-full bg-[#4472c4] text-white flex flex-col items-center justify-center font-bold shadow-xl shadow-[#4472c4]/30">
             <Activity size={24} className="mb-1" />
             <span className="text-xs">整合模擬</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-black text-slate-900">高擬真演練</div>
            <div className="text-[10px] text-slate-500 font-bold">Integrated Performance</div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 max-w-3xl mx-auto text-center">
        <div className="flex-1 p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
          <p className="text-[12px] text-black font-black">知識與技術作為基礎支柱，支撐認知決策</p>
        </div>
        <div className="flex-1 p-4 rounded-2xl bg-white border border-green-100 shadow-sm">
          <p className="text-[12px] text-black font-black">整合模擬驗證能力轉化，最終達成臨床勝任</p>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon, subtitle }: { title: string, icon: any, subtitle?: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2.5 bg-medical-blue/20 rounded-xl">
        <Icon className="text-medical-blue" size={24} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
    </div>
    {subtitle && <p className="text-black font-extrabold ml-[52px] leading-relaxed max-w-2xl">{subtitle}</p>}
  </div>
);

const ThemeIcon = ({ icon: Icon, label, colorClass }: { icon: any, label: string, colorClass: string }) => (
  <div className="flex flex-col items-center gap-3 group">
    <div className={`p-4 rounded-full transition-transform group-hover:scale-110 ${colorClass} bg-white shadow-sm border border-slate-100`}>
      <Icon size={32} />
    </div>
    <span className="text-sm font-bold text-slate-600">{label}</span>
  </div>
);

const MilestoneIcon = ({ name }: { name: string }) => {
  const icons: { [key: string]: any } = {
    Activity, Search, FlaskConical, Stethoscope, Pill, MessageSquare, BarChart, Book, Dumbbell, RefreshCw, Glasses, Shuffle, Navigation, Users, Shield, Zap, Layers, ClipboardList, Cpu
  };
  const Icon = icons[name] || Activity;
  return <Icon size={20} className="text-medical-blue" />;
};

const GenericIcon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  const icons: { [key: string]: any } = {
    Cpu, ClipboardList, Layers, Zap, Book, Dumbbell, RefreshCw, Glasses, School, Wrench, Gamepad2, Map, Calendar, Users, Target, Shield, Shuffle, Navigation, ClipboardCheck, Activity, Search, FlaskConical, Stethoscope, Pill, MessageSquare, BarChart, ClipboardType
  };
  const Icon = icons[name] || Activity;
  return <Icon size={size} className={className} />;
};

const KABCPyramid = () => {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  
  const layers = [
    { 
      id: 4, 
      name: '能力', 
      english: '(Competency)', 
      color: 'bg-[#4472c4]', 
      text: 'text-white',
      leftLabel: 'C = EPA & Milestone',
      leftColor: 'border-[#4472c4] text-[#4472c4]'
    },
    { 
      id: 3, 
      name: '技術 + 知識', 
      english: '(Performance)', 
      color: 'bg-[#70ad47]', 
      text: 'text-white',
      leftLabel: 'B2 = 模擬訓練',
      leftColor: 'border-[#70ad47] text-[#70ad47]',
      rightLabels: ['1. Clinical management', '2. Team resource management']
    },
    { 
      id: 2, 
      name: '技術', 
      english: '(Skill)', 
      color: 'bg-[#ed7d31]', 
      text: 'text-white',
      leftLabel: 'B1 = DOPS / SCT',
      leftColor: 'border-[#ed7d31] text-[#ed7d31]',
      rightLabels: ['1. Procedural skill', '2. Decision / cognitive skill']
    },
    { 
      id: 1, 
      name: '知識', 
      english: '(Knowledge)', 
      color: 'bg-[#ffc000]', 
      text: 'text-black',
      leftLabel: 'K = 知識前後測驗',
      leftColor: 'border-[#ffc000] text-[#ffc000]'
    },
  ];

  const trapezoids = [
    "polygon(10% 0%, 90% 0%, 95% 100%, 5% 100%)",    // C (Peak)
    "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",     // B2
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",    // B1
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",    // K (Base)
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 px-2 sm:px-10">
      <div className="absolute top-0 right-10 text-[10px] sm:text-xs font-black text-slate-500">
        A = 自我信心度
      </div>
      
      <div className="flex flex-col items-center">
        {layers.map((layer, idx) => {
          return (
            <div key={layer.id} className="relative w-full flex items-center justify-center min-h-[90px]">
              {/* Left Box Labels */}
              <div className="absolute left-0 w-[160px] hidden xl:block z-20">
                <div className={`p-2 border-2 rounded-xl bg-white text-[11px] font-black text-center shadow-md ${layer.leftColor}`}>
                  {layer.leftLabel}
                </div>
              </div>

              {/* Pyramid Layer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative cursor-pointer transition-all duration-300 ${layer.color} ${layer.text} border-b border-white border-opacity-40 w-full hover:z-30`}
                style={{ 
                  height: '90px',
                  clipPath: trapezoids[idx],
                  marginBottom: '-1px'
                }}
                onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
              >
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                   <div className="text-base sm:text-lg font-black mb-0.5 text-black">
                     {layer.name}
                   </div>
                   <div className="text-[11px] sm:text-sm font-black opacity-90 italic text-slate-800">
                     {layer.english}
                   </div>
                </div>
              </motion.div>

              {/* Right Side Labels */}
              {layer.rightLabels && (
                <div className="absolute right-0 w-[200px] hidden xl:block text-left pl-6 z-20">
                  <div className="space-y-1.5">
                    {layer.rightLabels.map((rl, i) => (
                      <div key={i} className="text-[11px] font-black text-black leading-tight bg-white/50 backdrop-blur-sm p-1 rounded-md">
                        {rl}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <AnimatePresence>
        {activeLayer && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 10 }}
             className="mt-12 text-center p-6 watercolor-card bg-slate-50 border-slate-200"
           >
             <div className="text-medical-blue font-black text-sm mb-2">
               {layers.find(l => l.id === activeLayer)?.leftLabel}
             </div>
             <p className="text-slate-800 font-bold text-[11px]">本階段核心：確保教學資源有效透過整合機制轉化為真實臨床能力</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GapCard = ({ gap }: { gap: typeof RESEARCH_GAPS[0] }) => (
  <div className="watercolor-card p-6 flex flex-col h-full hover:bg-white transition-all group border-none shadow-sm hover:shadow-md">
    <div className="flex items-start gap-3 mb-4">
      <div className="mt-1 p-2 bg-medical-red/10 rounded-lg group-hover:bg-medical-red/20 transition-colors">
        <AlertTriangle className="text-medical-red" size={20} />
      </div>
      <h3 className="text-lg font-black text-slate-900 leading-tight">{gap.title}</h3>
    </div>
    <p className="text-black font-black text-sm flex-grow mb-6 leading-relaxed">
      {gap.content}
    </p>
    {gap.reference && (
      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
        文獻：{gap.reference}
      </div>
    )}
  </div>
);

// --- Draggable Milestone Helper Component ---

interface MilestoneNodeProps {
  item: string;
  color: string;
  initialX: number;
  initialY: number;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}

const DraggableMilestone = ({ item, color, initialX, initialY, constraintsRef }: MilestoneNodeProps) => {
  // Use motion values to track position and sync with the line
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  return (
    <>
      {/* Connecting Line - always draws from category center (0,0) to current node position (x, y) */}
      <svg className="absolute pointer-events-none overflow-visible" style={{ left: '0', top: '0', zIndex: 0 }}>
        <motion.line
          x1={0}
          y1={0}
          x2={x}
          y2={y}
          stroke={color}
          strokeWidth="3"
          strokeDasharray="6 3"
          className="opacity-40"
        />
      </svg>
      
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.05}
        style={{ x, y, left: '0', top: '0' }}
        className="absolute z-20 cursor-grab active:cursor-grabbing"
      >
        <div className="transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="px-5 py-2.5 bg-white rounded-full text-[11px] font-black shadow-[0_6px_20px_rgba(0,0,0,0.18)] border-[4px] hover:scale-105 transition-all whitespace-nowrap"
            style={{ 
              borderColor: color,
              color: '#1e293b',
              boxShadow: `0 8px 24px -6px ${color}44`
            }}
          >
            {item}
          </div>
        </div>
      </motion.div>
    </>
  );
};

const MilestoneMindMap = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const categories = [
    { 
      id: 'k', 
      name: 'Knowledge (K)', 
      color: '#ffc000', 
      items: [
        'PC1 穩定: MARCH-PAWS',
        'PC2 評估: Primary survey',
        'PC3 診斷: E-FAST',
        'PC4 診斷: TECC/TCCC',
        'PC5 藥物: MARCH-PAWS',
        'PC6 再評估: MARCH reassessment',
        'PC7 處置: 後送概論',
        'ICS2 團隊: MIST / 9-line',
        'ICS3 領導: 指挥鏈',
        'SBP2 導航: 韌性醫療系統',
        'SBP3 資源: 資源配置'
      ], 
      icon: Book 
    },
    { 
      id: 'b1', 
      name: 'Procedural (B)', 
      color: '#ed7d31', 
      items: [
        'PC1 穩定: 止血帶/交界處/胸封',
        'PC2 評估: (問接) 評估技巧',
        'PC3 診斷: E-FAST 操作',
        'PC5 藥物: IV/IO 建立、輸血',
        'PC7 處置: 桌推演練 (部分)',
        'ICS2 溝通: 團隊演練',
        'ICS3 領導: 分組任務',
        'PC4 診斷: 氣道處置與傷情判斷'
      ], 
      icon: Wrench 
    },
    { 
      id: 'b2', 
      name: 'Cognitive (VR)', 
      color: '#ed4848', 
      items: [
        'PC1 穩定: 單一傷患 MARCH 決策',
        'PC2 評估: 單一傷患評估 decision',
        'PC3 診斷: 診斷 decision',
        'PC4 診斷: 單一 + 多傷患 decision',
        'PC5 藥物: resuscitation decision',
        'PC6 再評估: 動態病況變化',
        'PC7 處置: 後送決策 (priority)',
        'ICS2 溝通: 溝通 decision (通報)',
        'ICS3 領導: 指揮決策 (任務分配)',
        'SBP2 導航: 事前準備 (流程建置)',
        'SBP3 資源: 檢傷 + 後送 (資源分配)'
      ], 
      icon: Gamepad2 
    },
    { 
      id: 'sim', 
      name: 'Integration (Sim)', 
      color: '#70ad47', 
      items: [
        'PC1 穩定: 熱區止血、暖區持續止血',
        'PC2 評估: 暖區完整評估 (ABCDE)',
        'PC3 診斷: 暖區 E-FAST 判讀',
        'PC4 診斷: 複合傷情判斷',
        'PC5 藥物: 暖區輸血、藥物給予',
        'PC6 再評估: 持續 reassessment',
        'PC7 處置: MEDEVAC 決策與搬離',
        'ICS2 溝通: closed-loop communication',
        'ICS3 領導: 熱區/暖區團隊整合',
        'SBP2 導航: 集結點建立與流程運作',
        'SBP3 資源: 資源受限情境決策'
      ], 
      icon: Activity 
    },
  ];

  return (
    <div className="watercolor-card p-10 bg-white border-none shadow-sm overflow-hidden min-h-[1100px] relative" ref={constraintsRef}>
      <h3 className="text-2xl font-black text-slate-900 mb-4 text-center">里程碑與教學資源規劃心智圖</h3>
      <div className="text-center text-[11px] font-black text-slate-400 mb-12 uppercase tracking-[0.2em] leading-relaxed max-w-2xl mx-auto">
        此架構圖展示各里程碑於四大教學向度之分布。您可以自由拖動各里程碑節點，查看與分類中心的連結關係。
      </div>
      
      <div className="relative h-[850px] w-full flex items-center justify-center">
        {/* Central Hub - Fixed */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="z-50 w-40 h-40 rounded-[48px] border-[6px] border-slate-900 bg-white text-slate-900 flex flex-col items-center justify-center text-center p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative"
        >
          <div className="absolute inset-0 bg-slate-50/50 rounded-[42px]" />
          <Target size={36} className="mb-2 relative z-10 text-slate-900" />
          <span className="text-sm font-black leading-tight relative z-10 uppercase tracking-tight">臨床勝任能力<br />核心指標</span>
          
          <motion.div 
             animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute inset-0 rounded-[48px] border-4 border-slate-900 -z-10"
          />
        </motion.div>

        {/* Categories and Draggable Milestone Branches */}
        {categories.map((cat, idx) => {
          const initialAngle = (idx * 90) - 90; // Top, Right, Bottom, Left
          const initialRadius = 320; 
          const initialX = Math.cos(initialAngle * Math.PI / 180) * initialRadius;
          const initialY = Math.sin(initialAngle * Math.PI / 180) * initialRadius;

          return (
            <div 
              key={cat.id}
              className="absolute"
              style={{ left: '50%', top: '50%', transform: `translate(${initialX}px, ${initialY}px)` }}
            >
              <div className="flex flex-col items-center relative">
                {/* Category Node - Fixed */}
                <div 
                  className="w-28 h-28 rounded-[36px] bg-white border-[6px] flex items-center justify-center shadow-2xl relative z-40 transition-transform hover:scale-105"
                  style={{ borderColor: cat.color }}
                >
                  <cat.icon style={{ color: cat.color }} size={44} />
                  <div 
                    className="absolute -bottom-10 whitespace-nowrap text-[14px] font-black text-slate-900 bg-white shadow-xl px-5 py-2.5 rounded-full border-[3.5px]"
                    style={{ borderColor: cat.color }}
                  >
                    {cat.name}
                  </div>
                </div>

                {/* Sub-items (Milestones) - Optimized Draggable Nodes */}
                {cat.items.map((item, i) => {
                  const count = cat.items.length;
                  const layer = i % 2;
                  const itemRadius = 180 + (layer * 110); 
                  
                  // Reduced spread angle to 70 degrees to keep it focused
                  const spreadAngle = 70; 
                  const startAngle = initialAngle - spreadAngle/2;
                  const itemAngle = count > 1 ? startAngle + (i / (count - 1)) * spreadAngle : initialAngle;
                  
                  // Initial starting positions relative to Category Center
                  const startX = Math.cos(itemAngle * Math.PI / 180) * itemRadius;
                  const startY = Math.sin(itemAngle * Math.PI / 180) * itemRadius;

                  return (
                    <DraggableMilestone 
                      key={item}
                      item={item}
                      color={cat.color}
                      initialX={startX}
                      initialY={startY}
                      constraintsRef={constraintsRef}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 flex justify-center">
        <div className="max-w-2xl w-full p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center gap-5">
          <div className="p-3 bg-white rounded-xl shadow-md shrink-0">
            <Info size={24} className="text-medical-blue" />
          </div>
          <p className="text-[12px] text-slate-600 font-bold leading-relaxed">
            此心智圖視覺化了 <span className="text-slate-900 underline decoration-slate-400">里程碑 (Milestones)</span> 與教學向度的連結。您可以手動調整節點位置以利觀察。
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 評核專區組件 ---

const EvaluationDashboard = () => {
  const [activeSubTab, setActiveSubTab] = useState<'trends' | 'checklist'>('trends');
  const [activeWorkshop, setActiveWorkshop] = useState<'first' | 'followup'>('followup');
  const [w1SubTab, setW1SubTab] = useState<'C' | 'D'>('C');
  const [w2SubTab, setW2SubTab] = useState<'ex1' | 'ex2'>('ex1');
  
  const [user, setUser] = useState<User | null>(null);
  const [firstScores, setFirstScores] = useState<Record<string, number>>({});
  const [ex1Scores, setEx1Scores] = useState<Record<string, number>>({});
  const [ex2Scores, setEx2Scores] = useState<Record<string, number>>({});
  
  const [aiSuggestions, setAiSuggestions] = useState<{ suggestions: AISuggestion[], overallSummary: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.error("Login failed:", error);
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        // Load from LocalStorage if not logged in
        const savedFirst = localStorage.getItem('firstScores');
        const savedEx1 = localStorage.getItem('ex1Scores');
        const savedEx2 = localStorage.getItem('ex2Scores');
        try {
          if (savedFirst) setFirstScores(JSON.parse(savedFirst));
          if (savedEx1) setEx1Scores(JSON.parse(savedEx1));
          if (savedEx2) setEx2Scores(JSON.parse(savedEx2));
        } catch (e) {
          console.error("Local storage parse error:", e);
        }
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore Data Listener
  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, 'evaluations', user.uid);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.firstScores) setFirstScores(data.firstScores);
        if (data.ex1Scores) setEx1Scores(data.ex1Scores);
        if (data.ex2Scores) setEx2Scores(data.ex2Scores);
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `evaluations/${user.uid}`);
    });

    return () => unsubscribe();
  }, [user]);

  // Shared TRM items for First Workshop
  const getTRMItems = (prefix: string) => [
    { id: `${prefix}_TRM_1`, label: "封閉式溝通", desc: "落實 closed-loop communication", weight: 2, milestones: ["ICS2"] },
    { id: `${prefix}_TRM_2`, label: "清楚指令", desc: "下達清楚指令", weight: 2, milestones: ["ICS2"] },
    { id: `${prefix}_TRM_3`, label: "任務分配", desc: "明確的任務分配", weight: 2, milestones: ["ICS3"] },
    { id: `${prefix}_TRM_4`, label: "策略調整", desc: "動態調整策略", weight: 2, milestones: ["ICS3"] },
    { id: `${prefix}_TRM_5`, label: "互助合作", desc: "團隊成員互助合作", weight: 2, milestones: ["ICS3"] },
  ];

  // PDF Checklist - First Workshop
  const firstData = [
    {
      section: "傷患 C 評估 (Casualty C)",
      subsections: [
        {
          name: "整備 (Preparation)",
          items: [
            { id: "C_prep_1", label: "物資打包", desc: "5 分鐘內完成物資打包", weight: 2, milestones: ["SBP2"] },
            { id: "C_prep_2", label: "裝備精簡", desc: "僅攜帶 MARCH 必需物資，無攤開不必要裝備", weight: 2, milestones: ["SBP3"] },
          ]
        },
        {
          name: "熱區處置 (Hot Zone Care)",
          items: [
            { id: "C_hot_1", label: "進入救助", desc: "5 分鐘內進入並救助患者", weight: 2, milestones: ["PC7", "SBP2"] },
            { id: "C_hot_2", label: "高位止血帶", desc: "快速打上高位止血帶", weight: 2, milestones: ["PC1", "PC8"] },
            { id: "C_hot_3", label: "快速拖離", desc: "快速完成傷患拖離", weight: 2, milestones: ["PC7"] },
          ]
        },
        {
          name: "暖區 M - 大出血 (Massive Hemorrhage)",
          items: [
            { id: "C_m_1", label: "全身評估", desc: "確認全身有無大出血", weight: 2, milestones: ["PC2"] },
            { id: "C_m_2", label: "止血帶檢查", desc: "確認高位止血帶功能正常", weight: 2, milestones: ["PC1"] },
            { id: "C_m_3", label: "紗布填塞", desc: "執行紗布填塞止血", weight: 2, milestones: ["PC1", "PC8"] },
          ]
        },
        {
          name: "暖區 A - 呼吸道 (Airway)",
          items: [
            { id: "C_a_1", label: "呼吸音檢查", desc: "檢查呼吸道無異常呼吸音", weight: 2, milestones: ["PC2", "PC4"] },
            { id: "C_a_2", label: "維持暢通", desc: "維持呼吸道暢通", weight: 2, milestones: ["PC1"] },
          ]
        },
        {
          name: "暖區 R - 呼吸實質 (Respiration)",
          items: [
            { id: "C_r_1", label: "呼吸音對稱", desc: "確認雙側呼吸音對稱", weight: 2, milestones: ["PC4"] },
          ]
        },
        {
          name: "暖區 C - 循環處置 (Circulation)",
          items: [
            { id: "C_c_1", label: "脈搏與 CRT", desc: "評估橈動脈 (Radial pulse) 與 CRT", weight: 2, milestones: ["PC2", "PC4"] },
            { id: "C_c_2", label: "骨盆穩定性", desc: "評估骨盆是否穩定", weight: 2, milestones: ["PC2"] },
            { id: "C_c_3", label: "E-FAST", desc: "執行 E-FAST 無腹內出血、無氣血胸", weight: 2, milestones: ["PC3"] },
            { id: "C_c_4", label: "給予 TXA", desc: "給予 Transamine 2g IVP", weight: 2, milestones: ["PC5"] },
            { id: "C_c_5", label: "輸血處置", desc: "執行輸血處置 (Whole blood 2U)", weight: 2, milestones: ["PC5"] },
            { id: "C_c_6", label: "聯絡手術室", desc: "聯絡手術室安排截肢手術", weight: 2, milestones: ["PC7"] },
          ]
        },
        {
          name: "暖區 H - 神經與保溫 (Hypothermia)",
          items: [
            { id: "C_h_1", label: "瞳孔與 CNS", desc: "檢查瞳孔 (Pupil) 與 CNS 狀態", weight: 2, milestones: ["PC4"] },
            { id: "C_h_2", label: "覆蓋保溫毯", desc: "覆蓋保暖毯", weight: 2, milestones: ["PC1"] },
          ]
        },
        {
          name: "PAWS - 醫療處置",
          items: [
            { id: "C_p_1", label: "給予止痛藥", desc: "給予 Ketamine", weight: 2, milestones: ["PC5"] },
            { id: "C_p_2", label: "給予抗生素", desc: "給予 Ertapenem", weight: 2, milestones: ["PC5"] },
            { id: "C_p_3", label: "二次評估", desc: "二次評估（暴露全身）並包紮非致命傷口", weight: 2, milestones: ["PC6"] },
            { id: "C_p_4", label: "準備撤離", desc: "準備撤離 (MEDEVAC)", weight: 2, milestones: ["PC7", "SBP2"] },
          ]
        },
        {
          name: "團隊資源管理 (TRM)",
          items: getTRMItems("C")
        }
      ]
    },
    {
      section: "傷患 D 評估 (Casualty D)",
      subsections: [
        {
          name: "整備與熱區 (Prep & Hot Zone)",
          items: [
            { id: "D_prep_1", label: "物資打包", desc: "5 分鐘內完成物資打包", weight: 2, milestones: ["SBP2"] },
            { id: "D_prep_2", label: "裝備精簡", desc: "僅攜帶 MARCH 必需物資，無攤開不必要裝備", weight: 2, milestones: ["SBP3"] },
            { id: "D_hot_1", label: "進入救助", desc: "5 分鐘內進入並救助患者", weight: 2, milestones: ["PC7"] },
            { id: "D_hot_2", label: "快速撤離", desc: "快速撤離", weight: 2, milestones: ["PC2"] },
          ]
        },
        {
          name: "暖區 M - 大出血 (Massive Hemorrhage)",
          items: [
            { id: "D_m_1", label: "全身評估", desc: "確認全身有無大出血", weight: 2, milestones: ["PC2", "PC4"] },
          ]
        },
        {
          name: "暖區 A - 呼吸道 (Airway)",
          items: [
            { id: "D_a_1", label: "呼吸音檢查", desc: "確認呼吸道有無異常呼吸音", weight: 2, milestones: ["PC4"] },
            { id: "D_a_2", label: "灼傷識別", desc: "聲音沙啞，懷疑呼吸道灼傷", weight: 2, milestones: ["PC1", "PC8"] },
            { id: "D_a_3", label: "進階呼吸道", desc: "執行進階呼吸道處置", weight: 2, milestones: ["PC1", "PC8"] },
            { id: "D_a_4", label: "環甲膜切開", desc: "辨識面部變形無法插管，執行環甲膜切開術", weight: 2, milestones: ["PC4"] },
          ]
        },
        {
          name: "暖區 R - 呼吸實質 (Respiration)",
          items: [
            { id: "D_r_1", label: "給予氧氣", desc: "給予氧氣 -> SpO2 75%", weight: 2, milestones: ["PC4", "PC7"] },
            { id: "D_r_2", label: "呼吸音減弱", desc: "辨識右側呼吸音減弱", weight: 2, milestones: ["PC4"] },
            { id: "D_r_3", label: "針刺減壓", desc: "在腋中線第 4/5 肋間或鎖骨中線第 2 肋間執行針刺減壓", weight: 2, milestones: ["PC1", "PC8"] },
            { id: "D_r_4", label: "SpO2 評估", desc: "SpO2 85%，辨識胸廓起伏不明顯", weight: 2, milestones: ["PC4"] },
            { id: "D_r_5", label: "焦痂切開術", desc: "聯絡手術室執行焦痂切開術", weight: 2, milestones: ["PC2", "PC4"] },
          ]
        },
        {
          name: "暖區 C - 循環處置 (Circulation)",
          items: [
            { id: "D_c_1", label: "脈搏與 CRT", desc: "評估橈動脈 (Radial pulse) 與 CRT", weight: 2, milestones: ["PC3"] },
            { id: "D_c_2", label: "E-FAST", desc: "執行 E-FAST 無腹內出血、無氣血胸", weight: 2, milestones: ["PC5"] },
            { id: "D_c_3", label: "大量輸液", desc: "給予大量輸液 4 mL × BW (kg) × % TBSA", weight: 2, milestones: ["PC4"] },
          ]
        },
        {
          name: "暖區 H - 神經與保溫 (Hypothermia)",
          items: [
            { id: "D_h_1", label: "CNS 評估", desc: "檢查 CNS 狀態 (E2V1M4)", weight: 2, milestones: ["PC4"] },
            { id: "D_h_2", label: "瞳孔評估", desc: "檢查瞳孔 (Pupil 5+/3+)", weight: 2, milestones: ["PC4"] },
            { id: "D_h_3", label: "頭部抬高", desc: "頭部抬高", weight: 2, milestones: ["PC1"] },
            { id: "D_h_4", label: "預防併發症", desc: "避免低血壓低血氧", weight: 2, milestones: ["PC1"] },
            { id: "D_h_5", label: "覆蓋保暖毯", desc: "覆蓋保暖毯", weight: 2, milestones: ["PC5"] },
          ]
        },
        {
          name: "PAWS - 醫療處置",
          items: [
            { id: "D_p_1", label: "給予止痛藥", desc: "給予 Ketamine", weight: 2, milestones: ["PC5"] },
            { id: "D_p_2", label: "給予抗生素", desc: "給予 Ertapenem", weight: 2, milestones: ["PC6"] },
            { id: "D_p_3", label: "二次評估", desc: "二次評估（暴露全身）並包紮非致命傷口", weight: 2, milestones: ["PC7"] },
            { id: "D_p_4", label: "準備撤離", desc: "準備撤離 (MEDEVAC)", weight: 2, milestones: ["PC7"] },
          ]
        },
        {
          name: "團隊資源管理 (TRM)",
          items: getTRMItems("D")
        }
      ]
    }
  ];

  // PDF 1: Exercise 2 Content (追蹤工作坊：演練二 - 檢傷, 中傷 1, 2, Expectant 4)
  const ex1Data = [
    {
      section: "一、術前階段 (共 35 分)",
      subsections: [
        {
          name: "A. 人員組織及任務分配 (5分)",
          items: [
            { id: "A1_2", label: "分區規劃", desc: "明確建立檢傷、復甦與 Expectant 區", weight: 2, milestones: ["SBP2", "ICS3"] },
            { id: "A2_2", label: "動線設計", desc: "中傷安置於觀察區，避免阻塞主要動線", weight: 1, milestones: ["SBP2", "SBP3"] },
            { id: "A3_2", label: "角色分工", desc: "EDD、EDN、ICU nurse 等角色指派清楚", weight: 2, milestones: ["ICS3", "ICS2"] },
          ]
        },
        {
          name: "B. 器械組裝及功能測試 (10分)",
          items: [
            { id: "B1_2", label: "中傷#1 燒傷器材", desc: "準備濕紗、敷料、保溫與止痛藥物", weight: 2, milestones: ["PC5", "SBP3"] },
            { id: "B2_2", label: "中傷#2 骨折器材", desc: "準備副木、彈繃、固定材料，評估神經血管功能", weight: 2, milestones: ["SBP3", "PC2", "PC5"] },
            { id: "B3_2", label: "重傷#4 expectant 區域", desc: "準備覆蓋物、基本監測與人道照護，不開啟大器械", weight: 2, milestones: ["SBP3", "PC4", "PC7"] },
            { id: "B4_2", label: "設備功能測試", desc: "監視器、抽吸器與通訊設備可正常使用", weight: 2, milestones: ["SBP3", "PC5"] },
            { id: "B5_2", label: "物資盤點與整備", desc: "確認藥品、敷料、副木與後送紀錄充足", weight: 2, milestones: ["SBP2", "SBP3"] },
          ]
        },
        {
          name: "C. 術前損傷控制復甦處置 (20分)",
          items: [
            { id: "C1_2", label: "重傷#4 快速辨識", desc: "辨識大量腦組織外溢，判定 non-survivable", weight: 3, milestones: ["PC1", "PC2", "PC4"] },
            { id: "C2_2", label: "重傷#4 決策", desc: "判定為 expectant，不進行插管輸血或處置", weight: 3, milestones: ["SBP3", "PC4", "PC7"] },
            { id: "C3_2", label: "中傷#1 燒傷評估", desc: "評估氣道燒傷、TBSA、疼痛與低溫風險", weight: 3, milestones: ["PC2", "PC3", "PC4"] },
            { id: "C4_2", label: "中傷#1 燒傷處置", desc: "建立 IV、止痛、保溫、估算輸液需求", weight: 3, milestones: ["PC5", "PC6"] },
            { id: "C5_2", label: "中傷#2 骨折評估", desc: "評估變形疼痛、遠端脈搏、感覺與強度", weight: 3, milestones: ["PC2", "PC3", "PC4"] },
            { id: "C6_2", label: "中傷#2 骨折處置", desc: "給予 IV 止痛，進行復位與副木固定", weight: 3, milestones: ["PC5", "PC6"] },
            { id: "C7_2", label: "藥物與保溫", desc: "對中傷完成止痛、抗生素與基本監測", weight: 1, milestones: ["PC5", "PC6"] },
            { id: "C8_2", label: "檢傷與後送排序", desc: "明確重症#4 不優先後送，中傷穩定後待送", weight: 1, milestones: ["PC7", "SBP3"] },
          ]
        }
      ]
    },
    {
      section: "二、術中階段 (共 50 分)",
      subsections: [
        {
          name: "D. 模擬手術／臨床處置 (30分)",
          items: [
            { id: "D1_2", label: "重傷#4 非手術判斷", desc: "清楚說明因預後極差在有限資源下不手術", weight: 5, milestones: ["SBP3", "PC4", "PC7"] },
            { id: "D2_2", label: "重傷#4 安置紀錄", desc: "移離主區，維持尊嚴照護並完整紀錄", weight: 4, milestones: ["PC7", "ICS2", "SBP2"] },
            { id: "D3_2", label: "中傷#1 燒傷處置", desc: "完成 TBSA、濕紗、保溫與進階輸液設定", weight: 6, milestones: ["PC2", "PC5", "PC6"] },
            { id: "D4_2", label: "中傷#1 再評估", desc: "追蹤 VS、疼痛與輸液反應，避免延誤後送", weight: 4, milestones: ["PC3", "PC6", "PC7"] },
            { id: "D5_2", label: "中傷#2 骨折固定", desc: "完成復位、副木固定，避免二次傷害", weight: 5, milestones: ["PC1", "PC2", "PC6"] },
            { id: "D6_2", label: "中傷#2 神經血管", desc: "固定前後確認遠端脈搏與感覺運動功能", weight: 3, milestones: ["PC2", "PC6"] },
            { id: "D7_2", label: "非手術決策一致", desc: "正確說明三位病人皆不進手術", weight: 2, milestones: ["PC4", "PC7"] },
            { id: "D8_2", label: "資源使用合理", desc: "不啟動不必要手術器械，保留資源予後續病患", weight: 1, milestones: ["SBP3", "SBP2"] },
          ]
        },
        {
          name: "E. 團隊協作與突發應變 (20分)",
          items: [
            { id: "E1_2", label: "領導與指揮", desc: "有明確 TL，能宣告 #4 expectant 與回報優先級", weight: 4, milestones: ["ICS3", "PC4"] },
            { id: "E2_2", label: "優先順序管理", desc: "依可救治性、病況與效益安排，不讓 #4 消耗主要資源", weight: 4, milestones: ["SBP3", "PC4", "PC7"] },
            { id: "E3_2", label: "溝通品質", desc: "指令清楚、交接即時，落實 closed-loop communication", weight: 4, milestones: ["ICS2"] },
            { id: "E4_2", label: "情境覺察", desc: "掌握燒傷狀態、血循與 expectant 安置時間", weight: 4, milestones: ["PC6", "ICS3"] },
            { id: "E5_2", label: "主動支援補位", desc: "團隊成員主動協助包紮、固定、止痛、紀錄或區域維持", weight: 2, milestones: ["ICS3", "ICS2"] },
            { id: "E6_2", label: "突發狀況應變", desc: "若病況惡化（如呼吸惡化或血循變差），能即時調整優先級", weight: 2, milestones: ["SBP3", "PC6", "PC7"] },
          ]
        }
      ]
    },
    {
      section: "三、術後階段 (共 15 分)",
      subsections: [
        {
          name: "F. 外部聯繫與資訊回報 (15分)",
          items: [
            { id: "F1_2", label: "MIST 交班完整性", desc: "#1/#2/#4 皆能提供 Mechanism, Injury, Signs, Treatment", weight: 3, milestones: ["ICS2", "PC7"] },
            { id: "F2_2", label: "重傷#4 回報重點", desc: "說明判定理由、目前安置位置與後續需求", weight: 2, milestones: ["ICS2", "PC4", "PC7"] },
            { id: "F3_2", label: "中傷#1 後送重點", desc: "說明燒傷範圍、輸液速率、濕紗保溫與止痛抗生素", weight: 2, milestones: ["ICS2", "PC6", "PC7"] },
            { id: "F4_2", label: "中傷#2 後送重點", desc: "說明骨折狀況、止痛固定與遠端脈搏神經現況", weight: 2, milestones: ["ICS2", "PC6", "PC7"] },
            { id: "F5_2", label: "後送優先順序", desc: "依病情穩定度確定後送救援順位", weight: 2, milestones: ["PC7", "SBP3"] },
            { id: "F6_2", label: "外部通報", desc: "依 REMOC 指揮鍵回報點、狀況與行動", weight: 2, milestones: ["SBP2", "ICS2"] },
            { id: "F7_2", label: "持續照護計畫", desc: "提出轉送前監測、藥物與 PFC 照護計畫", weight: 2, milestones: ["PC5", "PC6", "PC7"] },
          ]
        }
      ]
    }
  ];

  // PDF 2: Exercise 1 Content (追蹤工作坊：演練一 - 重傷 1, 2, 3)
  const ex2Data = [
    {
      section: "一、術前階段 (共 35 分)",
      subsections: [
        {
          name: "A. 人員組織及任務分配 (5分)",
          items: [
            { id: "A1_1", label: "分區規劃", desc: "明確建立檢傷、手術、復甦區，三位病人流動順暢", weight: 2, milestones: ["SBP2", "ICS3"] },
            { id: "A2_1", label: "動線設計", desc: "病人移動路徑清楚，#1/#2 入手術區，#3 留於復甦/止血區", weight: 1, milestones: ["SBP2", "SBP3"] },
            { id: "A3_1", label: "角色分工", desc: "EDD、S1/S2、ANE、ORN、ICU nurse 等角色指派清楚", weight: 2, milestones: ["ICS3", "ICS2"] },
          ]
        },
        {
          name: "B. 器械組裝及功能測試 (10分)",
          items: [
            { id: "B1_1", label: "#1 開腹器械準備", desc: "針對#1 腹內出血準備開腹器械、抽吸、鋪單、暫時關腹材料", weight: 2, milestones: ["SBP3", "PC4"] },
            { id: "B2_1", label: "#2 開胸器械準備", desc: "針對#2 心包填塞準備開胸器械、胸管、抽吸等", weight: 2, milestones: ["SBP3", "PC4"] },
            { id: "B3_1", label: "#3 止血器材準備", desc: "針對#3 上肢 near amputation 準備止血帶、packing、彈繃", weight: 1, milestones: ["PC1", "SBP3"] },
            { id: "B4_1", label: "無菌操作與佈場", desc: "手術區鋪單、器械擺放與無菌原則符合要求", weight: 2, milestones: ["SBP2", "SBP3"] },
            { id: "B5_1", label: "設備功能測試", desc: "抽吸器、氧氣、呼吸機、監視器、輸血加溫設備正常", weight: 2, milestones: ["SBP3", "PC5"] },
            { id: "B6_1", label: "器械盤點與整備", desc: "能進行器械盤點、確認缺漏並即時補足", weight: 1, milestones: ["SBP2", "SBP3"] },
          ]
        },
        {
          name: "C. 術前損傷控制復甦處置 (20分)",
          items: [
            { id: "C1_1", label: "#1 氣道處置", desc: "#1 聲音沙啞、疑吸入性傷害，執行插管或替代氣道", weight: 2, milestones: ["PC1", "PC2"] },
            { id: "C2_1", label: "#2 氣道處置", desc: "#2 意識差、休克，維持呼吸道並進行 LMA 或插管", weight: 2, milestones: ["PC1", "PC2"] },
            { id: "C3_1", label: "胸部處置", desc: "#1 右側/#2 左側呼吸音下降，能辨識並放置胸管", weight: 3, milestones: ["PC1", "PC2", "PC4"] },
            { id: "C4_1", label: "循環復甦", desc: "#1/#2/#3 建立 IV/IO/central line 並啟動輸血", weight: 3, milestones: ["PC1", "PC5"] },
            { id: "C5_1", label: "TXA 與止血復甦", desc: "對出血性休克病人正確給予 TXA 並採 DCR 概念", weight: 2, milestones: ["PC5"] },
            { id: "C6_1", label: "FAST 與判讀", desc: "#1 辨識腹腔積液，#2 辨識心包膜積液，#3 FAST negative", weight: 3, milestones: ["PC3", "PC4"] },
            { id: "C7_1", label: "手術／非手術決策", desc: "#1 剖腹、#2 開胸及 #3 止血復甦後送決策", weight: 2, milestones: ["PC4", "PC7"] },
            { id: "C8_1", label: "特殊處置", desc: "#1 評估 TBSA 與輸液；#3 重新評估止血帶加強止血", weight: 2, milestones: ["PC1", "PC5", "PC6"] },
            { id: "C9_1", label: "藥物與保溫", desc: "給予抗生素、止痛、破傷風，並執行保溫與監測", weight: 1, milestones: ["PC5", "PC6"] },
          ]
        }
      ]
    },
    {
      section: "二、術中階段 (共 50 分)",
      subsections: [
        {
          name: "D. 模擬手術／臨床處置 (30分)",
          items: [
            { id: "D1_1", label: "#1 手術適應症", desc: "#1 FAST 陽性、休克，判斷需剖腹探查", weight: 2, milestones: ["PC3", "PC4"] },
            { id: "D2_1", label: "#1 腹部 DCS", desc: "執行 DCS laparotomy，處理小腸與橫結腸損傷", weight: 4, milestones: ["PC1", "PC4", "PC5"] },
            { id: "D3_1", label: "#1 出血控制", desc: "控制 mesentery 出血，並使用 Bogota 或 VAC 暫時關腹", weight: 4, milestones: ["PC1", "PC6"] },
            { id: "D4_1", label: "#2 手術適應症", desc: "#2 FAST 陽性、胸管大量出血，判斷需剖開胸探查", weight: 2, milestones: ["PC3", "PC4"] },
            { id: "D5_1", label: "#2 開胸心包減壓", desc: "執行左前側開胸，打開心包膜並解除心包填塞", weight: 4, milestones: ["PC1", "PC4"] },
            { id: "D6_1", label: "#2 心肺損傷處理", desc: "修補左心房裂傷，處理左下肺葉裂傷與胸管引流", weight: 4, milestones: ["PC1", "PC4", "PC6"] },
            { id: "D7_1", label: "#3 出血控制", desc: "辨識止血帶失效，重新束緊並加用第二條止血帶", weight: 3, milestones: ["PC1", "PC6"] },
            { id: "D8_1", label: "#3 非手術決策", desc: "判斷 #3 以止血、輸血、後送為主，不手術", weight: 2, milestones: ["SBP3", "PC4", "PC7"] },
            { id: "D9_1", label: "麻醉與監測", desc: "維持麻醉、呼吸器、生命徵象監測與輸血保溫", weight: 3, milestones: ["PC5", "PC6"] },
            { id: "D10_1", label: "資源合理使用", desc: "在有限人力與血品下合理分配資源", weight: 2, milestones: ["SBP3", "SBP2"] },
          ]
        },
        {
          name: "E. 團隊協作與突發應變 (20分)",
          items: [
            { id: "E1_1", label: "領導與指揮", desc: "有明確 TL，能宣告 #4 expectant 與病情穩定期", weight: 4, milestones: ["ICS3", "PC4"] },
            { id: "E2_1", label: "優先順序管理", desc: "依休克程度、可救治性與資源效益安排處置順序", weight: 4, milestones: ["SBP3", "PC4", "PC7"] },
            { id: "E3_1", label: "溝通品質", desc: "指令清楚、交接即時，落實 closed-loop communication", weight: 4, milestones: ["ICS2"] },
            { id: "E4_1", label: "情境覺察", desc: "持續掌握三位傷患生命徵象、手術進度與輸血量", weight: 4, milestones: ["PC6", "ICS3"] },
            { id: "E5_1", label: "主動支援補位", desc: "團隊成員能主動協助包紮、固定、止痛、紀錄或接辦聯繫", weight: 2, milestones: ["ICS3", "ICS2"] },
            { id: "E6_1", label: "突發狀況應變", desc: "若病況惡化（如呼吸惡化或血循變差），能即時調整優先級", weight: 2, milestones: ["PC6", "SBP3", "ICS3"] },
          ]
        }
      ]
    },
    {
      section: "三、術後階段 (共 15 分)",
      subsections: [
        {
          name: "F. 外部聯繫與資訊回報 (15分)",
          items: [
            { id: "F1_1", label: "MIST 交班品質", desc: "#1/#2/#3 皆能依 Mechanism, Injury, Signs, Treatment 完整報告", weight: 3, milestones: ["ICS2", "PC7"] },
            { id: "F2_1", label: "#1 術後重點", desc: "說明剖腹後處置、腸道損傷、關腹情形與輸血量", weight: 2, milestones: ["ICS2", "PC6", "PC7"] },
            { id: "F3_1", label: "#2 術後重點", desc: "說明開胸處置、心臟修補、胸管狀況與輸血需求", weight: 2, milestones: ["ICS2", "PC6", "PC7"] },
            { id: "F4_1", label: "#3 交班重點", desc: "說明止血帶時間、出血控制、神經血管狀態與輸血", weight: 2, milestones: ["ICS2", "PC6", "PC7"] },
            { id: "F5_1", label: "後送優先順序", desc: "依病況、手術穩定度與 ICU/救護車決定順位", weight: 2, milestones: ["PC7", "SBP3"] },
            { id: "F6_1", label: "外部通報", desc: "依 REMOC 或院內指揮鏈回報點、狀況與需求", weight: 2, milestones: ["SBP2", "ICS2"] },
            { id: "F7_1", label: "持續照護計畫", desc: "提出轉送前監測、止痛與 PFC 照護計畫", weight: 2, milestones: ["PC5", "PC6", "PC7"] },
          ]
        }
      ]
    }
  ];


  const updateFirestore = async (updates: Partial<{ firstScores: any, ex1Scores: any, ex2Scores: any }>) => {
    if (!user) return;
    const docRef = doc(db, 'evaluations', user.uid);
    try {
      await setDoc(docRef, {
        ...updates,
        userId: user.uid,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `evaluations/${user.uid}`);
    }
  };

  const handleScoreChange = (itemId: string, value: number) => {
    if (activeWorkshop === 'first') {
      const next = { ...firstScores, [itemId]: value };
      setFirstScores(next);
      localStorage.setItem('firstScores', JSON.stringify(next));
      updateFirestore({ firstScores: next });
    } else if (w2SubTab === 'ex1') {
      const next = { ...ex1Scores, [itemId]: value };
      setEx1Scores(next);
      localStorage.setItem('ex1Scores', JSON.stringify(next));
      updateFirestore({ ex1Scores: next });
    } else {
      const next = { ...ex2Scores, [itemId]: value };
      setEx2Scores(next);
      localStorage.setItem('ex2Scores', JSON.stringify(next));
      updateFirestore({ ex2Scores: next });
    }
  };

  const handleManualSave = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const result = await getImprovementSuggestions(radarData, MILESTONES);
      setAiSuggestions(result);
    } catch (e: any) {
      console.error(e);
      setAiError(e.message || "生成建議時發生錯誤，請稍後再試。");
    } finally {
      setAiLoading(false);
    }
  };

  const currentChecklistData = activeWorkshop === 'first' 
    ? firstData.filter(s => {
        if (w1SubTab === 'C') return s.section.includes('Casualty C');
        if (w1SubTab === 'D') return s.section.includes('Casualty D');
        return false;
      })
    : (w2SubTab === 'ex1' ? ex1Data : ex2Data);
    
  const currentScores = activeWorkshop === 'first' ? firstScores : (w2SubTab === 'ex1' ? ex1Scores : ex2Scores);

  const calculateTotal = (scores: Record<string, number>) => Object.values(scores).reduce((a, b) => a + b, 0);

  const calculateMilestoneAverages = (scores: Record<string, number>, data: typeof ex1Data) => {
    const milestoneMap: Record<string, { total: number, max: number }> = {
      PC1: { total: 0, max: 0 }, PC2: { total: 0, max: 0 }, PC3: { total: 0, max: 0 },
      PC4: { total: 0, max: 0 }, PC5: { total: 0, max: 0 }, PC6: { total: 0, max: 0 },
      PC7: { total: 0, max: 0 }, SBP2: { total: 0, max: 0 }, SBP3: { total: 0, max: 0 },
      ICS2: { total: 0, max: 0 }, ICS3: { total: 0, max: 0 }
    };

    data.forEach(phase => {
      phase.subsections.forEach(sub => {
        sub.items.forEach(item => {
          const score = scores[item.id] || 0;
          item.milestones.forEach(m => {
            if (milestoneMap[m]) {
              milestoneMap[m].total += score;
              milestoneMap[m].max += item.weight;
            }
          });
        });
      });
    });

    return Object.entries(milestoneMap).map(([m, val]) => ({
      milestone: m,
      score: val.max > 0 ? (val.total / val.max) * 100 : 0
    }));
  };

  const firstMilestones = calculateMilestoneAverages(firstScores, firstData);
  const ex1Milestones = calculateMilestoneAverages(ex1Scores, ex1Data);
  const ex2Milestones = calculateMilestoneAverages(ex2Scores, ex2Data);
  const radarData = ex1Milestones.map((d, i) => ({
    milestone: d.milestone,
    first: firstMilestones[i].score || 0,
    ex1: d.score || 0,
    ex2: ex2Milestones[i].score || 0
  }));

  const firstMax = firstData.flatMap(s => s.subsections.flatMap(sub => sub.items)).reduce((a, v) => a + v.weight, 0);
  const ex1Max = ex1Data.flatMap(s => s.subsections.flatMap(sub => sub.items)).reduce((a, v) => a + v.weight, 0);
  const ex2Max = ex2Data.flatMap(s => s.subsections.flatMap(sub => sub.items)).reduce((a, v) => a + v.weight, 0);

  return (
    <div className="space-y-12">
      <SectionHeader 
        title="追蹤工作坊實戰評核" 
        icon={TrendingUp}
        subtitle="針對追蹤工作坊之兩次實戰演練進行數位化評核，並對比 Milestone 成長。"
      />

      {/* Main Tab Controls */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto shadow-inner">
        <button 
          onClick={() => setActiveSubTab('trends')}
          className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'trends' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          能力成長雷達圖 (歷次實戰對比)
        </button>
        <button 
          onClick={() => setActiveSubTab('checklist')}
          className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'checklist' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
        >
          實戰評核清單
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'trends' ? (
          <motion.div 
            key="trends"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            <div className="xl:col-span-2 watercolor-card p-10 bg-white shadow-xl min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-xl font-black text-slate-900 mb-1">實戰表現成長對比</h3>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Growth Tracking: Workshop 1 → Exercise 1 → 2</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-black text-slate-400">首次 (Baseline)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#64748b]" />
                    <span className="text-[10px] font-black text-slate-500">演練一</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-medical-blue" />
                    <span className="text-[10px] font-black text-slate-900">演練二</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height={450}>
                  <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                    <PolarGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                    <PolarAngleAxis dataKey="milestone" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 900 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                    <Radar name="首次工作坊" dataKey="first" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 4" />
                    <Radar name="追蹤：演練一" dataKey="ex1" stroke="#64748b" fill="#64748b" fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="追蹤：演練二" dataKey="ex2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={3} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="watercolor-card p-8 bg-white border-2 border-slate-100 shadow-xl h-full">
                <Award className="text-medical-yellow mb-6" size={40} />
                <h3 className="text-xl font-black mb-6 text-slate-800">實戰表現統計</h3>
                <div className="space-y-8">
                  <div>
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">首次工作坊得分</div>
                    <div className="text-3xl font-black text-slate-900">{calculateTotal(firstScores).toFixed(1)} <span className="text-sm font-bold text-slate-500">/ {firstMax.toFixed(1)}</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">演練一得分</div>
                    <div className="text-3xl font-black text-slate-950">{calculateTotal(ex1Scores).toFixed(1)} <span className="text-sm font-bold text-slate-600">/ {ex1Max.toFixed(1)}</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-2">演練二得分</div>
                    <div className="text-4xl font-black text-blue-950">{calculateTotal(ex2Scores).toFixed(1)} <span className="text-sm font-bold text-blue-900/50">/ {ex2Max.toFixed(1)}</span></div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 italic text-[11px] text-slate-800 font-bold leading-relaxed">
                    * 演練一包含更複雜的檢傷分類 (expectant 區) 與針對性的中傷處置 (燒傷與骨折)。
                  </div>
                </div>
              </div>

              {/* AI Insights Card */}
              <div className="watercolor-card p-8 bg-white border-2 border-slate-100 shadow-xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl text-medical-blue">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">AI 成長建議</h3>
                      <p className="text-[10px] font-bold text-slate-400">Personalized Insights</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={aiLoading}
                    className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg active:scale-95"
                    title="生成 AI 分析建議"
                  >
                    {aiLoading ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
                  </button>
                </div>

                {aiError && (
                  <div className="p-4 mb-4 bg-red-50 border border-red-100 rounded-2xl">
                    <p className="text-[11px] font-bold text-red-600 leading-relaxed">
                      {aiError}
                    </p>
                  </div>
                )}

                {!aiSuggestions && !aiLoading && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <Activity size={32} />
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed px-4">
                      點擊上方按鈕，根據目前的雷達圖數據<br />生成專屬的強弱項分析與改進方案。
                    </p>
                  </div>
                )}

                {aiLoading && (
                  <div className="space-y-4 py-4">
                    <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                    <div className="h-24 bg-slate-50 rounded-2xl w-full animate-pulse" />
                    <div className="h-24 bg-slate-50 rounded-2xl w-full animate-pulse" />
                    <div className="h-24 bg-slate-50 rounded-2xl w-full animate-pulse" />
                  </div>
                )}

                {aiSuggestions && !aiLoading && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                      <p className="text-[11px] font-black text-slate-900 leading-relaxed italic">
                        " {aiSuggestions.overallSummary} "
                      </p>
                    </div>
                    
                    <div className="space-y-4 h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                      {aiSuggestions.suggestions.map((s, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-medical-blue bg-blue-50 px-2 py-0.5 rounded-lg">{s.milestoneId}</span>
                            <span className="text-[10px] font-bold text-slate-400">{s.milestoneTitle}</span>
                          </div>
                          <p className="text-[11px] font-black text-slate-800 leading-tight">
                            {s.observation}
                          </p>
                          <div className="pt-2 mt-2 border-t border-slate-50">
                            <div className="flex items-start gap-2 mb-2">
                              <Lightbulb size={12} className="text-orange-400 shrink-0 mt-0.5" />
                              <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{s.suggestion}</p>
                            </div>
                            <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl">
                              <Target size={12} className="text-slate-900 shrink-0 mt-0.5" />
                              <p className="text-[10px] font-black text-slate-700 leading-relaxed">{s.actionableStep}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="checklist"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Auth Toggle */}
            <div className="flex justify-center mb-6">
              {!user ? (
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                  <span className="text-xs font-black text-slate-600 group-hover:text-slate-900">使用 Google 登入同步雲端</span>
                </button>
              ) : (
                <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-medical-blue overflow-hidden border border-white shadow-sm">
                      {user.photoURL ? <img src={user.photoURL} alt="Avatar" /> : <div className="w-full h-full bg-slate-200" />}
                    </div>
                    <span className="text-[11px] font-black text-slate-600">{user.displayName || '已登入使用者'}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-tight"
                  >
                    登出
                  </button>
                </div>
              )}
            </div>

            {/* Session Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit mx-auto">
                 <span className="text-[11px] font-black text-slate-400 pl-4 uppercase tracking-tighter">選擇工作坊場次:</span>
                 <div className="flex gap-1">
                   <button 
                    onClick={() => setActiveWorkshop('first')}
                    className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${activeWorkshop === 'first' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                   >
                     首次工作坊
                   </button>
                   <button 
                    onClick={() => setActiveWorkshop('followup')}
                    className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all ${activeWorkshop === 'followup' ? 'bg-medical-blue text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                   >
                     追蹤工作坊
                   </button>
                 </div>
              </div>

              {activeWorkshop === 'first' ? (
                <div className="flex items-center gap-2 justify-center">
                  {[
                    { id: 'C', label: '傷患 C 評估' },
                    { id: 'D', label: '傷患 D 評估' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setW1SubTab(tab.id as any)}
                      className={`px-6 py-2 rounded-xl text-[11px] font-black transition-all ${
                        w1SubTab === tab.id 
                          ? 'bg-slate-200 text-slate-900 shadow-sm' 
                          : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  {[
                    { id: 'ex1', label: '演練一' },
                    { id: 'ex2', label: '演練二' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setW2SubTab(tab.id as any)}
                      className={`px-6 py-2 rounded-xl text-[11px] font-black transition-all ${
                        w2SubTab === tab.id 
                          ? 'bg-slate-800 text-white shadow-sm' 
                          : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-10">
                {currentChecklistData.map((phase, pidx) => (
                  <div key={pidx} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-[2px] flex-grow bg-slate-100" />
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{phase.section}</h3>
                      <div className="h-[2px] flex-grow bg-slate-100" />
                    </div>

                    {phase.subsections.map((sub, sidx) => (
                      <div key={sidx} className="watercolor-card p-6 bg-white overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 rounded-xl bg-medical-blue/10 flex items-center justify-center">
                            <ClipboardType size={18} className="text-medical-blue" />
                          </div>
                          <h4 className="font-black text-slate-800 tracking-tight">{sub.name}</h4>
                        </div>
                        
                        <div className="space-y-3">
                          {sub.items.map((item) => (
                            <div key={item.id} className="p-4 rounded-2xl border border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="max-w-md">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-black px-2 py-0.5 bg-slate-200 text-slate-600 rounded-lg">{item.id}</span>
                                  <h5 className="font-black text-slate-900 text-sm">{item.label}</h5>
                                  <div className="flex gap-1">
                                    {item.milestones.map(m => (
                                      <span key={m} className="text-[9px] font-black bg-medical-blue/10 text-medical-blue px-1.5 rounded">{m}</span>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-[11px] text-slate-500 font-bold leading-tight">{item.desc}</p>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                {[
                                  { label: '尚未做到', score: 0, color: 'hover:bg-red-50 hover:text-red-500' },
                                  { label: '部分做到', score: item.weight * 0.5, color: 'hover:bg-yellow-50 hover:text-yellow-600' },
                                  { label: '完全做到', score: item.weight, color: 'hover:bg-green-50 hover:text-green-600' }
                                ].map((opt) => (
                                  <button
                                    key={opt.label}
                                    onClick={() => handleScoreChange(item.id, opt.score)}
                                    className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${
                                      currentScores[item.id] === opt.score 
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                                        : 'bg-white border-slate-100 text-slate-400 ' + opt.color
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="sticky top-24 watercolor-card p-8 bg-white border-2 border-slate-900 shadow-2xl">
                  <div className="text-center mb-8 pb-6 border-b border-dashed border-slate-200">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">當前演練評分計</div>
                    <div className="text-6xl font-black text-slate-900">{calculateTotal(currentScores).toFixed(1)}</div>
                    <div className="text-[11px] font-black text-slate-400 mt-2">目標滿分：{currentChecklistData.flatMap(s => s.subsections.flatMap(sub => sub.items)).reduce((a, v) => a + v.weight, 0).toFixed(1)}</div>
                  </div>

                  <div className="space-y-6 mb-8">
                    {currentChecklistData.map((phase, i) => {
                      const phaseItems = phase.subsections.flatMap(sub => sub.items.map(it => it.id));
                      const phaseScore = Object.entries(currentScores)
                        .filter(([id]) => phaseItems.includes(id))
                        .reduce((a, [, v]) => a + v, 0);
                      const phaseMax = phase.subsections.flatMap(sub => sub.items).reduce((a, v) => a + v.weight, 0);
                      
                      return (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[11px] font-black uppercase">
                            <span className="text-slate-500">{phase.section.split('（')[0].split('(')[0]}</span>
                            <span className="text-slate-900">{phaseScore.toFixed(1)} / {phaseMax}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(phaseScore / phaseMax) * 100}%` }}
                              className="h-full bg-medical-blue transition-all duration-500" 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={handleManualSave}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Award size={16} className="text-medical-yellow" />
                    儲存本場評核結果
                  </button>

                  <AnimatePresence>
                    {showSaveToast && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-24 left-0 right-0 mx-8 p-3 bg-medical-green text-white text-center rounded-xl font-black text-[11px] shadow-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        評核資料已自動儲存至本機瀏覽器
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- 主介面 ---

export default function App() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [overviewStep, setOverviewStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const modules = [
    { id: 'disaster', name: '災難應變', english: 'Disaster Support', icon: Wind, color: 'border-blue-600' },
    { id: 'tactical', name: '戰傷醫療', english: 'Combat Casualty', icon: ShieldAlert, color: 'border-red-600' },
    { id: 'community', name: '社區在宅', english: 'Home & Community', icon: Home, color: 'border-green-600' },
    { id: 'emerging', name: '新興傳染', english: 'Infectious Disease', icon: Biohazard, color: 'border-red-800' },
  ];

  if (!selectedModule) {
    return (
      <div className="min-h-screen bg-medical-bg flex items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="text-medical-blue font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
              侷限醫療管理系統
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              選擇侷限醫療面向
            </h1>
            <p className="text-black font-black leading-relaxed max-w-2xl mx-auto">
              針對不同臨床場域之「高危險、低頻率」任務，請選擇欲查閱的模組以進入研究報告。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                onClick={() => setSelectedModule(mod.id)}
                className={`p-8 bg-white rounded-3xl shadow-xl border-l-8 ${mod.color} flex flex-col items-center text-center gap-4 group transition-all`}
              >
                <div className="p-4 bg-slate-50 text-slate-900 rounded-2xl group-hover:bg-medical-blue/10 group-hover:text-medical-blue transition-colors">
                  <mod.icon size={48} />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 italic">{mod.name}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{mod.english}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle other modules (placeholder)
  if (selectedModule === 'community' || selectedModule === 'emerging') {
    return (
      <div className="min-h-screen bg-medical-bg flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-6">本模組研究計畫建構中</h2>
          <p className="text-black font-black mb-10">此模組屬於不同期程之研究規劃，目前僅開放「災難」與「戰傷」核心模組查閱。</p>
          <button 
            onClick={() => setSelectedModule(null)}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black shadow-lg"
          >
            返回選擇模組
          </button>
        </div>
      </div>
    );
  }

  const overviewSteps = [
    { id: 'bg', label: '研究背景', icon: Info },
    { id: 'gaps', label: '研究缺口', icon: AlertTriangle },
    { id: 'aims', label: '研究目標', icon: Target },
    { id: 'hyp', label: '研究假說', icon: Lightbulb },
  ];

  const navItems = [
    { id: 'overview', label: '研究概況', icon: BookOpen },
    { id: 'methodology', label: '教學設計', icon: School },
    { id: 'milestones', label: '里程碑對應', icon: ClipboardCheck },
    { id: 'evaluation', label: '評核專區', icon: TrendingUp },
    { id: 'team', label: '團隊與時程', icon: Users },
  ];

  return (
    <div className="min-h-screen pb-32">
      {/* 頁首橫幅 - 仿水彩風格 */}
      <header className="relative pt-20 pb-28 px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-20 bg-medical-bg opacity-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full -z-10 opacity-20 pointer-events-none">
          <Activity size={400} className="text-medical-blue stroke-[1px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <button 
            onClick={() => setSelectedModule(null)}
            className="absolute top-0 right-0 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-[10px] font-black text-slate-500 hover:bg-white hover:text-medical-blue transition-all border border-slate-200"
          >
            ← 切換研究模組
          </button>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-medical-blue" />
            <span className="text-medical-blue font-bold text-xs uppercase tracking-widest">
              Cathay General Hospital · 國泰綜合醫院教學部
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.2]"
              >
                侷限醫療 <br />
                <span className="text-medical-green underline decoration-medical-green/30 decoration-8 underline-offset-8">研究計畫</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-black max-w-xl font-black leading-relaxed"
              >
                針對「高危險、低頻率」任務之整合式教學研究。
                本計畫鎖定四大核心情境模組，強化教、學、用之鏈結。
              </motion.p>
            </div>

            {/* 四大模組視覺化 */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-3xl shadow-xl border-l-8 border-l-blue-600 flex flex-col items-center text-center gap-2"
              >
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
                  <Wind size={32} />
                </div>
                <span className="text-sm font-black text-slate-900 italic">災難應變</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Disaster</span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-3xl shadow-xl border-l-8 border-l-red-600 flex flex-col items-center text-center gap-2"
              >
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl mb-2">
                  <ShieldAlert size={32} />
                </div>
                <span className="text-sm font-black text-slate-900 italic">戰傷醫療</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tactical</span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-3xl shadow-xl border-l-8 border-l-green-600 flex flex-col items-center text-center gap-2"
              >
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl mb-2">
                  <Home size={32} />
                </div>
                <span className="text-sm font-black text-slate-900 italic">社區在宅</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Community</span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-3xl shadow-xl border-l-8 border-l-red-800 flex flex-col items-center text-center gap-2"
              >
                <div className="p-3 bg-red-50 text-red-800 rounded-2xl mb-2">
                  <Biohazard size={32} />
                </div>
                <span className="text-sm font-black text-slate-900 italic">新興傳染</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Emerging</span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* 導覽列 */}
      <nav className="sticky top-0 z-50 px-8 -mt-10">
        <div className="max-w-4xl mx-auto watercolor-card shadow-xl p-2 flex items-center justify-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm whitespace-nowrap ${
                activeTab === item.id 
                  ? 'bg-medical-blue text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-8 mt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                {overviewSteps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <button
                      onClick={() => setOverviewStep(idx)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-bold text-sm ${
                        overviewStep === idx 
                          ? 'bg-slate-800 text-white shadow-lg' 
                          : 'bg-white text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <step.icon size={16} />
                      {step.label}
                    </button>
                    {idx < overviewSteps.length - 1 && <ArrowRight size={14} className="text-slate-200 hidden sm:block" />}
                  </React.Fragment>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {overviewStep === 0 && (
                  <motion.div
                    key="step-bg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                  >
                    <div>
                      <SectionHeader 
                        title="研究背景" 
                        icon={Info}
                        subtitle="分析侷限醫療任務特性，並針對現有醫學教育缺失提出改善策略。"
                      />
                      <ul className="space-y-6">
                        {RESEARCH_BACKGROUND.characteristics.map((char) => (
                          <li key={char} className="flex gap-4">
                            <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-medical-green shadow-glow shrink-0" />
                            <p className="text-black font-black text-base leading-relaxed">{char}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="watercolor-card bg-white p-10 text-black border-2 border-slate-100 relative overflow-hidden h-96 flex flex-col justify-center shadow-xl">
                       <div className="absolute -right-16 -bottom-16 opacity-5 rotate-12 text-slate-200">
                         <ShieldAlert size={350} />
                       </div>
                       <div className="text-[12px] uppercase font-black text-medical-blue tracking-[0.3em] mb-6">教育核心模型</div>
                       <h4 className="text-3xl font-black mb-6 leading-tight text-slate-900">{RESEARCH_BACKGROUND.educationModel}</h4>
                       <p className="text-base font-black leading-loose text-slate-800">
                         透過結構化的 K-A-B-C 進展鏈，將非同步學習與高擬真模擬深度整合，確保能力的有效轉化。
                       </p>
                    </div>
                  </motion.div>
                )}

                {overviewStep === 1 && (
                  <motion.div
                    key="step-gaps"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <SectionHeader 
                      title="研究缺口分析" 
                      icon={AlertTriangle}
                      subtitle="目前醫學教育中尚未被完整解決的問題點。"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {RESEARCH_GAPS.map((gap) => (
                        <GapCard key={gap.title} gap={gap} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {overviewStep === 2 && (
                  <motion.div
                    key="step-aims"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <SectionHeader 
                      title="研究目標" 
                      icon={Target}
                      subtitle="評估整合式教學模式對學員臨床勝任能力的提升成效。"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-1 watercolor-card p-8 border-t-8 border-t-medical-green bg-white shadow-md">
                        <h4 className="text-lg font-black text-medical-green mb-6 flex items-center gap-2">
                           主要目標
                        </h4>
                        <p className="text-black leading-relaxed font-black italic text-sm">{OBJECTIVES.primary.content}</p>
                      </div>
                      <div className="md:col-span-2 watercolor-card p-8 border-t-8 border-t-medical-blue bg-white shadow-md">
                        <h4 className="text-lg font-black text-medical-blue mb-6">次要研究目標 (Secondary)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {OBJECTIVES.secondary.map(obj => (
                            <div key={obj.id} className="flex gap-3 text-xs text-black font-black bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                              <span className="font-black text-medical-blue shrink-0">{obj.id}.</span>
                              {obj.content}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {overviewStep === 3 && (
                  <motion.div
                    key="step-hyp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <SectionHeader 
                      title="研究假說" 
                      icon={Lightbulb}
                      subtitle="基於教學理論基礎預期的研究產出與效果。"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {HYPOTHESES.map((hyp) => (
                        <div key={hyp.id} className="watercolor-card p-8 flex items-start gap-5 hover:border-medical-yellow transition-all">
                          <div className="h-10 w-10 rounded-xl bg-medical-yellow/20 text-medical-yellow flex items-center justify-center font-bold text-lg shrink-0">
                            {hyp.id}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 mb-2">{hyp.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{hyp.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                <button 
                  onClick={() => setOverviewStep(Math.max(0, overviewStep - 1))}
                  disabled={overviewStep === 0}
                  className="px-6 py-2 rounded-xl font-bold text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  上一步
                </button>
                <div className="flex items-center gap-1.5">
                  {overviewSteps.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${overviewStep === i ? 'w-8 bg-medical-blue' : 'w-1.5 bg-slate-200'}`} />
                  ))}
                </div>
                <button 
                  onClick={() => setOverviewStep(Math.min(overviewSteps.length - 1, overviewStep + 1))}
                  disabled={overviewStep === overviewSteps.length - 1}
                  className="px-8 py-3 bg-medical-blue text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  下一步
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'methodology' && (
            <motion.div
              key="methodology"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-12">
                 <SectionHeader 
                   title="K-A-B-C 教學設計架構" 
                   icon={Map}
                   subtitle="基於能力的醫學教育 (CBME) 模型，建立從理論知識到臨床實務的轉化路徑。"
                 />
              </div>

              <div className="lg:col-span-5">
                <KABCPyramid />
              </div>

              <div className="lg:col-span-7">
                <div className="watercolor-card p-10 h-full border-none">
                   <h3 className="text-2xl font-bold mb-8 text-slate-800">教學向度解析</h3>
                   <div className="space-y-10">
                     <div className="flex gap-6">
                       <div className="h-12 w-12 rounded-2xl bg-[#ffc000] text-black flex items-center justify-center font-black shrink-0 shadow-lg shadow-[#ffc000]/20">K</div>
                       <div>
                         <h4 className="font-black text-slate-900 mb-2">知識獲取 (Knowledge)</h4>
                         <p className="text-sm text-slate-700 font-bold leading-relaxed">透過翻轉教室，掌握 TECC、TCCC 指南與 MARCH-PAWS 核心理論。</p>
                       </div>
                     </div>
                     <div className="flex gap-6">
                       <div className="h-12 w-12 rounded-2xl bg-[#ed7d31] text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-[#ed7d31]/20">B</div>
                       <div>
                         <h4 className="font-black text-slate-900 mb-2">行為與技能 (Behavior)</h4>
                         <p className="text-sm text-slate-700 font-bold leading-relaxed">工作坊技能訓練 (Procedural) 與高擬真模擬訓練 (Performance)。</p>
                       </div>
                     </div>
                     <div className="flex gap-6">
                       <div className="h-12 w-12 rounded-2xl bg-[#4472c4] text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-[#4472c4]/20">C</div>
                       <div>
                         <h4 className="font-black text-slate-900 mb-2">最終勝任能力 (Competency)</h4>
                         <p className="text-sm text-slate-700 font-bold leading-relaxed">整合里程碑 (Milestone) 與可委託活動 (EPA) 的臨床能力判斷。</p>
                       </div>
                     </div>
                   </div>

                   <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-3 text-slate-400 italic text-xs">
                      <CheckCircle2 size={16} className="text-medical-green" />
                      符合 Miller's Pyramid 臨床能力進程模型
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="lg:col-span-12">
                 <SectionHeader 
                   title="臨床照護里程碑 (Milestones)" 
                   icon={ClipboardCheck}
                   subtitle="定義五個能級的表現基準，作為 CCC 委員會評核之依據。"
                 />
              </div>

              <div className="overflow-x-auto watercolor-card p-4">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className="px-6 py-4 font-bold text-slate-800 text-sm">里程碑項目</th>
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <th key={lvl} className={`px-4 py-4 font-bold text-sm text-center ${lvl === 3 ? 'text-medical-green' : 'text-slate-400'}`}>
                          能級 {lvl}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MILESTONES.map((m) => (
                      <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-6 font-bold text-medical-blue w-60 align-top">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="p-1 px-1.5 bg-medical-blue/10 rounded text-[10px] opacity-70">{m.id}</div>
                             {m.iconName && <MilestoneIcon name={m.iconName} />}
                          </div>
                          <div className="text-sm leading-tight text-slate-700">{m.category}</div>
                        </td>
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <td key={lvl} className={`px-4 py-6 text-xs leading-relaxed text-slate-600 align-top text-center max-w-[150px] ${lvl === 3 ? 'bg-medical-green/5 font-medium text-slate-800' : ''}`}>
                            {m.levels[lvl]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:col-span-12 mt-20">
                 <SectionHeader 
                    title="教學評估與對應 (K-B-VR-Sim)" 
                    icon={Layers}
                    subtitle="展示各里程碑核心能力如何透過 K、B、VR 與整合模擬四個維度進行完整訓練對應。"
                 />

                 <div className="mb-12">
                   <MilestoneMindMap />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {/* 課程對應 (K) */}
                   <div className="watercolor-card p-6 bg-white border-t-4 border-t-[#ffc000]">
                     <h4 className="text-sm font-bold text-[#ffc000] mb-6 flex items-center gap-2">
                       <School size={16} /> Knowledge (K)
                     </h4>
                     <div className="space-y-3">
                       {COURSE_MAPPING.map((row) => (
                         <div key={row.milestone} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="text-[9px] font-bold text-[#ffc000] uppercase mb-1">{row.milestone}</div>
                           <div className="text-[11px] font-bold text-slate-700 leading-tight mb-1">{row.course}</div>
                           <div className="text-[9px] text-slate-400 font-medium">{row.methods}</div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* 技術對應 (B) */}
                   <div className="watercolor-card p-6 bg-white border-t-4 border-t-[#ed7d31]">
                     <h4 className="text-sm font-bold text-[#ed7d31] mb-6 flex items-center gap-2">
                       <Wrench size={16} /> Procedural (B)
                     </h4>
                     <div className="space-y-3">
                       {TECHNIQUE_MAPPING.map((row) => (
                         <div key={row.milestone} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="text-[9px] font-bold text-[#ed7d31] uppercase mb-1">{row.milestone}</div>
                           <div className="text-[11px] font-bold text-slate-700 leading-tight mb-1">{row.technique}</div>
                           <div className="text-[9px] text-slate-400 font-medium">工具：{row.tool}</div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* VR 對應 (VR) */}
                   <div className="watercolor-card p-6 bg-white border-t-4 border-t-[#ed4848]">
                     <h4 className="text-sm font-bold text-[#ed4848] mb-6 flex items-center gap-2">
                       <Gamepad2 size={16} /> Cognitive (VR)
                     </h4>
                     <div className="space-y-3">
                       {VR_MAPPING.map((row) => (
                         <div key={row.milestone} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="text-[9px] font-bold text-[#ed4848] uppercase mb-1">{row.milestone}</div>
                           <div className="text-[11px] font-bold text-slate-700 leading-tight mb-1">{row.scenario}</div>
                           <div className="text-[9px] text-slate-400 font-medium">核心：{row.target}</div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* 整合模擬 (Sim) */}
                   <div className="watercolor-card p-6 bg-white border-t-4 border-t-[#70ad47]">
                     <h4 className="text-sm font-bold text-[#70ad47] mb-6 flex items-center gap-2">
                       <Activity size={16} /> Integration (Sim)
                     </h4>
                     <div className="space-y-3">
                       {INTEGRATED_SIM_MAPPING.map((row) => (
                         <div key={row.milestone} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="text-[9px] font-bold text-[#70ad47] uppercase mb-1">{row.milestone}</div>
                           <div className="text-[11px] font-bold text-slate-700 leading-tight">{row.sim}</div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'evaluation' && (
            <motion.div
              key="evaluation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <EvaluationDashboard />
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-12">
                 <SectionHeader 
                   title="研究團隊與進度規劃" 
                   icon={Users}
                   subtitle="跨領域協作體系與 2026 年度執行時程。"
                 />
              </div>

              {/* 團隊清單 */}
              <div className="lg:col-span-6">
                <div className="grid grid-cols-1 gap-4">
                  {TEAM.map((role) => {
                    const isInHospital = role.role.includes("院內");
                    const RoleIcon = isInHospital ? Building2 : Globe;
                    return (
                      <div key={role.role} className="watercolor-card p-4 flex items-center gap-4 border-l-4 border-l-medical-blue">
                        <div className={`p-2 rounded-lg ${isInHospital ? 'bg-medical-blue/10 text-medical-blue' : 'bg-slate-100 text-slate-500'}`}>
                          {role.iconName ? <GenericIcon name={role.iconName} /> : <RoleIcon size={20} />}
                        </div>
                        <div className="flex-1">
                          <div className="text-medical-blue font-black text-[10px] uppercase tracking-[0.2em] mb-1">{role.role}</div>
                          <p className="text-black font-black leading-tight text-sm">{role.members}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 時程表 - 甘特圖呈現 */}
              <div className="lg:col-span-6">
                <div className="watercolor-card p-8 bg-white border-slate-200 h-full">
                  <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-black">
                    <Calendar className="text-medical-red" />
                    2026 年度執行甘特圖
                  </h3>
                  
                  <div className="space-y-6">
                    {/* 月份標記 */}
                    <div className="flex ml-[180px] border-b border-slate-100 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <div className="flex-1 text-center">2026/04</div>
                      <div className="flex-1 text-center">2026/05</div>
                      <div className="flex-1 text-center">2026/06</div>
                      <div className="flex-1 text-center">2026/07</div>
                    </div>

                    <div className="space-y-4">
                      {TIMELINE.map((phase) => (
                        <div key={phase.title} className="flex items-center gap-4">
                          <div className="w-[180px] flex items-center gap-2">
                            {phase.iconName && <GenericIcon name={phase.iconName} size={14} className="text-slate-900" />}
                            <div className="text-xs font-black text-black leading-tight">
                              {phase.title}
                              {phase.events && (
                                <div className="mt-1 space-y-0.5">
                                  {phase.events.map((event, i) => (
                                    <div key={i} className="text-[9px] text-slate-500 font-bold flex items-start gap-1">
                                      <div className="w-1 h-1 rounded-full bg-slate-300 mt-1" />
                                      {event}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 grid grid-cols-4 gap-2 h-10">
                            {[0, 1, 2, 3].map(monthIdx => {
                              const isActive = monthIdx >= phase.start && monthIdx < phase.start + phase.duration;
                              return (
                                <motion.div
                                  key={monthIdx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ 
                                    opacity: isActive ? 0.85 : 0.05, 
                                    scale: 1 
                                  }}
                                  transition={{ delay: 0.5 + monthIdx * 0.05 }}
                                  className={`h-full rounded-md shadow-sm ${isActive ? phase.color : 'bg-slate-300'}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-slate-50 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400" />
                      <span className="text-[10px] text-slate-400 font-bold">基礎</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-teal-400" />
                      <span className="text-[10px] text-slate-400 font-bold">執行</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-400" />
                      <span className="text-[10px] text-slate-400 font-bold">追蹤</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-[10px] text-slate-400 font-bold">整合</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 統計分析策略 */}
              <div className="lg:col-span-12 mt-8 watercolor-card p-12 bg-medical-green/5 border-medical-green/10">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-black text-black mb-4">統計分析方法 (Statistical Analysis)</h3>
                    <p className="text-[13px] text-black font-black leading-relaxed">
                      採用組間比較 (t-test/ANCOVA) 以及多變項迴歸控制干擾因子，並可選用中介分析 (Mediation Analysis) 驗證 K→B→C 之轉化效果力。
                    </p>
                  </div>
                  <div className="flex-shrink-0 grid grid-cols-2 gap-4">
                     <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-600">Chi-square Test</div>
                     <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-600">Mann-Whitney U</div>
                     <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-600">Mediation (KBC)</div>
                     <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-600">SEM Modeling</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 底部導覽懸浮窗 (適用於評審閱讀) */}
      <div className="fixed bottom-10 left-0 right-0 z-[60] flex justify-center pointer-events-none px-8">
         <motion.div 
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-slate-900/90 text-white rounded-full px-8 py-5 shadow-2xl flex items-center gap-10 backdrop-blur-md pointer-events-auto border border-white/10"
         >
           <div className="flex items-center gap-3 border-r border-white/20 pr-10">
             <div className="h-3 w-3 bg-medical-green rounded-full animate-pulse shadow-glow" />
             <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-90">互動進度報告</span>
           </div>
           <div className="flex items-center gap-6 text-xs">
             <div className="flex flex-col">
               <span className="opacity-50 text-[9px] uppercase font-bold tracking-widest mb-0.5">目前階段</span>
               <span className="font-bold">Phase 2 追蹤評估中</span>
             </div>
             <ChevronRight size={16} className="text-slate-500" />
           </div>
         </motion.div>
      </div>
    </div>
  );
}
