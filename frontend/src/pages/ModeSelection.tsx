import { useEffect } from 'react';
import { MessageSquare, Mic, ArrowRight } from 'lucide-react';
import type { Screen } from '../App';

interface Props {
  onSelect: (mode: Screen) => void;
  language: string | null;
}

export default function ModeSelection({ onSelect, language }: Props) {
  
  useEffect(() => {
    const msg = new SpeechSynthesisUtterance(language === 'en' ? "Choose your mode: Message or Voice." : "Choisissez votre mode : Message ou Voix.");
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
    return () => window.speechSynthesis.cancel();
  }, [language]);

  return (
    <div className="flex-1 flex flex-col p-8 bg-white animate-slide-up-soft h-full">
      <div className="mb-12 space-y-2">
        <h2 className="text-3xl font-outfit font-black text-slate-900 tracking-tight">
          Interaction
        </h2>
        <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest leading-relaxed">
          Comment souhaitez-vous échanger ?
        </p>
      </div>

      <div className="flex-1 space-y-6">
        <button 
          onClick={() => onSelect('CHAT_TEXT')}
          className="w-full flex items-center gap-6 p-8 bg-slate-50 hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-100 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-2xl bg-white group-hover:bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-orange-brand transition-colors shadow-sm">
            <MessageSquare size={32} strokeWidth={1.5} />
          </div>
          <div className="flex-1 text-left">
            <span className="block font-outfit font-bold text-xl uppercase tracking-tighter">Par Message</span>
            <span className="text-xs font-medium text-slate-400 group-hover:text-white/50">Pour les environnements calmes</span>
          </div>
          <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <button 
          onClick={() => onSelect('CHAT_VOICE')}
          className="w-full flex items-center gap-6 p-8 bg-slate-50 hover:bg-orange-brand text-slate-900 hover:text-white border border-slate-100 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="w-16 h-16 rounded-2xl bg-white group-hover:bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors shadow-sm">
            <Mic size={32} strokeWidth={1.5} />
          </div>
          <div className="flex-1 text-left">
            <span className="block font-outfit font-bold text-xl uppercase tracking-tighter">Par la Voix</span>
            <span className="text-xs font-medium text-slate-400 group-hover:text-white/50">Navigation 100% mains-libres</span>
          </div>
          <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Technologie de reconnaissance intelligente v2.0</p>
      </div>
    </div>
  );
}
