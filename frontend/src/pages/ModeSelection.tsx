import React, { useEffect, useState } from 'react';
import { MessageSquare, Mic } from 'lucide-react';
import type { Screen } from '../App';

interface Props {
  onSelect: (mode: Screen) => void;
  language: string | null;
}

export default function ModeSelection({ onSelect, language }: Props) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const msg = new SpeechSynthesisUtterance("Comment préférez-vous communiquer ? Dites Message, ou bien Voix.");
    msg.lang = language === 'en' ? 'en-US' : 'fr-FR';
    msg.onend = () => {
      startListening();
    };
    window.speechSynthesis.speak(msg);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [language]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript.toLowerCase();
      if (transcript.includes('message') || transcript.includes('texte') || transcript.includes('clavier')) {
        onSelect('CHAT_TEXT');
      } else if (transcript.includes('voix') || transcript.includes('parler') || transcript.includes('micro')) {
        onSelect('CHAT_VOICE');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10 animate-fade-in bg-white relative">
      {isListening && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-full animate-pulse border border-red-200">
          <Mic size={16} /> 
          <span className="text-xs font-bold">À vous de parler...</span>
        </div>
      )}
      
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Votre choix
        </h2>
      </div>

      <div className="w-full space-y-6">
        <button 
          onClick={() => onSelect('CHAT_TEXT')}
          className="w-full flex flex-col items-center justify-center bg-white border-2 border-slate-200 hover:border-orange-brand/50 p-8 rounded-3xl text-slate-800 transition-all shadow-sm"
        >
          <MessageSquare size={48} className="text-orange-brand mb-4" />
          <span className="font-bold text-xl">Par Message</span>
          <span className="text-sm text-slate-500 mt-2">Dites "Message"</span>
        </button>

        <button 
          onClick={() => onSelect('CHAT_VOICE')}
          className="w-full flex flex-col items-center justify-center bg-orange-50 border-2 border-orange-200 hover:border-orange-brand p-8 rounded-3xl text-orange-900 transition-all shadow-md transform hover:scale-105"
        >
          <Mic size={56} className="text-orange-brand mb-4 animate-pulse" />
          <span className="font-bold text-xl">Par la Voix</span>
          <span className="text-sm font-semibold text-orange-700/80 mt-2">Dites "Voix"</span>
        </button>
      </div>
    </div>
  );
}
