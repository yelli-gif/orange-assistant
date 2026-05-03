import { useEffect } from 'react';
import { Wifi, Smartphone, Wallet, ShieldAlert, Mic, Volume2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'network', label: 'Réseau', icon: <Wifi size={24} />, speak: "Problème de connexion internet ou réseau." },
  { id: 'offer', label: 'Forfait', icon: <Smartphone size={24} />, speak: "Mon forfait n'a pas été activé." },
  { id: 'money', label: 'Monnaie', icon: <Wallet size={24} />, speak: "Problème avec mon argent Orange Money." },
  { id: 'sim', label: 'Carte SIM', icon: <ShieldAlert size={24} />, speak: "J'ai perdu ma puce Orange." },
];

interface Props {
  language: string | null;
}

export default function Claim({ language }: Props) {
  
  useEffect(() => {
    const text = language === 'en' ? "Tell us your problem. Speak or choose a category." : "Dites-moi votre problème. Appuyez sur une image pour l'écouter, ou parlez-moi directement.";
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
    return () => window.speechSynthesis.cancel();
  }, [language]);

  const speak = (txt: string) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(txt);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#F9F9F9] overflow-y-auto pb-24 animate-fade-in text-center items-center">
      
      <div className="mb-10 mt-2 space-y-4">
        <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight leading-[0.9]">Aide & <br/>Réclamation</h2>
        <p className="text-[#757575] font-medium text-[15px] max-w-[200px] mx-auto">
          Choisissez votre problème ci-dessous.
        </p>
      </div>

      <div className="mb-8 w-full">
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => speak(cat.speak)} className="flex flex-col items-center justify-center p-8 bg-white border-2 border-transparent rounded-3xl transition-all shadow-sm active:border-orange-brand active:scale-95">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-orange-brand">
                  {cat.icon}
               </div>
               <span className="text-[13px] font-bold text-slate-800 uppercase tracking-widest leading-none">
                  {cat.label}
               </span>
               <Volume2 size={14} className="mt-2 text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Bouton Vocal Géant - Crucial pour les non-lettrés */}
      <div className="mb-10 w-full">
        <p className="text-[11px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Ou parlez-moi directement</p>
        <button 
          onClick={() => speak("Je vous écoute. Racontez-moi votre problème et je m'en occupe.")}
          className="w-full bg-orange-brand text-white p-10 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-2xl shadow-orange-brand/20 active:scale-95 transition-transform"
        >
          <Mic size={48} />
          <span className="font-outfit font-black text-2xl uppercase tracking-tighter">Expliquer mon{"\n"}problème</span>
        </button>
      </div>

      <div className="w-full text-center">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-100 pt-6">L'agence Orange CI vous accompagne 24h/24</p>
      </div>

    </div>
  );
}
