import { InventoryItem, KPIData, Transaction, Patient } from "./types";

export const APP_NAME = "Aether Medis Enterprise";

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-001', date: '2023-10-24', description: 'Pengadaan: Masker Bedah', amount: 5000, type: 'DEBIT', category: 'HPP', status: 'POSTED' },
  { id: 'TX-002', date: '2023-10-24', description: 'Tagihan Pasien: Faktur #9921', amount: 12500, type: 'CREDIT', category: 'Pendapatan', status: 'POSTED' },
  { id: 'TX-003', date: '2023-10-25', description: 'Pemeliharaan Mesin MRI', amount: 2500, type: 'DEBIT', category: 'Pemeliharaan', status: 'PENDING' },
  { id: 'TX-004', date: '2023-10-25', description: 'Stok Obat Darurat (Segera)', amount: 15000, type: 'DEBIT', category: 'Inventaris', status: 'FLAGGED' }, // Anomaly candidate
  { id: 'TX-005', date: '2023-10-26', description: 'Klaim Asuransi: AXA', amount: 45000, type: 'CREDIT', category: 'Pendapatan', status: 'POSTED' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'Paracetamol IV 100ml', sku: 'MED-PARA-100', stockLevel: 450, reorderPoint: 500, unitPrice: 12.5, category: 'PHARMA' },
  { id: 'INV-002', name: 'Sarung Tangan Bedah (L)', sku: 'SURG-GLV-L', stockLevel: 1200, reorderPoint: 200, unitPrice: 0.5, category: 'SURGICAL' },
  { id: 'INV-003', name: 'Propofol 1%', sku: 'ANES-PRO-01', stockLevel: 30, reorderPoint: 50, unitPrice: 45.0, category: 'PHARMA' },
  { id: 'INV-004', name: 'Respirator N95', sku: 'GEN-N95', stockLevel: 85, reorderPoint: 100, unitPrice: 3.2, category: 'GENERAL' },
];

export const FINANCIAL_KPIS: KPIData[] = [
  { name: 'Pendapatan Total (YTD)', value: '$12.4M', change: '+12%', trend: 'up' },
  { name: 'Biaya Operasional (Bulan Ini)', value: '$840k', change: '-3%', trend: 'down' }, // Down is good for expenses
  { name: 'Kas Tunai', value: '$3.2M', change: '+5%', trend: 'up' },
  { name: 'Piutang Usaha', value: '$450k', change: '+2%', trend: 'down' }, // Up is bad for AR
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'PT-1024', name: 'Eleanor Rigby', age: 72, gender: 'F', condition: 'Hipertensi', room: '304-A', admissionDate: '2023-10-20', status: 'Stabil', medicalHistory: 'Didiagnosis Diabetes Tipe 2 pada 2015. Alergi Penicillin.', notes: 'Pasien melaporkan pusing ringan saat berdiri. Pemantauan TD dimulai setiap 4 jam.', assignedDoctor: 'Dr. Gregory House' },
  { id: 'PT-1025', name: 'John Doe', age: 45, gender: 'M', condition: 'Usus Buntu', room: '202-B', admissionDate: '2023-10-23', status: 'Pemulihan', medicalHistory: 'Tidak ada riwayat medis signifikan sebelumnya. Bukan perokok.', notes: 'Hari ke-2 pasca-op. Luka sembuh dengan baik. Diet ditingkatkan ke padat lunak.', assignedDoctor: 'Dr. Meredith Grey' },
  { id: 'PT-1026', name: 'Sarah Connor', age: 33, gender: 'F', condition: 'Patah Tulang Paha', room: '105-C', admissionDate: '2023-10-24', status: 'Stabil', medicalHistory: 'Rekonstruksi ACL sebelumnya di lutut kanan (2019).', assignedDoctor: 'Dr. Stephen Strange' },
  { id: 'PT-1027', name: 'Michael Scott', age: 50, gender: 'M', condition: 'Luka Bakar (Derajat 2)', room: 'ICU-04', admissionDate: '2023-10-25', status: 'Kritis', medicalHistory: 'Riwayat asma. Menggunakan inhaler Albuterol jika perlu.', assignedDoctor: 'Dr. Julius Hibbert' },
  { id: 'PT-1028', name: 'Walter White', age: 52, gender: 'M', condition: 'Karsinoma Paru', room: '401-A', admissionDate: '2023-10-18', status: 'Stabil', medicalHistory: 'Mantan guru kimia. Tidak ada rawat inap sebelumnya.', assignedDoctor: 'Dr. Leonard McCoy' },
  { id: 'PT-1029', name: 'Jesse Pinkman', age: 25, gender: 'M', condition: 'Gejala Putus Zat', room: '210-B', admissionDate: '2023-10-26', status: 'Pemulihan', medicalHistory: 'Riwayat penyalahgunaan zat. Tidak ada alergi yang diketahui.', assignedDoctor: 'Dr. Gregory House' },
];