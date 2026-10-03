import React from 'react';
import {
  Account,
  Product,
  Opportunity,
  GroundTruthRecord,
  RecommendationEvent,
  NavigationPage,
} from '../../types';
import {
  Building2,
  Sparkles,
  ArrowLeft,
  Package,
  Target,
  FileCheck2,
  History,
  CheckCircle2,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
} from 'lucide-react';

interface AccountDetailViewProps {
  account: Account;
  products: Product[];
  opportunities: Opportunity[];
  groundTruth: GroundTruthRecord[];
  recommendations: RecommendationEvent[];
  onBack: () => void;
  onNavigateToRecommend: (accountId: string) => void;
  onSelectProduct: (productId: string) => void;
  onSelectOpportunity: (opportunityId: string) => void;
  onSelectRecommendation: (recId: string) => void;
}

export const AccountDetailView: React.FC<AccountDetailViewProps> = ({
  account,
  products,
  opportunities,
  groundTruth,
  recommendations,
  onBack,
  onNavigateToRecommend,
  onSelectProduct,
  onSelectOpportunity,
  onSelectRecommendation,
}) => {
  const accountOpportunities = opportunities.filter((o) => o.accountId === account.id);
  const accountProducts = products.filter((p) => account.associatedProductIds.includes(p.id));
  const accountGroundTruth = groundTruth.filter((gt) => gt.accountId === account.id);
  const accountRecs = recommendations.filter((r) => r.accountId === account.id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation & Primary CTA */}
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
              <span>{account.id}</span>
              <span>·</span>
              <span>{account.customerPriority}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              {account.name}
            </h1>
          </div>
        </div>

        <button
          onClick={() => onNavigateToRecommend(account.id)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Recommendation for Account</span>
        </button>
      </div>

      {/* Section 1: Account Overview & Attributes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Bio */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
            Account Overview
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{account.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Headquarters</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{account.headquarters}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Annual Revenue</span>
              <span className="font-mono font-bold text-slate-900 mt-0.5 block">{account.annualRevenue}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Total Headcount</span>
              <span className="font-mono text-slate-800 mt-0.5 block">{account.employees.toLocaleString()} employees</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Global Sites</span>
              <span className="font-mono text-slate-800 mt-0.5 block">{account.locations} locations</span>
            </div>
          </div>
        </div>

        {/* Business Attributes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3.5 shadow-2xs text-xs">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
            Business Attributes
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Industry:</span>
              <span className="font-semibold text-slate-800">{account.industry}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Sector:</span>
              <span className="font-medium text-slate-800">{account.sector}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Rating:</span>
              <span className="font-semibold text-slate-900">{account.rating}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Ownership:</span>
              <span className="text-slate-700">{account.ownership}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Account Type:</span>
              <span className="text-slate-700">{account.type}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Sales State:</span>
              <span className="font-semibold text-indigo-700">{account.salesState}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Associated Products (Installed Base) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Associated Products (Installed Base)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Current systems deployed forming the baseline for cross-sell recommendations</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{accountProducts.length} Products</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accountProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod.id)}
              className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer text-xs space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {prod.name}
                </span>
                <span className="font-mono text-slate-400">{prod.id}</span>
              </div>
              <p className="text-slate-600 text-[11px] line-clamp-2">{prod.description}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>{prod.family}</span>
                <span>·</span>
                <span>{prod.technology}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Associated Opportunities */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Associated Opportunities</h2>
            <p className="text-xs text-slate-500 mt-0.5">Active commercial deals tied to this account</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{accountOpportunities.length} Deals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Opportunity</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4">Stage</th>
                <th className="py-2.5 px-4 text-right">Margin %</th>
                <th className="py-2.5 px-4 text-right">CM %</th>
                <th className="py-2.5 px-4">Close Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accountOpportunities.map((opp) => (
                <tr
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">{opp.name}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${opp.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{opp.stage}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">{opp.margin}%</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">{opp.cmPercent}%</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px] tabular-nums">{opp.closeDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Historical Cross-Sell & Recent Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historical Cross-Sell GroundTruth */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Historical Cross-Sell GroundTruth</h2>
            <span className="text-xs text-slate-400 font-mono">{accountGroundTruth.length} records</span>
          </div>

          {accountGroundTruth.length > 0 ? (
            <div className="space-y-3">
              {accountGroundTruth.map((gt) => (
                <div key={gt.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">#{gt.crossSellRank} {gt.crossSellProduct}</span>
                    <span className="font-mono text-emerald-700 font-semibold">{gt.historicalWinRate}% Win Rate</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    From current: <span className="text-slate-700">{gt.currentProduct}</span> · Closed Revenue: ${gt.closedRevenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
              No historical GroundTruth records logged for this account yet.
            </div>
          )}
        </div>

        {/* Live Recommendation Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Recent RL Recommendations</h2>
            <span className="text-xs text-slate-400 font-mono">{accountRecs.length} events</span>
          </div>

          {accountRecs.length > 0 ? (
            <div className="space-y-3">
              {accountRecs.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onSelectRecommendation(rec.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-lg border border-slate-200/70 text-xs space-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-900">{rec.recommendedProductName}</span>
                    <span className="font-mono text-indigo-600 font-semibold">Score: {rec.agentScore.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Outcome: <strong className="text-slate-700">{rec.outcome}</strong></span>
                    <span className="font-mono">{rec.timestamp.substring(0, 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
              No live RL recommendations generated for this account yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
