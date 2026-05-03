import { useEffect, useState } from 'react';
import { 
  Send, Wallet, Receipt, Phone, ArrowUpCircle, Eye, EyeOff, Mic, ArrowDownCircle, Plus
} from 'lucide-react';
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
  const [isListening, setIsListening] = useState(false);

  // Système d'écoute automatique des mots-clés (uniquement en mode voix)
  useEffect(() => {
    if (interactionMode !== 'voice') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      
      if (transcript.includes('transfert') || transcript.includes('envoyer')) {
        onSelectCategory({ id: 'transfer', label: 'Transfert' });
      } else if (transcript.includes('facture') || transcript.includes('payer')) {
        onSelectCategory({ id: 'bill', label: 'Factures' });
      } else if (transcript.includes('crédit') || transcript.includes('recharger')) {
        onSelectCategory({ id: 'credit', label: 'Crédit' });
      }
    };

    recognition.start();
    return () => recognition.stop();
  }, [language, onSelectCategory, interactionMode]);

  const speak = (txt: string) => {
    if (interactionMode !== 'voice') return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(txt);
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="flex flex-col p-6 animate-fade-in pb-10">
      
      {/* Orange Money Card - Image 13 */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 mb-10 relative overflow-hidden group">
         <div className="flex justify-between items-start mb-4">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Solde Orange Money</p>
               <h3 className="text-4xl font-outfit font-black text-[#1A1A1A]">
                  {showBalance ? '45.250' : '••••••'} <span className="text-xl font-bold text-[#A35200]">CFA</span>
               </h3>
               <p className="text-[9px] text-slate-400 font-bold mt-2 italic">Dernière mise à jour : Aujourd'hui, 10:45</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
               <Wallet size={24} />
            </div>
         </div>
         
         <div className="flex justify-between items-center mt-6">
            <button 
              onClick={() => { setShowBalance(!showBalance); speak(showBalance ? "Solde masqué" : "Votre solde est de 45 250 francs"); }}
              className="flex items-center gap-2 text-[#A35200] font-bold text-xs"
            >
               {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
               {showBalance ? "Masquer le solde" : "Afficher le solde"}
            </button>
            <button 
               onClick={() => speak("Recharger mon compte")}
               className="bg-[#FF7900] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-orange-brand/20 active:scale-95 transition-all"
            >
               Recharger
            </button>
         </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-outfit font-black text-[#1A1A1A] mb-6">Services Rapides</h2>
        
        {/* Services Grid - Image 13 */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'transfer', label: 'Transfert', sub: 'Envoyer de l\'argent vers un tiers', icon: <Send size={24} />, speak: "Faire un transfert d'argent" },
            { id: 'retrait', label: 'Retrait', sub: 'Retrait en agence ou DAB', icon: <ArrowDownCircle size={24} />, speak: "Faire un retrait en espèces" },
            { id: 'bill', label: 'Factures', sub: 'CIE, SODECI, Canal+, et plus', icon: <Receipt size={24} />, speak: "Payer une facture" },
            { id: 'credit', label: 'Crédit', sub: 'Recharger votre ligne mobile', icon: <Phone size={24} />, speak: "Acheter du crédit ou un forfait" },
          ].map((serv) => (
            <button 
              key={serv.id}
              onClick={() => { speak(serv.speak); onSelectCategory(serv); }}
              className="bg-white p-6 rounded-[2rem] flex flex-col items-start text-left border border-slate-50 shadow-sm hover:border-orange-brand/20 transition-all active:scale-95"
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

      {/* Voice Prompt Banner - Image 14 */}
      <div className="bg-[#FFF5ED] p-8 rounded-[2.5rem] flex items-center gap-6 mb-10 border border-orange-100 relative">
         <div className="relative">
            <div className={`absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-4 border-[#FFF5ED] ${isListening ? 'animate-pulse' : ''}`}></div>
            <div className="w-16 h-16 bg-[#FF7900] rounded-full flex items-center justify-center text-white shadow-xl">
               <Mic size={28} />
            </div>
         </div>
         <div className="flex-1">
            <p className="text-[#A35200] font-black text-sm mb-1">"Dis-moi ce que tu veux faire"</p>
            <p className="text-[#A35200]/60 font-bold text-[11px] italic italic">"Vire 5000 CFA à Maman"</p>
         </div>
      </div>

      {/* Recent Transactions - Image 14 */}
      <div className="mb-10">
         <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-2xl font-outfit font-black text-[#1A1A1A]">Transactions Récentes</h2>
            <button className="text-[#A35200] font-bold text-xs">Voir tout</button>
         </div>
         
         <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl flex justify-between items-center border border-slate-50 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                     <ArrowUpCircle size={22} />
                  </div>
                  <div>
                     <p className="font-black text-sm text-[#1A1A1A]">Transfert à Jean K.</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hier, 18:20</p>
                  </div>
               </div>
               <span className="text-red-500 font-black text-sm">- 10.000 CFA</span>
            </div>

            <div className="bg-white p-5 rounded-3xl flex justify-between items-center border border-slate-50 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                     <Plus size={22} />
                  </div>
                  <div>
                     <p className="font-black text-sm text-[#1A1A1A]">Dépôt cash</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">23 Octobre</p>
                  </div>
               </div>
               <span className="text-green-500 font-black text-sm">+ 25.000 CFA</span>
            </div>
         </div>
      </div>

    </div>
  );
}
