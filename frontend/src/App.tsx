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
export type Screen = 'SPLASH' | 'HOME' | 'MODE_SELECT' | 'CATEGORY' | 'CHAT_TEXT' | 'DASHBOARD' | 'CLAIM' | 'PURCHASE';

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
        <header className="bg-white px-6 py-5 flex items-center justify-between border-b border-slate-50 z-20">
          <div className="flex items-center gap-2">
            <SignalMedium className="text-orange-brand" size={20} />
            <h1 className="text-orange-brand font-black text-xl tracking-tight font-outfit uppercase">OraVoice 24/7</h1>
          </div>
          <UserCircle2 className="text-slate-400" size={28} />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#F9F9F9]">
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


        {/* Navigation Bar (Bottom) - Image 1/2 */}
        <nav className="bg-white border-t border-slate-100 px-10 py-4 flex justify-between items-center z-20">
          <button onClick={() => setScreen('DASHBOARD')} className={`nav-item ${screen === 'DASHBOARD' ? 'active' : ''}`}>
            <div className={`p-2 rounded-xl transition-all ${screen === 'DASHBOARD' ? 'bg-orange-50' : ''}`}>
              <Home size={24} />
            </div>
            <span>Accueil</span>
          </button>
          <button onClick={() => setScreen('CATEGORY')} className={`nav-item ${screen === 'CATEGORY' ? 'active' : ''}`}>
            <div className={`p-2 rounded-xl transition-all ${screen === 'CATEGORY' ? 'bg-orange-50' : ''}`}>
              <Grid size={24} />
            </div>
            <span>Services</span>
          </button>
          <button onClick={() => setScreen('PURCHASE')} className={`nav-item ${screen === 'PURCHASE' ? 'active' : ''}`}>
            <div className={`p-2 rounded-xl transition-all ${screen === 'PURCHASE' ? 'bg-orange-50' : ''}`}>
              <LayoutDashboard size={24} />
            </div>
            <span>Tableau</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;
