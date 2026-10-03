import React, { useState } from 'react';
import { RecommendationExperience, ExperienceStatus } from '../../types';
import {
  BrainCircuit,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  X,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Loader2,
} from 'lucide-react';
import { exportExperiencesToXLSX, filterExperiences } from '../../services/xlsxExportService';
import { storageService } from '../../services/storageService';

interface ExperiencesViewProps {
  experiences: RecommendationExperience[];
  lastExportTime: string;
}

export const ExperiencesView: React.FC<ExperiencesViewProps> = ({
  experiences,
  lastExportTime,
}) => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Detail Modal State
  const [selectedExperience, setSelectedExperience] =
    useState<RecommendationExperience | null>(null);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // RL Training State
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingNotice, setTrainingNotice] = useState<string | null>(null);

  const readyForExportCount = experiences.filter(
    (e) =>
      e.experienceStatus === 'Ready for Export' ||
      e.experienceStatus === 'Recorded'
  ).length;

  const totalExperiencesCount = experiences.length;

  // Filter application
  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch =
      exp.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.recommendedProductName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.recommendationId
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      exp.experienceStatus === statusFilter;

    const matchesOutcome =
      outcomeFilter === 'ALL' ||
      exp.outcome === outcomeFilter;

    let matchesDate = true;

    if (
      dateFrom &&
      exp.timestamp.substring(0, 10) < dateFrom
    ) {
      matchesDate = false;
    }

    if (
      dateTo &&
      exp.timestamp.substring(0, 10) > dateTo
    ) {
      matchesDate = false;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesOutcome &&
      matchesDate
    );
  });

  const handleExportAll = () => {
    setIsExporting(true);

    setTimeout(() => {
      const result = exportExperiencesToXLSX(filteredExperiences);

      setIsExporting(false);

      if (result.success) {
        setExportNotice(
          `Successfully exported ${result.count} experiences to ${result.filename}`
        );

        setTimeout(() => {
          setExportNotice(null);
        }, 5000);
      }
    }, 400);
  };

  const handleTrainRL = () => {
    const trainableExperiences = experiences.filter(
      (exp) =>
        (exp.experienceStatus === 'Ready for Export' ||
          exp.experienceStatus === 'Recorded') &&
        exp.outcome !== 'In Discussion'
    );

    if (trainableExperiences.length === 0) {
      setTrainingNotice(
        'No training experiences are currently available.'
      );

      setTimeout(() => {
        setTrainingNotice(null);
      }, 4000);

      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingNotice(null);

    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;

      setTrainingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        const result = storageService.trainRLModel();

        setIsTraining(false);

        if (result.success) {
          setTrainingNotice(
            `RL training completed successfully. ${result.experiencesTrained} experiences used for ${result.version}.`
          );
        } else {
          setTrainingNotice(result.message);
        }

        setTimeout(() => {
          setTrainingNotice(null);
        }, 5000);
      }
    }, 250);
  };

  const handleStatusChange = (
    id: string,
    newStatus: ExperienceStatus
  ) => {
    storageService.updateExperienceStatus(id, newStatus);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">

      {/* Export Toast Notice */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* RL Training Toast Notice */}
      {trainingNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <BrainCircuit className="w-4 h-4 text-indigo-400" />
          <span>{trainingNotice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>RL Experience Buffer Management</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Recommendation Experiences
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Preserves post-deployment live recommendations and salesperson outcomes as structured training tuples for next-generation RL models.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center gap-2">

          {/* Train RL Button */}
          <button
            onClick={handleTrainRL}
            disabled={isTraining || isExporting}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-98"
          >
            {isTraining ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <BrainCircuit className="w-4 h-4" />
            )}

            <span>
              {isTraining
                ? `Training RL... ${trainingProgress}%`
                : 'Train the RL'}
            </span>
          </button>

          {/* Download Experience Data Button */}
          <button
            onClick={handleExportAll}
            disabled={isExporting || isTraining}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-98"
          >
            <Download className="w-4 h-4 text-emerald-400" />

            <span>
              {isExporting
                ? 'Preparing XLSX...'
                : 'Download Experience Data (.xlsx)'}
            </span>
          </button>

        </div>
      </div>

      {/* Experience Store Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-900">
              Experience Store Overview
            </h2>

            <p className="text-xs text-slate-500">
              Structured recommendation experience records required for future offline RL policy iterations.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs">

            <div>
              <span className="text-slate-400 block text-[11px]">
                Total Experiences
              </span>

              <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                {totalExperiencesCount.toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">
                Ready for Export
              </span>

              <span className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                {readyForExportCount.toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">
                Last Export
              </span>

              <span className="font-mono text-slate-700 text-xs block">
                {lastExportTime}
              </span>
            </div>

          </div>
        </div>

        {/* Learning Architecture Concept Explanation Strip */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700 flex-wrap">

            <span className="font-bold text-slate-900">
              RL Data Loop:
            </span>

            <span>Live Rec</span>

            <span className="text-slate-400">→</span>

            <span>Salesperson Action</span>

            <span className="text-slate-400">→</span>

            <span>Outcome</span>

            <span className="text-slate-400">→</span>

            <span className="text-emerald-700 font-semibold">
              Experience Tuple
            </span>

            <span className="text-slate-400">→</span>

            <span className="text-indigo-700 font-semibold">
              Offline Retraining
            </span>

          </div>

          <span className="text-[11px] text-slate-400">
            Format: Standard Excel (.xlsx) / HDF5 Replay Queue
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-2xs">

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search account, product, experience ID..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto text-xs">

          <div className="flex items-center gap-1.5 text-slate-500">

            <Filter className="w-3.5 h-3.5 text-slate-400" />

            <span>Status:</span>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 py-1.5 px-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="Recorded">Recorded</option>
              <option value="Ready for Export">
                Ready for Export
              </option>
              <option value="Exported">Exported</option>
            </select>

          </div>

          <div className="flex items-center gap-1.5 text-slate-500">

            <span>Outcome:</span>

            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 py-1.5 px-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Outcomes</option>
              <option value="Opportunity">Opportunity</option>
              <option value="Closed-Won">Closed-Won</option>
              <option value="Accepted">Accepted</option>
              <option value="In Discussion">
                In Discussion
              </option>
              <option value="Rejected">Rejected</option>
            </select>

          </div>

          <div className="flex items-center gap-1 text-slate-500">

            <span>From:</span>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 py-1 px-2 text-slate-700"
            />

          </div>

          <div className="flex items-center gap-1 text-slate-500">

            <span>To:</span>

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 py-1 px-2 text-slate-700"
            />

          </div>

          {(searchTerm ||
            statusFilter !== 'ALL' ||
            outcomeFilter !== 'ALL' ||
            dateFrom ||
            dateTo) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setOutcomeFilter('ALL');
                setDateFrom('');
                setDateTo('');
              }}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}

        </div>
      </div>

      {/* Main Experience Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse text-xs">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">

                <th className="py-3 px-4">
                  Experience ID
                </th>

                <th className="py-3 px-4">
                  Timestamp
                </th>

                <th className="py-3 px-4">
                  Account
                </th>

                <th className="py-3 px-4">
                  Current Product
                </th>

                <th className="py-3 px-4">
                  Recommended Product
                </th>

                <th className="py-3 px-4 text-center">
                  Rank
                </th>

                <th className="py-3 px-4 text-right">
                  Agent Score
                </th>

                <th className="py-3 px-4">
                  Sales Action
                </th>

                <th className="py-3 px-4">
                  Outcome
                </th>

                <th className="py-3 px-4 text-right">
                  Reward
                </th>

                <th className="py-3 px-4">
                  Experience Status
                </th>

                <th className="py-3 px-4 text-right">
                  Details
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredExperiences.map((exp) => (
                <tr
                  key={exp.id}
                  onClick={() => setSelectedExperience(exp)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >

                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500 tabular-nums">
                    {exp.id}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px] tabular-nums">
                    {exp.timestamp.substring(0, 16)}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-600">
                    {exp.accountName}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 max-w-[130px] truncate">
                    {exp.currentProductName}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-indigo-900 max-w-[150px] truncate">
                    {exp.recommendedProductName}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      #{exp.rank}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-700 tabular-nums">
                    {exp.agentScore.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">
                      {exp.salespersonAction}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">
                      {exp.outcome}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">

                    <span
                      className={
                        exp.feedbackReward >= 0
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }
                    >
                      {exp.feedbackReward > 0
                        ? `+${exp.feedbackReward.toFixed(1)}`
                        : exp.feedbackReward.toFixed(1)}
                    </span>

                  </td>

                  <td
                    className="py-3.5 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <select
                      value={exp.experienceStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          exp.id,
                          e.target.value as ExperienceStatus
                        )
                      }
                      className={`text-[11px] font-semibold py-1 px-2 rounded border focus:outline-none ${
                        exp.experienceStatus === 'Exported'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : exp.experienceStatus ===
                            'Ready for Export'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Recorded">Recorded</option>
                      <option value="Ready for Export">
                        Ready for Export
                      </option>
                      <option value="Exported">Exported</option>
                    </select>

                  </td>

                  <td className="py-3.5 px-4 text-right">

                    <button
                      onClick={() =>
                        setSelectedExperience(exp)
                      }
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* Experience Detail Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">

            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">

              <div>

                <div className="text-[11px] font-mono text-slate-400">
                  {selectedExperience.id} · Ref:{' '}
                  {selectedExperience.recommendationId}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Recommendation Experience Tuple
                </h3>

              </div>

              <button
                onClick={() =>
                  setSelectedExperience(null)
                }
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">

              {/* Complete Learning Chain */}
              <div>

                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Complete Learning Chain
                </h4>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">
                      Account:
                    </span>

                    <span className="font-bold text-slate-900">
                      {selectedExperience.accountName} (
                      {selectedExperience.industry})
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">
                      Current Product:
                    </span>

                    <span className="font-semibold text-slate-900">
                      {selectedExperience.currentProductName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">
                      Current Opportunity:
                    </span>

                    <span className="font-medium text-slate-800">
                      {selectedExperience.opportunityName} ($
                      {selectedExperience.opportunityAmount.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">
                      RL Recommendation:
                    </span>

                    <span className="font-bold text-indigo-700">
                      #{selectedExperience.rank}{' '}
                      {selectedExperience.recommendedProductName}{' '}
                      (Score:{' '}
                      {selectedExperience.agentScore.toFixed(2)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">
                      Salesperson Action:
                    </span>

                    <span className="font-semibold text-slate-900">
                      {selectedExperience.salespersonAction}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">
                      Commercial Outcome:
                    </span>

                    <span className="font-bold text-slate-900">
                      {selectedExperience.outcome}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1">

                    <span className="text-slate-500">
                      RL Feedback Reward Signal:
                    </span>

                    <span className="font-mono font-bold text-emerald-700">
                      {selectedExperience.feedbackReward > 0
                        ? `+${selectedExperience.feedbackReward.toFixed(1)}`
                        : selectedExperience.feedbackReward.toFixed(1)}
                    </span>

                  </div>

                </div>
              </div>

              {/* State Vector Representation */}
              <div>

                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  State Representation Vector (S)
                </h4>

                <div className="p-3 bg-slate-900 text-indigo-300 font-mono text-[11px] rounded-lg border border-slate-800 break-all">
                  {selectedExperience.stateRepresentationVector}
                </div>

              </div>

              {/* Action Key and State Transition */}
              <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">

                  <span className="text-slate-400 text-[10px] block uppercase font-bold">
                    Action Key (a)
                  </span>

                  <span className="text-slate-900 font-semibold mt-0.5 block truncate">
                    {selectedExperience.actionTaken}
                  </span>

                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">

                  <span className="text-slate-400 text-[10px] block uppercase font-bold">
                    State Transition (s')
                  </span>

                  <span className="text-slate-900 font-semibold mt-0.5 block truncate">
                    {selectedExperience.nextStateTransition}
                  </span>

                </div>

              </div>

              {/* Salesperson Context Notes */}
              {selectedExperience.notes && (
                <div>

                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Salesperson Observation
                  </h4>

                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-xs">
                    "{selectedExperience.notes}"
                  </p>

                </div>
              )}

            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">

              <button
                onClick={() =>
                  setSelectedExperience(null)
                }
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};