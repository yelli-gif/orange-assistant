import { useEffect, useState } from 'react';
import { 
  Send, Wallet, Receipt, Phone, Eye, EyeOff, Mic, Headphones
} from 'lucide-react';
import { translations } from '../translations';
import type { Language } from '../App';

export interface Category {
  id: string;
  label: string;
  prompt: string;
}

interface Props {
  language: Language;
  onSelectCategory: (cat: any) => void;
  onVoiceMode: () => void;
  interactionMode?: 'text' | 'voice';
}

export default function CategoryMenu({ language, onSelectCategory, interactionMode }: Props) {
  const [showBalance, setShowBalance] = useState(true);
  const t = translations[language as keyof typeof translations] || translations.fr;

  useEffect(() => {
    if (interactionMode !== 'voice') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {};
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (transcript.includes('transfert') || transcript.includes('transfer')) {
        onSelectCategory({ id: 'transfer', label: t.transfer });
      } else if (transcript.includes('facture') || transcript.includes('bill')) {
        onSelectCategory({ id: 'bill', label: t.bills });
      }
    };

    recognition.start();
    return () => recognition.stop();
  }, [language, onSelectCategory, interactionMode, t]);

  const speak = (txt: string) => {
    if (interactionMode !== 'voice') return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(txt);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="flex flex-col p-6 animate-fade-in pb-10">
      
      {/* Orange Money Card */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 mb-10 relative overflow-hidden">
         <div className="flex justify-between items-start mb-4">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.balance}</p>
               <h3 className="text-4xl font-outfit font-black text-[#1A1A1A]">
                  {showBalance ? '45.250' : '••••••'} <span className="text-xl font-bold text-[#A35200]">CFA</span>
               </h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
               <Wallet size={24} />
            </div>
         </div>
         
         <div className="flex justify-between items-center mt-6">
            <button 
              onClick={() => { setShowBalance(!showBalance); speak(showBalance ? "Solde masqué" : "45 250 CFA"); }}
              className="flex items-center gap-2 text-[#A35200] font-bold text-xs"
            >
               {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
               {showBalance ? "Masquer" : "Afficher"}
            </button>
            <button className="bg-[#FF7900] text-white px-8 py-3 rounded-2xl font-black text-sm">{t.recharge}</button>
         </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-outfit font-black text-[#1A1A1A] mb-6">{t.services}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'transfer', label: t.transfer, sub: 'Orange Money', icon: <Send size={24} /> },
            { id: 'reclamation', label: t.assistance, sub: 'Aide & SAV', icon: <Headphones size={24} /> },
            { id: 'bill', label: t.bills, sub: 'Électricité, Eau', icon: <Receipt size={24} /> },
            { id: 'credit', label: t.credit, sub: 'Appels & Data', icon: <Phone size={24} /> },
          ].map((serv) => (
            <button 
              key={serv.id}
              onClick={() => onSelectCategory(serv)}
              className="bg-white p-6 rounded-[2rem] flex flex-col items-start text-left border border-slate-50 shadow-sm transition-all active:scale-95"
            >
              <div className="w-12 h-12 bg-[#FFF5ED] rounded-2xl flex items-center justify-center text-orange-brand mb-4">
                 {serv.icon}
              </div>
              <p className="font-black text-[#1A1A1A] text-sm mb-1">{serv.label}</p>
              <p className="text-[9px] text-slate-400 font-medium leading-tight">{serv.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Prompt Banner */}
      <div className="bg-[#FFF5ED] p-8 rounded-[2.5rem] flex items-center gap-6 border border-orange-100">
         <div className="w-16 h-16 bg-[#FF7900] rounded-full flex items-center justify-center text-white shadow-xl">
            <Mic size={28} />
         </div>
         <div className="flex-1">
            <p className="text-[#A35200] font-black text-sm mb-1">{language === 'en' ? 'Just speak to me' : 'Dites-moi tout'}</p>
            <p className="text-[#A35200]/60 font-bold text-[11px] italic">"{language === 'en' ? 'Send money to Dad' : 'Envoie de l\'argent à Maman'}"</p>
         </div>
      </div>
    </div>
  );
}
