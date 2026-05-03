import { useEffect, useState } from 'react';
import { History, Mic, Volume2, ShieldCheck, Fingerprint, Wallet, Eye, EyeOff } from 'lucide-react';
import { translations } from '../translations';
import type { Language } from '../App';

interface Props {
  language: Language;
  interactionMode?: 'text' | 'voice';
}

export default function Dashboard({ language, interactionMode }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  
  const t = translations[language as keyof typeof translations] || translations.fr;

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsAuthenticating(false);
        if (interactionMode === 'voice') triggerwelcomeVoice();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const triggerwelcomeVoice = () => {
    const welcomeText = language === 'en' 
        ? "Identity verified. Welcome back. Your balance is 45,250 FCFA and you have 2.3 Gigabytes of data remaining." 
        : language === 'dioula'
        ? "Identification soti la. I ni tché. I ka wari bé 45 250, i ka internet taaba bé 2,3 Giga."
        : language === 'baoule'
        ? "Mo. I ka sika bé 45 250, i ka internet sika bé 2,3 Giga."
        : "Identité vérifiée. Bienvenue. Votre solde est de 45 250 francs CFA et il vous reste 2,3 Gigas de forfait internet.";
    
    const msg = new SpeechSynthesisUtterance(welcomeText);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

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

  if (isAuthenticating) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-10 animate-fade-in">
            <div className="relative w-32 h-32 mb-10">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-[2.5rem]"></div>
                <div className="absolute inset-0 flex items-center justify-center text-orange-brand">
                    <Fingerprint size={64} strokeWidth={1} />
                </div>
                <div className="scan-line rounded-full"></div>
            </div>
            <h2 className="text-2xl font-outfit font-black text-slate-800 tracking-tighter uppercase mb-2">Authentification</h2>
            <p className="text-slate-400 font-medium text-sm text-center">Vérification de sécurité biométrique...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col p-6 animate-fade-in pb-10">
      
      <div className="mb-8 mt-2 flex justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Compte Sécurisé</span>
            </div>
            <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tighter">{t.home}</h2>
        </div>
        {interactionMode === 'voice' && (
          <button onClick={() => speak(t.bot_greeting)} className="p-4 bg-white rounded-2xl shadow-xl text-orange-brand border border-slate-50">
              <Volume2 size={24} />
          </button>
        )}
      </div>

      <div className="space-y-6 mb-10">
        {/* Nouveau Cadre Solde Premium - Votre Image envoyée */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-orange-brand/5 border border-slate-50 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{t.balance}</p>
                    <h3 className="text-5xl font-outfit font-black text-[#1A1A1A] tracking-tighter">
                        {showBalance ? '45.250' : '••••••'} <span className="text-2xl font-bold text-orange-brand ml-1">CFA</span>
                    </h3>
                </div>
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-brand shadow-inner">
                    <Wallet size={28} />
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-8">
                <button 
                  onClick={() => { setShowBalance(!showBalance); speak(showBalance ? "Solde masqué" : "45 250 CFA"); }}
                  className="flex items-center gap-3 text-slate-400 hover:text-orange-brand transition-colors font-bold text-xs"
                >
                   {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                   {showBalance ? "Masquer" : "Afficher"}
                </button>
                <button className="bg-[#FF7900] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-orange-brand/30 active:scale-95 transition-all">
                  {t.recharge}
                </button>
            </div>
        </div>

        {/* Forfait Card Glass */}
        <button 
            onClick={() => speak(`${t.internet} 2.3 Giga`)}
            className="glass-card p-8 rounded-[2.5rem] flex flex-col gap-4 text-left active:scale-95 transition-all"
        >
           <p className="text-[#757575] text-[11px] font-black uppercase tracking-[0.2em]">{t.internet}</p>
           <div className="flex items-baseline gap-2">
              <span className="text-6xl font-outfit font-black text-[#2D2D2D] tracking-tighter">2,3</span>
              <span className="text-2xl font-bold text-[#FF7900]">Go</span>
           </div>
        </button>
      </div>

      {/* Barre Voice Wave - Signature Orange AI */}
      <button 
        onClick={startVoiceCommand}
        className={`w-full rounded-[3rem] p-10 text-center text-white space-y-6 shadow-2xl relative overflow-hidden transition-all duration-700 ${
          isListening ? 'bg-slate-900' : 'bg-gradient-to-br from-orange-600 via-orange-brand to-black'
        }`}
      >
         {isListening ? (
           <div className="flex items-center justify-center gap-1 h-12">
             {[1,2,3,4,5,6,7,2,4,3].map((h, i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s`, height: `${h * 4}px` }}></div>
             ))}
           </div>
         ) : (
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Mic size={32} className="text-orange-brand" />
           </div>
         )}
         
         <div className="space-y-1">
            <h3 className="text-2xl font-outfit font-black uppercase tracking-tighter">
              {isListening ? (language === 'en' ? "I'm listening..." : "Je vous écoute") : t.talk}
            </h3>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
              {transcript || (language === 'en' ? "Secured by Orange AI" : "IA Sécurisée Orange")}
            </p>
         </div>
      </button>

      <button className="mt-8 w-full bg-slate-900 text-white py-5 rounded-[22px] font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
         <History size={18} />
         {language === 'en' ? 'TRANSACTION ANALYTICS' : 'HISTORIQUE ANALYTIQUE'}
      </button>

    </div>
  );
}
