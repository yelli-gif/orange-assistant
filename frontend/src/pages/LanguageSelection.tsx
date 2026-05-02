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
    <div className="flex-1 flex flex-col p-8 bg-[#F9F9F9] animate-fade-in relative overflow-hidden">
      
      <div className="mb-10 space-y-3">
        <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight">
          Choisissez votre langue
        </h2>
        <p className="text-[#757575] font-medium text-[15px] leading-snug">
          Sélectionnez la langue avec laquelle vous souhaitez interagir avec l'assistant.
        </p>
      </div>

      {/* Grille de Langues - Votre Image 2 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {languages.map((lang) => (
          <button 
            key={lang.code}
            onClick={() => setSelected(lang.code as Language)}
            className={`relative flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-2 transition-all shadow-sm ${
              selected === lang.code ? 'border-orange-brand shadow-orange-brand/5' : 'border-transparent'
            }`}
          >
             {selected === lang.code && (
               <div className="absolute top-3 right-3 text-orange-brand">
                 <CheckCircle2 size={16} fill="currentColor" fillOpacity={0.1} />
               </div>
             )}
             <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 transition-colors">
                {lang.icon}
             </div>
             <span className={`font-bold text-lg ${selected === lang.code ? 'text-slate-900' : 'text-slate-400 font-medium'}`}>
                {lang.label}
             </span>
          </button>
        ))}
      </div>

      {/* Image Illustrative - Votre Image 2 (Simulée) */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl mb-10 group">
         <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" 
            alt="Local Language" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
            <p className="text-white font-bold text-xl leading-tight">Votre assistant parle votre langue locale.</p>
         </div>
      </div>

      {/* Bouton Continuer - Votre Image 3 */}
      <div className="mt-auto">
        <button 
          onClick={() => onSelect(selected)}
          className="w-full bg-[#FF7900] text-white py-5 rounded-[20px] font-bold text-lg shadow-xl shadow-orange-brand/20 active:scale-95 transition-transform"
        >
          Continuer
        </button>
      </div>

    </div>
  );
}
