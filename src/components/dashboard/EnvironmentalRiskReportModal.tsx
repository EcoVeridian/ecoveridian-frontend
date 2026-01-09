'use client';

import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  XMarkIcon,
} from '@heroicons/react/24/outline';
import CompanyLogo from '@/components/common/CompanyLogo';
import type { AnalysisHistory } from '@/types/dashboard';

interface EnvironmentalRiskReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisHistory | null;
}

export default function EnvironmentalRiskReportModal({
  isOpen,
  onClose,
  analysis,
}: EnvironmentalRiskReportModalProps) {
  if (!isOpen || !analysis) return null;

  // Check if we have a real environmental risk report
  if (!analysis.riskReport) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md m-4 bg-background border border-border rounded-xl shadow-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Report Not Available</h2>
          <p className="text-muted-foreground mb-4">
            The environmental risk report for this company is not yet available. This may be an older analysis that was completed before the environmental risk reporting feature was added.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Please re-analyze this company using the browser extension to generate a new detailed environmental risk report.
          </p>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    );
  }

  const report = analysis.riskReport;

  // Refs to adjust scrolling so sections clear the sticky header inside the modal
  const modalScrollRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Low':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'High':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getImpactDisplay = (impact: number) => {
    return impact.toFixed(3);
  };

  const getImpactColor = (impact: number) => {
    if (impact <= -0.3) return 'text-green-500';
    if (impact <= 0.3) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Step indicator component (clickable to smooth-scroll to sections)
  const StepIndicator = ({ number, label, active = false }: { number: number; label: string; active?: boolean }) => {
    const handleClick = () => {
      const el = document.getElementById(`report-section-${number}`);
      const container = modalScrollRef.current;
      const header = headerRef.current;

      if (el && container) {
        // compute position relative to the scrollable modal container so sticky header doesn't overlap
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const headerHeight = header ? header.getBoundingClientRect().height : 0;

        const offset = elRect.top - containerRect.top - headerHeight - 12; // small gap
        const target = Math.max(0, container.scrollTop + offset);
        container.scrollTo({ top: target, behavior: 'smooth' });
        return;
      }

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        aria-controls={`report-section-${number}`}
        className="group flex items-center gap-3 focus:outline-none cursor-pointer"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} group-hover:bg-primary/10 group-hover:text-primary`}>
          {number}
        </div>
        <span className={`text-sm transition-colors ${active ? 'text-foreground font-medium' : 'text-muted-foreground'} group-hover:text-primary`}>{label}</span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div ref={modalScrollRef} className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto m-4 bg-background border border-border rounded-xl shadow-2xl modal-table-scroll">
        {/* Header */}
        <div ref={headerRef} className="sticky top-0 z-10 bg-background border-b border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Environmental Risk Report</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We scan recent, independent news and reports about this company to estimate its environmental risk and explain why.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Step Navigation */}
          <div className="flex flex-wrap gap-6 mt-4">
            <StepIndicator number={1} label="Company" active />
            <StepIndicator number={2} label="GreenScore" active />
            <StepIndicator number={3} label="Findings" active />
            <StepIndicator number={4} label="Articles Checked" active />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Section 1: Company */}
          <section id="report-section-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="text-lg font-semibold">Company you asked us to check</h3>
            </div>
            
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <CompanyLogo 
                  domain={analysis.domain} 
                  companyName={report.company} 
                  size="md" 
                />
                <div>
                  <h4 className="text-xl font-bold">{report.company}</h4>
                  <p className="text-sm text-muted-foreground">Company audited</p>
                </div>
              </div>
              
              {/* Summary at a Glance */}
              <div className="border-t border-border pt-4">
                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Summary at a glance</h5>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Environmental Verdict */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Environmental verdict</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-semibold text-sm ${getVerdictColor(report.summary_at_a_glance.environmental_verdict)}`}>
                      {report.summary_at_a_glance.environmental_verdict} risk
                    </span>
                  </div>
                  
                  {/* GreenScore */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">GreenScore</p>
                    <p className={`text-2xl font-bold ${getScoreColor(report.summary_at_a_glance.GreenScore)}`}>
                      {report.summary_at_a_glance.GreenScore} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
                    </p>
                  </div>
                  
                  {/* Events Reviewed */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Events reviewed</p>
                    <p className="text-2xl font-bold">{report.summary_at_a_glance.events_reviewed}</p>
                  </div>
                  
                  {/* Issues Flagged */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Serious issues flagged</p>
                    <p className={`text-2xl font-bold ${report.summary_at_a_glance.serious_issues_flagged > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {report.summary_at_a_glance.serious_issues_flagged}
                    </p>
                  </div>
                </div>
                
                {/* Event Balance */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Event balance</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      <span className="font-semibold text-red-500">{report.summary_at_a_glance.event_balance.harmful}</span>
                      <span className="text-muted-foreground"> harmful</span>
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm">
                      <span className="font-semibold text-green-500">{report.summary_at_a_glance.event_balance.beneficial}</span>
                      <span className="text-muted-foreground"> beneficial</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 2: GreenScore */}
          <section id="report-section-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
              <h3 className="text-lg font-semibold">GreenScore</h3>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${getVerdictColor(report.summary_at_a_glance.environmental_verdict)}`}>
                {report.summary_at_a_glance.environmental_verdict} risk
              </span>
            </div>
            
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                GreenScore is a 0–100 rating of this company's environmental risk based on recent, independent news and reports. Higher scores mean lower environmental risk.
              </p>
              
              {/* Score Display */}
              <div className="flex items-center gap-6 mb-6">
                <div className={`text-6xl font-bold ${getScoreColor(report.summary_at_a_glance.GreenScore)}`}>
                  {report.summary_at_a_glance.GreenScore}%
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getScoreBgColor(report.summary_at_a_glance.GreenScore)} transition-all`}
                      style={{ width: `${report.summary_at_a_glance.GreenScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 = very high risk</span>
                    <span>100 = very low risk</span>
                  </div>
                </div>
              </div>
              
              {/* Explanation */}
              <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                <p className="text-sm leading-relaxed">
                  {report.green_score_explanation}
                </p>
              </div>
              
              {/* Main reasons */}
              <div className="mb-6">
                <h5 className="font-semibold mb-2">Main reasons for this score</h5>
                <p className="text-sm text-muted-foreground">
                  Mean (log-compressed) risk: <span className="font-mono font-semibold">{report.mean_log_risk.toFixed(3)}</span> from {report.total_events} events (risk level: {report.overall_concern_level.toLowerCase()}).
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  GreenScore uses a 6-factor model (severity, credibility, recency, scope, confidence) with log compression. Higher = lower environmental risk.
                </p>
              </div>
              
              {/* Risk Levels Legend */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="font-bold text-green-500 whitespace-nowrap">80–100</span>
                  <span className="text-sm text-muted-foreground">Low environmental risk, strong record.</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <span className="font-bold text-yellow-500 whitespace-nowrap">50–79</span>
                  <span className="text-sm text-muted-foreground">Medium risk, mixed record.</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="font-bold text-red-500 whitespace-nowrap">0–49</span>
                  <span className="text-sm text-muted-foreground">High risk, repeated or serious issues.</span>
                </div>
              </div>
              
              {/* Key Articles Preview */}
              <div className="mt-6 pt-6 border-t border-border">
                <h5 className="font-semibold mb-4">Key articles influencing this score</h5>
                {report.key_articles.slice(0, 1).map((article, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                    <p className="font-medium mb-2">{article.title}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>Event score: <span className={`font-semibold ${getScoreColor(article.event_score)}`}>{article.event_score}</span></span>
                      <span>Impact (−1..+1): <span className={`font-mono font-semibold ${getImpactColor(article.impact)}`}>{getImpactDisplay(article.impact)}</span></span>
                      <span>Contribution: <span className="font-semibold">{article.contribution_percent.toFixed(1)}%</span></span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                      <span>Credibility {article.credibility.toFixed(2)}</span>
                      <span>Recency {article.recency.toFixed(2)}</span>
                      <span>Scope {article.scope.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Section 3: What we found */}
          <section id="report-section-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
              <h3 className="text-lg font-semibold">What we found</h3>
            </div>
            
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Harmful events</p>
                  <p className="text-2xl font-bold text-red-500">{report.summary_at_a_glance.event_balance.harmful}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Beneficial events</p>
                  <p className="text-2xl font-bold text-green-500">{report.summary_at_a_glance.event_balance.beneficial}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total events reviewed</p>
                  <p className="text-2xl font-bold">{report.total_events}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Serious issues flagged</p>
                  <p className={`text-2xl font-bold ${report.summary_at_a_glance.serious_issues_flagged > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {report.summary_at_a_glance.serious_issues_flagged}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Overall concern level:</span>
                <span className={`px-3 py-1 rounded-md border font-semibold text-sm ${getVerdictColor(report.overall_concern_level)}`}>
                  {report.overall_concern_level.toLowerCase()}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {report.notes}
              </p>
            </Card>
          </section>

          {/* Section 4: Articles we checked */}
          <section id="report-section-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
              <h3 className="text-lg font-semibold">Articles Checked</h3>
            </div>
            
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto modal-table-scroll">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Title</th>
                      <th className="text-center py-3 px-4 font-medium whitespace-nowrap">
                        <div>Event score</div>
                        <div className="text-xs font-normal text-muted-foreground">0–100 (higher = better)</div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium whitespace-nowrap">
                        <div>Impact</div>
                        <div className="text-xs font-normal text-muted-foreground">−1 harmful · +1 positive</div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium">Severity</th>
                      <th className="text-center py-3 px-4 font-medium">Confidence</th>
                      <th className="text-center py-3 px-4 font-medium">Contribution</th>
                      <th className="text-center py-3 px-4 font-medium">Cred.</th>
                      <th className="text-center py-3 px-4 font-medium">Recency</th>
                      <th className="text-center py-3 px-4 font-medium">Scope</th>
                      <th className="text-left py-3 px-4 font-medium">Date / source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.key_articles.map((article, index) => (
                      <tr key={index} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-4 max-w-xs">
                          <p className="font-medium line-clamp-2">{article.title}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-bold ${getScoreColor(article.event_score)}`}>
                            {article.event_score}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-mono font-semibold ${getImpactColor(article.impact)}`}>
                            {getImpactDisplay(article.impact)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-mono ${article.severity < 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {article.severity.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {article.confidence.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-1 bg-primary/10 rounded text-primary font-semibold">
                            {article.contribution_percent.toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-muted-foreground">
                          {article.credibility.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-center text-muted-foreground">
                          {article.recency.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-center text-muted-foreground">
                          {article.scope.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                          {article.date_source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Notes */}
              <div className="p-4 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Notes:</strong> Event score is 0–100 (higher = less environmental risk). "Impact" is the underlying −1..+1 value used in our model. Contribution shows how much that event explains the overall risk.
                </p>
              </div>
            </Card>
          </section>
        </div>
      </div>
      <style jsx global>{`
        /* Light theme (default): always visible, high-contrast scrollbars */
        .modal-table-scroll {
          scrollbar-width: auto; /* Firefox: always show, default width */
          scrollbar-color: #222 #cfcfcf; /* thumb color, track color */
          overscroll-behavior: contain;
        }
        .modal-table-scroll::-webkit-scrollbar {
          width: 14px; /* vertical scrollbar width */
          height: 14px; /* horizontal scrollbar height */
          background: #cfcfcf;
        }
        .modal-table-scroll::-webkit-scrollbar-track {
          background: #cfcfcf;
        }
        .modal-table-scroll::-webkit-scrollbar-thumb {
          background: #222 !important;
          border-radius: 8px;
          border: 3px solid #cfcfcf;
          background-clip: padding-box;
          min-height: 40px;
          min-width: 40px;
          opacity: 1 !important;
          -webkit-box-shadow: 0 0 2px #000, 0 0 1px #000;
        }
        .modal-table-scroll::-webkit-scrollbar-thumb:hover {
          background: #222 !important;
        }
        .modal-table-scroll::-webkit-scrollbar-corner {
          background: #cfcfcf;
        }
        /* Fallback for browsers that ignore ::-webkit-scrollbar */
        .modal-table-scroll {
          scrollbar-face-color: #222;
          scrollbar-track-color: #cfcfcf;
        }

        /* Dark theme overrides: use lighter thumb for dark backgrounds.
           Support common dark-theme selectors and prefers-color-scheme. */
        .dark .modal-table-scroll,
        [data-theme="dark"] .modal-table-scroll {
          scrollbar-color: rgba(255,255,255,0.16) rgba(255,255,255,0.03);
        }
        .dark .modal-table-scroll::-webkit-scrollbar-track,
        [data-theme="dark"] .modal-table-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
        }
        .dark .modal-table-scroll::-webkit-scrollbar-thumb,
        [data-theme="dark"] .modal-table-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.12);
          -webkit-box-shadow: none;
        }
        .dark .modal-table-scroll::-webkit-scrollbar-thumb:hover,
        [data-theme="dark"] .modal-table-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.18);
        }

        /* Respect user's OS preference as an additional fallback */
        @media (prefers-color-scheme: dark) {
          .modal-table-scroll {
            scrollbar-color: rgba(255,255,255,0.16) rgba(255,255,255,0.03);
          }
          .modal-table-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
          .modal-table-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); -webkit-box-shadow: none; }
          .modal-table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
        }
      `}</style>
    </div>
  );
}

