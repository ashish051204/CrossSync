import React from 'react';
import {
  Opportunity,
  Account,
  Product,
  GroundTruthRecord,
  RecommendationEvent,
} from '../../types';
import {
  Target,
  ArrowLeft,
  Sparkles,
  Building2,
  Package,
  FileCheck2,
  History,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  account?: Account;
  currentProduct?: Product;
  groundTruth: GroundTruthRecord[];
  recommendations: RecommendationEvent[];
  onBack: () => void;
  onNavigateToRecommend: (accountId: string, opportunityId: string) => void;
  onSelectAccount: (accountId: string) => void;
  onSelectProduct: (productId: string) => void;
  onSelectRecommendation: (recId: string) => void;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  opportunity,
  account,
  currentProduct,
  groundTruth,
  recommendations,
  onBack,
  onNavigateToRecommend,
  onSelectAccount,
  onSelectProduct,
  onSelectRecommendation,
}) => {
  const oppGroundTruth = groundTruth.filter((gt) => gt.opportunityId === opportunity.id);
  const oppRecommendations = recommendations.filter((r) => r.opportunityId === opportunity.id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>{opportunity.id}</span>
              <span>·</span>
              <span>{opportunity.stage}</span>
              <span>·</span>
              <span>Forecast: {opportunity.forecastCategory}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              {opportunity.name}
            </h1>
          </div>
        </div>

        <button
          onClick={() => onNavigateToRecommend(opportunity.accountId, opportunity.id)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Recommendation for Opportunity</span>
        </button>
      </div>

      {/* Main Attributes Grid (All prompt required fields) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Financials & Stages */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Opportunity Financials & Contract Terms
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Deal Amount</span>
              <span className="font-mono text-lg font-bold text-slate-900 mt-0.5 block tabular-nums">
                ${opportunity.amount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Target Close Date</span>
              <span className="font-mono font-semibold text-slate-800 mt-0.5 block tabular-nums">
                {opportunity.closeDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Win Probability</span>
              <span className="font-mono font-semibold text-slate-800 mt-0.5 block tabular-nums">
                {opportunity.probability}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Opportunity Score</span>
              <span className="font-mono font-bold text-indigo-700 mt-0.5 block tabular-nums">
                {opportunity.opportunityScore} / 100
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Gross Margin</span>
              <span className="font-mono font-bold text-slate-900 mt-0.5 block tabular-nums">
                {opportunity.margin}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contribution Margin (CM %)</span>
              <span className="font-mono font-bold text-slate-900 mt-0.5 block tabular-nums">
                {opportunity.cmPercent}%
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Opportunity Type</span>
              <span className="text-slate-800 mt-0.5 block">{opportunity.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contract Structure</span>
              <span className="text-slate-800 mt-0.5 block">{opportunity.contract}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Lead Source</span>
              <span className="text-slate-800 mt-0.5 block">{opportunity.leadSource}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Project Value</span>
              <span className="font-mono text-slate-800 mt-0.5 block">${opportunity.projectValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Order Type</span>
              <span className="text-slate-800 mt-0.5 block">{opportunity.orderType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Engagement Type</span>
              <span className="text-slate-800 mt-0.5 block">{opportunity.engagementType}</span>
            </div>
          </div>
        </div>

        {/* Account & Current Product Link Cards */}
        <div className="space-y-4">
          {/* Account Card */}
          <div
            onClick={() => account && onSelectAccount(account.id)}
            className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-2xs hover:border-slate-300 cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Customer Account
              </span>
              <Building2 className="w-4 h-4 group-hover:text-slate-900" />
            </div>
            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
              {opportunity.accountName}
            </div>
            <div className="text-xs text-slate-500">
              {account?.industry} · {account?.region}
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
              ID: {opportunity.accountId} · Rev: {account?.annualRevenue}
            </div>
          </div>

          {/* Current Product Card */}
          <div
            onClick={() => currentProduct && onSelectProduct(currentProduct.id)}
            className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 shadow-2xs hover:border-slate-300 cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Installed / Current Product
              </span>
              <Package className="w-4 h-4 group-hover:text-slate-900" />
            </div>
            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
              {opportunity.currentProduct}
            </div>
            <div className="text-xs text-slate-500">
              {currentProduct?.family} · {currentProduct?.serviceLine}
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
              ID: {opportunity.currentProductId} · Partner: {currentProduct?.partner}
            </div>
          </div>
        </div>
      </div>

      {/* Historical GroundTruth & Previous Recommendations for Opportunity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Associated Historical GroundTruth */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Historical Cross-Sell GroundTruth</h2>
            <span className="text-xs font-mono text-slate-400">{oppGroundTruth.length} records</span>
          </div>

          {oppGroundTruth.length > 0 ? (
            <div className="space-y-3">
              {oppGroundTruth.map((gt) => (
                <div key={gt.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">#{gt.crossSellRank} {gt.crossSellProduct}</span>
                    <span className="font-mono text-emerald-700 font-semibold">{gt.historicalWinRate}% Win Rate</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Revenue: ${gt.closedRevenue.toLocaleString()} ({gt.closedQuarter})</span>
                    <span>Rep: {gt.salesRepresentative}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
              No historical GroundTruth logged directly under this deal ID.
            </div>
          )}
        </div>

        {/* Previous Recommendations for this Opportunity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Previous RL Recommendations</h2>
            <span className="text-xs font-mono text-slate-400">{oppRecommendations.length} events</span>
          </div>

          {oppRecommendations.length > 0 ? (
            <div className="space-y-3">
              {oppRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onSelectRecommendation(rec.id)}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-lg border border-slate-200/70 text-xs space-y-1.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">{rec.recommendedProductName}</span>
                    <span className="font-mono text-indigo-600 font-semibold">Score: {rec.agentScore.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Action: <strong className="text-slate-800">{rec.salespersonAction}</strong></span>
                    <span>Outcome: <strong className="text-slate-800">{rec.outcome}</strong></span>
                    <span className="font-mono">{rec.timestamp.substring(0, 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
              No prior recommendations logged for this opportunity yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
