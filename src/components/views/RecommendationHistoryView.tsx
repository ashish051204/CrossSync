import React, { useState } from 'react';
import { RecommendationEvent } from '../../types';
import { History, Search, Filter, ArrowRight, Sparkles } from 'lucide-react';

interface RecommendationHistoryViewProps {
  recommendations: RecommendationEvent[];
  onSelectRecommendation: (id: string) => void;
  onNavigateToRecommend: () => void;
}

export const RecommendationHistoryView: React.FC<RecommendationHistoryViewProps> = ({
  recommendations,
  onSelectRecommendation,
  onNavigateToRecommend,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');

  const outcomes = Array.from(new Set(recommendations.map((r) => r.outcome)));

  const filteredRecommendations = recommendations.filter((rec) => {
    const matchesSearch =
      rec.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.recommendedProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.currentProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutcome = outcomeFilter === 'ALL' || rec.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Agent Inference Logs</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Recommendation History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit log of all live RL recommendations produced by CrossSync, agent scores, and salesperson actions.
          </p>
        </div>

        <button
          onClick={onNavigateToRecommend}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Recommendation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search account, product, recommendation ID..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Outcome / Status:</span>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Outcomes</option>
            {outcomes.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendation History Table (Exact prompt requirements) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Current Product</th>
                <th className="py-3 px-4">Recommended Product</th>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4 text-right">Agent Score</th>
                <th className="py-3 px-4">Sales Action</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecommendations.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => onSelectRecommendation(rec.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500 tabular-nums">
                    {rec.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] tabular-nums">
                    {rec.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-600">
                    {rec.accountName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-[140px] truncate">
                    {rec.currentProductName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-900 max-w-[170px] truncate">
                    {rec.recommendedProductName}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      #{rec.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-700 tabular-nums">
                    {rec.agentScore.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">{rec.salespersonAction}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{rec.outcome}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectRecommendation(rec.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
