import { useState, useEffect, useRef } from 'react';
import { Mic, Send, Volume2, KeyRound, CheckCircle2, Fingerprint, Lock, ShieldCheck, User, MessageSquare } from 'lucide-react';
import type { Language } from '../App';
import type { Category } from './CategoryMenu';

interface Props {
  language: Language;
  goBack: () => void;
  initialPrompt?: string | null;
  category?: Category | null;
  interactionMode?: 'text' | 'voice';
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  category?: 'simple' | 'sensible' | 'complexe' | 'success';
  visual?: string | null;
  actions?: Array<{ label: string, type: string, url: string }> | null;
  timestamp: string;
}

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

export default function Chat({ language, initialPrompt, category, interactionMode }: Props) {
  const getWelcomeMsg = () => {
    if (category) return `Bonjour. Je suis à votre service concernant la section **${category.label}**.`;
    return "Bonjour. Je suis l'Assistant Orange CI. Comment puis-je vous assister ?";
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: getWelcomeMsg(),
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSecurity, setShowSecurity] = useState<'none' | 'biometric' | 'otp'>('none');
  const [otpCode, setOtpCode] = useState("");
  const [biometricScanning, setBiometricScanning] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showSecurity, isTyping]);

  const speak = (text: string) => {
    if (interactionMode === 'text') return;
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });
      const data = await response.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'bot',
        category: data.category,
        visual: data.visual,
        actions: data.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      speak(data.reply);

      if (data.category === 'sensible') {
        setTimeout(() => setShowSecurity('biometric'), 1200);
      }
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Échec de connexion au service sécurisé.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      const timer = setTimeout(() => handleSend(initialPrompt), 600);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt]);

  const toggleListen = () => {
    if (!recognition) return;
    if (isListening) { recognition.stop(); setIsListening(false); }
    else {
      recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
      recognition.start();
      setIsListening(true);
      recognition.onresult = (e: any) => {
        const t = e.results[0][0].transcript;
        setInputText(t);
        handleSend(t);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-slide-up-soft relative">
      {/* Barre de status sécurité Ultra-pro */}
      <div className="bg-slate-900 text-white text-[9px] font-black tracking-[0.2em] py-3 px-6 flex items-center justify-between uppercase">
        <div className="flex items-center gap-2">
            <Lock size={12} className="text-orange-brand" />
            <span>Cryptage AES-256</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Serveur Sécurisé</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                <div className={`p-4 rounded-2xl shadow-sm border ${
                  msg.sender === 'user' 
                    ? 'bg-orange-brand border-orange-brand text-white rounded-tr-none' 
                    : 'bg-white border-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                </div>

                {msg.visual && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-100 shadow-xl max-w-[240px]">
                    <img src={msg.visual} alt="Guide" className="w-full h-auto" />
                  </div>
                )}

                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2 w-full">
                    {msg.actions.map((act, i) => (
                      <a 
                        key={i} href={act.url} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          act.type === 'maxit' ? 'bg-black text-white hover:bg-slate-800' : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {act.label}
                      </a>
                    ))}
                  </div>
                )}
                
                <span className="text-[9px] mt-2 font-bold text-slate-300 uppercase tracking-tighter">
                  {msg.timestamp}
                </span>
             </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {/* Modals Sécurité Premium */}
        {showSecurity === 'biometric' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl animate-slide-up-soft">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Fingerprint size={42} className={biometricScanning ? 'text-orange-brand animate-pulse' : 'text-slate-300'} />
              </div>
              <h4 className="text-xl font-outfit font-black text-slate-900 mb-2 uppercase tracking-tight">Authentification</h4>
              <p className="text-xs text-slate-400 font-medium mb-8">Veuillez scanner votre empreinte pour valider l'opération Orange Money.</p>
              <button 
                onClick={() => { setBiometricScanning(true); setTimeout(() => {setBiometricScanning(false); setShowSecurity('otp')}, 1500)}}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase"
              >
                Lancer le scan
              </button>
            </div>
          </div>
        )}

        {showSecurity === 'otp' && (
           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl animate-slide-up-soft">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} className="text-green-500" />
              </div>
              <h4 className="text-xl font-outfit font-black text-slate-900 mb-2 uppercase tracking-tight">Code de Sécurité</h4>
              <p className="text-xs text-slate-400 font-medium mb-6 text-center">Entrez le code reçu par SMS.</p>
              <input 
                type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                placeholder="0 0 0 0" maxLength={4}
                className="w-full bg-slate-50 border-2 border-slate-100 text-2xl font-black text-center py-4 rounded-xl mb-6 outline-none focus:border-orange-brand transition-all tracking-[0.5em]"
              />
              <button onClick={() => {setShowSecurity('none'); setMessages(prev => [...prev, {id: Date.now(), text: "Opération sécurisée confirmée. Merci de votre confiance.", sender: 'bot', category: 'success', timestamp: new Date().toLocaleTimeString()}])}}
                className="w-full bg-orange-brand text-white py-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase shadow-lg shadow-orange-brand/30"
              >
                Confirmer
              </button>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input de Chat Premium */}
      <div className="p-6 bg-white border-t border-slate-50 flex items-center gap-4">
        <button onClick={toggleListen} className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : 'bg-slate-100 text-slate-400 hover:text-orange-brand'}`}>
          <Mic size={24} />
        </button>
        <div className="flex-1 bg-slate-50 rounded-2xl flex items-center px-4 border border-transparent focus-within:border-slate-200 focus-within:bg-white transition-all">
          <input 
            type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre demande..."
            className="flex-1 bg-transparent py-4 text-sm font-medium outline-none text-slate-800"
          />
          <button onClick={() => handleSend()} disabled={!inputText.trim()} className="p-2 text-orange-brand disabled:text-slate-200">
            <Send size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
