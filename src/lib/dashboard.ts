import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { DEFAULT_STATS } from '@/types/dashboard';
import type { DashboardData, DashboardStats, AnalysisHistory, EnvironmentalRiskReport } from '@/types/dashboard';

// use shared DEFAULT_STATS from types when user has no data yet

/**
 * Map backend company data structure to frontend EnvironmentalRiskReport structure
 * @param cacheData The company document data from Firestore
 * @param domain The domain identifier
 */
function mapCompanyDataToRiskReport(cacheData: any, domain: string): EnvironmentalRiskReport | undefined {
  const envReport = cacheData.environmentalRiskReport;
  
  // Map backend structure to frontend structure
  if (envReport && envReport.articles) {
    return {
      company: cacheData.companyName || domain,
      summary_at_a_glance: {
        environmental_verdict: envReport.verdict?.replace(' risk', '') as 'Low' | 'Medium' | 'High' || 'Medium',
        GreenScore: envReport.greenScore || 0,
        events_reviewed: envReport.totalEvents || 0,
        serious_issues_flagged: envReport.seriousIssuesCount || 0,
        event_balance: {
          harmful: envReport.harmfulEvents || 0,
          beneficial: envReport.beneficialEvents || 0,
        },
      },
      green_score_explanation: envReport.scoreSummary || '',
      mean_log_risk: envReport.meanRisk || 0,
      key_articles: (envReport.articles || []).map((article: any) => {
        let dateSource = 'N/A';
        try {
          const hostname = new URL(article.url).hostname.replace(/^www\./, '');
          dateSource = article.publishedDate 
            ? `${new Date(article.publishedDate).toISOString().split('T')[0]} • ${hostname}`
            : `N/A • ${hostname}`;
        } catch {
          dateSource = article.publishedDate 
            ? `${new Date(article.publishedDate).toISOString().split('T')[0]} • ${article.url}`
            : `N/A • ${article.url}`;
        }
        
        return {
          title: article.title || '',
          event_score: article.eventScore || 0,
          impact: article.impact || 0,
          severity: article.severity || 0,
          confidence: article.confidence || 0,
          contribution_percent: Math.round(article.contribution || 0),
          credibility: article.credibility || 0,
          recency: article.recency || 0,
          scope: article.scope || 0,
          date_source: dateSource,
        };
      }),
      overall_concern_level: (envReport.riskLevel === 'low' ? 'Low' : envReport.riskLevel === 'high' ? 'High' : 'Medium') as 'Low' | 'Medium' | 'High',
      total_events: envReport.totalEvents || 0,
    };
  }
  return undefined;
}

/**
 * Fetch company data from the normalized companies collection
 * @param domain The domain to fetch (e.g., "amazon.com")
 */
async function fetchCompanyData(domain: string): Promise<any | null> {
  try {
    const companyRef = doc(db, 'companies', domain);
    const companySnap = await getDoc(companyRef);
    
    if (companySnap.exists()) {
      return companySnap.data();
    }
    return null;
  } catch (err) {
    console.error(`Error fetching company data for domain ${domain}:`, err);
    return null;
  }
}

/**
 * Helper to convert timestamp to milliseconds
 */
function getTimestampMillis(ts: any): number {
  if (!ts) return 0;
  // Firestore Timestamp has toDate() method
  if (typeof ts.toDate === 'function') {
    return ts.toDate().getTime();
  }
  // Already a Date object
  if (ts instanceof Date) {
    return ts.getTime();
  }
  // Firestore Timestamp with seconds/nanoseconds
  if (ts.seconds !== undefined) {
    return ts.seconds * 1000 + (ts.nanoseconds || 0) / 1000000;
  }
  return 0;
}

/**
 * Fetch the current user's dashboard data from Firestore.
 * 
 * NORMALIZED SCHEMA:
 * - Stats: users/{uid}
 * - User History (reference list): users/{uid}/history/{domain}
 * - Company Data (source of truth): companies/{domain}
 * 
 * This function:
 * 1. Fetches user stats
 * 2. Gets all domains from user's history collection
 * 3. For each domain, fetches the actual company data from the global companies collection
 * 4. Merges history metadata with company data
 * 5. Returns populated history with real data from companies collection
 */
export async function getUserDashboardData(): Promise<DashboardData | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  try {
    // 1. Fetch user stats document
    const userDocRef = doc(db, 'users', user.uid);
    const statsSnap = await getDoc(userDocRef);
    const rawStats = statsSnap.exists() ? statsSnap.data() : null;

    const stats: DashboardStats = rawStats
      ? {
          totalSitesAnalyzed: rawStats.totalSitesAnalyzed ?? DEFAULT_STATS.totalSitesAnalyzed,
          averageEcoScore: rawStats.averageEcoScore ?? DEFAULT_STATS.averageEcoScore,
          highScoreSites: rawStats.highScoreSites ?? DEFAULT_STATS.highScoreSites,
          totalScoreSum: rawStats.totalScoreSum,
          lastActive: rawStats.lastActive,
          createdAt: rawStats.createdAt,
        }
      : DEFAULT_STATS;

    // 2. Fetch user's history subcollection (list of domains)
    const historyRef = collection(db, 'users', user.uid, 'history');
    const historySnap = await getDocs(historyRef);
    
    if (historySnap.empty) {
      // User has no history yet
      return { stats, history: [] };
    }

    // 3. For each domain in history, fetch the company data from the global companies collection
    const historyPromises = historySnap.docs.map(async (historyDoc) => {
      const domain = historyDoc.id; // The document ID is the domain
      const historyData = historyDoc.data();
      
      // Fetch company data from normalized schema
      const companyData = await fetchCompanyData(domain);
      
      // Merge history metadata with company data
      return {
        id: domain,
        domain: domain,
        companyName: companyData?.companyName || historyData.companyName || domain,
        score: companyData?.greenScore ?? historyData.greenScore ?? historyData.ecoScore ?? historyData.score ?? 0,
        grade: companyData?.ecoGrade ?? historyData.ecoGrade ?? historyData.grade ?? 'N/A',
        summary: companyData?.summary ?? historyData.summary ?? '',
        timestamp: historyData.timestamp ?? companyData?.analyzedAt ?? companyData?.createdAt ?? null,
        sources: Array.isArray(companyData?.sources) ? companyData.sources : Array.isArray(historyData?.sources) ? historyData.sources : [],
        breakdown: companyData?.breakdown ?? historyData.breakdown,
        riskReport: companyData ? mapCompanyDataToRiskReport(companyData, domain) : undefined,
      };
    });
    
    const history: AnalysisHistory[] = await Promise.all(historyPromises);

    // 4. Sort by timestamp descending (most recent first), client-side
    history.sort((a, b) => {
      return getTimestampMillis(b.timestamp) - getTimestampMillis(a.timestamp);
    });

    return { stats, history };
  } catch (err) {
    console.error('getUserDashboardData error:', err);
    return null;
  }
}

// Keep legacy export for backwards compatibility
export const fetchDashboardData = getUserDashboardData;

