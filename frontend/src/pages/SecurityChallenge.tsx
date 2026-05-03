import { Fingerprint, Lock, Database } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  onSuccess: () => void;
}

export default function SecurityChallenge({ onSuccess }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onSuccess, 800);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onSuccess]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-10 animate-fade-in text-center">
      
      {/* Animation Scanner */}
      <div className="relative w-40 h-40 mb-12">
        <div className="absolute inset-0 border-4 border-slate-50 rounded-[3rem]"></div>
        <div className="absolute inset-0 flex items-center justify-center text-orange-brand">
           <Fingerprint size={80} strokeWidth={1} />
        </div>
        <div className="scan-line rounded-full"></div>
      </div>

      <h2 className="text-3xl font-outfit font-black text-slate-800 uppercase tracking-tighter mb-4">Vérification de Sécurité</h2>
      <p className="text-slate-400 font-bold text-sm mb-12">Action sensible détectée : Accès aux données du compte Orange Money.</p>

      {/* Principes de Sécurité - Votre demande explicite */}
      <div className="w-full space-y-4 mb-12">
        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 text-left">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-brand">
                <Lock size={20} />
            </div>
            <div>
                <p className="font-black text-[10px] uppercase tracking-widest text-[#FF7900]">Session Isolée</p>
                <p className="text-slate-600 text-xs font-semibold">Environnement bancaire 100% protégé.</p>
            </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100 text-left">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-brand">
                <Database size={20} />
            </div>
            <div>
                <p className="font-black text-[10px] uppercase tracking-widest text-[#FF7900]">Données Certifiées</p>
                <p className="text-slate-600 text-xs font-semibold">Aucune invention. Données Orange réelles.</p>
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
        <div className="bg-orange-brand h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-[10px] font-black text-orange-brand uppercase tracking-widest">Analyse biométrique : {progress}%</p>

    </div>
  );
}
