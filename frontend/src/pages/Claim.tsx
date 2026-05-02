import { Wifi, Smartphone, Wallet, ShieldAlert, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  { id: 'network', label: 'Réseau', icon: <Wifi size={24} className="text-orange-brand" /> },
  { id: 'offer', label: 'Forfait non activé', icon: <Smartphone size={24} className="text-slate-400" /> },
  { id: 'money', label: 'Orange Money', icon: <Wallet size={24} className="text-slate-400" /> },
  { id: 'sim', label: 'SIM perdue', icon: <ShieldAlert size={24} className="text-slate-400" /> },
];

export default function Claim() {
  return (
    <div className="flex-1 flex flex-col p-8 bg-[#F9F9F9] overflow-y-auto pb-24 animate-fade-in">
      
      <div className="mb-10 mt-2">
        <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight leading-[0.9]">Créer une réclamation</h2>
        <p className="text-[#757575] font-medium text-[15px] mt-4 leading-snug">
          Besoin d’assistance ? Notre agence virtuelle est là pour résoudre votre problème rapidement.
        </p>
      </div>

      <div className="mb-8">
        <p className="text-[13px] font-bold text-[#757575] mb-4 uppercase tracking-widest">Catégories</p>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} className={`flex flex-col items-center justify-center p-8 bg-white border-2 rounded-3xl transition-all shadow-sm ${cat.id === 'network' ? 'border-orange-brand' : 'border-transparent'}`}>
               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  {cat.icon}
               </div>
               <span className={`text-[13px] font-bold ${cat.id === 'network' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {cat.label}
               </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <p className="text-[13px] font-bold text-[#757575] mb-4 uppercase tracking-widest">Détails de l’incident</p>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50">
           <textarea 
            placeholder="Décrivez votre problème"
            className="w-full h-40 bg-slate-50/50 rounded-2xl p-6 text-sm font-medium text-slate-800 outline-none focus:bg-slate-50 transition-all resize-none"
           />
        </div>
      </div>

      {/* Illustrative Banner - Image 5 */}
      <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-xl group mb-8">
         <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600" 
            alt="Office" 
            className="w-full h-full object-cover grayscale"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-orange-brand/80 via-transparent to-transparent flex flex-col justify-end p-8">
            <button className="bg-white text-orange-brand font-black text-xs px-6 py-3 rounded-full flex items-center justify-center gap-2 w-max shadow-xl">
               Envoyer maintenant <ChevronRight size={14} />
            </button>
         </div>
      </div>

    </div>
  );
}
