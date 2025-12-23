import { Timestamp } from 'firebase/firestore';

/**
 * EcoVeridian Dashboard Types
 * Mirrors the data structure saved by the extension/backend to Firestore
 */

/** User stats document (Firestore: users/{uid}) */
export interface DashboardStats {
  totalSitesAnalyzed: number;
  averageEcoScore: number;
  highScoreSites: number;
  totalScoreSum?: number;
  lastActive?: Timestamp;
  createdAt?: Timestamp;
}

/** ESG Category Breakdown */
export interface ESGBreakdown {
  environmental: {
    score: number;
    highlights: string[];
    concerns: string[];
  };
  social: {
    score: number;
    highlights: string[];
    concerns: string[];
  };
  governance: {
    score: number;
    highlights: string[];
    concerns: string[];
  };
}

/** Key article in environmental risk report */
export interface KeyArticle {
  title: string;
  event_score: number; // 0-100
  impact: number; // -1 to +1
  severity: number; // -1 to +1 (negative = harmful, positive = beneficial)
  confidence: number; // 0-1
  contribution_percent: number; // 0-100
  credibility: number; // 0-1
  recency: number; // 0-1
  scope: number; // 0-1
  date_source: string; // "{date} • {source_url}"
}

/** Summary at a glance for environmental risk report */
export interface SummaryAtGlance {
  environmental_verdict: 'Low' | 'Medium' | 'High';
  GreenScore: number; // 0-100
  events_reviewed: number;
  serious_issues_flagged: number;
  event_balance: {
    harmful: number;
    beneficial: number;
  };
}

/** Environmental Risk Report structure */
export interface EnvironmentalRiskReport {
  company: string;
  summary_at_a_glance: SummaryAtGlance;
  green_score_explanation: string;
  mean_log_risk: number; // log-compressed risk value
  key_articles: KeyArticle[];
  overall_concern_level: 'Low' | 'Medium' | 'High';
  total_events: number;
  notes?: string;
}

/** User history entry (Firestore: users/{uid}/history/{domain}) */
export interface AnalysisHistory {
  id: string; // document id (domain)
  domain: string;
  companyName: string;
  score: number; // ecoScore
  grade: string; // ecoGrade (A+, A, B, etc.)
  summary: string;
  timestamp: Timestamp | Date;
  sources: string[];
  breakdown?: ESGBreakdown;
  // Environmental Risk Report (populated by backend)
  riskReport?: EnvironmentalRiskReport;
}

/** Dashboard data bundle returned by getUserDashboardData */
export interface DashboardData {
  stats: DashboardStats;
  history: AnalysisHistory[];
}

/** Default stats when user has no data yet */
export const DEFAULT_STATS: DashboardStats = {
  totalSitesAnalyzed: 0,
  averageEcoScore: 0,
  highScoreSites: 0,
};
