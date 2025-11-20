'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import {
  ChartBarIcon,
  GlobeAltIcon,
  ClockIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

// Mock data type (will be replaced with real Firestore data)
interface HistoryItem {
  id: string;
  url: string;
  domain: string;
  ecoScore: number;
  timestamp: Date;
  category: string;
}

export default function ActivityHistory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  // Stats computed from history
  const totalSites = historyData.length;
  const avgEcoScore =
    historyData.length > 0
      ? Math.round(
          historyData.reduce((sum, item) => sum + item.ecoScore, 0) /
            historyData.length
        )
      : 0;
  const highScoreSites = historyData.filter((item) => item.ecoScore >= 70).length;

  useEffect(() => {
    // TODO: Replace with actual Firestore query
    // Example: query collection(`users/${user?.uid}/history`)
    
    // Mock data for demonstration
    const mockData: HistoryItem[] = [
      {
        id: '1',
        url: 'https://patagonia.com',
        domain: 'patagonia.com',
        ecoScore: 92,
        timestamp: new Date('2024-11-15T10:30:00'),
        category: 'Retail',
      },
      {
        id: '2',
        url: 'https://tesla.com',
        domain: 'tesla.com',
        ecoScore: 85,
        timestamp: new Date('2024-11-14T15:45:00'),
        category: 'Automotive',
      },
      {
        id: '3',
        url: 'https://example-corp.com',
        domain: 'example-corp.com',
        ecoScore: 58,
        timestamp: new Date('2024-11-13T09:20:00'),
        category: 'Technology',
      },
      {
        id: '4',
        url: 'https://greenenergy.com',
        domain: 'greenenergy.com',
        ecoScore: 95,
        timestamp: new Date('2024-11-12T14:10:00'),
        category: 'Energy',
      },
      {
        id: '5',
        url: 'https://fastfashion.com',
        domain: 'fastfashion.com',
        ecoScore: 42,
        timestamp: new Date('2024-11-11T11:00:00'),
        category: 'Retail',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setHistoryData(mockData);
      setLoading(false);
    }, 500);
  }, [user]);

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get score badge color
  const getScoreBadgeColor = (score: number) => {
    if (score >= 70) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (score >= 40) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sites Analyzed */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <GlobeAltIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Sites Analyzed
              </p>
              <p className="text-3xl font-bold">{totalSites}</p>
            </div>
          </div>
        </Card>

        {/* Average Eco Score */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Average Eco Score
              </p>
              <p className={`text-3xl font-bold ${getScoreColor(avgEcoScore)}`}>
                {avgEcoScore}
              </p>
            </div>
          </div>
        </Card>

        {/* High Score Sites */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <SparklesIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                High Score Sites
              </p>
              <p className="text-3xl font-bold text-green-500">{highScoreSites}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* History Table */}
      <Card className="p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Analysis History</h2>

        {historyData.length === 0 ? (
          <div className="text-center py-12">
            <GlobeAltIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No analysis history yet</p>
            <p className="text-sm text-muted-foreground">
              Install the browser extension and start analyzing websites to see your
              history here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                    Website
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                    Category
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-sm text-muted-foreground">
                    Eco Score
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{item.domain}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {item.url}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-bold border rounded-full ${getScoreBadgeColor(item.ecoScore)}`}
                      >
                        {item.ecoScore}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="w-4 h-4" />
                        {item.timestamp.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Info Note */}
      <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Note:</strong> Your analysis history is
          automatically populated by the EcoVeridian browser extension. Install the
          extension to start tracking your sustainability journey.
        </p>
      </div>
    </div>
  );
}
