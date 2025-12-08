import React from 'react';
import { View } from '../types';
import { LayoutDashboard, Wallet, Package, Users, Settings, Activity } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dasbor Utama', icon: LayoutDashboard },
    { id: View.FINANCE, label: 'Keuangan & GL', icon: Wallet },
    { id: View.INVENTORY, label: 'Logistik & Farmasi', icon: Package },
    { id: View.PATIENTS, label: 'Pasien & Adm', icon: Users },
    { id: View.SETTINGS, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 leading-tight tracking-tight">AME</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-teal-50 text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
          <p className="text-xs text-slate-400 mb-1">Pengguna Aktif</p>
          <p className="text-sm font-semibold">Prof. React Dev</p>
          <p className="text-[10px] text-teal-400">Direktur Teknologi</p>
        </div>
      </div>
    </div>
  );
};