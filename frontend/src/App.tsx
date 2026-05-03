import { useState } from 'react';
import { Home, Grid, LayoutDashboard, UserCircle2, SignalMedium, Bot } from 'lucide-react';
import SplashScreen from './pages/SplashScreen';
import LanguageSelection from './pages/LanguageSelection';
import ModeSelection from './pages/ModeSelection';
import CategoryMenu, { type Category } from './pages/CategoryMenu';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Claim from './pages/Claim';
import Purchase from './pages/Purchase';

export type Language = 'fr' | 'nouchi' | 'dioula' | 'baoule' | 'en' | null;
export type Screen = 'SPLASH' | 'HOME' | 'MODE_SELECT' | 'CATEGORY' | 'CHAT_TEXT' | 'CHAT_VOICE' | 'DASHBOARD' | 'CLAIM' | 'PURCHASE';

function App() {
  const [screen, setScreen] = useState<Screen>('SPLASH');
  const [language, setLanguage] = useState<Language>(null);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [interactionMode, setInteractionMode] = useState<'text' | 'voice'>('text');

  const goBack = () => {
    if (screen === 'CHAT_TEXT') setScreen('CATEGORY');
    else if (screen === 'CATEGORY') setScreen('MODE_SELECT');
    else if (screen === 'MODE_SELECT') setScreen('HOME');
    else setScreen('SPLASH');
  };

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center">
      <div className="mobile-frame">
        
        {/* Header App (Image 1) */}
        <header className="bg-white px-6 py-8 flex items-center justify-between border-b border-slate-50 z-20">
          <div className="flex items-center gap-3">
            <SignalMedium className="text-orange-brand" size={24} strokeWidth={3} />
            <h1 className="text-orange-brand font-black text-xl tracking-tighter font-outfit">Orange Assistant</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
             <UserCircle2 size={24} />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-[#F9F9F9] no-scrollbar">
          {screen === 'SPLASH' && <SplashScreen onStart={() => setScreen('HOME')} />}
          {screen === 'HOME' && <LanguageSelection onSelect={(l) => { setLanguage(l); setScreen('MODE_SELECT'); }} />}
          {screen === 'MODE_SELECT' && (
            <ModeSelection onSelect={(s) => { 
                setInteractionMode(s === 'CHAT_TEXT' ? 'text' : 'voice');
                setScreen('DASHBOARD'); 
            }} language={language} />
          )}
          
          {screen === 'DASHBOARD' && <Dashboard language={language} />}
          {screen === 'CLAIM' && <Claim language={language} />}
          {screen === 'PURCHASE' && <Purchase language={language} />}
          
          {screen === 'CATEGORY' && (
            <CategoryMenu
              onSelectCategory={(cat) => { 
                  setSelectedCategory(cat); 
                  setInitialPrompt(cat.prompt); 
                  if (cat.id === 'reclamation') setScreen('CLAIM');
                  else if (cat.id === 'credit' || cat.id === 'internet') setScreen('PURCHASE');
                  else setScreen('CHAT_TEXT'); 
              }}
              onVoiceMode={() => { setInteractionMode('voice'); setScreen('CHAT_TEXT'); }}
              language={language}
              interactionMode={interactionMode}
            />
          )}

          {(screen === 'CHAT_TEXT' || screen === 'CHAT_VOICE') && (
            <Chat
              language={language}
              goBack={goBack}
              initialPrompt={initialPrompt}
              category={selectedCategory}
              interactionMode={interactionMode}
            />
          )}
        </main>

        {/* Floating Robot AI Button - Vocalisé */}
        {screen !== 'SPLASH' && screen !== 'HOME' && (
          <button 
            onClick={() => setScreen('CHAT_TEXT')}
            onMouseEnter={() => {
                const msg = new SpeechSynthesisUtterance("Cliquez ici pour me parler");
                msg.lang = 'fr-FR';
                window.speechSynthesis.speak(msg);
            }}
            className="fixed bottom-24 right-6 w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl z-50 border border-white/10 active:scale-95 transition-transform animate-bounce"
          >
            <Bot size={28} />
          </button>
        )}


        {/* Navigation Bar (Bottom) - Style Pixel Perfect */}
        <nav className="bg-white border-t border-slate-50 px-8 py-4 flex justify-between items-center z-20">
          <button onClick={() => setScreen('SPLASH')} className={`flex flex-col items-center gap-1 transition-all ${screen === 'SPLASH' || screen === 'HOME' ? 'text-orange-900' : 'text-slate-400'}`}>
            <div className={`p-4 rounded-[1.2rem] transition-all ${screen === 'SPLASH' || screen === 'HOME' ? 'bg-[#FFF5ED] text-[#FF7900]' : ''}`}>
              <Home size={26} strokeWidth={screen === 'SPLASH' || screen === 'HOME' ? 2.5 : 1.5} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tighter">Accueil</span>
          </button>
          
          <button onClick={() => setScreen('CATEGORY')} className={`flex flex-col items-center gap-1 transition-all ${screen === 'CATEGORY' ? 'text-orange-900' : 'text-slate-400'}`}>
            <div className={`p-4 rounded-[1.2rem] transition-all ${screen === 'CATEGORY' ? 'bg-[#FFF5ED] text-[#FF7900]' : ''}`}>
              <Grid size={26} strokeWidth={screen === 'CATEGORY' ? 2.5 : 1.5} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tighter">Services</span>
          </button>
          
          <button onClick={() => setScreen('PURCHASE')} className={`flex flex-col items-center gap-1 transition-all ${screen === 'PURCHASE' ? 'text-orange-900' : 'text-slate-400'}`}>
            <div className={`p-4 rounded-[1.2rem] transition-all ${screen === 'PURCHASE' ? 'bg-[#FFF5ED] text-[#FF7900]' : ''}`}>
              <LayoutDashboard size={26} strokeWidth={screen === 'PURCHASE' ? 2.5 : 1.5} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-tighter">Tableau</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;
