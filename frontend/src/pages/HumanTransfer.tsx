import { Star, Phone, MessageSquare, ArrowLeft, ShieldCheck } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function HumanTransfer({ onBack }: Props) {
  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in pb-10">
      
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-outfit font-black text-slate-800 uppercase tracking-tighter">Expert Orange CI</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        {/* Avatar avec badge vérifié */}
        <div className="relative mb-8">
            <div className="w-40 h-40 rounded-full bg-slate-100 border-4 border-orange-50 overflow-hidden shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300&h=300" 
                    alt="Agent Orange"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={18} />
            </div>
        </div>

        <div className="space-y-2 mb-10">
            <h3 className="text-3xl font-outfit font-black text-slate-800">Fatoumata K.</h3>
            <p className="text-orange-brand font-black text-xs uppercase tracking-widest">Conseillère Expert Facturation</p>
            <div className="flex items-center justify-center gap-1 text-yellow-400 mt-2">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span className="text-slate-400 text-sm font-bold ml-2">(4.9/5)</span>
            </div>
        </div>

        <div className="w-full space-y-4">
            <button className="w-full bg-black text-white py-6 rounded-[2.5rem] flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all">
                <Phone size={24} className="animate-bounce" />
                <span className="font-black text-lg uppercase tracking-tighter">Appeler maintenant</span>
            </button>
            <button className="w-full bg-slate-50 text-slate-800 py-6 rounded-[2.5rem] flex items-center justify-center gap-4 active:scale-95 transition-all border border-slate-100">
                <MessageSquare size={24} />
                <span className="font-bold text-lg uppercase tracking-tighter">Chatter en direct</span>
            </button>
        </div>
      </div>

      <div className="px-10">
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Contexte de la demande</p>
            <p className="text-slate-800 text-sm font-medium leading-relaxed italic">
                "L'utilisateur souhaite contester un débit anormal sur son solde Orange Money du 02 mai."
            </p>
        </div>
      </div>

    </div>
  );
}
