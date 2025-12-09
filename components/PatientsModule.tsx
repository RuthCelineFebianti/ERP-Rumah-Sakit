import React, { useState } from 'react';
import { Patient } from '../types';
import { Activity, Clock, MapPin, Plus, X, Save, UserPlus, Image as ImageIcon, ChevronDown, ChevronUp, FileText, Check, ClipboardList, Stethoscope, Filter, AlertCircle } from 'lucide-react';

interface PatientsModuleProps {
  searchQuery: string;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const DOCTORS = [
  'Dr. Smith',
  'Dr. Jones',
  'Dr. Gregory House',
  'Dr. Meredith Grey',
  'Dr. Stephen Strange',
  'Dr. Julius Hibbert',
  'Dr. Leonard McCoy',
  'Dr. Allison Cameron',
  'Dr. John Dorian'
];

const DRAFT_KEY_PREFIX = 'ame_note_draft_';

export const PatientsModule: React.FC<PatientsModuleProps> = ({ searchQuery, patients, setPatients }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  
  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    age: undefined,
    gender: 'M',
    condition: '',
    room: '',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'Stabil',
    profilePicture: '',
    medicalHistory: '',
    assignedDoctor: ''
  });

  // State for collapsible row
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || '' : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar. Maksimal 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // Compress and Resize Logic
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 200; // Resize to thumbnail size (max 200px)
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Convert to compressed base64 JPEG
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                setFormData(prev => ({ ...prev, profilePicture: compressedDataUrl }));
            }
        };
        if (event.target?.result) {
            img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.condition) {
        alert("Mohon lengkapi Nama dan Kondisi pasien.");
        return;
    }

    const newPatient: Patient = {
        id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        age: formData.age || 0,
        gender: (formData.gender as 'M' | 'F') || 'M',
        condition: formData.condition,
        room: formData.room || 'TBD',
        admissionDate: formData.admissionDate || new Date().toISOString().split('T')[0],
        status: (formData.status as any) || 'Stabil',
        profilePicture: formData.profilePicture,
        medicalHistory: formData.medicalHistory || '',
        notes: '',
        assignedDoctor: formData.assignedDoctor
    };

    setPatients([newPatient, ...patients]);
    setIsFormOpen(false);
    setFormData({
        name: '',
        age: undefined,
        gender: 'M',
        condition: '',
        room: '',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'Stabil',
        profilePicture: '',
        medicalHistory: '',
        assignedDoctor: ''
    });
  };

  const toggleExpand = (patient: Patient) => {
    if (expandedId === patient.id) {
      setExpandedId(null);
      setNoteDraft('');
      setSavedSuccessId(null);
    } else {
      setExpandedId(patient.id);
      // Try to load unsaved draft from localStorage first
      try {
        const savedDraft = localStorage.getItem(`${DRAFT_KEY_PREFIX}${patient.id}`);
        // Use draft if exists, otherwise fall back to saved patient notes, or empty string
        setNoteDraft(savedDraft !== null ? savedDraft : (patient.notes || ''));
      } catch (e) {
        setNoteDraft(patient.notes || '');
      }
      setSavedSuccessId(null);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>, patientId: string) => {
    const newValue = e.target.value;
    setNoteDraft(newValue);
    
    // Persist draft to localStorage immediately so data isn't lost on refresh/collapse
    try {
      localStorage.setItem(`${DRAFT_KEY_PREFIX}${patientId}`, newValue);
    } catch (err) {
      console.error("Failed to save draft to localStorage:", err);
    }
  };

  const handleSaveNote = (patientId: string) => {
    // 1. Update the main patients state (which triggers App.tsx to save to persisted storage)
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, notes: noteDraft } : p
    ));
    
    // 2. Clear the temporary draft from localStorage as it is now committed
    try {
      localStorage.removeItem(`${DRAFT_KEY_PREFIX}${patientId}`);
    } catch (err) {
      console.error("Failed to clear draft from localStorage:", err);
    }

    // 3. Show success feedback
    setSavedSuccessId(patientId);
    setTimeout(() => setSavedSuccessId(null), 2000);
  };

  const handleStatusChange = (patientId: string, newStatus: string) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, status: newStatus as any } : p
    ));
  };

  const handleAddTimestamp = (patientId: string) => {
    const now = new Date().toLocaleString('id-ID', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    });
    const entry = `[${now}] `;
    
    let newDraft = noteDraft;
    // Add newline if there is existing text and it doesn't end with one
    if (noteDraft && !noteDraft.endsWith('\n')) {
        newDraft += '\n';
    }
    newDraft += entry;
    
    setNoteDraft(newDraft);
    // Update draft storage
    try {
      localStorage.setItem(`${DRAFT_KEY_PREFIX}${patientId}`, newDraft);
    } catch (err) { console.error(err); }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDoctor = selectedDoctor ? p.assignedDoctor === selectedDoctor : true;

    return matchesSearch && matchesDoctor;
  });

  // Calculate dirty state (unsaved changes)
  const expandedPatient = patients.find(p => p.id === expandedId);
  const isDirty = expandedPatient && noteDraft !== (expandedPatient.notes || '');

  return (
    <div className="p-8 space-y-6 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Pasien</h2>
          <p className="text-slate-500 text-sm">Sensus pasien real-time dan pemantauan status klinis.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-all"
        >
            <Plus className="w-4 h-4" /> Registrasi Pasien Baru
        </button>
      </div>

      {/* Add Patient Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-100 rounded-lg">
                        <UserPlus className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">Registrasi Pasien Baru</h3>
                </div>
                <button 
                    onClick={() => setIsFormOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Profile Picture Upload */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group hover:border-teal-500 transition">
                    {formData.profilePicture ? (
                      <img src={formData.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-teal-500 transition" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Foto Profil</p>
                    <p className="text-xs text-slate-500">Otomatis dikompres (Klik untuk unggah)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Lengkap</label>
                        <input 
                            required
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                            placeholder="cth. Budi Santoso"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Umur</label>
                        <input 
                            required
                            type="number" 
                            name="age" 
                            value={formData.age || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                            placeholder="cth. 34"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Jenis Kelamin</label>
                        <select 
                            name="gender" 
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                        >
                            <option value="M">Laki-laki</option>
                            <option value="F">Perempuan</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Kondisi / Diagnosis Awal</label>
                        <input 
                            required
                            type="text" 
                            name="condition" 
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                            placeholder="cth. Bronkitis Akut"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Dokter Penanggung Jawab (DPJP)</label>
                         <select 
                            name="assignedDoctor" 
                            value={formData.assignedDoctor}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                        >
                            <option value="">Pilih Dokter</option>
                            {DOCTORS.map((doc) => (
                                <option key={doc} value={doc}>{doc}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Kamar Rawat</label>
                        <input 
                            required
                            type="text" 
                            name="room" 
                            value={formData.room}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                            placeholder="cth. 101-A"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tanggal Masuk</label>
                        <input 
                            required
                            type="date" 
                            name="admissionDate" 
                            value={formData.admissionDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Status Saat Ini</label>
                        <select 
                            name="status" 
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
                        >
                            <option value="Stabil">Stabil</option>
                            <option value="Kritis">Kritis</option>
                            <option value="Pemulihan">Pemulihan</option>
                            <option value="Pulang">Pulang</option>
                        </select>
                    </div>
                     <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Riwayat Medis</label>
                        <textarea 
                            name="medicalHistory" 
                            value={formData.medicalHistory}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition resize-none h-20"
                            placeholder="cth. Diabetes Tipe 2, Alergi Penicillin..."
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                    <button 
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition"
                    >
                        <Save className="w-4 h-4" /> Simpan Data
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500 px-2 border-r border-slate-200">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Filter</span>
        </div>
        <div className="flex-1 flex items-center gap-2">
            <span className="text-sm text-slate-600 whitespace-nowrap">DPJP:</span>
            <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full max-w-xs bg-slate-50 border-none text-sm text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-teal-500/20 transition cursor-pointer"
            >
                <option value="">Semua Dokter</option>
                {DOCTORS.map((doc) => (
                    <option key={doc} value={doc}>{doc}</option>
                ))}
            </select>
        </div>
        {selectedDoctor && (
            <button 
                onClick={() => setSelectedDoctor('')}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2"
            >
                Hapus Filter
            </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Info Pasien</th>
              <th className="px-6 py-4">Kondisi</th>
              <th className="px-6 py-4">Kamar</th>
              <th className="px-6 py-4">Masuk</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <React.Fragment key={patient.id}>
                <tr className={`hover:bg-slate-50 transition ${expandedId === patient.id ? 'bg-slate-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold overflow-hidden border border-slate-100">
                            {patient.profilePicture ? (
                                <img src={patient.profilePicture} alt={patient.name} className="w-full h-full object-cover" />
                            ) : (
                                patient.name.charAt(0)
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{patient.name}</p>
                            <p className="text-xs text-slate-500">{patient.id} • {patient.age}thn {patient.gender === 'M' ? 'L' : 'P'}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{patient.condition}</td>
                  <td className="px-6 py-4 text-slate-600">
                     <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400"/> {patient.room}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="flex items-center gap-1 text-xs">
                        <Clock className="w-3 h-3"/> {patient.admissionDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      patient.status === 'Kritis' ? 'bg-red-50 text-red-700 border-red-200' :
                      patient.status === 'Stabil' ? 'bg-green-50 text-green-700 border-green-200' :
                      patient.status === 'Pemulihan' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {patient.status === 'Kritis' && <Activity className="w-3 h-3" />}
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-end gap-3">
                      {patient.notes && patient.notes.trim().length > 0 && (
                        <div className="group relative">
                          <div className="p-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 cursor-help">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max max-w-xs px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg z-10">
                            Memiliki Catatan
                          </div>
                        </div>
                      )}
                      <button 
                          onClick={() => toggleExpand(patient)}
                          className={`p-2 rounded-full transition ${expandedId === patient.id ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-200' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                      >
                          {expandedId === patient.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === patient.id && (
                  <tr className="bg-slate-50/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <td colSpan={6} className="px-6 py-4 pt-0 pb-6 border-b border-slate-100">
                       <div className="ml-14 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                          {/* Medical History & Details Section */}
                          <div className="mb-4 pb-4 border-b border-slate-100 flex gap-6">
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                    <ClipboardList className="w-4 h-4 text-teal-500" /> 
                                    Riwayat Medis
                                </h4>
                                <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3">
                                    {patient.medicalHistory || "Tidak ada riwayat medis signifikan tercatat."}
                                </div>
                            </div>
                            <div className="w-1/3 space-y-4">
                                {/* Condition & Status */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                        <Activity className="w-4 h-4 text-teal-500" /> 
                                        Kondisi & Status
                                    </h4>
                                    <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Diagnosis / Kondisi</p>
                                            <p className="font-medium text-slate-800">{patient.condition}</p>
                                        </div>
                                        <div>
                                             <p className="text-xs text-slate-500 mb-1">Status Pasien</p>
                                             <select 
                                                value={patient.status}
                                                onChange={(e) => handleStatusChange(patient.id, e.target.value)}
                                                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition cursor-pointer"
                                             >
                                                <option value="Stabil">Stabil</option>
                                                <option value="Kritis">Kritis</option>
                                                <option value="Pemulihan">Pemulihan</option>
                                                <option value="Pulang">Pulang</option>
                                             </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                        <Stethoscope className="w-4 h-4 text-teal-500" /> 
                                        Dokter Penanggung Jawab
                                    </h4>
                                    <div className="text-sm font-medium text-slate-800 bg-teal-50 border border-teal-100 rounded-md p-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-teal-700 text-xs font-bold border border-teal-200">
                                            Dr
                                        </div>
                                        {patient.assignedDoctor || "Belum Ditugaskan"}
                                    </div>
                                </div>
                            </div>
                          </div>

                          {/* Clinical Notes Section */}
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-3">
                                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-teal-500" /> 
                                    Catatan Klinis & Observasi
                                </h4>
                                <button 
                                    onClick={() => handleAddTimestamp(patient.id)}
                                    className="text-xs flex items-center gap-1.5 text-slate-500 hover:text-teal-700 transition-colors bg-white hover:bg-teal-50 px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-teal-200 shadow-sm"
                                    title="Tambahkan timestamp saat ini"
                                >
                                    <Clock className="w-3.5 h-3.5" /> 
                                    <span>Sisipkan Waktu</span>
                                </button>
                             </div>
                             <div className="flex items-center gap-3">
                                {isDirty && (
                                    <span className="text-xs text-amber-600 font-medium flex items-center gap-1.5 animate-pulse">
                                        <AlertCircle className="w-3.5 h-3.5" /> 
                                        Perubahan belum disimpan
                                    </span>
                                )}
                                {savedSuccessId === patient.id && (
                                    <span className="text-xs text-teal-600 font-semibold flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-300">
                                        <div className="bg-teal-100 rounded-full p-0.5">
                                            <Check className="w-3 h-3" /> 
                                        </div>
                                        Berhasil disimpan
                                    </span>
                                )}
                             </div>
                          </div>
                          <textarea 
                             value={noteDraft}
                             onChange={(e) => handleNoteChange(e, patient.id)}
                             spellCheck={false}
                             placeholder="Masukkan observasi klinis rinci, catatan perkembangan harian, dan instruksi perawatan..."
                             className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3 min-h-[100px] outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition resize-y"
                          />
                          <div className="mt-3 flex justify-end">
                             <button 
                                onClick={() => handleSaveNote(patient.id)}
                                disabled={!isDirty}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1 ${
                                    isDirty 
                                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm' 
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                             >
                                <Save className="w-3 h-3" /> {isDirty ? 'Simpan Catatan' : 'Tersimpan'}
                             </button>
                          </div>
                       </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))
            ) : (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                        Tidak ada pasien ditemukan untuk "{searchQuery}" {selectedDoctor ? `dengan DPJP: ${selectedDoctor}` : ''}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};