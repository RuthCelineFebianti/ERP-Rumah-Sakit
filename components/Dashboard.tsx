import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FINANCIAL_KPIS } from '../constants';
import { DollarSign, TrendingUp, TrendingDown, Users, Activity } from 'lucide-react';

const data = [
  { name: 'Jan', Pendapatan: 4000, Pengeluaran: 2400 },
  { name: 'Feb', Pendapatan: 3000, Pengeluaran: 1398 },
  { name: 'Mar', Pendapatan: 2000, Pengeluaran: 9800 },
  { name: 'Apr', Pendapatan: 2780, Pengeluaran: 3908 },
  { name: 'Mei', Pendapatan: 1890, Pengeluaran: 4800 },
  { name: 'Jun', Pendapatan: 2390, Pengeluaran: 3800 },
  { name: 'Jul', Pendapatan: 3490, Pengeluaran: 4300 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Ringkasan Eksekutif</h1>
        <p className="text-slate-500 mt-1">Selamat datang kembali, Profesor. Berikut adalah laporan kesehatan operasional harian.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FINANCIAL_KPIS.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.name}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${kpi.trend === 'up' ? 'bg-teal-50' : 'bg-rose-50'}`}>
                {kpi.trend === 'up' ? (
                  <TrendingUp className={`w-5 h-5 ${kpi.trend === 'up' ? 'text-teal-600' : 'text-rose-600'}`} />
                ) : (
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className={`font-medium ${kpi.change.startsWith('+') ? 'text-teal-600' : 'text-rose-600'}`}>
                {kpi.change}
              </span>
              <span className="text-slate-400">vs bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Arus Kas: Pendapatan vs Pengeluaran</h3>
            <select className="bg-slate-50 border-none text-sm text-slate-600 rounded-lg px-3 py-1 outline-none">
              <option>Tahun Ini</option>
              <option>Tahun Lalu</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="Pendapatan" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Pengeluaran" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Occupancy / Stats */}
        <div className="bg-teal-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" /> Okupansi Real-time
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-teal-200 mb-2">
                  <span>Kapasitas ICU</span>
                  <span>85%</span>
                </div>
                <div className="h-2 bg-teal-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[85%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-teal-200 mb-2">
                  <span>Bangsal Umum</span>
                  <span>62%</span>
                </div>
                <div className="h-2 bg-teal-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 w-[62%] rounded-full"></div>
                </div>
              </div>

               <div>
                <div className="flex justify-between text-sm text-teal-200 mb-2">
                  <span>Ketersediaan UGD</span>
                  <span>4/12 Bed</span>
                </div>
                <div className="h-2 bg-teal-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 w-[70%] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-teal-800">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-teal-800 rounded-lg">
                   <Users className="w-6 h-6 text-teal-200" />
                 </div>
                 <div>
                   <p className="text-xs text-teal-300">Pasien Rawat Inap</p>
                   <p className="text-xl font-bold">1,248</p>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Decorative Background Blob */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-700 rounded-full blur-3xl opacity-50"></div>
        </div>
      </div>
    </div>
  );
};