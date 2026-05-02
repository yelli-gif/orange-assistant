import { Mic, Zap } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12 animate-fade-in bg-white relative">
      {/* Cercles décoratifs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-48 h-48 bg-orange-50 rounded-full blur-2xl opacity-60"></div>

      <div className="flex flex-col items-center space-y-6 relative">
        <div className="w-32 h-32 bg-orange-brand rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3 transform transition-transform hover:rotate-0">
          <span className="text-white font-black text-6xl select-none">O</span>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Orange Assistant
          </h2>
          <p className="text-slate-500 font-medium text-sm px-4">
            Votre assistant virtuel 24h/24, accessible par la voix ou par texte.
          </p>
        </div>
      </div>

      <div className="w-full space-y-4 relative">
        <button 
          onClick={onStart}
          className="w-full bg-orange-brand hover:bg-orange-600 active:scale-95 text-white py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-200 shadow-xl shadow-orange-brand/20 flex items-center justify-center gap-3"
        >
          <Zap size={24} fill="currentColor" />
          COMMENCER
        </button>

        <div className="flex items-center justify-center gap-6 pt-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Mic size={16} />
            <span className="text-xs font-semibold">Parlez-moi</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold underline">Inclusif</span>
          </div>
        </div>
      </div>
    </div>
  );
}
