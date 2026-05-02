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
    const timer = setTimeout(() => {
      speakAndSetState("Assistant vocal activé. Je vous écoute.", 'idle');
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });
      const data = await response.json();
      let nextVis = 'idle';
      if (data.category === 'simple') {
        if (text.toLowerCase().includes('solde')) nextVis = 'balance';
        if (text.toLowerCase().includes('pass')) nextVis = 'pass';
      } else if (data.category === 'complexe') nextVis = 'transfer';
      else if (data.category === 'sensible') nextVis = 'security';
      speakAndSetState(data.reply, nextVis);
      setTranscript("");
    } catch (err) {
      speakAndSetState("Erreur de connexion.", 'idle');
    }
  };

  const toggleListen = () => {
    if (!recognition) return;
    if (isListening) { recognition.stop(); setIsListening(false); setVisualState('idle'); }
    else {
      window.speechSynthesis.cancel();
      recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
      recognition.start();
      setIsListening(true);
      setVisualState('listening');
      recognition.onresult = (e: any) => {
        const c = e.results[0][0].transcript;
        setTranscript(c);
        if (e.results[0].isFinal) { setIsListening(false); handleVoiceCommand(c); }
      };
      recognition.onerror = () => { setIsListening(false); setVisualState('idle'); };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative overflow-hidden">
      {/* HUD de status Ultra Tech */}
      <div className="p-8 flex justify-between items-center z-10">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-brand rounded-full animate-pulse shadow-[0_0_10px_#FF7900]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Active</span>
         </div>
         <button onClick={goBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
         </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10 relative">
        {/* Background Visual Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-brand/5 rounded-full blur-[100px]"></div>
        
        <div className="w-full h-80 flex flex-col items-center justify-center space-y-12 z-10">
          {visualState === 'listening' ? (
            <div className="flex flex-col items-center space-y-12">
               <div className="flex items-end gap-1.5 h-16">
                  {[1,2,3,4,3,2,3,4,5,2,1].map((h, i) => (
                    <div key={i} className="w-1 bg-red-500 rounded-full animate-bounce" style={{height: `${h*12}px`, animationDelay: `${i*0.05}s`}}></div>
                  ))}
               </div>
               <p className="text-2xl font-outfit font-black text-center max-w-xs leading-tight uppercase tracking-tight">
                {transcript || "Écoute en cours..."}
               </p>
            </div>
          ) : visualState === 'speaking' ? (
            <div className="flex flex-col items-center space-y-8">
               <div className="flex items-center gap-1 h-32">
                  {[1,2,3,2,1,2,3,2,1].map((h, i) => (
                    <div key={i} className="w-2 bg-orange-brand rounded-full animate-pulse" style={{height: `${h*30}px`, animationDelay: `${i*0.1s}`}}></div>
                  ))}
               </div>
               <div className="w-20 h-20 bg-white text-black rounded-2xl flex items-center justify-center font-black text-4xl shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  O
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
               <div className="w-40 h-40 border border-white/10 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                  <Headphones size={48} className="text-white/20" />
               </div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Prêt pour commande</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="pb-20 pt-10 flex flex-col items-center space-y-6 z-10">
        <button 
          onClick={toggleListen}
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
            isListening 
              ? 'bg-red-600 shadow-[0_0_60px_#dc2626] scale-110' 
              : 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105'
          }`}
        >
          <Mic size={48} />
        </button>
        <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10">
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Interaction mains-libres</span>
        </div>
      </div>
    </div>
  );
}
