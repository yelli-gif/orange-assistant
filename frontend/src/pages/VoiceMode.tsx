import React, { useState, useEffect } from 'react';
import { Mic, Headphones, Wallet, Wifi, PhoneCall, ShieldAlert } from 'lucide-react';
import type { Language } from '../App';

interface Props {
  language: Language;
  goBack: () => void;
}

export default function VoiceMode({ language, goBack }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [visualState, setVisualState] = useState<'idle' | 'listening' | 'speaking' | 'balance' | 'pass' | 'transfer' | 'security'>('speaking');

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    // Message de bienvenue initial
    setTimeout(() => {
      speakAndSetState("Bonjour ! Appuyez sur le gros bouton orange en bas pour me parler directement.", 'idle');
    }, 500);
  }, []);

  const speakAndSetState = (text: string, nextState: any = 'idle') => {
    setVisualState('speaking');
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    msg.onend = () => setVisualState(nextState);
    window.speechSynthesis.speak(msg);
  };

  const handleVoiceCommand = async (text: string) => {
    setVisualState('speaking');
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
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

    } catch (err) {
      speakAndSetState("Pardon, la connexion a échoué. Réessayez.", 'idle');
    }
  };

  const toggleListen = () => {
    if (!recognition) {
      speakAndSetState("Microphone non supporté sur cet appareil.", 'idle');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setVisualState('idle');
    } else {
      window.speechSynthesis.cancel(); // Coupe la parole si l'IA parlait
      recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
      recognition.start();
      setIsListening(true);
      setVisualState('listening');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleVoiceCommand(transcript);
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
        return <div className="text-center animate-fade-in"><Headphones size={120} className="text-slate-200 mx-auto drop-shadow-sm" /></div>;
      case 'listening':
        return <div className="text-center animate-pulse"><Mic size={140} className="text-red-500 mx-auto drop-shadow-lg" /></div>;
      case 'speaking':
        return (
          <div className="relative flex justify-center items-center">
            <div className="absolute w-64 h-64 bg-orange-brand/10 rounded-full animate-ping"></div>
            <div className="absolute w-48 h-48 bg-orange-brand/30 rounded-full animate-pulse"></div>
            <div className="w-32 h-32 bg-orange-brand rounded-full z-10 shadow-2xl shadow-orange-brand/60"></div>
          </div>
        );
      case 'balance':
        return (
          <div className="text-center animate-bounce">
            <Wallet size={120} className="text-orange-brand mx-auto mb-6 drop-shadow-md" />
            <h1 className="text-6xl font-black text-slate-800 tracking-tighter">4500<span className="text-3xl">F</span></h1>
          </div>
        );
      case 'pass':
        return (
          <div className="text-center animate-fade-in">
            <Wifi size={120} className="text-blue-500 mx-auto mb-6 drop-shadow-md" />
            <h1 className="text-6xl font-black text-slate-800 tracking-tighter">1<span className="text-3xl">Go</span></h1>
          </div>
        );
      case 'transfer':
        return <div className="text-center animate-pulse"><PhoneCall size={120} className="text-green-500 mx-auto drop-shadow-md" /></div>;
      case 'security':
        return <div className="text-center animate-pulse"><ShieldAlert size={120} className="text-amber-500 mx-auto drop-shadow-md" /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* L'espace visuel principal ultra épuré (0 texte informatif) */}
        <div className="w-full h-80 flex items-center justify-center">
          {renderVisual()}
        </div>
      </div>

      {/* Le Micro Gigantesque seul bouton actionnable */}
      <div className="pb-12 pt-8 px-8 flex justify-center bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <button 
          onClick={toggleListen}
          className={`w-36 h-36 rounded-full flex items-center justify-center transition-all shadow-2xl ${
            isListening 
              ? 'bg-red-500 shadow-red-500/50 scale-110' 
              : 'bg-orange-brand hover:bg-orange-600 shadow-orange-brand/40 hover:scale-105'
          }`}
        >
          <Mic size={64} className="text-white" />
        </button>
      </div>
    </div>
  );
}
