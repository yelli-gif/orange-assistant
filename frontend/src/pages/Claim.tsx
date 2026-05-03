import { useEffect } from 'react';
import { Wifi, Smartphone, Wallet, ShieldAlert, Mic, Volume2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'network', label: 'Réseau', icon: <Wifi size={24} />, speak: "Problème de connexion internet ou réseau." },
  { id: 'sim', label: 'Ma Ligne', icon: <Smartphone size={24} />, speak: "Problème avec ma carte SIM ou mon numéro." },
  { id: 'money', label: 'Orange Money', icon: <Wallet size={24} />, speak: "Problème avec mon argent Orange Money." },
  { id: 'scam', label: 'Fraude', icon: <ShieldAlert size={24} />, speak: "Signaler un vol ou une arnaque." },
];

interface Props {
  language: string | null;
}

export default function Claim({ language }: Props) {
  
  useEffect(() => {
    const text = language === 'en' ? "Explain your problem verbally or choose a category below." : "Expliquez votre problème vocalement, ou choisissez une catégorie ci-dessous.";
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
    return () => window.speechSynthesis.cancel();
  }, [language]);

  const speak = (msgText: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msgText);
    utterance.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col p-8 animate-fade-in relative pb-10">
      
      <div className="mb-10 mt-2 flex justify-between items-start">
        <div className="max-w-[80%]">
            <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight">Support &{"\n"}Aide</h2>
            <p className="text-[#757575] font-medium text-[15px] mt-2 leading-relaxed">Nous sommes là pour vous aider rapidement.</p>
        </div>
        <button onClick={() => speak("Ici vous pouvez signaler un problème. Utilisez le gros bouton mic pour parler.")} className="p-3 bg-white rounded-full shadow-sm text-orange-brand">
            <Volume2 size={24} />
        </button>
      </div>

      {/* Bouton Vocal Géant - Style Image 10 */}
      <div className="mb-12">
        <button 
           onClick={() => speak("Dites-moi votre problème après le bip sonore")}
           className="w-full aspect-square bg-gradient-to-br from-orange-600 to-orange-400 rounded-[3rem] shadow-2xl shadow-orange-brand/30 flex flex-col items-center justify-center space-y-8 border-8 border-white/20 active:scale-95 transition-all group"
        >
           <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Mic size={56} className="text-orange-brand" />
           </div>
           <div className="text-center">
              <h3 className="text-white text-3xl font-outfit font-black leading-tight uppercase tracking-tighter">Parler maintenant</h3>
              <p className="text-white/80 font-bold text-sm tracking-widest uppercase">Expertise Vocale</p>
           </div>
        </button>
      </div>

      <div className="space-y-6">
         <p className="text-[13px] font-bold text-[#757575] uppercase tracking-[0.25em] pl-2">Par Catégorie</p>
         
         <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => speak(cat.speak)}
                className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-4 shadow-sm border border-slate-50 active:scale-95 transition-all"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                   {cat.icon}
                </div>
                <span className="font-black text-sm text-[#2D2D2D] uppercase tracking-tighter">{cat.label}</span>
              </button>
            ))}
         </div>
      </div>

      <div className="mt-12 bg-white p-8 rounded-[3rem] border border-slate-50 space-y-6 shadow-sm">
         <h4 className="font-black text-xl text-[#2D2D2D]">Écrire mon problème</h4>
         <textarea 
            className="w-full bg-slate-50 rounded-[1.5rem] p-6 text-sm font-medium border-none focus:ring-2 focus:ring-orange-brand/20 min-h-[150px]"
            placeholder="Dites-nous ce qui ne va pas..."
         ></textarea>
         <button className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg shadow-xl uppercase tracking-widest">
            Envoyer
         </button>
      </div>

    </div>
  );
}
