import { ArrowRight, Mic } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between p-10 animate-fade-in relative overflow-hidden bg-[#F9F9F9]">
      
      <div className="w-full"></div>

      {/* Hero Visual - Votre Image 1 (Cercle Orange + Ondes) */}
      <div className="relative flex items-center justify-center w-full">
         {/* Ripples animations */}
         <div className="absolute w-72 h-72 border border-orange-500/10 rounded-full animate-[ping_3s_infinite]"></div>
         <div className="absolute w-64 h-64 border border-orange-500/20 rounded-full animate-[ping_2s_infinite]"></div>
         <div className="absolute w-56 h-56 border border-orange-500/30 rounded-full"></div>
         
         {/* Central Microphone Orb */}
         <div className="relative w-48 h-48 bg-gradient-to-br from-orange-400 to-orange-brand rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(255,121,0,0.3)] z-10 animate-pulse">
            <Mic size={80} className="text-white" strokeWidth={1.5} />
         </div>
      </div>

      <div className="text-center space-y-4 w-full px-6">
        <h2 className="text-5xl font-outfit font-black text-[#2D2D2D] leading-[0.9] tracking-tighter">
          Orange <br/> Assistant
        </h2>
        <div className="space-y-1">
            <p className="text-[#757575] font-bold text-lg">Votre assistant Orange dans votre poche, disponible 24h/24</p>
            <p className="text-[#AAAAAA] text-[11px] font-medium leading-tight pt-2">Parlez naturellement, notre assistant vous aide instantanément.</p>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="w-full bg-[#FF7900] text-white py-5 px-10 rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-orange-brand/20 active:scale-95 transition-transform"
      >
        Commencer
        <ArrowRight size={24} />
      </button>

    </div>
  );
}
