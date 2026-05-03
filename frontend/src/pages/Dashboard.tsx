import { useEffect } from 'react';
import { History, Mic, PlusCircle, Volume2 } from 'lucide-react';

interface Props {
  language: string | null;
}

export default function Dashboard({ language }: Props) {
  
  useEffect(() => {
    const welcomeText = language === 'en' ? "Welcome back. Your balance is 1500 FCFA." : "Bienvenue. Votre solde actuel est de 1 500 francs CFA.";
    const msg = new SpeechSynthesisUtterance(welcomeText);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
    return () => window.speechSynthesis.cancel();
  }, [language]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="flex flex-col p-6 animate-fade-in pb-10">
      
      <div className="mb-8 mt-2 flex justify-between items-start">
        <div>
            <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight">Mon Espace</h2>
            <p className="text-[#757575] font-medium">Bienvenue dans votre agence virtuelle Orange.</p>
        </div>
        <button onClick={() => speak("Écran d'accueil. Ici vous pouvez voir votre crédit et vos forfaits.")} className="p-3 bg-white rounded-full shadow-sm text-orange-brand">
            <Volume2 size={24} />
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {/* Solde Card parlante */}
        <button 
            onClick={() => speak("Votre solde est de 1 500 francs CFA")}
            className="w-full bg-white p-6 rounded-[2rem] shadow-sm flex flex-col gap-4 border border-slate-50 text-left active:scale-95 transition-transform"
        >
           <div className="flex justify-between items-center text-[#757575] text-[13px] font-bold">
              <span>Solde actuel</span>
              <Volume2 size={18} className="text-orange-brand" />
           </div>
           <div className="flex items-baseline gap-2">
              <span className="text-5xl font-outfit font-black text-[#2D2D2D]">1 500</span>
              <span className="text-xl font-bold text-[#2D2D2D]">FCFA</span>
           </div>
           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-orange-brand"></div>
           </div>
        </button>

        {/* Forfait Card parlant */}
        <button 
            onClick={() => speak("Il vous reste 1 Giga de forfait internet")}
            className="w-full bg-white p-6 rounded-[2rem] shadow-sm flex flex-col gap-4 border border-slate-50 text-left active:scale-95 transition-transform"
        >
           <div className="flex justify-between items-center text-[#757575] text-[13px] font-bold">
              <span>Forfait actif</span>
              <Volume2 size={18} className="text-orange-brand" />
           </div>
           <div className="flex items-baseline gap-2">
              <span className="text-5xl font-outfit font-black text-[#2D2D2D]">1</span>
              <span className="text-xl font-bold text-[#2D2D2D]">Go</span>
           </div>
           <p className="text-[11px] text-[#AAAAAA] font-medium uppercase tracking-widest">Validité: 3 jours</p>
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 mb-8">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-900">
               <History size={20} />
            </div>
            <span className="text-[13px] font-bold text-[#2D2D2D]">Dernière demande</span>
         </div>
         <div onClick={() => speak("Votre réclamation pour le forfait est en cours de traitement")} className="bg-slate-50 p-4 rounded-3xl flex justify-between items-center cursor-pointer">
            <div>
               <p className="font-bold text-sm text-[#2D2D2D]">Réclamation forfait</p>
               <p className="text-[10px] text-slate-400 font-medium tracking-wider">ID: #ORV-8821</p>
            </div>
            <div className="bg-orange-50 px-3 py-1.5 rounded-full flex items-center gap-2 border border-orange-100">
               <div className="w-2 h-2 bg-orange-brand rounded-full"></div>
               <span className="text-[10px] font-bold text-orange-900 uppercase">En cours</span>
            </div>
         </div>
      </div>

      {/* Bannière Vocale parlante */}
      <button 
        onClick={() => speak("Appuyez sur ce bouton pour me parler. Je suis là pour vous aider.")}
        className="w-full bg-gradient-to-br from-orange-600 to-orange-400 rounded-[2.5rem] p-10 text-center text-white space-y-6 shadow-2xl relative overflow-hidden group border-4 border-white/20"
      >
         <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
            <Mic size={36} className="text-orange-brand" />
         </div>
         <div className="space-y-2">
            <h3 className="text-3xl font-outfit font-black leading-tight uppercase tracking-tighter">Parlez-moi</h3>
            <p className="text-white/80 text-sm font-bold">Appuyez ici pour commander</p>
         </div>
      </button>

      <button onClick={() => speak("Cliquez ici pour créer une nouvelle demande")} className="mt-8 w-full bg-black text-white py-5 rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 shadow-xl">
         <PlusCircle size={22} />
         NOUVELLE DEMANDE
      </button>

      <div className="mt-10">
        <p className="text-[13px] font-bold text-[#757575] mb-4 uppercase tracking-widest">Suggestions</p>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
           {[ 
             { t: "Acheter crédit", s: "Acheter du crédit" }, 
             { t: "Pass Internet", s: "Acheter un pass internet" }, 
             { t: "Aide", s: "Obtenir de l'aide technique" } 
           ].map((s, i) => (
             <button key={i} onClick={() => speak(s.s)} className="flex-shrink-0 bg-white border border-slate-200 px-6 py-3 rounded-full text-[11px] font-black text-slate-600 shadow-sm uppercase tracking-wider">
                {s.t}
             </button>
           ))}
        </div>
      </div>

    </div>
  );
}
