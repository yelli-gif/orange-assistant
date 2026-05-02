import { useState, useEffect, useRef } from 'react';
import { Send, Volume2, Mic, User, Bot, RotateCcw } from 'lucide-react';
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
}

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';

export default function Chat({ language, initialPrompt, interactionMode }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour, comment puis-je vous aider aujourd'hui ? Je suis à votre écoute pour toutes vos demandes Orange.",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (msg: string) => {
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
      const botMsg: Message = { id: Date.now() + 1, text: data.reply, sender: 'bot', timestamp: "12:01" };
      setMessages(prev => [...prev, botMsg]);
      if (interactionMode === 'voice') speak(data.reply);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Erreur de connexion.", sender: 'bot', timestamp: "" }]);
    }
  };

  const toggleListen = () => {
    if (!recognition) return;
    if (isListening) { recognition.stop(); setIsListening(false); }
    else {
      recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
      recognition.start();
      setIsListening(true);
      recognition.onresult = (e: any) => {
        const t = e.results[0][0].transcript;
        setInputText(t);
        handleSend(t);
        setIsListening(false);
      };
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F9F9F9] animate-fade-in relative overflow-hidden">
      
      {/* Header Info - Votre Image 4 */}
      <div className="px-10 pt-8 pb-4 text-center space-y-2 bg-white">
        <h3 className="text-2xl font-outfit font-black text-[#2D2D2D]">Bonjour, comment puis-je vous aider aujourd’hui ?</h3>
        <p className="text-[#757575] text-sm font-medium">Je suis à votre écoute pour toutes vos demandes Orange.</p>
      </div>

      {/* Zone de Chat - Votre Image 4 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar Bot/User - Votre Image 4 */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-600' : 'bg-orange-brand'}`}>
              {msg.sender === 'user' ? <User size={18} className="text-white" /> : <Bot size={20} className="text-white" />}
            </div>

            <div className="flex flex-col items-start gap-1 max-w-[80%]">
              <div className={`relative p-5 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-[#FF7900] text-white rounded-tr-none' 
                  : 'bg-white text-slate-800'
              }`}>
                {msg.text}
                {msg.sender === 'bot' && (
                  <button onClick={() => speak(msg.text)} className="absolute -right-10 top-2 text-orange-brand/60 hover:text-orange-brand">
                    <Volume2 size={20} />
                  </button>
                )}

                {/* Bouton Action Optionnel (Dashed border) - Image 4 */}
                {(msg.text.includes('solde') || msg.text.includes('123')) && (
                  <button className="mt-4 w-full py-3 px-4 border-2 border-dashed border-orange-brand/30 rounded-2xl text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-orange-brand/5">
                    <RotateCcw size={16} /> Recharger maintenant
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input / Voice Area - Votre Image 5 */}
      <div className="bg-white border-t border-slate-50 px-8 pt-8 pb-10 flex flex-col items-center">
        {/* Microphone Dynamic View */}
        <div className="relative flex items-center justify-center mb-6">
           <div className={`absolute w-32 h-32 rounded-full bg-orange-brand/10 ${isListening ? 'animate-ping' : ''}`}></div>
           <button 
            onClick={toggleListen}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl z-10 ${
              isListening ? 'bg-red-500 scale-105' : 'bg-gradient-to-br from-orange-400 to-orange-brand'
            }`}
           >
             <Mic size={40} className="text-white" />
           </button>
        </div>
        
        <p className="text-orange-brand font-black text-xl mb-4">Appuyez et parlez</p>
        <div className="flex gap-2 mb-8">
           <div className="w-2 h-2 bg-orange-brand rounded-full"></div>
           <div className="w-2 h-2 bg-orange-brand/40 rounded-full"></div>
           <div className="w-2 h-2 bg-orange-brand/20 rounded-full"></div>
        </div>

        {/* Suggestions - Image 5 */}
        <div className="flex flex-col gap-3 w-full max-w-xs mb-6">
           {["Payer ma facture", "Offres internet", "Contacter un agent"].map((txt, i) => (
             <button key={i} onClick={() => handleSend(txt)} className="py-3 px-6 border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:border-orange-brand/50 hover:bg-orange-50 transition-all">
                "{txt}"
             </button>
           ))}
        </div>

        {/* Input Text Cache / Toggle */}
        <div className="w-full flex items-center bg-slate-50 rounded-2xl px-4 py-2">
            <input 
              type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Écrivez ici..."
              className="flex-1 bg-transparent py-2 outline-none text-sm font-medium"
            />
            <button onClick={() => handleSend()} className="text-orange-brand p-2">
              <Send size={20} fill="currentColor" />
            </button>
        </div>
      </div>
    </div>
  );
}
