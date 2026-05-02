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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative h-[90vh] flex flex-col">
        
        {/* Header Officiel Orange */}
        <header className="bg-orange-brand px-5 py-4 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white text-orange-brand rounded-xl flex items-center justify-center font-black text-2xl shadow-sm leading-none">
              O
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide leading-tight">Orange CI</h1>
              <p className="text-white/80 text-[11px] font-medium">{getHeaderSubtitle()}</p>
            </div>
          </div>
          {screen !== 'HOME' && (
            <button
              onClick={goBack}
              className="text-sm font-semibold text-white/90 hover:text-white bg-white/20 px-3 py-1.5 rounded-full transition-colors"
            >
              ← Retour
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
