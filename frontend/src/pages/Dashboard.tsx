import { useEffect, useState } from 'react';
import { History, Mic, Volume2 } from 'lucide-react';
import { translations } from '../translations';
import type { Language } from '../App';

interface Props {
  language: Language;
  interactionMode?: 'text' | 'voice';
}

export default function Dashboard({ language, interactionMode }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  // On récupère les traductions pour la langue actuelle (fallback sur 'fr')
  const t = translations[language as keyof typeof translations] || translations.fr;

  useEffect(() => {
    if (interactionMode !== 'voice') return;

    // Vocalisation intelligente basée sur la langue sélectionnée
    const welcomeText = language === 'en' 
        ? "Welcome. Your balance is 1500 FCFA." 
        : language === 'dioula'
        ? "I ni tché. I ka wari bé 1500 FCFA."
        : "Bienvenue. Votre solde actuel est de 1 500 francs CFA.";
    
    const msg = new SpeechSynthesisUtterance(welcomeText);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
    
    return () => window.speechSynthesis.cancel();
  }, [language, interactionMode]);

  const speak = (text: string) => {
    if (interactionMode !== 'voice') return;
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
      speak(language === 'en' ? "Understood. I'm on it." : "C'est noté, je m'en occupe.");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="flex flex-col p-6 animate-fade-in pb-10">
      
      <div className="mb-8 mt-2 flex justify-between items-start">
        <div>
            <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight">{t.home}</h2>
            <p className="text-[#757575] font-medium leading-tight">{t.welcome}</p>
        </div>
        {interactionMode === 'voice' && (
          <button onClick={() => speak(t.bot_greeting)} className="p-3 bg-white rounded-full shadow-sm text-orange-brand">
              <Volume2 size={24} />
          </button>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {/* Solde Card */}
        <button 
            onClick={() => speak(`${t.balance} 1 500`)}
            className="w-full bg-white p-7 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border border-slate-50 text-left active:scale-95 transition-transform"
        >
           <p className="text-[#757575] text-[12px] font-black uppercase tracking-widest">{t.balance}</p>
           <div className="flex items-baseline gap-2">
              <span className="text-5xl font-outfit font-black text-[#2D2D2D]">1 500</span>
              <span className="text-xl font-bold text-[#FF7900]">FCFA</span>
           </div>
        </button>
      </div>

      {/* Bouton "Parlez-moi" */}
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
              {isListening ? (language === 'en' ? "Listening..." : "J'écoute...") : t.talk}
            </h3>
            <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest">
              {transcript || (language === 'en' ? "What can I do for you?" : "Dites ce que vous voulez faire")}
            </p>
         </div>
      </button>

      <button className="mt-8 w-full bg-white border-2 border-slate-100 text-slate-900 py-5 rounded-[22px] font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all">
         <History size={18} />
         {language === 'en' ? 'VOICE HISTORY' : 'HISTORIQUE DES ÉCHANGES'}
      </button>

    </div>
  );
}
