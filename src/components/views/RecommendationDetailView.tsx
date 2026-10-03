import React from 'react';
import { RecommendationEvent, NavigationPage } from '../../types';
import {
  History,
  ArrowLeft,
  Sparkles,
  Building2,
  Package,
  Target,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface RecommendationDetailViewProps {
  recommendation: RecommendationEvent;
  onBack: () => void;
  onSelectAccount: (accountId: string) => void;
  onSelectOpportunity: (opportunityId: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const RecommendationDetailView: React.FC<RecommendationDetailViewProps> = ({
  recommendation,
  onBack,
  onSelectAccount,
  onSelectOpportunity,
  onSelectProduct,
}) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>{recommendation.id}</span>
              <span>·</span>
              <span>{recommendation.timestamp}</span>
              <span>·</span>
              <span className="font-semibold text-indigo-700">RL Recommendation Event</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              Recommendation for {recommendation.accountName}
            </h1>
          </div>
        </div>
      </div>

      {/* Visual Sequence Flow (Prompt Section 16 Flow: Context -> RL Agent -> Recommendation -> Sales Action -> Outcome) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Recommendation Event Execution Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* 1. Context */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Input Context</span>
              <div className="font-bold text-slate-900 mt-1 truncate">{recommendation.accountName}</div>
              <div className="text-[11px] text-slate-600 truncate">{recommendation.currentProductName}</div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-2">Deal: ${recommendation.opportunityAmount.toLocaleString()}</div>
          </div>

          {/* 2. RL Agent */}
          <div className="p-3.5 bg-indigo-50/50 rounded-lg border border-indigo-200 text-xs space-y-1 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">2. RL Agent</span>
              <div className="font-bold text-slate-900 mt-1">DQN Policy v2.4</div>
              <div className="text-[11px] text-indigo-900 font-mono">Q-Score: {recommendation.agentScore.toFixed(2)}</div>
            </div>
            <div className="text-[10px] text-slate-500 mt-2">Top 5 Action Ranked</div>
          </div>

          {/* 3. Recommendation */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Recommended</span>
              <div className="font-bold text-slate-900 mt-1 truncate">{recommendation.recommendedProductName}</div>
              <div className="text-[11px] font-mono text-slate-500">Rank #{recommendation.rank}</div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2">Cross-Sell Action</div>
          </div>

          {/* 4. Sales Action */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">4. Sales Action</span>
              <div className="font-bold text-slate-900 mt-1">{recommendation.salespersonAction}</div>
              <div className="text-[11px] text-slate-500">Logged by Sales Rep</div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2">Human-in-the-Loop</div>
          </div>

          {/* 5. Outcome & Feedback */}
          <div className="p-3.5 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs space-y-1 h-full flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">5. Final Outcome</span>
              <div className="font-bold text-emerald-950 mt-1">{recommendation.outcome}</div>
              <div className="text-[11px] font-mono font-semibold text-emerald-700">
                Reward: {recommendation.feedbackReward !== undefined ? (recommendation.feedbackReward > 0 ? `+${recommendation.feedbackReward}` : recommendation.feedbackReward) : '+1.0'}
              </div>
            </div>
            <div className="text-[10px] text-emerald-700/80 mt-2">RL Experience Tuple</div>
          </div>
        </div>
      </div>

      {/* Complete Context Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => onSelectAccount(recommendation.accountId)}
          className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-2xs hover:border-slate-300 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Account Context</span>
            <Building2 className="w-4 h-4 group-hover:text-slate-900" />
          </div>
          <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
            {recommendation.accountName}
          </div>
          <div className="text-xs text-slate-500 font-mono">ID: {recommendation.accountId}</div>
        </div>

        <div
          onClick={() => onSelectProduct(recommendation.currentProductId)}
          className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-2xs hover:border-slate-300 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Product Base</span>
            <Package className="w-4 h-4 group-hover:text-slate-900" />
          </div>
          <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
            {recommendation.currentProductName}
          </div>
          <div className="text-xs text-slate-500 font-mono">ID: {recommendation.currentProductId}</div>
        </div>

        <div
          onClick={() => onSelectOpportunity(recommendation.opportunityId)}
          className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-2xs hover:border-slate-300 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Opportunity Context</span>
            <Target className="w-4 h-4 group-hover:text-slate-900" />
          </div>
          <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
            {recommendation.opportunityName}
          </div>
          <div className="text-xs text-slate-500 font-mono">Amount: ${recommendation.opportunityAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* Top 5 Recommendations Produced in this Event */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Top 5 Recommendations Generated in this Session
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">RL policy Q-score evaluation rankings</p>
          </div>
          <span className="text-xs font-mono text-indigo-600 font-semibold">Policy v2.4 Inferences</span>
        </div>

        <div className="space-y-3">
          {recommendation.topRecommendations.map((item) => (
            <div
              key={item.productId}
              className={`p-4 rounded-xl border text-xs space-y-2 transition-colors ${
                item.productId === recommendation.recommendedProductId
                  ? 'bg-indigo-50/40 border-indigo-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                    #{item.rank}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.productName}</span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">({item.productId})</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold block">Agent Score</span>
                  <span className="font-mono font-bold text-indigo-700 text-sm tabular-nums">
                    {item.agentScore.toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-slate-700 text-xs pl-10">{item.productDescription}</p>

              <div className="flex items-center justify-between pl-10 pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span>{item.productFamily}</span>
                  <span>·</span>
                  <span>{item.serviceLine}</span>
                  <span>·</span>
                  <span>Partner: {item.partner}</span>
                </div>
                <span className="font-mono text-emerald-700 font-semibold">{item.estimatedMarginImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Action & Notes */}
      {recommendation.salespersonNotes && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Salesperson Qualitative Feedback Notes
          </h2>
          <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200/80 leading-relaxed font-mono">
            "{recommendation.salespersonNotes}"
          </p>
        </div>
      )}
    </div>
  );
};
