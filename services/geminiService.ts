import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { Transaction, InventoryItem, ChatMessage } from "../types";

// Initialize Gemini
// NOTE: In a real production app, ensure the key is handled securely via a backend proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
Anda adalah Aether, asisten AI canggih untuk "Aether Medis Enterprise" (AME), sebuah ERP Rumah Sakit.
Peran Anda adalah membantu staf rumah sakit (akuntan, dokter, manajer logistik) dengan:
1. Analisis Keuangan: Menjelaskan aturan PSAK/IFRS, menganalisis anomali transaksi, dan merangkum laporan GL.
2. Rantai Pasok: Memprediksi permintaan berdasarkan data yang diberikan dan menyarankan strategi pengadaan.
3. SOP Umum: Menjelaskan prosedur operasi standar rumah sakit.
4. Perawatan Pasien: Membantu observasi klinis, merangkum catatan pasien, dan mengambil pembaruan status.

Penggunaan Konteks:
Anda mungkin menerima data spesifik (Rekam Medis Pasien, Catatan Klinis, Log Keuangan) yang dilampirkan pada pertanyaan pengguna.
Gunakan data ini untuk memberikan jawaban yang akurat dan spesifik. Jika ditanya tentang pasien, rujuk konteks "Catatan" atau "Kondisi" yang diberikan.

Nada: Profesional, presisi, mewah, dan membantu.
Format: Gunakan Markdown untuk tabel atau daftar.
Bahasa: Selalu merespons dalam Bahasa Indonesia yang formal dan baik.
`;

/**
 * Creates a chat session for the persistent assistant.
 * @param history Optional chat history to restore context
 */
export const createChatSession = (history?: ChatMessage[]): Chat => {
  const formattedHistory: Content[] | undefined = history?.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    history: formattedHistory
  });
};

/**
 * Analyzes financial transactions for potential fraud or anomalies.
 */
export const analyzeFraud = async (transactions: Transaction[]): Promise<string> => {
  const prompt = `
    Analisis transaksi keuangan rumah sakit berikut untuk anomali atau potensi penipuan berdasarkan pola umum.
    Tandai item dengan status 'FLAGGED' sebagai prioritas tinggi.
    
    Data:
    ${JSON.stringify(transactions, null, 2)}
    
    Berikan ringkasan eksekutif yang ringkas dan tindakan yang disarankan dalam Bahasa Indonesia.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Analisis selesai. Tidak ada teks spesifik yang dikembalikan.";
  } catch (error) {
    console.error("Gemini Fraud Analysis Error:", error);
    return "Tidak dapat menyelesaikan analisis AI saat ini. Silakan periksa konfigurasi API.";
  }
};

/**
 * Generates an inventory optimization strategy.
 */
export const generateInventoryStrategy = async (inventory: InventoryItem[]): Promise<string> => {
  const prompt = `
    Berdasarkan tingkat inventaris medis berikut, sarankan strategi pengadaan menggunakan kerangka kerja ESIA (Eliminate, Simplify, Integrate, Automate).
    Identifikasi item di bawah titik pemesanan ulang (reorder point).
    
    Data Inventaris:
    ${JSON.stringify(inventory, null, 2)}
    
    Jawab dalam Bahasa Indonesia.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Pembuatan strategi selesai.";
  } catch (error) {
    console.error("Gemini Inventory Strategy Error:", error);
    return "Tidak dapat membuat strategi. Silakan periksa konfigurasi API.";
  }
};