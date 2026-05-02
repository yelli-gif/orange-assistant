import { useState, useEffect } from 'react';
import { Mic, Headphones, Wallet, Wifi, PhoneCall, ShieldAlert, X } from 'lucide-react';
import type { Language } from '../App';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

interface Props {
  language: Language;
  goBack: () => void;
}

export default function VoiceMode({ language, goBack }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [visualState, setVisualState] = useState<'idle' | 'listening' | 'speaking' | 'balance' | 'pass' | 'transfer' | 'security'>('speaking');

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    // Message de bienvenue initial
    const timer = setTimeout(() => {
      speakAndSetState("Akwaba ! Je vous écoute. Appuyez sur le micro pour me parler.", 'idle');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const speakAndSetState = (text: string, nextState: any = 'idle') => {
    window.speechSynthesis.cancel();
    setVisualState('speaking');
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    msg.onend = () => setVisualState(nextState);
    window.speechSynthesis.speak(msg);
  };

  const handleVoiceCommand = async (text: string) => {
    setVisualState('speaking');
    
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });
      const data = await response.json();

      let nextVis = 'idle';
      if (data.category === 'simple') {
        if (text.toLowerCase().includes('solde')) nextVis = 'balance';
        if (text.toLowerCase().includes('pass') || text.toLowerCase().includes('internet')) nextVis = 'pass';
      } else if (data.category === 'complexe') {
        nextVis = 'transfer';
      } else if (data.category === 'sensible') {
        nextVis = 'security';
      }

      speakAndSetState(data.reply, nextVis);
      setTranscript(""); // Reset après réponse

    } catch (err) {
      speakAndSetState("Désolé, il y a un petit souci technique. Réessayez.", 'idle');
    }
  };

  const toggleListen = () => {
    if (!recognition) {
      speakAndSetState("Désolé, je ne peux pas utiliser le micro sur ce téléphone.", 'idle');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setVisualState('idle');
    } else {
      window.speechSynthesis.cancel();
      recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.start();
      setIsListening(true);
      setVisualState('listening');

      recognition.onresult = (event: any) => {
        const current = event.results[0][0].transcript;
        setTranscript(current);
        if (event.results[0].isFinal) {
          setIsListening(false);
          handleVoiceCommand(current);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVisualState('idle');
      };
    }
  };

  const renderVisual = () => {
    switch (visualState) {
      case 'idle':
        return (
          <div className="flex flex-col items-center animate-fade-in space-y-6">
            <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
              <Headphones size={80} className="text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-400">Je vous attends...</p>
          </div>
        );
      case 'listening':
        return (
          <div className="flex flex-col items-center space-y-8 h-full justify-center w-full">
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/20 rounded-full animate-ping"></div>
              <div className="relative w-32 h-32 bg-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 z-10">
                <Mic size={54} className="text-white" />
              </div>
            </div>
            <div className="px-6 text-center max-w-xs">
              <p className="text-3xl font-black text-slate-900 leading-tight break-words animate-pulse">
                {transcript || "Parlez maintenant"}
              </p>
            </div>
          </div>
        );
      case 'speaking':
        return (
          <div className="relative flex flex-col items-center space-y-10">
            <div className="flex items-center gap-1.5 h-20">
              {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                <div key={i} className="w-1.5 bg-orange-brand rounded-full animate-bounce" style={{ height: `${h * 15}px`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
            <div className="w-40 h-40 bg-orange-brand rounded-full flex items-center justify-center shadow-2xl shadow-orange-brand/50 border-8 border-orange-50">
               <span className="text-white font-black text-7xl">O</span>
            </div>
          </div>
        );
      case 'balance':
        return (
          <div className="text-center animate-bounce flex flex-col items-center">
            <div className="w-32 h-32 bg-green-50 rounded-3xl flex items-center justify-center mb-6 border-2 border-green-100">
               <Wallet size={64} className="text-green-600" />
            </div>
            <h1 className="text-7xl font-black text-slate-900">4500<span className="text-3xl ml-1">F</span></h1>
          </div>
        );
      case 'pass':
        return (
          <div className="text-center animate-fade-in flex flex-col items-center">
            <div className="w-32 h-32 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 border-2 border-blue-100">
               <Wifi size={64} className="text-blue-600" />
            </div>
            <h1 className="text-7xl font-black text-slate-900">1<span className="text-3xl ml-1">Go</span></h1>
          </div>
        );
      case 'transfer':
        return (
          <div className="flex flex-col items-center space-y-4 text-green-600">
            <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center animate-pulse border-4 border-green-200">
              <PhoneCall size={64} />
            </div>
            <p className="font-bold">Appel en cours...</p>
          </div>
        );
      case 'security':
        return (
          <div className="flex flex-col items-center space-y-4 text-amber-600">
            <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center animate-pulse border-4 border-amber-200">
              <ShieldAlert size={64} />
            </div>
            <p className="font-bold">Vérification...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Bouton de sortie discret mais accessible */}
      <button 
        onClick={goBack} 
        className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full z-20 transition-colors"
      >
        <X size={24} />
      </button>

      {/* Zone de Langue Locales Indicator */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="px-3 py-1 bg-orange-50 text-orange-700 text-[10px] font-black rounded-full border border-orange-100 uppercase tracking-widest">
          {language}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <div className="w-full h-[400px] flex items-center justify-center">
          {renderVisual()}
        </div>
      </div>

      {/* Le Micro Gigantesque */}
      <div className="pb-16 pt-8 flex justify-center">
        <button 
          onClick={toggleListen}
          className={`group w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 relative ${
            isListening 
              ? 'bg-red-500 scale-110 shadow-[0_0_50px_rgba(239,68,68,0.4)]' 
              : 'bg-orange-brand hover:scale-105 shadow-[0_20px_50px_rgba(255,121,0,0.3)]'
          }`}
        >
          {isListening ? (
             <div className="absolute w-full h-full rounded-full border-4 border-white/30 animate-ping"></div>
          ) : null}
          <Mic size={72} className="text-white z-10 group-active:scale-90 transition-transform" />
        </button>
      </div>
    </div>
  );
}

