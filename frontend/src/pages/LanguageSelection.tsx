import { useEffect, useState } from 'react';
import { Globe, User, CheckCircle2 } from 'lucide-react';
import type { Language } from '../App';

interface Props {
  onSelect: (lang: Language) => void;
}

const languages = [
  { code: 'fr', label: 'Français', icon: <Globe size={28} className="text-orange-brand" />, active: true },
  { code: 'en', label: 'Anglais', icon: <Globe size={28} className="text-slate-400" /> },
  { code: 'dioula', label: 'Dioula', icon: <User size={28} className="text-slate-400" /> },
  { code: 'baoule', label: 'Baoulé', icon: <User size={28} className="text-slate-400" /> },
] as const;

export default function LanguageSelection({ onSelect }: Props) {
  const [selected, setSelected] = useState<Language>('fr');

  useEffect(() => {
    const msg = new SpeechSynthesisUtterance("Choisissez votre langue.");
    msg.lang = 'fr-FR';
    window.speechSynthesis.speak(msg);
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="flex flex-col p-8 bg-[#F9F9F9] animate-fade-in pb-10">
      
      <div className="mb-10 space-y-3">
        <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight">
          Choisissez votre langue
        </h2>
        <p className="text-[#757575] font-medium text-[15px] leading-snug">
          Sélectionnez la langue avec laquelle vous souhaitez interagir avec l'assistant.
        </p>
      </div>

      {/* Grille de Langues */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {languages.map((lang) => (
          <button 
            key={lang.code}
            onClick={() => {
              setSelected(lang.code as Language);
              // Optionnel: onSelect(lang.code as Language);
            }}
            className={`relative flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-2 transition-all shadow-sm active:scale-95 cursor-pointer z-10 ${
              selected === lang.code ? 'border-orange-brand shadow-orange-brand/10' : 'border-transparent'
            }`}
          >
             {selected === lang.code && (
               <div className="absolute top-3 right-3 text-orange-brand">
                 <CheckCircle2 size={16} fill="currentColor" fillOpacity={0.1} />
               </div>
             )}
             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 pointer-events-none">
                {lang.icon}
             </div>
             <span className={`font-bold text-lg pointer-events-none ${selected === lang.code ? 'text-slate-900' : 'text-slate-400 font-medium'}`}>
                {lang.label}
             </span>
          </button>
        ))}
      </div>

      {/* Image Illustrative */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl mb-10">
         <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" 
            alt="Local Language" 
            className="w-full h-full object-cover grayscale"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
            <p className="text-white font-bold text-xl leading-tight">Votre assistant parle votre langue locale.</p>
         </div>
      </div>

      {/* Bouton Continuer Unique au milieu/bas */}
      <div className="pt-4">
        <button 
          onClick={() => onSelect(selected)}
          className="w-full bg-[#FF7900] text-white py-6 rounded-[22px] font-black text-xl shadow-2xl shadow-orange-brand/30 active:scale-95 cursor-pointer z-20 uppercase tracking-tighter"
        >
          Continuer
        </button>
      </div>

    </div>
  );
}
