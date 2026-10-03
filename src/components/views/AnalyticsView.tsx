import React from 'react';
import {
  RecommendationEvent,
  RecommendationExperience,
  Product,
  Opportunity,
} from '../../types';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Briefcase,
  Trophy,
  PieChart,
  ArrowUpRight,
} from 'lucide-react';

interface AnalyticsViewProps {
  recommendations: RecommendationEvent[];
  experiences: RecommendationExperience[];
  products: Product[];
  opportunities: Opportunity[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  recommendations,
  experiences,
  products,
  opportunities,
}) => {
  // Aggregate real outcomes
  const total = recommendations.length;
  const accepted = recommendations.filter((r) => r.outcome === 'Accepted').length;
  const rejected = recommendations.filter((r) => r.outcome === 'Rejected').length;
  const oppCreated = recommendations.filter((r) => r.outcome === 'Opportunity').length;
  const closedWon = recommendations.filter((r) => r.outcome === 'Closed-Won').length;

  const totalActioned = accepted + rejected + oppCreated + closedWon;
  const positive = accepted + oppCreated + closedWon;
  const conversionToOppRate = total > 0 ? Math.round((oppCreated / total) * 100) : 0;
  const conversionToClosedWonRate = total > 0 ? Math.round((closedWon / total) * 100) : 0;
  const overallAgreementRate = totalActioned > 0 ? Math.round((positive / totalActioned) * 100) : 0;

  // Real product recommendation frequency
  const productFrequencyMap: Record<string, { count: number; won: number; opp: number }> = {};
  recommendations.forEach((r) => {
    if (!productFrequencyMap[r.recommendedProductId]) {
      productFrequencyMap[r.recommendedProductId] = { count: 0, won: 0, opp: 0 };
    }
    productFrequencyMap[r.recommendedProductId].count += 1;
    if (r.outcome === 'Closed-Won') productFrequencyMap[r.recommendedProductId].won += 1;
    if (r.outcome === 'Opportunity') productFrequencyMap[r.recommendedProductId].opp += 1;
  });

  const sortedProductStats = Object.entries(productFrequencyMap)
    .map(([productId, stats]) => {
      const prod = products.find((p) => p.id === productId);
      return {
        productId,
        name: prod?.name || productId,
        family: prod?.family || 'Enterprise',
        count: stats.count,
        won: stats.won,
        opp: stats.opp,
        conversionRate: Math.round(((stats.won + stats.opp) / stats.count) * 100),
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Policy Evaluation Analytics</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            CrossSync Recommendation Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Empirical performance telemetry derived from deployed agent sessions and recorded salesperson responses.
          </p>
        </div>
      </div>

      {/* KPI Conversion Funnel Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Inferences
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
            {total}
          </div>
          <div className="text-[11px] text-slate-400">Recommendation sessions logged</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Sales Acceptance
          </div>
          <div className="text-2xl font-mono font-bold text-indigo-600 tabular-nums">
            {overallAgreementRate}%
          </div>
          <div className="text-[11px] text-slate-400">Accepted, Opp, or Closed-Won</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Opportunity Conversion
          </div>
          <div className="text-2xl font-mono font-bold text-blue-700 tabular-nums">
            {conversionToOppRate}%
          </div>
          <div className="text-[11px] text-slate-400">Scoped into commercial pipeline</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Closed-Won Conversion
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 tabular-nums">
            {conversionToClosedWonRate}%
          </div>
          <div className="text-[11px] text-slate-400">Directly realized contract wins</div>
        </div>
      </div>

      {/* Conversion Funnel Bar & Outcomes Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outcome Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900">Recommendation Outcome Distribution</h2>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Opportunity Created</span>
                <span className="font-mono font-bold text-slate-900">{oppCreated} ({total > 0 ? Math.round((oppCreated / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${total > 0 ? (oppCreated / total) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Closed-Won Contract</span>
                <span className="font-mono font-bold text-slate-900">{closedWon} ({total > 0 ? Math.round((closedWon / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${total > 0 ? (closedWon / total) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Accepted in Scoping</span>
                <span className="font-mono font-bold text-slate-900">{accepted} ({total > 0 ? Math.round((accepted / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${total > 0 ? (accepted / total) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">Rejected / Not Applicable</span>
                <span className="font-mono font-bold text-slate-900">{rejected} ({total > 0 ? Math.round((rejected / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${total > 0 ? (rejected / total) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Experiences Replay Buffer Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900">Experience Store Retraining Readiness</h2>
          <p className="text-xs text-slate-500">
            Experiences are partitioned into positive and negative rewards to prevent catastrophic forgetting.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-200/70">
              <span className="text-[11px] text-emerald-800 uppercase font-semibold">Positive Rewards (+1.0 to +5.0)</span>
              <div className="text-xl font-mono font-bold text-emerald-950 mt-1 tabular-nums">
                {experiences.filter((e) => e.feedbackReward > 0).length} records
              </div>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Policy gradient reinforcement</span>
            </div>

            <div className="p-3.5 bg-rose-50/60 rounded-lg border border-rose-200/70">
              <span className="text-[11px] text-rose-800 uppercase font-semibold">Negative Rewards (-0.5)</span>
              <div className="text-xl font-mono font-bold text-rose-950 mt-1 tabular-nums">
                {experiences.filter((e) => e.feedbackReward < 0).length} records
              </div>
              <span className="text-[10px] text-rose-700 block mt-0.5">Action space constraint penalties</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Recommendation Frequency & Outcomes Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Product Recommendation Frequency & Conversion</h2>
          <p className="text-xs text-slate-500 mt-0.5">Frequency of selection by the RL Agent and commercial outcomes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Family</th>
                <th className="py-3 px-4 text-right">Inference Count</th>
                <th className="py-3 px-4 text-right">Opportunities Created</th>
                <th className="py-3 px-4 text-right">Closed-Won Deals</th>
                <th className="py-3 px-4 text-right">Win Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedProductStats.map((item) => (
                <tr key={item.productId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.family}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {item.count}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-blue-700 font-semibold tabular-nums">
                    {item.opp}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold tabular-nums">
                    {item.won}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {item.conversionRate}%
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
