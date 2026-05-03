import { useState, useEffect } from 'react';
import { Wifi, Zap, Volume2 } from 'lucide-react';

const PACKAGES = [
  { id: 1, amount: '500 Mo', price: '500 francs', validity: 'Valide 24 heures', icon: <Wifi size={24} className="text-orange-brand" />, speak: "Pack 500 méga, prix 500 francs, valable 24 heures." },
  { id: 2, amount: '1 Go', price: '1 000 francs', validity: 'Valide 24 heures', icon: <Zap size={24} className="text-orange-900/30" />, speak: "Pack 1 giga, prix 1000 francs, valable 24 heures." },
  { id: 3, amount: '2 Go', price: '1 800 francs', validity: 'Valide 3 jours', icon: <Zap size={24} className="text-orange-900/30" />, speak: "Pack 2 gigas, prix 1800 francs, valable 3 jours." },
];

interface Props {
  language: string | null;
  interactionMode?: 'text' | 'voice';
}

export default function Purchase({ language, interactionMode }: Props) {
  const [tab, setTab] = useState('Journalier');
  const [selectedId, setSelectedId] = useState(1);

  useEffect(() => {
    if (interactionMode !== 'voice') return;
    const text = language === 'en' ? "Choose your internet package." : "Choisissez votre forfait internet. Cliquez sur un prix pour l'entendre.";
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
    return () => window.speechSynthesis.cancel();
  }, [language]);

  const speak = (msgText: string) => {
    if (interactionMode !== 'voice') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msgText);
    utterance.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col p-8 animate-fade-in relative pb-10">
      
      <div className="mb-10 mt-2 flex justify-between items-start">
        <div className="max-w-[80%]">
            <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight whitespace-pre-line">Achat de{"\n"}forfait</h2>
            <p className="text-[#757575] font-medium text-[15px] mt-2">Écoutez les offres avant d'acheter.</p>
        </div>
        <button onClick={() => speak("Ici vous pouvez acheter de l'internet. Choisissez entre jour, semaine ou mois.")} className="p-3 bg-white rounded-full shadow-sm text-orange-brand">
            <Volume2 size={24} />
        </button>
      </div>

      {/* Tabs - Image 3 */}
      <div className="flex bg-slate-100/50 p-1.5 rounded-2xl mb-8">
        {['Journalier', 'Hebdomadaire', 'Mensuel'].map((t) => (
          <button 
            key={t}
            onClick={() => { setTab(t); speak(`Forfaits ${t}`); }}
            className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all uppercase tracking-widest ${
              tab === t ? 'bg-white text-orange-brand shadow-sm' : 'text-slate-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Packages List - Image 3 */}
      <div className="space-y-4 mb-10">
        {PACKAGES.map((pkg) => (
          <button 
            key={pkg.id}
            onClick={() => { setSelectedId(pkg.id); speak(pkg.speak); }}
            className={`w-full bg-white p-6 rounded-[2rem] flex items-center gap-6 border-4 transition-all shadow-sm active:scale-95 ${
              selectedId === pkg.id ? 'border-orange-brand' : 'border-transparent'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${selectedId === pkg.id ? 'bg-orange-50' : 'bg-slate-50'}`}>
               <Volume2 size={24} className={selectedId === pkg.id ? 'text-orange-brand' : 'text-slate-300'} />
            </div>
            <div className="flex-1 text-left">
               <span className="block text-3xl font-outfit font-black text-[#2D2D2D]">{pkg.amount}</span>
               <span className="text-[11px] text-[#AAAAAA] font-bold uppercase tracking-wider">{pkg.validity}</span>
            </div>
            <div className="text-right">
               <span className="block text-xl font-black text-orange-brand">{pkg.price}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Promo Banner - Image 4 */}
      <div className="relative w-full aspect-[2/1] rounded-[2.5rem] overflow-hidden shadow-xl mb-10">
         <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" 
            alt="Promo" 
            className="w-full h-full object-cover grayscale"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
            <h4 className="text-white font-black text-2xl mb-1">Promotion Weekend</h4>
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Bonus de 50% sur les forfaits 2Go</p>
         </div>
      </div>

      {/* Bouton Valider */}
      <div className="pt-4">
        <button onClick={() => speak("Cliquez ici pour confirmer l'achat de votre forfait.")} className="w-full bg-[#FF7900] text-white py-6 rounded-[25px] font-black text-xl shadow-2xl shadow-orange-brand/30 active:scale-95 transition-transform flex items-center justify-center gap-3 uppercase tracking-tighter">
          Valider l'achat
        </button>
        <p className="text-center text-[10px] text-[#AAAAAA] font-bold mt-4">Votre forfait sera activé après confirmation.</p>
      </div>

    </div>
  );
}
