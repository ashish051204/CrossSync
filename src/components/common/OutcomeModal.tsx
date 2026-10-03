import React, { useState } from 'react';
import { RecommendationRecommendationItem } from '../../types';
import { Check, X, ArrowUpRight, MessageSquare } from 'lucide-react';

interface OutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendationItem: RecommendationRecommendationItem | null;
  accountName: string;
  opportunityName: string;
  onSave: (
    action: 'Accepted' | 'Rejected' | 'Adjusted Priority',
    outcome: 'Accepted' | 'Rejected' | 'Opportunity' | 'Closed-Won' | 'In Discussion',
    notes: string
  ) => void;
}

export const OutcomeModal: React.FC<OutcomeModalProps> = ({
  isOpen,
  onClose,
  recommendationItem,
  accountName,
  opportunityName,
  onSave,
}) => {
  const [action, setAction] = useState<'Accepted' | 'Rejected' | 'Adjusted Priority'>('Accepted');
  const [outcome, setOutcome] = useState<'Accepted' | 'Rejected' | 'Opportunity' | 'Closed-Won' | 'In Discussion'>('Opportunity');
  const [notes, setNotes] = useState('');

  if (!isOpen || !recommendationItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(action, outcome, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Record Salesperson Outcome</h3>
            <p className="text-xs text-slate-500 mt-0.5">Capturing experience data for RL model learning</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Account:</span>
              <span className="font-semibold text-slate-800">{accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Opportunity:</span>
              <span className="font-medium text-slate-800 truncate max-w-[260px]">{opportunityName}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">Recommended Product:</span>
              <span className="font-semibold text-slate-900">{recommendationItem.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Agent Score:</span>
              <span className="font-mono font-semibold text-indigo-700 tabular-nums">
                {recommendationItem.agentScore.toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Salesperson Decision
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAction('Accepted');
                  if (outcome === 'Rejected') setOutcome('Opportunity');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  action === 'Accepted'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Accept
              </button>
              <button
                type="button"
                onClick={() => {
                  setAction('Rejected');
                  setOutcome('Rejected');
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  action === 'Rejected'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 font-semibold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <X className="w-3.5 h-3.5 text-rose-600" />
                Reject
              </button>
              <button
                type="button"
                onClick={() => setAction('Adjusted Priority')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  action === 'Adjusted Priority'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 font-semibold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                Adjust
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Customer / Commercial Outcome
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as any)}
              className="w-full text-xs font-medium rounded-lg border border-slate-300 py-2 px-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="Opportunity">Opportunity Created (Added to Deal Scope)</option>
              <option value="Closed-Won">Closed-Won (Immediate Contract Sign)</option>
              <option value="Accepted">Accepted by Salesperson (In Scoping)</option>
              <option value="In Discussion">In Customer Discussion / Pending Pitch</option>
              <option value="Rejected">Rejected by Customer / Not Applicable</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Salesperson Notes & Context Rationale
            </label>
            <div className="relative">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Why was this recommendation accepted/rejected? (e.g., customer requested compliance tool, budget constraints, existing competitor tool)..."
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
              />
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 bottom-2.5 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Feedback notes are recorded into the RL replay buffer to refine state embeddings.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              Save Experience Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
