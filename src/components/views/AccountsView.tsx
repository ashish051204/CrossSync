import React, { useState } from 'react';
import { Account, NavigationPage } from '../../types';
import {
  Building2,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface AccountsViewProps {
  accounts: Account[];
  onSelectAccount: (id: string) => void;
  onNavigateToRecommend: (accountId: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  onSelectAccount,
  onNavigateToRecommend,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const industries = Array.from(new Set(accounts.map((a) => a.industry)));
  const priorities = Array.from(new Set(accounts.map((a) => a.customerPriority)));

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'ALL' || acc.industry === industryFilter;
    const matchesPriority = priorityFilter === 'ALL' || acc.customerPriority === priorityFilter;
    return matchesSearch && matchesIndustry && matchesPriority;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Master Enterprise Data</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Accounts Data
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect corporate accounts, annual revenues, customer priority tiers, and operational regions used in RL context embedding.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-mono font-bold text-slate-900">{filteredAccounts.length}</span> of{' '}
          <span className="font-mono">{accounts.length}</span> accounts
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search account name, ID, or sector..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Industry:</span>
          </div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 ml-2">
            <span>Priority:</span>
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 py-1.5 px-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Accounts Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4">Industry & Sector</th>
                <th className="py-3 px-4 text-right">Annual Revenue</th>
                <th className="py-3 px-4 text-right">Employees</th>
                <th className="py-3 px-4">Customer Priority</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Sales State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((account) => (
                <tr
                  key={account.id}
                  onClick={() => onSelectAccount(account.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500 tabular-nums">
                    {account.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-600">
                    {account.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{account.industry}</div>
                    <div className="text-[11px] text-slate-400">{account.sector}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                    {account.annualRevenue}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 tabular-nums">
                    {account.employees.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-medium text-slate-700">
                      {account.customerPriority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {account.region}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-medium text-slate-800">
                      {account.salesState}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigateToRecommend(account.id)}
                        title="Generate Recommendation for this Account"
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Recommend</span>
                      </button>
                      <button
                        onClick={() => onSelectAccount(account.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
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
