import React from 'react';
import { ModelVersion } from '../../types';
import {
  Cpu,
  ArrowLeft,
  GitBranch,
  Layers,
  Database,
  Sliders,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';

interface ModelDetailViewProps {
  modelInfo: ModelVersion;
  allVersions: ModelVersion[];
  onBack: () => void;
}

export const ModelDetailView: React.FC<ModelDetailViewProps> = ({
  modelInfo,
  allVersions,
  onBack,
}) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
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
              <span>Model Architecture Specifications</span>
              <span>·</span>
              <span className="font-semibold text-emerald-700">{modelInfo.status}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5 font-mono">
              {modelInfo.version}
            </h1>
          </div>
        </div>
      </div>

      {/* Hyperparameters & Training Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Evaluation Summary & Benchmark Results
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200/80">
            {modelInfo.evaluationSummary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Training Episodes</span>
              <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block tabular-nums">
                {modelInfo.totalTrainingEpisodes.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Experience Tuples</span>
              <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block tabular-nums">
                {modelInfo.experiencesTrainedOn.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mean Reciprocal Rank (MRR)</span>
              <span className="font-mono font-bold text-indigo-700 text-sm mt-0.5 block tabular-nums">
                {modelInfo.mrr}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Avg Reward / Session</span>
              <span className="font-mono font-bold text-emerald-700 text-sm mt-0.5 block tabular-nums">
                +{modelInfo.avgRewardPerSession}
              </span>
            </div>
          </div>
        </div>

        {/* Hyperparameters Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3.5 shadow-2xs text-xs">
          <div className="flex items-center justify-between text-slate-700 font-bold uppercase tracking-wider text-xs">
            <span>Hyperparameters</span>
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-sans">Learning Rate (α):</span>
              <span className="font-bold text-slate-900">{modelInfo.hyperparameters.learningRate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-sans">Discount Factor (γ):</span>
              <span className="font-bold text-slate-900">{modelInfo.hyperparameters.gammaDiscount}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-sans">Exploration (ε-greedy):</span>
              <span className="font-bold text-slate-900">{modelInfo.hyperparameters.epsilonGreedy}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-sans">Batch Size:</span>
              <span className="font-bold text-slate-900">{modelInfo.hyperparameters.batchSize}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-sans">Target Net Update Freq:</span>
              <span className="font-bold text-slate-900">{modelInfo.hyperparameters.targetUpdateFreq} steps</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-sans">Replay Buffer Cap:</span>
              <span className="font-bold text-slate-900">{modelInfo.hyperparameters.replayBufferSize.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Version History Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">RL Agent Version Evolution</h2>
            <p className="text-xs text-slate-500 mt-0.5">Chronological comparison of models, algorithms, and benchmark lifts</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{allVersions.length} Model Checkpoints</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Algorithm Architecture</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">HitRate@5</th>
                <th className="py-3 px-4 text-right">NDCG@5</th>
                <th className="py-3 px-4 text-right">MRR</th>
                <th className="py-3 px-4 text-right">Experiences</th>
                <th className="py-3 px-4">Deployment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allVersions.map((ver) => (
                <tr
                  key={ver.version}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    ver.status === 'Active / Deployed' ? 'bg-indigo-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {ver.version}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-[240px] truncate">
                    {ver.algorithm}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                      ver.status === 'Active / Deployed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ver.status === 'Staging'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ver.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {ver.hitRateAt5}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-700 tabular-nums">
                    {ver.ndcgAt5}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-700 tabular-nums">
                    {ver.mrr}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 tabular-nums">
                    {ver.experiencesTrainedOn.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {ver.deployedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
