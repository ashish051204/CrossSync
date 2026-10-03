import React, { useState } from 'react';
import { Product } from '../../types';
import { Package, Search, Filter, ArrowRight, Check, X } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [familyFilter, setFamilyFilter] = useState('ALL');

  const families = Array.from(new Set(products.map((p) => p.family)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.technology.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFamily = familyFilter === 'ALL' || p.family === familyFilter;
    return matchesSearch && matchesFamily;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>RL Action Space</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Products Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Products, service lines, technology architectures, and alliance partners available in the CrossSync recommendation action space.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-mono font-bold text-slate-900">{filteredProducts.length}</span> of{' '}
          <span className="font-mono">{products.length}</span> products
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product name, ID, technology..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Product Family:</span>
          <select
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value)}
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

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Family & Class</th>
                <th className="py-3 px-4">Technology & Partner</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Avg Margin</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => onSelectProduct(product.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500 tabular-nums">
                    {product.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {product.productCode} · {product.sku}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{product.family}</div>
                    <div className="text-[11px] text-slate-500">{product.productClass}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 max-w-[200px] truncate">{product.technology}</div>
                    <div className="text-[11px] text-slate-500">{product.partner}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {product.productType}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800 tabular-nums">
                    {product.typicalMargin}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[11px] font-medium text-slate-700">
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectProduct(product.id)}
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
