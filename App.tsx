import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FinanceModule } from './components/FinanceModule';
import { InventoryModule } from './components/InventoryModule';
import { PatientsModule } from './components/PatientsModule';
import { SettingsModule } from './components/SettingsModule';
import { AIChatAssistant } from './components/AIChatAssistant';
import { View, Patient } from './types';
import { MOCK_PATIENTS } from './constants';
import { Bell, Search } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [searchQuery, setSearchQuery] = useState('');

  // Lifted Patient State
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('ame_patients');
      return saved ? JSON.parse(saved) : MOCK_PATIENTS;
    } catch (e) {
      console.error("Gagal memuat data pasien:", e);
      return MOCK_PATIENTS;
    }
  });

  // Persist patients to LocalStorage whenever the list changes
  useEffect(() => {
    try {
      localStorage.setItem('ame_patients', JSON.stringify(patients));
    } catch (error) {
      console.error("Gagal menyimpan data pasien ke LocalStorage:", error);
      // Check for QuotaExceededError
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("Peringatan: Penyimpanan browser penuh. Data pasien baru mungkin tidak tersimpan permanen. Cobalah hapus beberapa data atau gunakan foto profil yang lebih kecil.");
      }
    }
  }, [patients]);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.FINANCE:
        return <FinanceModule />;
      case View.INVENTORY:
        return <InventoryModule />;
      case View.PATIENTS:
        return (
          <PatientsModule 
            searchQuery={searchQuery} 
            patients={patients} 
            setPatients={setPatients} 
          />
        );
      case View.SETTINGS:
        return <SettingsModule />;
      default:
        return <div className="p-8 text-slate-500">Modul Tidak Ditemukan</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400 bg-slate-100 rounded-full px-4 py-2 w-96">
            <Search className="w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari data pasien, tagihan, atau stok obat..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-600"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 overflow-hidden">
               <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>

      {/* Persistent AI Assistant with access to Patient Data */}
      <AIChatAssistant patients={patients} />
    </div>
  );
}