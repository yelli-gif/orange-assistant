import { useState, useEffect, useRef } from 'react';
import { Send, Volume2, Mic, User, Bot, Headphones } from 'lucide-react';
import type { Language } from '../App';
import type { Category } from './CategoryMenu';

interface Props {
  language: Language;
  goBack: () => void;
  initialPrompt?: string | null;
  category?: Category | null;
  interactionMode?: 'text' | 'voice';
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isComplex?: boolean;
}

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

export default function Chat({ language, initialPrompt, interactionMode }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour, comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (msg: string) => {
    if (interactionMode !== 'voice') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = language === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), text, sender: 'user', timestamp: "12:00" };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });
      const data = await response.json();
      
      // Simulation intelligence Simple vs Complexe
      const isComplex = text.toLowerCase().includes('facture') || text.toLowerCase().includes('vol') || text.toLowerCase().includes('bloqué');
      const replyText = isComplex 
        ? "Cette demande nécessite l'intervention d'un expert. Souhaitez-vous parler à un conseiller humain ?" 
        : data.reply;

      const botMsg: Message = { 
        id: Date.now() + 1, 
        text: replyText, 
        sender: 'bot', 
        timestamp: "12:01",
        isComplex
      };
      
      setMessages(prev => [...prev, botMsg]);
      speak(replyText);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Je comprends. Je vais vérifier cela.", sender: 'bot', timestamp: "" }]);
    }
  };

  const toggleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    if (isListening) {
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const t = e.results[0][0].transcript;
        handleSend(t);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      const timer = setTimeout(() => handleSend(initialPrompt), 600);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt]);

  return (
    <div className="flex flex-col animate-fade-in pb-10">
      
      {/* Messages */}
      <div className="px-6 py-10 space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-800' : 'bg-orange-brand shadow-lg box-content border-4 border-white'}`}>
              {msg.sender === 'user' ? <User size={20} className="text-white" /> : <Bot size={22} className="text-white" />}
            </div>

            <div className={`flex flex-col gap-2 max-w-[80%]`}>
              <div className={`p-6 rounded-[2rem] text-sm font-semibold leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-orange-brand text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-50'
              }`}>
                {msg.text}
                
                {msg.isComplex && (
                  <button 
                    onClick={() => speak("D'accord, je vous passe un conseiller.")}
                    className="mt-4 w-full bg-black text-white py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs uppercase tracking-widest"
                  >
                    <Headphones size={16} />
                    Appeler un conseiller
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input / Voice */}
      <div className="px-8 flex flex-col items-center space-y-10">
        <div className="relative">
           <div className={`absolute -inset-8 bg-orange-brand/10 rounded-full ${isListening ? 'animate-ping' : 'hidden'}`}></div>
           <button 
            onClick={toggleListen}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl relative z-10 border-8 border-white ${
              isListening ? 'bg-red-500' : 'bg-[#FF7900]'
            }`}
           >
             <Mic size={36} className="text-white" />
           </button>
        </div>
        
        <p className={`font-black text-lg transition-colors ${isListening ? 'text-red-500' : 'text-orange-brand'}`}>
           {isListening ? "Je vous écoute..." : "Appuyez et parlez"}
         </p>

        <div className="w-full flex items-center bg-white border border-slate-100 rounded-[2rem] p-3 shadow-sm">
            <input 
              type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Écrivez ici..."
              className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-semibold"
            />
            <button onClick={() => handleSend()} className="w-12 h-12 bg-orange-brand text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all">
              <Send size={20} fill="currentColor" />
            </button>
        </div>
      </div>
    </div>
  );
}
