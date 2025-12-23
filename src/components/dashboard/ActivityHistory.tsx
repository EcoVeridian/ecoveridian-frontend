'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import {
  GlobeAltIcon,
  ClockIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { getUserDashboardData } from '@/lib/dashboard';
import type { AnalysisHistory } from '@/types/dashboard';
import EnvironmentalRiskReportModal from './EnvironmentalRiskReportModal';

export default function ActivityHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisHistory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (item: AnalysisHistory) => {
    setSelectedAnalysis(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnalysis(null);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        const res = await getUserDashboardData();
        if (!res) {
          setHistory([]);
        } else {
          setHistory(res.history);
        }
      } catch (err) {
        console.error('Error loading dashboard data', err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // Format timestamp
  const formatDate = (ts: any): string => {
    if (!ts) return 'N/A';
    const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  // Skeleton loader for table rows
  const TableSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 py-4 px-4 animate-pulse">
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-32 mb-2" />
            <div className="h-3 bg-muted rounded w-48" />
          </div>
          <div className="h-6 bg-muted rounded w-12" />
          <div className="h-6 bg-muted rounded w-10" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* History Table */}
      <Card className="p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-1">Analysis History</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Click a report to see an in-depth analysis to explore full environmental risk details, scores, and insights
        </p>

        {loading ? (
          <TableSkeleton />
        ) : history.length === 0 ? (
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
                    Reports
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">
                    <span className="sr-only">View Report</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{item.companyName}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {item.domain}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="w-4 h-4" />
                        {formatDate(item.timestamp)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <ChevronRightIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors inline-block" />
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

      {/* Environmental Risk Report Modal */}
      <EnvironmentalRiskReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        analysis={selectedAnalysis}
      />
    </div>
  );
}
