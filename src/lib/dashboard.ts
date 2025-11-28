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
    console.log('getUserDashboardData: No user logged in');
    return null;
  }

  console.log('getUserDashboardData: Fetching for user UID:', user.uid);

  try {
    // 1. Fetch user stats document
    const userDocRef = doc(db, 'users', user.uid);
    console.log('Fetching stats from path:', `users/${user.uid}`);
    const statsSnap = await getDoc(userDocRef);
    const rawStats = statsSnap.exists() ? statsSnap.data() : null;
    console.log('Stats document exists:', statsSnap.exists(), rawStats);

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
    const historyPath = `users/${user.uid}/history`;
    console.log('Fetching history from path:', historyPath);
    const historyRef = collection(db, 'users', user.uid, 'history');
    const historySnap = await getDocs(historyRef);
    
    console.log('History collection size:', historySnap.size);
    console.log('History docs:', historySnap.docs.map(d => d.id));

    const history: AnalysisHistory[] = historySnap.docs.map((d) => {
      const data = d.data();
      console.log('History doc:', d.id, data);
      return {
        id: d.id,
        domain: data.domain ?? d.id,
        companyName: data.companyName ?? data.domain ?? d.id,
        score: data.ecoScore ?? data.score ?? 0,
        grade: data.ecoGrade ?? data.grade ?? 'N/A',
        summary: data.summary ?? '',
        timestamp: data.timestamp ?? data.createdAt ?? data.analyzedAt ?? null,
        sources: Array.isArray(data.sources) ? data.sources : [],
        breakdown: data.breakdown,
      };
    });

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

    console.log('Dashboard data loaded:', { stats, historyCount: history.length });
    return { stats, history };
  } catch (err) {
    console.error('getUserDashboardData error:', err);
    return null;
  }
}

// Keep legacy export for backwards compatibility
export const fetchDashboardData = getUserDashboardData;

