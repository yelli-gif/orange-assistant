import { ChevronRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between p-10 bg-white animate-fade-in relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-slate-50 rounded-bl-[100px] -z-10"></div>
      
      <div className="w-full"></div>

      <div className="flex flex-col items-center space-y-12 w-full max-w-xs">
        {/* Logo Minimaliste */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-orange-brand/5 rounded-full blur-2xl group-hover:bg-orange-brand/10 transition-all duration-500"></div>
          <div className="w-24 h-24 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl relative">
            <span className="font-outfit font-black text-5xl leading-none">O</span>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-outfit font-black text-slate-900 tracking-tight leading-tight">
            Innovation <br/> & Inclusion.
          </h2>
          <div className="h-1 w-12 bg-orange-brand mx-auto rounded-full"></div>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">
            L'assistant nouvelle génération d'Orange CI, pensé pour chaque Ivoirien.
          </p>
        </div>
      </div>

      <div className="w-full space-y-6">
        <button 
          onClick={onStart}
          className="w-full bg-slate-900 border border-slate-800 hover:bg-black text-white py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 group"
        >
          COMMENCER L'EXPÉRIENCE
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="flex items-center justify-center gap-2 text-slate-300">
          <span className="text-[10px] uppercase font-black tracking-[0.2em]">Orange Côte d'Ivoire</span>
        </div>
      </div>
    </div>
  );
}
