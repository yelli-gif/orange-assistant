import { useEffect } from 'react';
import { Wifi, Smartphone, Receipt, Headphones, Mic, Search } from 'lucide-react';
import type { Language } from '../App';

interface Props {
  language: Language;
  interactionMode?: 'text' | 'voice';
}

const COMPLAINTS = [
  { id: 'network', label: 'Problèmes Réseau', sub: 'Signal faible, coupures d\'appels ou internet lent dans votre zone.', icon: <Wifi size={24} />, speak: "Problème de réseau ou internet lent." },
  { id: 'sim', label: 'Blocage Carte SIM', sub: 'Code PUK perdu, SIM bloquée ou renouvellement de ligne.', icon: <Smartphone size={24} />, speak: "Carte SIM bloquée ou code PUK perdu." },
  { id: 'billing', label: 'Facturation', sub: 'Contestation de solde, erreurs de débit ou historique de recharge.', icon: <Receipt size={24} />, speak: "Problème de facture ou de prélèvement." },
];

export default function Claim({ language, interactionMode }: Props) {
  
  useEffect(() => {
    if (interactionMode !== 'voice') return;

    const text = language === 'en' 
      ? "Help and support. Choose a category or speak directly to an advisor." 
      : "Assistance et réclamations. Choisissez une catégorie ou parlez directement à un conseiller.";
    
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);

    return () => window.speechSynthesis.cancel();
  }, [language, interactionMode]);

  const speak = (msgText: string) => {
    if (interactionMode !== 'voice') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msgText);
    utterance.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col p-6 animate-fade-in pb-10 bg-[#F9F9F9]">
      
      {/* Header Interne - Image 16 */}
      <div className="mb-8 mt-2 space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-[32px] font-outfit font-black text-[#1A1A1A] leading-tight tracking-tight">
                Assistance & <br/> Réclamations
            </h2>
            <div className="flex gap-2">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                    <Search size={20} />
                </button>
            </div>
        </div>
        <p className="text-[#666666] font-medium text-[14px] leading-relaxed max-w-[90%]">
            Comment pouvons-nous vous aider aujourd'hui ? Sélectionnez une catégorie ou parlez directement à un conseiller.
        </p>
      </div>

      {/* Categories List - Image 16 */}
      <div className="space-y-4 mb-10">
        {COMPLAINTS.map((item) => (
          <button 
            key={item.id}
            onClick={() => { speak(item.speak); }}
            className="w-full bg-white p-7 rounded-[2.5rem] flex flex-col items-start text-left border border-slate-50 shadow-sm active:scale-95 transition-all group"
          >
            <div className="w-14 h-14 bg-[#FFF5ED] rounded-2xl flex items-center justify-center text-orange-brand mb-5 group-hover:bg-orange-brand group-hover:text-white transition-colors">
               {item.icon}
            </div>
            <p className="font-black text-[#1A1A1A] text-xl mb-2">{item.label}</p>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed">{item.sub}</p>
          </button>
        ))}
      </div>

      {/* Human Assistance Banner - Image 15 */}
      <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl mb-12 group">
         <img 
            src="https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=800" 
            alt="Customer Expert" 
            className="w-full h-full object-cover"
         />
         {/* Overlay Sombri */}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 space-y-6">
            <div className="bg-orange-brand text-white text-[10px] font-black px-4 py-1.5 rounded-full inline-block self-start uppercase tracking-widest animate-pulse">
               Disponible Maintenant
            </div>
            
            <div className="space-y-4">
                <h3 className="text-white font-black text-3xl leading-tight">Besoin d'une assistance personnalisée ?</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed">
                   Nos experts sont en ligne pour résoudre vos demandes les plus complexes en direct.
                </p>
            </div>

            <button 
                onClick={() => speak("Je vous mets en relation avec un de nos experts. Veuillez patienter.")}
                className="w-full bg-[#FF7900] text-white py-5 rounded-[22px] font-black text-sm flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all uppercase tracking-tighter"
            >
               <Headphones size={22} />
               Parler à un conseiller humain
            </button>
         </div>
      </div>

      {/* Microphone flottant incitatif */}
      <div className="flex flex-col items-center gap-4 py-10">
         <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-50">
            <Mic size={32} className="text-orange-brand" />
         </div>
         <p className="text-[#A35200] font-black text-[11px] uppercase tracking-[0.2em]">Dites simplement votre problème</p>
      </div>

    </div>
  );
}
