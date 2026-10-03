import React from 'react';
import {
  Account,
  Product,
  Opportunity,
  GroundTruthRecord,
  RecommendationEvent,
  RecommendationExperience,
  NavigationPage,
} from '../../types';
import {
  Sparkles,
  Building2,
  Package,
  Target,
  FileCheck2,
  History,
  BrainCircuit,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Briefcase,
  Trophy,
} from 'lucide-react';

interface DashboardViewProps {
  accounts: Account[];
  products: Product[];
  opportunities: Opportunity[];
  groundTruth: GroundTruthRecord[];
  recommendations: RecommendationEvent[];
  experiences: RecommendationExperience[];
  onNavigate: (page: NavigationPage) => void;
  onSelectRecommendation: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  accounts,
  products,
  opportunities,
  groundTruth,
  recommendations,
  experiences,
  onNavigate,
  onSelectRecommendation,
}) => {
  // Outcomes summary counts
  const outcomesCount = {
    accepted: recommendations.filter((r) => r.outcome === 'Accepted').length,
    rejected: recommendations.filter((r) => r.outcome === 'Rejected').length,
    opportunity: recommendations.filter((r) => r.outcome === 'Opportunity').length,
    closedWon: recommendations.filter((r) => r.outcome === 'Closed-Won').length,
  };

  const totalActioned = outcomesCount.accepted + outcomesCount.rejected + outcomesCount.opportunity + outcomesCount.closedWon;
  const positiveActioned = outcomesCount.accepted + outcomesCount.opportunity + outcomesCount.closedWon;
  const acceptanceRate = totalActioned > 0 ? Math.round((positiveActioned / totalActioned) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome & Primary CTA Banner */}
      <div className="bg-slate-900 rounded-2xl p-7 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-slate-800">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RL Agent Active · Deep Q-Network Policy v2.4</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Intelligent Cross-Sell Workspace
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            CrossSync analyzes account context, installed products, and active opportunities to generate calibrated Top 5 cross-sell recommendations. Sales responses feed reinforcement learning experience buffers for continuous policy refinement.
          </p>
        </div>
        <button
          onClick={() => onNavigate('recommend')}
          className="flex items-center gap-2.5 px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all whitespace-nowrap active:scale-98"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Recommendation</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Main KPI Cards (Exact Prompt Requirements) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => onNavigate('accounts')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Accounts</span>
            <Building2 className="w-4 h-4 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {accounts.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Enterprise Clients</div>
        </div>

        <div
          onClick={() => onNavigate('products')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Products</span>
            <Package className="w-4 h-4 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {products.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Catalog Portfolio</div>
        </div>

        <div
          onClick={() => onNavigate('opportunities')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Opportunities</span>
            <Target className="w-4 h-4 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {opportunities.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active Deals</div>
        </div>

        <div
          onClick={() => onNavigate('groundtruth')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">GroundTruth</span>
            <FileCheck2 className="w-4 h-4 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {groundTruth.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Historical Wins</div>
        </div>

        <div
          onClick={() => onNavigate('history')}
          className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Generated</span>
            <History className="w-4 h-4 group-hover:text-slate-900 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
            {recommendations.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Agent Events</div>
        </div>

        <div
          onClick={() => onNavigate('experiences')}
          className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 hover:border-emerald-300 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Experiences</span>
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {experiences.length}
          </div>
          <div className="text-[11px] text-emerald-600/90 mt-1">RL Training Buffers</div>
        </div>
      </div>

      {/* Outcome Summary Strip */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recommendation Outcome Summary</h2>
            <p className="text-xs text-slate-500 mt-0.5">Commercial trajectory and salesperson actions on agent recommendations</p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Overall Acceptance Rate: <span className="font-mono font-bold text-slate-900">{acceptanceRate}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200/70">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
              <span>Accepted</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-900 mt-2 tabular-nums">
              {outcomesCount.accepted}
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-0.5">Sales consensus agreed</div>
          </div>

          <div className="p-4 rounded-lg bg-rose-50/60 border border-rose-200/70">
            <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
              <span>Rejected</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-bold font-mono text-rose-900 mt-2 tabular-nums">
              {outcomesCount.rejected}
            </div>
            <div className="text-[11px] text-rose-700/80 mt-0.5">Negative feedback logged</div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200/70">
            <div className="flex items-center justify-between text-blue-700 text-xs font-semibold">
              <span>Opportunity</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold font-mono text-blue-900 mt-2 tabular-nums">
              {outcomesCount.opportunity}
            </div>
            <div className="text-[11px] text-blue-700/80 mt-0.5">Scoped into pipeline</div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
              <span>Closed-Won</span>
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-900 mt-2 tabular-nums">
              {outcomesCount.closedWon}
            </div>
            <div className="text-[11px] text-amber-700/80 mt-0.5">Realized cross-sell wins</div>
          </div>
        </div>
      </div>

      {/* Recent Recommendations Table & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Recommendations (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Recommendations</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time agent inferences and recorded salesperson actions</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-4">Account</th>
                  <th className="py-2.5 px-4">Current Product</th>
                  <th className="py-2.5 px-4">Recommended Product</th>
                  <th className="py-2.5 px-4 text-right">Agent Score</th>
                  <th className="py-2.5 px-4 text-center">Outcome</th>
                  <th className="py-2.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recommendations.slice(0, 5).map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => {
                      onSelectRecommendation(rec.id);
                      onNavigate('recommendation-details');
                    }}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900">{rec.accountName}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-[150px] truncate">{rec.currentProductName}</td>
                    <td className="py-3 px-4 font-medium text-indigo-900 max-w-[170px] truncate">
                      {rec.recommendedProductName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-indigo-600 tabular-nums">
                      {rec.agentScore.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] font-semibold text-slate-700">
                        {rec.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px] tabular-nums">
                      {rec.timestamp.substring(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* High-Level Analytics & Workflow Context */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">RL Continuous Learning Loop</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Every salesperson response is recorded as a state-action-reward transition tuple.
            </p>

            <div className="mt-5 space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Active Model Checkpoint
                </div>
                <div className="text-xs font-mono font-bold text-slate-900">
                  v2.4-DQN-CrossSell-Policy
                </div>
                <div className="text-[11px] text-slate-500">
                  NDCG@5: <span className="font-mono text-slate-700 font-semibold">0.812</span> · HitRate@5:{' '}
                  <span className="font-mono text-slate-700 font-semibold">86.4%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Experience Replay Buffer
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {experiences.filter((e) => e.experienceStatus === 'Ready for Export' || e.experienceStatus === 'Recorded').length} Experiences Ready
                  </span>
                  <button
                    onClick={() => onNavigate('experiences')}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    Manage & Export
                  </button>
                </div>
                <div className="text-[11px] text-slate-400">
                  Exports directly to .xlsx for offline training pipelines
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Looking for deep analytics?</span>
            <button
              onClick={() => onNavigate('analytics')}
              className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Analytics Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
