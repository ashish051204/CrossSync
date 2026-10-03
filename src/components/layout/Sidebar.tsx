import React from 'react';
import { NavigationPage } from '../../types';
import {
  LayoutDashboard,
  Sparkles,
  Building2,
  Package,
  Target,
  FileCheck2,
  History,
  BrainCircuit,
  BarChart3,
  Cpu,
  Settings,
  ChevronRight,
  DatabaseZap,
} from 'lucide-react';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  readyExperiencesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  readyExperiencesCount,
}) => {
  const isNavActive = (page: NavigationPage, detailPage?: NavigationPage) => {
    return currentPage === page || (detailPage && currentPage === detailPage);
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs">
            CS
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
              CrossSync
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              RL Cross-Sell Platform
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Section */}
        <div>
          <div className="px-3 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            CrossSync
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('dashboard')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onNavigate('recommend')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('recommend')
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Recommend</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isNavActive('recommend') ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100 text-indigo-700'
              }`}>
                Agent
              </span>
            </button>
          </div>
        </div>

        {/* DATA Section */}
        <div>
          <div className="px-3 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Data
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigate('accounts')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('accounts', 'account-details')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Accounts</span>
            </button>
            <button
              onClick={() => onNavigate('products')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('products', 'product-details')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('opportunities', 'opportunity-details')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Opportunities</span>
            </button>
            <button
              onClick={() => onNavigate('groundtruth')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('groundtruth', 'groundtruth-details')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Cross-Sell GroundTruth</span>
            </button>
          </div>
        </div>

        {/* INSIGHTS Section */}
        <div>
          <div className="px-3 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Insights
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigate('history')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('history', 'recommendation-details')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Recommendation History</span>
            </button>
            <button
              onClick={() => onNavigate('experiences')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('experiences')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <BrainCircuit className="w-4 h-4 text-emerald-600" />
                <span className="truncate">Recommendation Experiences</span>
              </div>
              {readyExperiencesCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold tabular-nums">
                  {readyExperiencesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('analytics')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* SYSTEM Section */}
        <div>
          <div className="px-3 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => onNavigate('rl-agent')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isNavActive('rl-agent', 'model-details')
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>RL Agent / Model</span>
            </button>
            <button
              onClick={() => onNavigate('model-details')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                currentPage === 'model-details'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <DatabaseZap className="w-4 h-4" />
              <span>Model Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Status Footer */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span>Active RL Agent</span>
          <span className="font-mono text-emerald-600 font-semibold">Active</span>
        </div>
        <div className="font-mono text-[11px] text-slate-800 font-medium truncate">
          v2.4-DQN-CrossSell-Policy
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
          <span>Action Space: 10 Prods</span>
          <span>NDCG: 0.81</span>
        </div>
      </div>
    </aside>
  );
};
