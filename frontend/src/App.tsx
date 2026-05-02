import { useState } from 'react';
import LanguageSelection from './pages/LanguageSelection';
import ModeSelection from './pages/ModeSelection';
import CategoryMenu, { type Category } from './pages/CategoryMenu';
import Chat from './pages/Chat';
import VoiceMode from './pages/VoiceMode';
import SplashScreen from './pages/SplashScreen';


export type Language = 'fr' | 'nouchi' | 'dioula' | 'baoule' | 'en' | null;
export type Screen = 'SPLASH' | 'HOME' | 'MODE_SELECT' | 'CATEGORY' | 'CHAT_TEXT' | 'CHAT_VOICE';


function App() {
  const [screen, setScreen] = useState<Screen>('SPLASH');

  const [language, setLanguage] = useState<Language>(null);
  const [interactionMode, setInteractionMode] = useState<'text' | 'voice'>('text');
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setScreen('MODE_SELECT');
  };

  const handleModeSelect = (mode: Screen) => {
    if (mode === 'CHAT_TEXT') {
      setInteractionMode('text');
      setScreen('CATEGORY');
    } else {
      setInteractionMode('voice');
      setScreen(mode);
    }
  };


  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat);
    setInitialPrompt(cat.prompt);
    setScreen('CHAT_TEXT');
  };

  const getHeaderSubtitle = () => {
    if (screen === 'CATEGORY') return 'Choisissez votre sujet';
    if (screen === 'CHAT_TEXT' && selectedCategory) return selectedCategory.emoji + ' ' + selectedCategory.label;
    if (screen === 'CHAT_VOICE') return '🎙️ Mode Vocal';
    if (screen === 'SPLASH') return 'Bienvenue';
    return 'Assistant Universel';

  };

  const goBack = () => {
    if (screen === 'CHAT_TEXT' || screen === 'CHAT_VOICE') { setScreen('CATEGORY'); setInitialPrompt(null); }
    else if (screen === 'CATEGORY') setScreen('MODE_SELECT');
    else if (screen === 'MODE_SELECT') setScreen('HOME');
    else setScreen('HOME');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-0 md:p-4 font-sans selection:bg-orange-brand/20">
      <div className="w-full max-w-md bg-white md:rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative h-screen md:h-[90vh] flex flex-col border border-slate-100">
        
        {/* Header Ultra Minimaliste */}
        <header className="px-6 py-6 flex items-center justify-between z-10 flex-shrink-0 bg-white border-b border-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-black text-white rounded flex items-center justify-center font-bold text-xl leading-none">
              O
            </div>
            <div>
              <h1 className="font-outfit font-black text-lg tracking-tight text-slate-900">ORANGE ASSISTANT</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-orange-brand rounded-full animate-pulse"></div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">{getHeaderSubtitle()}</p>
              </div>
            </div>
          </div>
          {screen !== 'SPLASH' && (
            <button
              onClick={goBack}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-900 bg-slate-50 px-3 py-1.5 rounded transition-all uppercase tracking-wider"
            >
              Retour
            </button>
          )}
        </header>


        {/* Contenu principal */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {screen === 'SPLASH' && <SplashScreen onStart={() => setScreen('HOME')} />}
          {screen === 'HOME' && <LanguageSelection onSelect={handleLanguageSelect} />}
          {screen === 'MODE_SELECT' && <ModeSelection onSelect={handleModeSelect} language={language} />}

          {screen === 'CATEGORY' && (
            <CategoryMenu
              onSelectCategory={handleCategorySelect}
              onVoiceMode={() => { setInteractionMode('voice'); setScreen('CHAT_VOICE'); }}
              language={language}
              interactionMode={interactionMode}
            />

          )}
          {screen === 'CHAT_TEXT' && (
            <Chat
              language={language}
              goBack={goBack}
              initialPrompt={initialPrompt}
              category={selectedCategory}
              interactionMode={interactionMode}
            />

          )}
          {screen === 'CHAT_VOICE' && <VoiceMode language={language} goBack={goBack} />}
        </main>
      </div>
    </div>
  );
}

export default App;
