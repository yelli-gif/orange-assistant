import { ArrowRight, Mic, Sparkles, Zap } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center p-8 animate-fade-in relative overflow-y-auto no-scrollbar bg-gradient-to-b from-[#FFF9F5] to-[#F9F9F9]">
      
      {/* Hero Visual - Ripple Effect affiné */}
      <div className="relative flex items-center justify-center w-full mt-10 mb-12">
         {/* Concentric rings (Static & Thin) */}
         <div className="absolute w-80 h-80 border border-orange-500/5 rounded-full"></div>
         <div className="absolute w-72 h-72 border border-orange-500/10 rounded-full"></div>
         <div className="absolute w-64 h-64 border border-orange-500/20 rounded-full"></div>
         
         {/* Central Microphone Orb - Dégradé exact */}
         <div className="relative w-56 h-56 bg-gradient-to-br from-[#FF7900] to-[#F53D00] rounded-full flex items-center justify-center shadow-[0_30px_60px_rgba(255,121,0,0.4)] z-10">
            <Mic size={90} className="text-white" strokeWidth={1.5} />
         </div>
      </div>

      <div className="text-center space-y-6 w-full px-4 mb-12">
        <h2 className="text-[42px] font-outfit font-black text-[#1A1A1A] leading-[1.1] tracking-tight">
          Orange <br/> Assistant
        </h2>
        
        <div className="space-y-4">
            <p className="text-[#555555] font-bold text-xl leading-snug px-6">
                Votre assistant Orange dans votre poche, disponible 24h/24
            </p>
            <p className="text-[#888888] text-[12px] font-medium leading-relaxed max-w-[240px] mx-auto">
                Parlez naturellement, notre assistant vous aide instantanément.
            </p>
        </div>
      </div>

      {/* Bouton Commencer - Style exact */}
      <button 
        onClick={onStart}
        className="w-full bg-[#FF7900] text-white py-5 rounded-[22px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-orange-brand/30 active:scale-95 transition-all mb-12"
      >
        Commencer
        <ArrowRight size={24} strokeWidth={3} />
      </button>

      {/* Feature Cards - Vos Images 11 & 12 */}
      <div className="grid grid-cols-2 gap-4 w-full pb-10">
         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#A35200]">
               <Sparkles size={22} />
            </div>
            <div>
               <p className="font-black text-[#1A1A1A] text-sm">Intelligent</p>
               <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">Comprend vos besoins en un instant.</p>
            </div>
         </div>

         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#A35200]">
               <Zap size={22} />
            </div>
            <div>
               <p className="font-black text-[#1A1A1A] text-sm">Rapide</p>
               <p className="text-[10px] text-slate-500 font-medium leading-tight mt-1">Zéro attente, réponse instantanée.</p>
            </div>
         </div>
      </div>

    </div>
  );
}
