import { useEffect, useState } from 'react';
import { History, Mic, PlusCircle, Volume2 } from 'lucide-react';

interface Props {
  language: string | null;
  interactionMode?: 'text' | 'voice';
}

export default function Dashboard({ language, interactionMode }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  // Vocalisation automatique UNIQUEMENT en mode voix
  useEffect(() => {
    if (interactionMode !== 'voice') return;

    const welcomeText = language === 'en' 
        ? "Welcome back. Your balance is 1500 FCFA and you have 1 gigabyte of data remaining." 
        : "Bienvenue. Votre solde actuel est de 1 500 francs CFA et il vous reste 1 giga de forfait internet.";
    
    const msg = new SpeechSynthesisUtterance(welcomeText);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
    
    return () => window.speechSynthesis.cancel();
  }, [language, interactionMode]);

  const speak = (text: string) => {
    if (interactionMode !== 'voice') return; // Silence total en mode texte
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  const startVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      // Ici on simulerait l'envoi au backend pour Simple vs Complexe
      speak(`Bien reçu. Vous avez dit : ${text}. Je m'en occupe.`);
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div className="flex flex-col p-6 animate-fade-in pb-10">
      
      <div className="mb-8 mt-2 flex justify-between items-start">
        <div>
            <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight">Mon Espace</h2>
            <p className="text-[#757575] font-medium leading-tight">Votre agence Orange personnalisée.</p>
        </div>
        {interactionMode === 'voice' && (
          <button onClick={() => speak("Ici vous pouvez voir votre crédit et vos forfaits.")} className="p-3 bg-white rounded-full shadow-sm text-orange-brand">
              <Volume2 size={24} />
          </button>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {/* Solde Card */}
        <button 
            onClick={() => speak("Votre solde est de 1 500 francs CFA")}
            className="w-full bg-white p-7 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border border-slate-50 text-left active:scale-95 transition-transform"
        >
           <p className="text-[#757575] text-[12px] font-black uppercase tracking-widest">Solde actuel</p>
           <div className="flex items-baseline gap-2">
              <span className="text-5xl font-outfit font-black text-[#2D2D2D]">1 500</span>
              <span className="text-xl font-bold text-[#FF7900]">FCFA</span>
           </div>
        </button>

        {/* Forfait Card */}
        <button 
            onClick={() => speak("Il vous reste 1 Giga de forfait internet")}
            className="w-full bg-white p-7 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border border-slate-50 text-left active:scale-95 transition-transform"
        >
           <p className="text-[#757575] text-[12px] font-black uppercase tracking-widest">Forfait internet</p>
           <div className="flex items-baseline gap-2">
              <span className="text-5xl font-outfit font-black text-[#2D2D2D]">1</span>
              <span className="text-xl font-bold text-[#FF7900]">Go</span>
           </div>
        </button>
      </div>

      {/* Bouton "Parlez-moi" - Logique Reféchié */}
      <button 
        onClick={startVoiceCommand}
        className={`w-full rounded-[2.5rem] p-10 text-center text-white space-y-6 shadow-2xl relative overflow-hidden transition-all duration-500 border-8 border-white/20 ${
          isListening ? 'bg-black scale-105' : 'bg-gradient-to-br from-orange-600 to-orange-400'
        }`}
      >
         <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl ${isListening ? 'animate-pulse' : ''}`}>
            <Mic size={36} className={isListening ? 'text-red-500' : 'text-orange-brand'} />
         </div>
         <div className="space-y-2">
            <h3 className="text-3xl font-outfit font-black uppercase tracking-tighter">
              {isListening ? "Je vous écoute..." : "Appuyez pour parler"}
            </h3>
            <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest">
              {transcript || "Dites ce que vous voulez faire"}
            </p>
         </div>
      </button>

      {/* On renomme "Nouvelle Demande" en quelque chose de plus clair */}
      <button onClick={() => setTranscript("")} className="mt-8 w-full bg-white border-2 border-slate-100 text-slate-900 py-5 rounded-[22px] font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all">
         <History size={18} />
         HISTORIQUE DES ÉCHANGES
      </button>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 mt-8 mb-10">
         <div className="flex items-center gap-3 mb-4">
            <PlusCircle size={20} className="text-orange-brand" />
            <span className="text-[13px] font-bold text-[#2D2D2D]">Suivi de dossier</span>
         </div>
         <div className="bg-slate-50 p-4 rounded-3xl flex justify-between items-center">
            <p className="font-bold text-sm text-[#2D2D2D]">Réclamation en cours</p>
            <span className="text-[10px] font-black text-orange-900 bg-orange-100 px-3 py-1 rounded-full uppercase">Actif</span>
         </div>
      </div>

    </div>
  );
}
