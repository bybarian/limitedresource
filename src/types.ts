export interface MilestoneLevel {
  level: number;
  description: string;
}

export interface Milestone {
  id: string;
  category: string;
  levels: { [key: number]: string };
  iconName?: string;
}

export interface TeamMember {
  role: string;
  members: string;
  iconName?: string;
}

export interface ResearchGap {
  title: string;
  content: string;
  reference?: string;
}

export interface TimelinePhase {
  title: string;
  start: number;
  duration: number;
  color: string;
  dateLabel: string;
  iconName?: string;
  events?: string[];
}
