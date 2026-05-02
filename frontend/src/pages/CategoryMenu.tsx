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
    id: 'sim', label: 'Carte SIM & Ligne', emoji: '📱',
    icon: <Phone size={24} />, description: 'PUK, PIN, remplacement, identification',
    color: 'text-violet-700', borderColor: 'border-violet-200', iconBg: 'bg-violet-50',
    prompt: 'Je veux de l\'aide avec ma carte SIM'
  },
  {
    id: 'credit', label: 'Crédit & Forfaits', emoji: '💳',
    icon: <CreditCard size={24} />, description: 'Solde, recharge, offres, numéros préférés',
    color: 'text-blue-700', borderColor: 'border-blue-200', iconBg: 'bg-blue-50',
    prompt: 'Consulter mon solde'
  },
  {
    id: 'internet', label: 'Internet Mobile', emoji: '📶',
    icon: <Wifi size={24} />, description: 'Pass internet, solde Data, configuration',
    color: 'text-sky-700', borderColor: 'border-sky-200', iconBg: 'bg-sky-50',
    prompt: 'Je veux acheter un pass internet'
  },
  {
    id: 'orange_money', label: 'Orange Money', emoji: '💰',
    icon: <Wallet size={24} />, description: 'Transferts, compte, arnaques, dépôt/retrait',
    color: 'text-orange-700', borderColor: 'border-orange-200', iconBg: 'bg-orange-50',
    prompt: 'Je veux transférer de l\'argent'
  },
  {
    id: 'facture', label: 'Factures', emoji: '🧾',
    icon: <Receipt size={24} />, description: 'Obtenir, payer ou contester une facture',
    color: 'text-amber-700', borderColor: 'border-amber-200', iconBg: 'bg-amber-50',
    prompt: 'Je veux payer ma facture'
  },
  {
    id: 'domicile', label: 'Internet Domicile', emoji: '🏠',
    icon: <Home size={24} />, description: 'Fibre, Flybox, 4G Home, box, panne',
    color: 'text-green-700', borderColor: 'border-green-200', iconBg: 'bg-green-50',
    prompt: 'Je veux de l\'aide avec ma box internet à la maison'
  },
  {
    id: 'securite', label: 'Sécurité & Arnaques', emoji: '🔒',
    icon: <ShieldCheck size={24} />, description: 'Bloquer compte, fraude, protection',
    color: 'text-red-700', borderColor: 'border-red-200', iconBg: 'bg-red-50',
    prompt: 'Je veux signaler une arnaque Orange Money'
  },
  {
    id: 'reclamation', label: 'Réclamations', emoji: '⚠️',
    icon: <AlertCircle size={24} />, description: 'Problème non résolu, remboursement, plainte',
    color: 'text-rose-700', borderColor: 'border-rose-200', iconBg: 'bg-rose-50',
    prompt: 'Je veux faire une réclamation'
  },
  {
    id: 'maxit', label: 'Max it & Digital', emoji: '📲',
    icon: <Smartphone size={24} />, description: 'Application Max it, eSIM, services digitaux',
    color: 'text-indigo-700', borderColor: 'border-indigo-200', iconBg: 'bg-indigo-50',
    prompt: 'Je veux de l\'aide avec l\'application Max it'
  },
  {
    id: 'entreprise', label: 'Entreprises', emoji: '🏢',
    icon: <Building2 size={24} />, description: 'Fibre pro, flotte, cloud, devenir distributeur',
    color: 'text-slate-700', borderColor: 'border-slate-200', iconBg: 'bg-slate-50',
    prompt: 'Je veux des informations sur les offres entreprises'
  },
  {
    id: 'info', label: 'Info & Orientation', emoji: '📞',
    icon: <Info size={24} />, description: 'Agences, horaires, tarifs, rendez-vous',
    color: 'text-teal-700', borderColor: 'border-teal-200', iconBg: 'bg-teal-50',
    prompt: 'Où sont les agences Orange et quels sont les horaires ?'
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
    <div className="flex flex-col h-full bg-slate-50">
      {/* Sous-titre + indicateur micro */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">Comment puis-je vous aider ?</p>
        {isListening ? (
          <span className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold animate-pulse border border-red-200">
            <Mic size={12} /> Je vous écoute...
          </span>
        ) : (
          <button onClick={startListening} className="flex items-center gap-1.5 text-orange-700 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 hover:bg-orange-100 transition-colors">
            <Mic size={12} /> Parler
          </button>
        )}
      </div>

      {/* Grille de catégories */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className={`w-full flex items-center gap-4 bg-white border-2 ${cat.borderColor} hover:shadow-md p-4 rounded-2xl text-left transition-all duration-200 group`}
          >
            <div className={`${cat.iconBg} ${cat.color} p-3 rounded-xl flex-shrink-0`}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">{cat.emoji} {cat.label}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{cat.description}</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-brand transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Bouton mode vocal */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <button
          onClick={onVoiceMode}
          className="w-full flex items-center justify-center gap-3 bg-orange-brand text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-brand/30"
        >
          <Mic size={22} /> Utiliser l'assistant vocal
        </button>
      </div>
    </div>
  );
}
