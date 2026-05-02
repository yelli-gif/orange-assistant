import { useEffect, useState } from 'react';
import {
  Phone, CreditCard, Wifi, Wallet, Receipt, Home, ShieldCheck,
  AlertCircle, Smartphone, Building2, Info, ChevronRight, Mic
} from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  borderColor: string;
  iconBg: string;
  prompt: string; // phrase envoyée au backend en cliquant
}

export const CATEGORIES: Category[] = [
  {
    id: 'sim', label: 'CARTE SIM & LIGNE', emoji: '',
    icon: <Phone size={20} strokeWidth={1.5} />, description: 'Identité, PUK, code PIN...',
    color: 'text-slate-900', borderColor: 'border-slate-100', iconBg: 'bg-slate-50',
    prompt: 'Aide-moi avec ma ligne mobile'
  },
  {
    id: 'credit', label: 'CRÉDIT & FORFAITS', emoji: '',
    icon: <CreditCard size={20} strokeWidth={1.5} />, description: 'Solde et rechargement',
    color: 'text-slate-900', borderColor: 'border-slate-100', iconBg: 'bg-slate-50',
    prompt: 'Consulter mon crédit'
  },
  {
    id: 'orange_money', label: 'ORANGE MONEY', emoji: '',
    icon: <Wallet size={20} strokeWidth={1.5} />, description: 'Paiements et transferts',
    color: 'text-slate-900', borderColor: 'border-slate-100', iconBg: 'bg-slate-50',
    prompt: 'Transfert d\'argent'
  },
  {
    id: 'internet', label: 'INTERNET MOBILE', emoji: '',
    icon: <Wifi size={20} strokeWidth={1.5} />, description: 'Pass 4G/5G et Data',
    color: 'text-slate-900', borderColor: 'border-slate-100', iconBg: 'bg-slate-50',
    prompt: 'Acheter pass internet'
  },
  {
    id: 'domicile', label: 'INTERNET DOMICILE', emoji: '',
    icon: <Home size={20} strokeWidth={1.5} />, description: 'Fibre et Flybox',
    color: 'text-slate-900', borderColor: 'border-slate-100', iconBg: 'bg-slate-50',
    prompt: 'Aide internet maison'
  },
  {
    id: 'facture', label: 'FACTURES', emoji: '',
    icon: <Receipt size={20} strokeWidth={1.5} />, description: 'CIE, SODECI, Canal+',
    color: 'text-slate-900', borderColor: 'border-slate-100', iconBg: 'bg-slate-50',
    prompt: 'Payer une facture'
  },
  {
    id: 'securite', label: 'SÉCURITÉ', emoji: '',
    icon: <ShieldCheck size={20} strokeWidth={1.5} />, description: 'Signaler une fraude',
    color: 'text-slate-900', borderColor: 'border-slate-100', iconBg: 'bg-slate-50',
    prompt: 'Problème de sécurité'
  },
  {
    id: 'reclamation', label: 'RÉCLAMATIONS', emoji: '',
    icon: <AlertCircle size={20} strokeWidth={1.5} />, description: 'Dépôt de plainte',
    color: 'text-slate-900', borderColor: 'border-slate-100', iconBg: 'bg-slate-50',
    prompt: 'Faire une réclamation'
  },
];


interface Props {
  onSelectCategory: (cat: Category) => void;
  onVoiceMode: () => void;
  language: string | null;
  interactionMode?: 'text' | 'voice';
}


export default function CategoryMenu({ onSelectCategory, onVoiceMode, language, interactionMode }: Props) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (interactionMode === 'text') return; // Silence en mode message
    const msg = new SpeechSynthesisUtterance(
      'Bonjour ! Comment puis-je vous aider ? Dites le sujet de votre problème, ou cliquez sur une catégorie.'
    );

    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    msg.onend = () => startListening();
    window.speechSynthesis.speak(msg);
    return () => window.speechSynthesis.cancel();
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.lang = language === 'en' ? 'en-US' : 'fr-FR';
    r.start();
    setIsListening(true);
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript.toLowerCase();
      const match = CATEGORIES.find(c =>
        t.includes(c.id.replace('_', ' ')) ||
        c.label.toLowerCase().split(' ').some((word: string) => t.includes(word))
      );
      if (match) onSelectCategory(match);
      else {
        // Aller directement au chat avec ce que l'utilisateur a dit
        onSelectCategory({ ...CATEGORIES[10], prompt: e.results[0][0].transcript });
      }
    };
    r.onend = () => setIsListening(false);
  };

  return (
    <div className="flex-1 flex flex-col p-8 bg-white overflow-hidden h-full">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-outfit font-black text-slate-900 tracking-tight text-center md:text-left">
          SERVICES
        </h2>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
          Plateforme d'assistance officielle
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className="flex flex-col items-center p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-orange-brand/5 flex items-center justify-center mb-4 transition-colors text-slate-400 group-hover:text-orange-brand">
                {cat.icon}
              </div>
              <span className="font-bold text-slate-900 text-[10px] leading-tight mb-1 uppercase tracking-wider">{cat.label}</span>
              <span className="text-[9px] text-slate-400 font-medium leading-tight">{cat.description}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Mode Vocal Flottant Pro */}
      <div className="pt-6 border-t border-slate-50">
        <button 
          onClick={onVoiceMode}
          className="w-full bg-black text-white py-5 rounded-xl font-bold text-[11px] tracking-widest uppercase shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
        >
          <Mic size={18} />
          Accès rapide vocal
        </button>
      </div>
    </div>
  );
}

