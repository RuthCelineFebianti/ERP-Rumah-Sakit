export enum View {
  DASHBOARD = 'DASHBOARD',
  FINANCE = 'FINANCE',
  INVENTORY = 'INVENTORY',
  PATIENTS = 'PATIENTS',
  SETTINGS = 'SETTINGS'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: string;
  status: 'POSTED' | 'PENDING' | 'FLAGGED';
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stockLevel: number;
  reorderPoint: number;
  unitPrice: number;
  category: 'PHARMA' | 'SURGICAL' | 'GENERAL';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface KPIData {
  name: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  condition: string;
  room: string;
  admissionDate: string;
  status: 'Kritis' | 'Stabil' | 'Pemulihan' | 'Pulang';
  profilePicture?: string;
  medicalHistory?: string;
  notes?: string;
  assignedDoctor?: string;
}