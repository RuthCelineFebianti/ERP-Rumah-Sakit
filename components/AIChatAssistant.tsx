import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { MessageSquare, X, Send, Bot, Loader2, Trash2, Mic, MicOff } from 'lucide-react';
import { ChatMessage, Patient } from '../types';
import { createChatSession } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface AIChatAssistantProps {
  patients?: Patient[];
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ patients = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize state from localStorage if available, otherwise use default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ame_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat history:", e);
      }
    }
    return [{ id: 'init', role: 'model', text: 'Halo. Saya asisten HospitalSuite Enterprise. Ada yang bisa saya bantu terkait data pasien atau operasional hari ini?' }];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // Ref for the chat session
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize session once
    if (!chatSessionRef.current) {
      const history = messages.filter(m => m.id !== 'init');
      chatSessionRef.current = createChatSession(history);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save to localStorage whenever messages change and scroll to bottom
  useEffect(() => {
    localStorage.setItem('ame_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop after one sentence/phrase
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'id-ID'; // Set to Indonesian

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${transcript}` : transcript;
        });
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setSpeechSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Browser Anda tidak mendukung fitur input suara (Web Speech API). Cobalah gunakan Google Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  const handleClearChat = () => {
    const initialMsg: ChatMessage = { 
      id: 'init', 
      role: 'model', 
      text: 'Halo. Saya asisten HospitalSuite Enterprise. Ada yang bisa saya bantu terkait data pasien atau operasional hari ini?' 
    };
    
    // Clear storage
    localStorage.removeItem('ame_chat_history');
    
    // Reset state
    setMessages([initialMsg]);
    
    // Reset Gemini session context
    chatSessionRef.current = createChatSession();
  };

  const handleSend = async () => {
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Prepare context with patient notes if available
    let messageToSend = userMsg.text;
    if (patients.length > 0) {
      const patientContext = patients.map(p => 
        `ID: ${p.id} | Nama: ${p.name} | Kondisi: ${p.condition} | Kamar: ${p.room} | Status: ${p.status} | Riwayat: ${p.medicalHistory || 'Nihil'} | Dokter: ${p.assignedDoctor || 'Belum Ada'} | Catatan: ${p.notes || 'Nihil'}`
      ).join('\n');
      
      messageToSend = `[Data Konteks Sistem - Rekam Medis Pasien Saat Ini]\n${patientContext}\n\n[Pertanyaan Pengguna]\n${userMsg.text}`;
    }

    try {
      const response = await chatSessionRef.current.sendMessage({ message: messageToSend });
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "Maaf, saya tidak dapat memproses permintaan tersebut."
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Maaf, terjadi gangguan koneksi ke layanan AI. Mohon coba lagi."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-teal-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-semibold text-sm">HospitalSuite AI</h3>
                <span className="text-xs text-teal-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleClearChat} 
                title="Mulai Sesi Baru"
                className="hover:bg-teal-800 p-1.5 rounded-full transition text-teal-200 hover:text-amber-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-teal-800 p-1 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <span className="text-xs text-slate-500">HospitalSuite sedang berpikir...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Silakan bicara..." : "Tanya tentang SOP atau data..."}
                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
              />
              {speechSupported && (
                <button
                    onClick={toggleListening}
                    className={`transition ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-teal-600'}`}
                    title="Dikte Suara"
                >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="text-teal-600 hover:text-teal-800 disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6 group-hover:animate-bounce" />
        )}
      </button>
    </div>
  );
};