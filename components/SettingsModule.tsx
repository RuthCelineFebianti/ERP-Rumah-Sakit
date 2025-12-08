import React, { useState, useEffect } from 'react';
import { Save, User, Building, Bell, Trash2, Shield, Globe, Database, RotateCcw, Check } from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Simulated State for Settings
  const [settings, setSettings] = useState({
    hospitalName: 'Aether Medis Enterprise',
    fiscalYearEnd: '31 Desember',
    currency: 'USD ($)',
    taxRate: '11',
    language: 'Bahasa Indonesia',
    notifications: {
      email: true,
      system: true,
      anomalies: true
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call / LocalStorage save
    setTimeout(() => {
      localStorage.setItem('ame_settings', JSON.stringify(settings));
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleFactoryReset = () => {
    if (window.confirm("PERINGATAN: Tindakan ini akan menghapus SEMUA data pasien, riwayat chat, dan pengaturan lokal. Apakah Anda yakin ingin melanjutkan?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Load settings on mount
  useEffect(() => {
    const saved = localStorage.getItem('ame_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) { console.error("Error loading settings", e); }
    }
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pengaturan Sistem</h2>
          <p className="text-slate-500 text-sm">Konfigurasi parameter ERP, profil pengguna, dan preferensi aplikasi.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-70"
        >
          {isLoading ? (
            <RotateCcw className="w-4 h-4 animate-spin" />
          ) : showSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {showSuccess ? 'Tersimpan!' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: User & System Info */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <User className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-slate-800">Profil Pengguna</h3>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-teal-100 border-4 border-white shadow-lg mb-4 overflow-hidden">
                 <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Prof. React Dev</h4>
              <p className="text-sm text-slate-500 font-medium">Chief Technology Officer</p>
              <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">ADMIN</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">ERP LEAD</span>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 text-center">
              ID Pengguna: AME-ADM-001
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" /> Informasi Sistem
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Versi Aplikasi</span>
                <span className="font-mono text-slate-700">v2.5.0 (Stable)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Versi Gemini AI</span>
                <span className="font-mono text-slate-700">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Terakhir Update</span>
                <span className="text-slate-700">20 Okt 2023</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Status Server</span>
                <span className="text-teal-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span> Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ERP Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <Building className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-slate-800">Konfigurasi ERP & Instansi</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Instansi Rumah Sakit</label>
                <input 
                  type="text" 
                  name="hospitalName"
                  value={settings.hospitalName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tahun Fiskal Berakhir</label>
                <select 
                  name="fiscalYearEnd"
                  value={settings.fiscalYearEnd}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                >
                  <option value="31 Desember">31 Desember (Kalender)</option>
                  <option value="31 Maret">31 Maret</option>
                  <option value="30 Juni">30 Juni</option>
                  <option value="30 September">30 September</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mata Uang Dasar</label>
                <select 
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                >
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="IDR (Rp)">IDR (Rp) - Rupiah</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tarif Pajak Default (%)</label>
                <input 
                  type="number" 
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bahasa Sistem</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select 
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  >
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="English (US)">English (US)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <Bell className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-slate-800">Preferensi Notifikasi</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">Notifikasi Email</p>
                  <p className="text-xs text-slate-500">Terima laporan harian via email.</p>
                </div>
                <button 
                  onClick={() => handleToggle('email')}
                  className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${settings.notifications.email ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.notifications.email ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div>
                  <p className="font-medium text-slate-800">Peringatan Sistem</p>
                  <p className="text-xs text-slate-500">Notifikasi popup untuk pemeliharaan server.</p>
                </div>
                <button 
                  onClick={() => handleToggle('system')}
                  className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${settings.notifications.system ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.notifications.system ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div>
                  <p className="font-medium text-slate-800">Deteksi Anomali AI</p>
                  <p className="text-xs text-slate-500">Peringatan real-time jika AI mendeteksi fraud.</p>
                </div>
                <button 
                  onClick={() => handleToggle('anomalies')}
                  className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${settings.notifications.anomalies ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${settings.notifications.anomalies ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 flex items-center gap-3">
              <Database className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Manajemen Data (Zona Berbahaya)</h3>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Factory Reset / Hapus Data</p>
                <p className="text-xs text-red-700 mt-1 max-w-sm">
                  Menghapus semua data lokal termasuk pasien baru, riwayat chat AI, dan pengaturan. Aplikasi akan kembali ke status awal (demo).
                </p>
              </div>
              <button 
                onClick={handleFactoryReset}
                className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Trash2 className="w-4 h-4" /> Reset Aplikasi
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};