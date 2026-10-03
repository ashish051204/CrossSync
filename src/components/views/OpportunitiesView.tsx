import React, { useState } from 'react';
import { Opportunity } from '../../types';
import { Target, Search, Filter, ArrowRight, Sparkles } from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (id: string) => void;
  onNavigateToRecommend: (accountId: string, opportunityId: string) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  onSelectOpportunity,
  onNavigateToRecommend,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const stages = Array.from(new Set(opportunities.map((o) => o.stage)));

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.currentProduct.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || opp.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Commercial Deal Pipeline</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Opportunities Data
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active customer deals with financial margins, contribution margins (CM %), current products, and order types.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-mono font-bold text-slate-900">{filteredOpportunities.length}</span> of{' '}
          <span className="font-mono">{opportunities.length}</span> opportunities
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search opportunity, account, current product..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Stage:</span>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Opportunities Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Deal ID</th>
                <th className="py-3 px-4">Opportunity Name</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Current Product</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Margin %</th>
                <th className="py-3 px-4 text-right">CM %</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOpportunities.map((opp) => (
                <tr
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500 tabular-nums">
                    {opp.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-600">
                    {opp.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {opp.accountName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-[170px] truncate">
                    {opp.currentProduct}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${opp.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {opp.stage}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-700 tabular-nums">
                    {opp.margin}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-700 tabular-nums">
                    {opp.cmPercent}%
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigateToRecommend(opp.accountId, opp.id)}
                        title="Recommend for this Opportunity"
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Recommend</span>
                      </button>
                      <button
                        onClick={() => onSelectOpportunity(opp.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
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
