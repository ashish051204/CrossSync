import React from 'react';
import { ModelVersion, NavigationPage } from '../../types';
import {
  Cpu,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
  GitBranch,
  ShieldCheck,
  CheckCircle,
  FileCode2,
} from 'lucide-react';

interface RLAgentViewProps {
  modelInfo: ModelVersion;
  onNavigateToModelDetails: () => void;
  readyExperiencesCount: number;
}

export const RLAgentView: React.FC<RLAgentViewProps> = ({
  modelInfo,
  onNavigateToModelDetails,
  readyExperiencesCount,
}) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical System Administration</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            RL Agent & Policy Deployment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Architecture, action space geometry, contextual state space embeddings, and model weights governing CrossSync live recommendations.
          </p>
        </div>

        <button
          onClick={onNavigateToModelDetails}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>View Model Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Active Model Snapshot Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Active Production Checkpoint
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold font-mono text-slate-900">
                {modelInfo.version}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold font-mono">
                {modelInfo.status}
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            Deployed: <span className="font-mono font-medium text-slate-800">{modelInfo.deployedDate}</span>
          </div>
        </div>

        {/* Algorithm & Core Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px]">RL Algorithm Formulation</span>
            <span className="font-semibold text-slate-900 block leading-relaxed">{modelInfo.algorithm}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px]">Underlying Framework</span>
            <span className="font-mono font-medium text-slate-900 block">{modelInfo.framework}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 block text-[11px]">Checkpoint Path</span>
            <span className="font-mono text-slate-600 block text-[11px] truncate">{modelInfo.modelCheckpointsPath}</span>
          </div>
        </div>

        {/* Action & State Space Dimensions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">Action Space Size (A)</span>
            <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block tabular-nums">
              {modelInfo.actionSpaceSize} Products
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Catalog candidate products</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">State Space Dimensions (S)</span>
            <span className="text-2xl font-mono font-bold text-slate-900 mt-1 block tabular-nums">
              {modelInfo.stateSpaceDim} Features
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Account & deal context embedding</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">HitRate@5 Accuracy</span>
            <span className="text-2xl font-mono font-bold text-indigo-700 mt-1 block tabular-nums">
              {modelInfo.hitRateAt5}%
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Cross-sell target in Top 5</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 block text-[11px]">Ranking Quality (NDCG@5)</span>
            <span className="text-2xl font-mono font-bold text-emerald-700 mt-1 block tabular-nums">
              {modelInfo.ndcgAt5}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Discounted cumulative gain</span>
          </div>
        </div>
      </div>

      {/* Feature Weights & Context Importance */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Context Feature Importance Weights</h2>
        <p className="text-xs text-slate-500">
          Policy network sensitivity analysis across business context signals.
        </p>

        <div className="space-y-3 pt-2">
          {modelInfo.featureWeights.map((fw) => (
            <div key={fw.feature} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-medium">{fw.feature}</span>
                <span className="font-mono font-bold text-slate-900">{Math.round(fw.weight * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${fw.weight * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retraining Queue & Next Version Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Next Retraining Batch Queue</h2>
          <span className="text-xs font-mono font-semibold text-emerald-700">
            {readyExperiencesCount} Ready Experiences
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          When authorized sales managers export experiences as XLSX or dump replay buffers to HDF5, offline training jobs consume the pending experience records to gradient-update the Q-network into version v2.5.
        </p>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 text-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-indigo-600" />
            <div>
              <span className="font-bold text-slate-900 block">Planned Model Version: v2.5-DQN-ExperienceBuffer</span>
              <span className="text-slate-500 text-[11px]">Target Deployment: Scheduled for Q4 2026 Batch Retraining</span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Target Replay: 50,000 steps</span>
        </div>
      </div>
    </div>
  );
};
