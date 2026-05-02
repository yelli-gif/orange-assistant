import React, { useEffect, useState } from 'react';
import { Volume2, Mic } from 'lucide-react';
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
    const msg = new SpeechSynthesisUtterance("Akwaba. Bienvenue. Dites votre langue à haute voix : Français, Dioula, Baoulé, Nouchi, ou English.");
    msg.lang = 'fr-FR';
    msg.onend = () => {
      startListening();
    };
    window.speechSynthesis.speak(msg);

    return () => {
      window.speechSynthesis.cancel();
    };
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

  const playAudio = (text: string) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10 animate-fade-in bg-white relative">
      {isListening && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-full animate-pulse border border-red-200">
          <Mic size={16} /> 
          <span className="text-xs font-bold">Je vous écoute...</span>
        </div>
      )}

      <div className="text-center space-y-3">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Akwaba !
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          Dites votre langue à voix haute<br/>ou cliquez sur un bouton
        </p>
      </div>

      <div className="w-full space-y-4">
        {languages.map((lang) => (
          <div key={lang.code} className="flex items-center space-x-3 w-full">
            <button 
              onClick={() => onSelect(lang.code)}
              className="flex-1 bg-white hover:bg-slate-50 active:bg-orange-50 border-2 border-slate-100 hover:border-orange-brand/50 py-4 px-6 rounded-2xl text-left font-bold text-slate-800 transition-all duration-200 shadow-sm"
            >
              {lang.label}
            </button>
            <button 
              onClick={() => playAudio(`Dites ou cliquez ici pour choisir ${lang.speak}`)}
              className="p-4 bg-orange-50 border-2 border-orange-100 rounded-2xl hover:bg-orange-100 transition-colors text-orange-brand"
              aria-label={`Écouter ${lang.label}`}
            >
              <Volume2 size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
