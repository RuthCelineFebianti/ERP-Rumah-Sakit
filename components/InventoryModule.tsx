import React, { useState, useEffect } from 'react';
import { MOCK_INVENTORY } from '../constants';
import { generateInventoryStrategy } from '../services/geminiService';
import { Package, TrendingUp, AlertCircle, Sparkles, Loader2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const InventoryModule: React.FC = () => {
  const [strategy, setStrategy] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load strategy from local storage on mount
  useEffect(() => {
    const savedStrategy = localStorage.getItem('ame_inventory_strategy');
    if (savedStrategy) {
      setStrategy(savedStrategy);
    }
  }, []);

  const handleOptimization = async () => {
    setIsGenerating(true);
    try {
      const result = await generateInventoryStrategy(MOCK_INVENTORY);
      setStrategy(result);
      localStorage.setItem('ame_inventory_strategy', result);
    } catch (error) {
      console.error("Strategy generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearStrategy = () => {
    setStrategy(null);
    localStorage.removeItem('ame_inventory_strategy');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Logistik & Farmasi</h2>
          <p className="text-slate-500 text-sm">Otomatisasi pengadaan dan pemantauan stok obat.</p>
        </div>
        <div className="flex gap-2">
            {strategy && (
                <button
                    onClick={clearStrategy}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-all"
                    title="Hapus Strategi"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            <button
            onClick={handleOptimization}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-all disabled:opacity-70"
            >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {strategy ? 'Perbarui Strategi' : 'Buat Strategi Pengadaan AI'}
            </button>
        </div>
      </div>

      {/* AI Strategy Panel */}
      {strategy && (
        <div className="bg-white rounded-xl p-6 shadow-xl border-l-4 border-teal-500 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            <h3 className="text-lg font-semibold text-slate-800">Rekomendasi Optimasi (Metode ESIA)</h3>
          </div>
          <div className="prose prose-slate prose-sm max-w-none">
            <ReactMarkdown>{strategy}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_INVENTORY.map((item) => {
          const isLowStock = item.stockLevel <= item.reorderPoint;
          return (
            <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition relative overflow-hidden group">
              {isLowStock && (
                <div className="absolute top-0 right-0 p-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-bl-lg">
                    <AlertCircle className="w-3 h-3" /> Stok Kritis
                  </span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-teal-50 group-hover:text-teal-600 transition">
                  <Package className="w-6 h-6 text-slate-500 group-hover:text-teal-600" />
                </div>
              </div>
              
              <h3 className="font-semibold text-slate-800 truncate">{item.name}</h3>
              <p className="text-xs text-slate-500 font-mono mb-4">{item.sku}</p>
              
              <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-400">Sisa Stok</p>
                  <p className={`text-xl font-bold ${isLowStock ? 'text-red-500' : 'text-slate-700'}`}>
                    {item.stockLevel.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Harga Satuan</p>
                  <p className="text-sm font-semibold text-slate-700">${item.unitPrice.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Progress bar for stock capacity (mock capacity 2x reorder point) */}
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-teal-500'}`} 
                  style={{ width: `${Math.min((item.stockLevel / (item.reorderPoint * 2)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};