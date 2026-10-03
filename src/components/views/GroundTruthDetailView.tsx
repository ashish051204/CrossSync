import React from 'react';
import { GroundTruthRecord } from '../../types';
import { FileCheck2, ArrowLeft, ArrowDown, ArrowRight, Building2, Package, Target } from 'lucide-react';

interface GroundTruthDetailViewProps {
  groundTruth: GroundTruthRecord;
  allGroundTruthForAccount: GroundTruthRecord[];
  onBack: () => void;
  onSelectAccount: (accountId: string) => void;
  onSelectOpportunity: (oppId: string) => void;
}

export const GroundTruthDetailView: React.FC<GroundTruthDetailViewProps> = ({
  groundTruth,
  allGroundTruthForAccount,
  onBack,
  onSelectAccount,
  onSelectOpportunity,
}) => {
  // Sort ground truth for this opportunity/account by rank
  const rankedItems = [...allGroundTruthForAccount].sort((a, b) => a.crossSellRank - b.crossSellRank);

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
              <span>{groundTruth.id}</span>
              <span>·</span>
              <span>{groundTruth.closedQuarter}</span>
              <span>·</span>
              <span className="font-semibold text-amber-700">Historical GroundTruth</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              GroundTruth: {groundTruth.accountName}
            </h1>
          </div>
        </div>
      </div>

      {/* Explicit Distinction Notice */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
        <div className="font-bold flex items-center gap-2 text-amber-950">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Historical Deal GroundTruth (Offline Baseline)</span>
        </div>
        <p className="text-amber-800 text-[11px] leading-relaxed">
          This data represents actual closed sales historical sequences harvested from enterprise CRM records. It is distinct from live RL agent recommendations and is used for supervised warm-starting and policy benchmarking.
        </p>
      </div>

      {/* Visual Flow Representation (Explicitly requested in Section 14) */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xs space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Historical Cross-Sell Sequence Architecture
        </h2>

        {/* Visual Workflow Cards */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Account Box */}
          <div
            onClick={() => onSelectAccount(groundTruth.accountId)}
            className="w-full md:w-1/3 bg-slate-50 p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[11px]">Account</span>
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-slate-900 text-sm">{groundTruth.accountName}</div>
            <div className="text-[11px] font-mono text-slate-500">{groundTruth.accountId}</div>
          </div>

          <div className="hidden md:block text-slate-300">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="md:hidden text-slate-300">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Opportunity Box */}
          <div
            onClick={() => onSelectOpportunity(groundTruth.opportunityId)}
            className="w-full md:w-1/3 bg-slate-50 p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[11px]">Opportunity</span>
              <Target className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-slate-900 text-sm">{groundTruth.opportunityId}</div>
            <div className="text-[11px] text-slate-500">Representative: {groundTruth.salesRepresentative}</div>
          </div>

          <div className="hidden md:block text-slate-300">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="md:hidden text-slate-300">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Current Product Box */}
          <div className="w-full md:w-1/3 bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-bold uppercase tracking-wider text-[11px]">Current Product</span>
              <Package className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-slate-900 text-sm">{groundTruth.currentProduct}</div>
            <div className="text-[11px] font-mono text-slate-500">{groundTruth.currentProductId}</div>
          </div>
        </div>

        {/* Historical Cross-Sell Visual List */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Historical Cross-Sell Ranked Products
            </h3>
            <span className="text-xs text-slate-400">Verified CRM Closed Deals</span>
          </div>

          <div className="space-y-3">
            {rankedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                    #{item.crossSellRank}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{item.crossSellProduct}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Family: {item.crossSellProductFamily} · ID: <span className="font-mono">{item.crossSellProductId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-auto text-right">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Historical Win Rate</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{item.historicalWinRate}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Realized Revenue</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ${item.closedRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
