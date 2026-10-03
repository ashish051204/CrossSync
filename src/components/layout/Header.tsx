import React from 'react';
import { NavigationPage } from '../../types';
import { Sparkles, Download, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  selectedAccountId?: string | null;
  selectedOpportunityId?: string | null;
  onQuickExport?: () => void;
}

const PAGE_TITLES: Record<NavigationPage, string> = {
  dashboard: 'Executive Dashboard',
  recommend: 'Generate RL Recommendation',
  accounts: 'Enterprise Accounts',
  'account-details': 'Account Details',
  products: 'Product Catalog',
  'product-details': 'Product Details',
  opportunities: 'Sales Opportunities',
  'opportunity-details': 'Opportunity Details',
  groundtruth: 'Cross-Sell GroundTruth Data',
  'groundtruth-details': 'GroundTruth Details',
  history: 'Recommendation History',
  'recommendation-details': 'Recommendation Details',
  experiences: 'Recommendation Experiences',
  analytics: 'Recommendation Analytics',
  'rl-agent': 'RL Agent & Model Governance',
  'model-details': 'RL Model Architecture & Parameters',
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onQuickExport,
}) => {
  return (
    <header className="h-16 px-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30">
      {/* Zone 1: Contextual Breadcrumb Trail */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-slate-400">CrossSync</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900 tracking-tight text-sm">
          {PAGE_TITLES[currentPage]}
        </span>
      </div>

      {/* Zone 2: Navigation Links / System Indicators */}
      <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 font-medium">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`hover:text-slate-900 transition-colors ${currentPage === 'dashboard' ? 'text-slate-900 font-semibold' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => onNavigate('recommend')}
          className={`hover:text-indigo-600 transition-colors ${currentPage === 'recommend' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Recommend
        </button>
        <button
          onClick={() => onNavigate('experiences')}
          className={`hover:text-slate-900 transition-colors ${currentPage === 'experiences' ? 'text-slate-900 font-semibold' : ''}`}
        >
          Experience Store
        </button>
        <button
          onClick={() => onNavigate('rl-agent')}
          className={`hover:text-slate-900 transition-colors ${currentPage === 'rl-agent' ? 'text-slate-900 font-semibold' : ''}`}
        >
          Agent Policy
        </button>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3">
        {currentPage !== 'recommend' && (
          <button
            onClick={() => onNavigate('recommend')}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Recommendation</span>
          </button>
        )}
        {currentPage === 'experiences' && onQuickExport && (
          <button
            onClick={onQuickExport}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export XLSX</span>
          </button>
        )}
      </div>
    </header>
  );
};
