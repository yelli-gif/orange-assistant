import { useState, useEffect, useRef } from 'react';
import { Mic, Send, Volume2, KeyRound, PhoneCall, ShieldAlert, CheckCircle2, Fingerprint, Lock } from 'lucide-react';
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
  timestamp: string;
}

const QUICK_ACTIONS = ["Mon Solde", "Pass Internet", "Orange Money", "Assistance réseau"];

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

export default function Chat({ language, initialPrompt, category, interactionMode }: Props) {
  const getWelcomeMsg = () => {
    if (category) return `Bonjour ! Vous êtes dans la section **${category.label}**. Je suis là pour vous aider. Décrivez votre problème ou posez votre question.`;
    return "Bonjour ! Je suis votre Assistant Orange CI. Comment puis-je vous aider ?";
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
    if (interactionMode === 'text') return; // Silence en mode message
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      speak(data.reply);

      if (data.category === 'sensible') {
        setTimeout(() => setShowSecurity('biometric'), 1500);
      }

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Désolé, je n'arrive pas à joindre le serveur. Essayez plus tard.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // Envoi automatique du prompt de la catégorie (déclenché après init de handleSend)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (initialPrompt) {
      const timer = setTimeout(() => handleSend(initialPrompt), 800);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt]);

  const toggleListen = () => {
    if (!recognition) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };
    }
  };

  const simulateBiometric = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setShowSecurity('otp');
    }, 2000);
  };

  const verifyOtp = async () => {
    try {
      const resp = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: '0000', otp: otpCode })
      });
      const data = await resp.json();
      
      if (data.success) {
        setShowSecurity('none');
        setOtpCode("");
        const successMsg: Message = {
          id: Date.now(),
          text: "Authentification réussie. Votre opération a été traitée avec succès en toute confidentialité.",
          sender: 'bot',
          category: 'success',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, successMsg]);
        speak(successMsg.text);
      } else {
        alert("Code OTP invalide (essayez : 1234)");
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-slide-up relative">
      {/* Badge de sécurité */}
      <div className="bg-green-50 text-green-700 text-xs py-2 px-4 flex items-center justify-center gap-2 border-b border-green-200">
        <Lock size={14} /> Données chiffrées de bout en bout
      </div>

      {/* Historique du Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-orange-brand text-white rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                {msg.sender === 'bot' && (
                  <button onClick={() => speak(msg.text)} className="text-slate-400 hover:text-orange-brand flex-shrink-0">
                    <Volume2 size={18} />
                  </button>
                )}
              </div>
              
              {msg.category === 'sensible' && (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <ShieldAlert size={14} /> Authentification requise
                </div>
              )}
              {msg.category === 'complexe' && (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <PhoneCall size={14} /> Transfert en cours...
                </div>
              )}
              {msg.category === 'success' && (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">
                  <CheckCircle2 size={14} /> Opération confirmée
                </div>
              )}
              
              <span className={`text-[10px] mt-2 block font-medium ${msg.sender === 'user' ? 'text-orange-100' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        
        {/* Indicateur de frappe */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-brand/60 rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-orange-brand/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2.5 h-2.5 bg-orange-brand/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}

        {/* Modal Sécurité : Biométrie */}
        {showSecurity === 'biometric' && (
          <div className="bg-white border border-amber-200 p-6 rounded-3xl max-w-[90%] mx-auto shadow-xl animate-fade-in text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-brand to-amber-400"></div>
            <div className="flex items-center justify-center gap-3 text-amber-600 mb-4 mt-2">
              <ShieldAlert size={28} />
              <h4 className="font-bold text-lg text-slate-800">Sécurité Orange</h4>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-6">Afin de protéger vos fonds, veuillez confirmer votre identité.</p>
            
            <button 
              onClick={simulateBiometric}
              className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                biometricScanning 
                ? 'bg-amber-50 border-2 border-orange-brand text-orange-brand animate-pulse' 
                : 'bg-slate-50 border-2 border-slate-200 hover:border-orange-brand hover:bg-orange-50 text-slate-400 hover:text-orange-brand'
              }`}
            >
              <Fingerprint size={48} className={biometricScanning ? 'animate-bounce' : ''} />
            </button>
            <p className="text-xs font-semibold text-slate-500 mt-5">Touchez le capteur d'empreinte digitale pour valider</p>
          </div>
        )}

        {/* Modal Sécurité : OTP */}
        {showSecurity === 'otp' && (
          <div className="bg-white border border-orange-200 p-6 rounded-3xl max-w-[90%] mx-auto shadow-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-brand"></div>
            <div className="flex items-center gap-3 text-orange-brand mb-4 justify-center mt-2">
              <KeyRound size={24} />
              <h4 className="font-bold text-slate-800 text-lg">Validation SMS</h4>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-6 text-center">Entrez le code à 4 chiffres reçu au ** ** ** ** 45.</p>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Ex: 1234"
                maxLength={4}
                className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-center tracking-widest focus:outline-none focus:border-orange-brand focus:bg-white font-bold text-xl transition-colors"
              />
              <button onClick={verifyOtp} className="bg-orange-brand hover:bg-orange-600 px-6 rounded-xl text-white transition-colors shadow-lg shadow-orange-brand/30">
                <CheckCircle2 size={28} />
              </button>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 flex gap-3 overflow-x-auto hide-scrollbar whitespace-nowrap border-t border-slate-200 bg-white/90 backdrop-blur-sm">
        {QUICK_ACTIONS.map((action, idx) => (
          <button 
            key={idx}
            onClick={() => handleSend(action)}
            className="text-sm font-semibold bg-orange-50 border border-orange-200 text-orange-700 px-5 py-2 rounded-full hover:bg-orange-100 hover:border-orange-300 transition-colors shadow-sm"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Zone de saisie */}
      <div className="p-4 bg-white flex items-end gap-3 pb-6">
        <button 
          onClick={toggleListen}
          className={`p-4 rounded-full transition-all flex-shrink-0 shadow-md ${
            isListening 
              ? 'bg-red-500 animate-pulse-fast shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : 'bg-orange-brand hover:bg-orange-600 shadow-orange-brand/30'
          } text-white`}
        >
          <Mic size={24} />
        </button>
        <div className="flex-1 bg-slate-100 border-2 border-transparent rounded-3xl flex items-center px-4 py-1.5 focus-within:border-orange-brand/50 focus-within:bg-white transition-all shadow-inner">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez ou parlez..."
            className="flex-1 bg-transparent text-slate-800 font-medium outline-none placeholder:text-slate-400 py-2"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="text-orange-brand disabled:text-slate-300 disabled:cursor-not-allowed p-2 ml-1 hover:bg-orange-50 rounded-full transition-colors"
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
