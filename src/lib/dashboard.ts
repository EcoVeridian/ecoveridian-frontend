import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { DEFAULT_STATS } from '@/types/dashboard';
import type { DashboardData, DashboardStats, AnalysisHistory } from '@/types/dashboard';

// use shared DEFAULT_STATS from types when user has no data yet

/**
 * Fetch the current user's dashboard data from Firestore.
 * - Stats: users/{uid}
 * - History: users/{uid}/history (sorted client-side by timestamp desc)
 */
export async function getUserDashboardData(): Promise<DashboardData | null> {
  const user = auth.currentUser;
  if (!user) {
    // console.log('getUserDashboardData: No user logged in');
    return null;
  }

  // console.log('getUserDashboardData: Fetching for user UID:', user.uid);

  try {
    // 1. Fetch user stats document
    const userDocRef = doc(db, 'users', user.uid);
    // console.log('Fetching stats from path:', `users/${user.uid}`);
    const statsSnap = await getDoc(userDocRef);
    const rawStats = statsSnap.exists() ? statsSnap.data() : null;
    // console.log('Stats document exists:', statsSnap.exists(), rawStats);

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

    // 2. Fetch history subcollection WITHOUT orderBy (to avoid missing field issues)
    // Sort client-side instead
    // console.log('Fetching history from path:', historyPath);
    const historyRef = collection(db, 'users', user.uid, 'history');
    const historySnap = await getDocs(historyRef);
    
    // console.log('History collection size:', historySnap.size);
    // console.log('History docs:', historySnap.docs.map(d => d.id));

    // Fetch full environmental risk reports from cache for each history item
    const historyPromises = historySnap.docs.map(async (d) => {
      const data = d.data();
      const domain = data.domain ?? d.id;
      
      // Fetch the cached analysis which contains the full environmentalRiskReport
      const cacheDocId = domain.replace(/\./g, '_');
      const cacheRef = doc(db, 'domainAnalysisCache', cacheDocId);
      const cacheSnap = await getDoc(cacheRef);
      
      let riskReport = undefined;
      
      if (cacheSnap.exists()) {
        const cacheData = cacheSnap.data();
        const envReport = cacheData.environmentalRiskReport;
        
        // Map backend structure to frontend structure
        if (envReport && envReport.articles) {
          riskReport = {
            company: cacheData.companyName || data.companyName || domain,
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
            overall_concern_level: envReport.riskLevel === 'low' ? 'Low' : envReport.riskLevel === 'high' ? 'High' : 'Medium',
            total_events: envReport.totalEvents || 0,
          };
        }
      }
      
      // console.log('History doc:', d.id, data);
      return {
        id: d.id,
        domain: data.domain ?? d.id,
        companyName: data.companyName ?? data.domain ?? d.id,
        score: data.greenScore ?? data.ecoScore ?? data.score ?? 0,
        grade: data.ecoGrade ?? data.grade ?? 'N/A',
        summary: data.summary ?? '',
        timestamp: data.timestamp ?? data.createdAt ?? data.analyzedAt ?? null,
        sources: Array.isArray(data.sources) ? data.sources : [],
        breakdown: data.breakdown,
        riskReport,
      };
    });
    
    const history: AnalysisHistory[] = await Promise.all(historyPromises);

    // Sort by timestamp descending (most recent first), client-side
    history.sort((a, b) => {
      // Handle Firestore Timestamp or JS Date
      const getTime = (ts: any): number => {
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
      };
      return getTime(b.timestamp) - getTime(a.timestamp);
    });

    // console.log('Dashboard data loaded:', { stats, historyCount: history.length });
    return { stats, history };
  } catch (err) {
    console.error('getUserDashboardData error:', err);
    return null;
  }
}

// Keep legacy export for backwards compatibility
export const fetchDashboardData = getUserDashboardData;

