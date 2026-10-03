import React, { useState } from 'react';
import { GroundTruthRecord } from '../../types';
import { FileCheck2, Search, Filter, ArrowRight } from 'lucide-react';

interface GroundTruthViewProps {
  groundTruth: GroundTruthRecord[];
  onSelectGroundTruth: (id: string) => void;
}

export const GroundTruthView: React.FC<GroundTruthViewProps> = ({
  groundTruth,
  onSelectGroundTruth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productFamilyFilter, setProductFamilyFilter] = useState('ALL');

  const families = Array.from(new Set(groundTruth.map((gt) => gt.crossSellProductFamily)));

  const filteredGroundTruth = groundTruth.filter((gt) => {
    const matchesSearch =
      gt.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gt.currentProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gt.crossSellProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gt.opportunityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gt.salesRepresentative.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = productFamilyFilter === 'ALL' || gt.crossSellProductFamily === productFamilyFilter;
    return matchesSearch && matchesFamily;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Supervised Baseline Dataset</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Historical Cross-Sell GroundTruth
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified historical enterprise sales co-occurrences used during cold-start RL model training prior to live deployment.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-mono font-bold text-slate-900">{filteredGroundTruth.length}</span> records
        </div>
      </div>

      {/* Distinction Banner */}
      <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>
            <strong>Historical GroundTruth vs. Live RL Recommendations:</strong> These records reflect historic closed deals, not live agent inferences.
          </span>
        </div>
        <span className="font-mono text-[11px] text-amber-700 font-semibold">Cold-Start Dataset</span>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search account, product, opportunity ID..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Cross-Sell Family:</span>
          <select
            value={productFamilyFilter}
            onChange={(e) => setProductFamilyFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Families</option>
            {families.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GroundTruth Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Opportunity ID</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Current Product</th>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Historical Cross-Sell Product</th>
                <th className="py-3 px-4 text-right">Win Rate</th>
                <th className="py-3 px-4 text-right">Closed Revenue</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGroundTruth.map((gt) => (
                <tr
                  key={gt.id}
                  onClick={() => onSelectGroundTruth(gt.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500 tabular-nums">
                    {gt.opportunityId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-600">
                    {gt.accountName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-[170px] truncate">
                    {gt.currentProduct}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      #{gt.crossSellRank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{gt.crossSellProduct}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{gt.crossSellProductId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                    {gt.historicalWinRate}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${gt.closedRevenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectGroundTruth(gt.id)}
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
    </div>
  );
};
