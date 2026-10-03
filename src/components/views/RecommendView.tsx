import React, { useState, useEffect } from 'react';
import {
  Account,
  Product,
  Opportunity,
  RecommendationRecommendationItem,
  RecommendationEvent,
  NavigationPage,
} from '../../types';
import { storageService } from '../../services/storageService';
import { OutcomeModal } from '../common/OutcomeModal';
import {
  Sparkles,
  Building2,
  Package,
  Target,
  ArrowRight,
  CheckCircle,
  XCircle,
  HelpCircle,
  Cpu,
  Layers,
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

interface RecommendViewProps {
  accounts: Account[];
  products: Product[];
  opportunities: Opportunity[];
  preselectedAccountId?: string | null;
  preselectedOpportunityId?: string | null;
  onNavigate: (page: NavigationPage) => void;
  onViewRecommendationDetails: (id: string) => void;
}

export const RecommendView: React.FC<RecommendViewProps> = ({
  accounts,
  products,
  opportunities,
  preselectedAccountId,
  preselectedOpportunityId,
  onNavigate,
  onViewRecommendationDetails,
}) => {
  // Step 1: Account
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    preselectedAccountId || (accounts.length > 0 ? accounts[0].id : '')
  );

  // Step 2: Current Product
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Step 3: Current Opportunity
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>(
    preselectedOpportunityId || ''
  );

  // RL Evaluation State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationStage, setEvaluationStage] = useState<string>('');
  const [recommendations, setRecommendations] = useState<RecommendationRecommendationItem[] | null>(null);
  const [activeRecommendationEvent, setActiveRecommendationEvent] = useState<RecommendationEvent | null>(null);

  // Outcome Modal State
  const [modalItem, setModalItem] = useState<RecommendationRecommendationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  // Filter opportunities for selected account
  const accountOpportunities = opportunities.filter((o) => o.accountId === selectedAccountId);

  // Auto-select or adjust opportunity when account changes
  useEffect(() => {
    if (accountOpportunities.length > 0) {
      const match = preselectedOpportunityId && accountOpportunities.find((o) => o.id === preselectedOpportunityId);
      const chosenOpp = match ? match : accountOpportunities[0];
      setSelectedOpportunityId(chosenOpp.id);
      setSelectedProductId(chosenOpp.currentProductId);
    } else {
      setSelectedOpportunityId('');
      if (selectedAccount && selectedAccount.associatedProductIds.length > 0) {
        setSelectedProductId(selectedAccount.associatedProductIds[0]);
      } else if (products.length > 0) {
        setSelectedProductId(products[0].id);
      }
    }
  }, [selectedAccountId]);

  // When selected opportunity changes, update current product
  useEffect(() => {
    const opp = opportunities.find((o) => o.id === selectedOpportunityId);
    if (opp && opp.currentProductId) {
      setSelectedProductId(opp.currentProductId);
    }
  }, [selectedOpportunityId]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedOpportunity = opportunities.find((o) => o.id === selectedOpportunityId);

  // Run the RL Recommendation engine
  const handleGenerateRecommendations = () => {
    if (!selectedAccountId || !selectedProductId || !selectedOpportunityId) return;

    setIsEvaluating(true);
    setRecommendations(null);

    setEvaluationStage('Constructing 48-dim account and deal state vector...');
    setTimeout(() => {
      setEvaluationStage('Filtering action space with contextual constraints...');
      setTimeout(() => {
        setEvaluationStage('Evaluating Q-values via policy network v2.4...');
        setTimeout(() => {
          const top5 = storageService.generateRLRecommendations(
            selectedAccountId,
            selectedProductId,
            selectedOpportunityId
          );
          // Persist the recommendation event & initial experience
          const event = storageService.saveRecommendation(
            selectedAccountId,
            selectedProductId,
            selectedOpportunityId,
            top5
          );

          setRecommendations(top5);
          setActiveRecommendationEvent(event);
          setIsEvaluating(false);
          setEvaluationStage('');
        }, 350);
      }, 350);
    }, 400);
  };

  const handleOpenOutcome = (item: RecommendationRecommendationItem) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleQuickAction = (
    item: RecommendationRecommendationItem,
    action: 'Accepted' | 'Rejected'
  ) => {
    if (!activeRecommendationEvent) return;
    const outcome = action === 'Accepted' ? 'Opportunity' : 'Rejected';
    storageService.recordSalespersonResponse(
      activeRecommendationEvent.id,
      action,
      outcome,
      item.rank,
      item.productId,
      `Quick ${action.toLowerCase()} from recommendation panel`
    );

    setSuccessToast(`Recorded ${action} outcome for "${item.productName}". Experience saved.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSaveModalOutcome = (
    action: 'Accepted' | 'Rejected' | 'Adjusted Priority',
    outcome: 'Accepted' | 'Rejected' | 'Opportunity' | 'Closed-Won' | 'In Discussion',
    notes: string
  ) => {
    if (!activeRecommendationEvent || !modalItem) return;
    storageService.recordSalespersonResponse(
      activeRecommendationEvent.id,
      action,
      outcome,
      modalItem.rank,
      modalItem.productId,
      notes
    );

    setSuccessToast(`Experience successfully recorded and queued for RL retraining export.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Sales Workspace</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Generate Cross-Sell Recommendation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure current customer and opportunity context to receive real-time calibrated Top 5 cross-sell products from the RL agent.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
            Active Policy: v2.4-DQN
          </span>
        </div>
      </div>

      {/* 4 Context Selection Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Select Account */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Account
              </h2>
            </div>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Account Identifier & Name
            </label>
            <div className="relative">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full text-xs font-semibold rounded-lg border border-slate-300 py-2.5 px-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none pr-8 cursor-pointer"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.id} — {acc.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {selectedAccount && (
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Industry:</span>
                <span className="font-semibold text-slate-900 text-right">{selectedAccount.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sector:</span>
                <span className="font-medium text-slate-800 text-right">{selectedAccount.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Region:</span>
                <span className="text-slate-800">{selectedAccount.region} ({selectedAccount.subregion})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Priority:</span>
                <span className="font-semibold text-slate-900">{selectedAccount.customerPriority}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-200/60">
                <span className="text-slate-500">Annual Revenue:</span>
                <span className="font-mono font-semibold text-slate-900">{selectedAccount.annualRevenue}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Current Product */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Current Product
              </h2>
            </div>
            <Package className="w-4 h-4 text-slate-400" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Installed / Core Product
            </label>
            <div className="relative">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full text-xs font-semibold rounded-lg border border-slate-300 py-2.5 px-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none pr-8 cursor-pointer"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.id} — {prod.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {selectedProduct && (
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 text-xs space-y-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Product Description:</span>
                <p className="text-slate-700 text-[11px] line-clamp-2 mt-0.5">{selectedProduct.description}</p>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Product Family:</span>
                <span className="font-semibold text-slate-900">{selectedProduct.family}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Line:</span>
                <span className="text-slate-800">{selectedProduct.serviceLine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Technology:</span>
                <span className="text-slate-800 truncate max-w-[160px] text-right">{selectedProduct.technology}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alliance Partner:</span>
                <span className="font-medium text-slate-800">{selectedProduct.partner}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Current Opportunity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Current Opportunity
              </h2>
            </div>
            <Target className="w-4 h-4 text-slate-400" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Active Deal Context
            </label>
            <div className="relative">
              <select
                value={selectedOpportunityId}
                onChange={(e) => setSelectedOpportunityId(e.target.value)}
                className="w-full text-xs font-semibold rounded-lg border border-slate-300 py-2.5 px-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 appearance-none pr-8 cursor-pointer"
              >
                {accountOpportunities.length > 0 ? (
                  accountOpportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.id} — {opp.name}
                    </option>
                  ))
                ) : (
                  opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.id} — {opp.name}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {selectedOpportunity && (
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Deal Amount:</span>
                <span className="font-mono font-bold text-slate-900">
                  ${selectedOpportunity.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stage:</span>
                <span className="font-semibold text-slate-800">{selectedOpportunity.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Win Probability:</span>
                <span className="font-mono text-slate-700">{selectedOpportunity.probability}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Margin:</span>
                <span className="font-mono text-slate-900 font-semibold">{selectedOpportunity.margin}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contribution Margin (CM %):</span>
                <span className="font-mono text-slate-900 font-semibold">{selectedOpportunity.cmPercent}%</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">Order / Engagement:</span>
                <span className="text-slate-700 text-right truncate max-w-[170px]">
                  {selectedOpportunity.orderType} · {selectedOpportunity.engagementType}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 4: Business Context Summary Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Business Context Summary (Input to RL Agent)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Context Vector Size: 48 dims</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Account column */}
          <div className="space-y-1.5 border-l-2 border-indigo-500 pl-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Account</div>
            <div className="font-bold text-slate-900 text-sm">{selectedAccount?.name}</div>
            <div className="text-slate-600">Industry: <span className="font-medium text-slate-800">{selectedAccount?.industry}</span></div>
            <div className="text-slate-600">Sector: <span className="font-medium text-slate-800">{selectedAccount?.sector}</span></div>
            <div className="text-slate-600">Priority: <span className="font-medium text-slate-800">{selectedAccount?.customerPriority}</span></div>
          </div>

          {/* Current Product column */}
          <div className="space-y-1.5 border-l-2 border-indigo-500 pl-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Current Product</div>
            <div className="font-bold text-slate-900 text-sm">{selectedProduct?.name}</div>
            <div className="text-slate-600">Family: <span className="font-medium text-slate-800">{selectedProduct?.family}</span></div>
            <div className="text-slate-600">Technology: <span className="font-medium text-slate-800">{selectedProduct?.technology}</span></div>
            <div className="text-slate-600 line-clamp-1">{selectedProduct?.description}</div>
          </div>

          {/* Opportunity column */}
          <div className="space-y-1.5 border-l-2 border-indigo-500 pl-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Opportunity</div>
            <div className="font-bold text-slate-900 text-sm">{selectedOpportunity?.name}</div>
            <div className="text-slate-600">
              Amount: <span className="font-mono font-bold text-slate-900">${selectedOpportunity?.amount.toLocaleString()}</span>
              {' · '}Stage: <span className="font-medium text-slate-800">{selectedOpportunity?.stage}</span>
            </div>
            <div className="text-slate-600">
              Margin: <span className="font-mono font-medium text-slate-900">{selectedOpportunity?.margin}%</span>
              {' · '}CM%: <span className="font-mono font-medium text-slate-900">{selectedOpportunity?.cmPercent}%</span>
            </div>
            <div className="text-slate-600 truncate">
              {selectedOpportunity?.orderType} ({selectedOpportunity?.engagementType})
            </div>
          </div>
        </div>

        {/* Step 5: Primary Recommend Button & Action Center */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-400" />
            <span>RL Agent will eliminate same-product candidates and return the Top 5 cross-sell opportunities.</span>
          </div>

          <button
            onClick={handleGenerateRecommendations}
            disabled={isEvaluating}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl shadow-md transition-all whitespace-nowrap active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEvaluating ? 'Evaluating RL Policy...' : 'Recommend'}</span>
          </button>
        </div>
      </div>

      {/* Evaluating Loading State */}
      {isEvaluating && (
        <div className="bg-white rounded-xl border border-indigo-200 p-8 shadow-xs text-center space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">RL Agent Evaluating State Space</h3>
            <p className="text-xs font-mono text-indigo-600 mt-1">{evaluationStage}</p>
          </div>
          <div className="max-w-md mx-auto w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Step 6: Top 5 Cross-Sell Recommendations Results */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommendation Results</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Top 5 Cross-Sell Product Recommendations
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              Evaluated for: <span className="font-semibold text-slate-800">{selectedAccount?.name}</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {recommendations.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all p-5 shadow-2xs space-y-4 group"
              >
                {/* Top Row: Rank, Product Name, Agent Score, Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center shrink-0">
                      #{item.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.productName}
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">({item.productId})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                        <span className="font-semibold text-slate-700">{item.productFamily}</span>
                        <span>·</span>
                        <span>{item.serviceLine}</span>
                        <span>·</span>
                        <span className="text-slate-600 font-mono">{item.partner}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Score Box (Explicit Prompt Constraint: Agent Score or Recommendation Score, NOT probability) */}
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Agent Score
                      </div>
                      <div className="text-xl font-bold font-mono text-indigo-700 tabular-nums">
                        {item.agentScore.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Description & Contextual Synergy Rationale */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50/70 rounded-lg p-3.5 border border-slate-200/60">
                  <div className="md:col-span-2 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Product Description
                    </div>
                    <p className="text-slate-700 leading-relaxed">{item.productDescription}</p>
                    <div className="text-[11px] text-slate-500 pt-1">
                      <strong className="text-slate-700">Technology Architecture:</strong> {item.technology}
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t md:border-t-0 md:border-l md:border-slate-200 md:pl-4 pt-2 md:pt-0">
                    <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
                      RL Synergy Rationale
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {item.synergyReasoning}
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-mono text-[11px] font-semibold text-emerald-700">
                      <span>{item.estimatedMarginImpact}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Response feedback trains future RL checkpoints</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickAction(item, 'Rejected')}
                      className="px-3.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction(item, 'Accepted')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleOpenOutcome(item)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Record Outcome...</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outcome Recording Modal */}
      <OutcomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recommendationItem={modalItem}
        accountName={selectedAccount?.name || ''}
        opportunityName={selectedOpportunity?.name || ''}
        onSave={handleSaveModalOutcome}
      />
    </div>
  );
};
