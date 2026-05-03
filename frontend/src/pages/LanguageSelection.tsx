import { useEffect, useState } from 'react';
import { Globe, Mic } from 'lucide-react';
import type { Language } from '../App';

interface Props {
  onSelect: (lang: Language) => void;
}

const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'dioula', label: 'Dioula' },
  { code: 'baoule', label: 'Baoulé' },
] as const;

export default function LanguageSelection({ onSelect }: Props) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const msg = new SpeechSynthesisUtterance("Dites : Français, English, Dioula ou Baoulé.");
    msg.lang = 'fr-FR';
    window.speechSynthesis.speak(msg);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (transcript.includes('français')) onSelect('fr');
        else if (transcript.includes('english') || transcript.includes('anglais')) onSelect('en');
        else if (transcript.includes('dioula')) onSelect('dioula');
        else if (transcript.includes('baoulé')) onSelect('baoule');
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
      return () => {
        recognition.stop();
        window.speechSynthesis.cancel();
      };
    }
  }, [onSelect]);

  return (
    <div className="flex flex-col p-8 bg-[#F9F9F9] animate-fade-in pb-10">
      <div className="mb-10 space-y-3">
        <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight">
          Votre langue
        </h2>
        <p className="text-[#757575] font-medium text-[15px] leading-snug">
          Dites votre langue ou cliquez sur votre choix pour continuer.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {languages.map((lang) => (
          <button 
            key={lang.code}
            onClick={() => onSelect(lang.code as Language)}
            className="relative flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] border-2 border-transparent transition-all shadow-sm active:scale-95 hover:border-orange-brand"
          >
             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Globe size={28} className="text-slate-400 group-hover:text-orange-brand" />
             </div>
             <span className="font-black text-lg text-slate-800">
                {lang.label}
             </span>
          </button>
        ))}
      </div>

      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl mb-12">
         <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" 
            alt="Local Language" 
            className="w-full h-full object-cover grayscale"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-center">
            <p className="text-white font-bold text-lg leading-tight uppercase tracking-widest">Inclusivité Orange</p>
         </div>
      </div>

      <div className={`p-10 rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center gap-6 ${isListening ? 'border-orange-brand bg-orange-50' : 'border-slate-200 bg-white'}`}>
         <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${isListening ? 'bg-orange-brand text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
            <Mic size={32} />
         </div>
         <p className={`font-black text-xs uppercase tracking-widest ${isListening ? 'text-orange-brand' : 'text-slate-400'}`}>
            {isListening ? "Je vous écoute..." : "Micro activé"}
         </p>
      </div>
    </div>
  );
}
