import React, { useState, useEffect } from 'react';
import { MOCK_TRANSACTIONS } from '../constants';
import { analyzeFraud } from '../services/geminiService';
import { AlertTriangle, CheckCircle, Search, FileText, BrainCircuit, RefreshCw, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const FinanceModule: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load analysis from local storage on mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('ame_finance_analysis');
    if (savedAnalysis) {
      setAnalysis(savedAnalysis);
    }
  }, []);

  const handleAIAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeFraud(MOCK_TRANSACTIONS);
      setAnalysis(result);
      localStorage.setItem('ame_finance_analysis', result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    localStorage.removeItem('ame_finance_analysis');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Buku Besar (General Ledger)</h2>
          <p className="text-slate-500 text-sm">Pencatatan real-time dan audit otomatis berbasis AI.</p>
        </div>
        <div className="flex gap-2">
            {analysis && (
                <button
                    onClick={clearAnalysis}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-all"
                    title="Hapus Hasil Analisis"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            <button
            onClick={handleAIAnalysis}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-md transition-all disabled:opacity-70"
            >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
            {analysis ? 'Analisis Ulang' : 'Analisis Indikasi Kecurangan AI'}
            </button>
        </div>
      </div>

      {/* AI Analysis Result Panel */}
      {analysis && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-slate-100 rounded-xl p-6 shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-semibold text-amber-400">Laporan Audit Anomali HospitalSuite</h3>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Deskripsi</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-right">Jumlah</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_TRANSACTIONS.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-mono text-slate-500">{tx.id}</td>
                <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{tx.description}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs border border-slate-200">
                    {tx.category}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-semibold ${tx.type === 'CREDIT' ? 'text-teal-600' : 'text-slate-700'}`}>
                  {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    tx.status === 'POSTED' ? 'bg-green-50 text-green-700 border-green-200' :
                    tx.status === 'FLAGGED' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {tx.status === 'FLAGGED' && <AlertTriangle className="w-3 h-3" />}
                    {tx.status === 'POSTED' ? 'TERCATAT' : tx.status === 'FLAGGED' ? 'DITANDAI' : 'TERTUNDA'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};