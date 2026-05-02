import { Wallet, Smartphone, History, Mic, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col p-6 bg-[#F9F9F9] overflow-y-auto pb-24 animate-fade-in">
      
      {/* Salutations - Image 1 */}
      <div className="mb-8 mt-2">
        <h2 className="text-4xl font-outfit font-black text-[#2D2D2D] tracking-tight">Mon Espace</h2>
        <p className="text-[#757575] font-medium">Bienvenue dans votre agence virtuelle Orange.</p>
      </div>

      {/* Cartes Solde & Forfait - Image 1 */}
      <div className="space-y-4 mb-8">
        {/* Solde Card */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col gap-4 border border-slate-50">
           <div className="flex justify-between items-center text-[#757575] text-[13px] font-bold">
              <span>Solde actuel</span>
              <Wallet size={20} className="text-orange-900/40" />
           </div>
           <div className="flex items-baseline gap-2">
              <span className="text-5xl font-outfit font-black text-[#2D2D2D]">1 500</span>
              <span className="text-xl font-bold text-[#2D2D2D]">FCFA</span>
           </div>
           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-orange-brand"></div>
           </div>
        </div>

        {/* Forfait Card */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col gap-4 border border-slate-50">
           <div className="flex justify-between items-center text-[#757575] text-[13px] font-bold">
              <span>Forfait actif</span>
              <Smartphone size={20} className="text-orange-900/40" />
           </div>
           <div className="flex items-baseline gap-2">
              <span className="text-5xl font-outfit font-black text-[#2D2D2D]">1</span>
              <span className="text-xl font-bold text-[#2D2D2D]">Go</span>
           </div>
           <p className="text-[11px] text-[#AAAAAA] font-medium">Valide jusqu'au 24 Oct.</p>
        </div>
      </div>

      {/* Dernière demande - Image 1 */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 mb-8">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-900">
               <History size={20} />
            </div>
            <span className="text-[13px] font-bold text-[#2D2D2D]">Dernière demande</span>
         </div>
         <div className="bg-slate-50 p-4 rounded-3xl flex justify-between items-center">
            <div>
               <p className="font-bold text-sm text-[#2D2D2D]">Réclamation forfait</p>
               <p className="text-[10px] text-slate-400 font-medium tracking-wider">ID: #ORV-8821</p>
            </div>
            <div className="bg-orange-50 px-3 py-1.5 rounded-full flex items-center gap-2 border border-orange-100">
               <div className="w-2 h-2 bg-orange-brand rounded-full"></div>
               <span className="text-[10px] font-bold text-orange-900">En cours</span>
            </div>
         </div>
      </div>

      {/* Large Voice Action Banner - Votre Image 2 */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-400 rounded-[2.5rem] p-10 text-center text-white space-y-6 shadow-2xl shadow-orange-brand/20 relative overflow-hidden group">
         <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-white/10">
            <Mic size={36} className="text-white" />
         </div>
         <div className="space-y-2">
            <h3 className="text-3xl font-outfit font-black leading-tight">Comment puis-je vous aider ?</h3>
            <p className="text-white/80 text-sm font-medium">Appuyez pour lancer une commande vocale</p>
         </div>
      </div>

      {/* Bouton Nouvelle Demande - Image 2 */}
      <button className="mt-8 w-full bg-[#FF7900] text-white py-5 rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 shadow-xl">
         <PlusCircle size={22} />
         Nouvelle demande
      </button>

      {/* Suggestions Rapides - Image 2 */}
      <div className="mt-10">
        <p className="text-[13px] font-bold text-[#757575] mb-4">Suggestions rapides</p>
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
           {["Acheter crédit", "Pass Internet", "Aide technique"].map((s, i) => (
             <button key={i} className="flex-shrink-0 bg-white border border-slate-200 px-6 py-3 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                {s}
             </button>
           ))}
        </div>
      </div>

    </div>
  );
}
