import React from 'react';
import {
  Product,
  Account,
  Opportunity,
  GroundTruthRecord,
  RecommendationEvent,
} from '../../types';
import {
  Package,
  ArrowLeft,
  Building2,
  Target,
  FileCheck2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  accounts: Account[];
  opportunities: Opportunity[];
  groundTruth: GroundTruthRecord[];
  recommendations: RecommendationEvent[];
  onBack: () => void;
  onSelectAccount: (accountId: string) => void;
  onSelectOpportunity: (opportunityId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  accounts,
  opportunities,
  groundTruth,
  recommendations,
  onBack,
  onSelectAccount,
  onSelectOpportunity,
}) => {
  // Related accounts using this product
  const relatedAccounts = accounts.filter((a) => a.associatedProductIds.includes(product.id));

  // Related opportunities involving this product
  const relatedOpportunities = opportunities.filter((o) => o.currentProductId === product.id);

  // Recommendations where this product was recommended
  const recommendedEvents = recommendations.filter((r) => r.recommendedProductId === product.id);

  // GroundTruth wins where this product was the cross-sell target
  const groundTruthWins = groundTruth.filter((gt) => gt.crossSellProductId === product.id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation */}
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
              <span>{product.id}</span>
              <span>·</span>
              <span>{product.family}</span>
              <span>·</span>
              <span className="font-semibold text-slate-700">{product.active ? 'Active' : 'Inactive'}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
              {product.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Product Attributes Grid (Exact prompt requirements) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Product Description
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Product Code</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block">{product.productCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Product SKU</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block">{product.sku}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Unit of Measure</span>
              <span className="text-slate-800 mt-0.5 block">{product.unitOfMeasure}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Primary Seller Channel</span>
              <span className="text-slate-800 mt-0.5 block">{product.seller}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Typical Margin</span>
              <span className="font-mono font-bold text-slate-900 mt-0.5 block">{product.typicalMargin}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Service Line</span>
              <span className="text-slate-800 mt-0.5 block">{product.serviceLine}</span>
            </div>
          </div>
        </div>

        {/* Technology & Alliance Partner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs text-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Architecture & Alliances
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500 block">Technology Stack</span>
              <span className="font-semibold text-slate-900 mt-1 block">{product.technology}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500 block">Strategic Partner</span>
              <span className="font-semibold text-slate-900 mt-1 block">{product.partner}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500 block">Classification</span>
              <span className="font-medium text-slate-800 mt-1 block">{product.productClass} · {product.productType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Statistics (Real data from the engine) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900">RL Agent Performance Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-500 block text-[11px]">Times Recommended</span>
            <span className="text-2xl font-mono font-bold text-indigo-700 mt-1 block tabular-nums">
              {recommendedEvents.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Live agent sessions</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-500 block text-[11px]">Historical GroundTruth Wins</span>
            <span className="text-2xl font-mono font-bold text-emerald-700 mt-1 block tabular-nums">
              {groundTruthWins.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Validated customer contracts</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-500 block text-[11px]">Installed Account Base</span>
            <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block tabular-nums">
              {relatedAccounts.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Core deployed clients</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/70">
            <span className="text-slate-500 block text-[11px]">Active Related Pipeline</span>
            <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block tabular-nums">
              {relatedOpportunities.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Open commercial deals</span>
          </div>
        </div>
      </div>

      {/* Related Accounts & Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Related Accounts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Accounts With This Product Installed</h2>
            <span className="text-xs font-mono text-slate-400">{relatedAccounts.length} accounts</span>
          </div>

          {relatedAccounts.length > 0 ? (
            <div className="space-y-2.5">
              {relatedAccounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => onSelectAccount(acc.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-lg border border-slate-200/70 text-xs flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{acc.name}</span>
                    <span className="text-slate-400 text-[11px] block">{acc.industry} · {acc.customerPriority}</span>
                  </div>
                  <span className="font-mono text-slate-600 text-[11px]">{acc.annualRevenue}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
              No accounts currently list this product as primary installed base.
            </div>
          )}
        </div>

        {/* Related Opportunities */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Opportunities Involving This Product</h2>
            <span className="text-xs font-mono text-slate-400">{relatedOpportunities.length} deals</span>
          </div>

          {relatedOpportunities.length > 0 ? (
            <div className="space-y-2.5">
              {relatedOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => onSelectOpportunity(opp.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-lg border border-slate-200/70 text-xs flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{opp.name}</span>
                    <span className="text-slate-400 text-[11px] block">{opp.accountName} · {opp.stage}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    ${opp.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
              No active pipeline deals mapped to this product currently.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
