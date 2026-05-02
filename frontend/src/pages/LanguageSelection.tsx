import { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';

import type { Language } from '../App';

interface Props {
  onSelect: (lang: Language) => void;
}

const languages = [
  { code: 'fr', label: 'Français', speak: 'Français' },
  { code: 'nouchi', label: 'Nouchi', speak: 'Nouchi' },
  { code: 'dioula', label: 'Dioula', speak: 'Dioula' },
  { code: 'baoule', label: 'Baoulé', speak: 'Baoulé' },
  { code: 'en', label: 'English', speak: 'English' },
] as const;

export default function LanguageSelection({ onSelect }: Props) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const msg = new SpeechSynthesisUtterance("Bienvenue. Veuillez sélectionner votre langue.");
      msg.lang = 'fr-FR';
      msg.onend = () => startListening();
      window.speechSynthesis.speak(msg);
    }, 800);
    return () => { window.speechSynthesis.cancel(); clearTimeout(timer); };
  }, []);

  
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript.toLowerCase();
      if (transcript.includes('français') || transcript.includes('francais')) onSelect('fr');
      else if (transcript.includes('dioula') || transcript.includes('djoula')) onSelect('dioula');
      else if (transcript.includes('baoulé') || transcript.includes('baoule')) onSelect('baoule');
      else if (transcript.includes('nouchi')) onSelect('nouchi');
      else if (transcript.includes('english') || transcript.includes('anglais')) onSelect('en');
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };


  return (
    <div className="flex-1 flex flex-col p-8 bg-white animate-slide-up-soft h-full">
      <div className="mb-10 space-y-2">
        <h2 className="text-3xl font-outfit font-black text-slate-900 tracking-tight">
          Langue
        </h2>
        <p className="text-slate-400 font-semibold text-xs uppercase tracking-widest leading-relaxed">
          Choisissez votre mode d'expression
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {languages.map((lang) => (
          <button 
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition-all duration-200 group relative overflow-hidden"
          >
             <div className="absolute left-0 top-0 w-1 h-full bg-orange-brand opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 text-lg uppercase tracking-tight">{lang.label}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sélectionner {lang.label}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-orange-brand shadow-sm group-hover:shadow-md transition-all">
                <Volume2 size={18} />
             </div>
          </button>
        ))}
      </div>

      {isListening && (
        <div className="mt-6 flex items-center justify-center gap-3 bg-red-50 py-4 rounded-xl border border-red-100 animate-pulse">
           <div className="w-2 h-2 bg-red-500 rounded-full"></div>
           <span className="text-xs font-black text-red-600 uppercase tracking-widest">Écoute active en cours...</span>
        </div>
      )}
    </div>
  );
}

