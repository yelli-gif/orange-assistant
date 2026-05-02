import { useState } from 'react';
import { Wifi, Zap, CheckCircle2, Mic } from 'lucide-react';

const PACKAGES = [
  { id: 1, amount: '500 Mo', price: '500 FCFA', validity: 'Validité 24h', icon: <Wifi size={24} className="text-orange-brand" />, selected: true },
  { id: 2, amount: '1 Go', price: '1 000 FCFA', validity: 'Validité 24h', icon: <Zap size={24} className="text-orange-900/30" /> },
  { id: 3, amount: '2 Go', price: '1 800 FCFA', validity: 'Validité 24h • Top Vente', icon: <Zap size={24} className="text-orange-900/30" /> },
];

export default function Purchase() {
  const [tab, setTab] = useState('Journalier');

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#F9F9F9] overflow-y-auto pb-32 animate-fade-in relative">
      
      <div className="mb-10 mt-2">
        <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight leading-[0.9]">Achat de forfait internet</h2>
        <p className="text-[#757575] font-medium text-[15px] mt-4 leading-snug">
          Choisissez l’offre qui correspond le mieux à vos besoins de connexion.
        </p>
      </div>

      {/* Tabs - Image 3 */}
      <div className="flex bg-slate-100/50 p-1.5 rounded-2xl mb-8">
        {['Journalier', 'Hebdomadaire', 'Mensuel'].map((t) => (
          <button 
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3.5 rounded-xl text-[13px] font-bold transition-all ${
              tab === t ? 'bg-white text-orange-brand shadow-sm' : 'text-slate-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Packages List - Image 3 */}
      <div className="space-y-4 mb-10">
        {PACKAGES.map((pkg) => (
          <button 
            key={pkg.id}
            className={`w-full bg-white p-6 rounded-[2rem] flex items-center gap-6 border-2 transition-all shadow-sm ${
              pkg.selected ? 'border-orange-brand' : 'border-transparent'
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${pkg.selected ? 'bg-orange-50' : 'bg-slate-50'}`}>
              {pkg.icon}
            </div>
            <div className="flex-1 text-left">
               <span className="block text-2xl font-outfit font-black text-[#2D2D2D]">{pkg.amount}</span>
               <span className="text-[11px] text-[#AAAAAA] font-bold uppercase tracking-wider">{pkg.validity}</span>
            </div>
            <div className="text-right">
               <span className="block text-xl font-black text-orange-brand">{pkg.price}</span>
               {pkg.selected && <CheckCircle2 size={18} className="text-orange-brand ml-auto mt-1" fill="currentColor" fillOpacity={0.1} />}
            </div>
          </button>
        ))}
      </div>

      {/* Promo Banner - Image 4 */}
      <div className="relative w-full aspect-[2/1] rounded-[2.5rem] overflow-hidden shadow-xl mb-10">
         <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" 
            alt="Promo" 
            className="w-full h-full object-cover grayscale"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
            <h4 className="text-white font-black text-2xl mb-1">Promotion Weekend</h4>
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Bonus de 50% sur les forfaits 2Go</p>
         </div>
      </div>

      {/* Bouton Valider Floating Style - Image 4 */}
      <div className="sticky bottom-0 left-0 right-0 pt-4 bg-gradient-to-t from-[#F9F9F9] to-transparent">
        <button className="w-full bg-[#FF7900] text-white py-5 rounded-[20px] font-bold text-lg shadow-xl shadow-orange-brand/20 active:scale-95 transition-transform flex items-center justify-center gap-3">
          Valider
          <span className="text-white/50">→</span>
        </button>
        <p className="text-center text-[10px] text-[#AAAAAA] font-bold mt-4">Votre forfait sera activé après confirmation.</p>
      </div>

      {/* Floating Orange Mic - Image 4 */}
      <button className="fixed bottom-32 right-10 w-20 h-20 bg-orange-brand rounded-full shadow-2xl shadow-orange-brand/50 flex items-center justify-center text-white z-40 animate-bounce">
         <Mic size={32} />
      </button>

    </div>
  );
}
