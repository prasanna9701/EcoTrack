import React, { useState, useRef, useEffect } from 'react';
import { Leaf, X, Send, Bot, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import { useDataContext } from '../context/DataContext';

const EcoAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your EcoTrack Intelligence Agent. I can calculate your footprint and email audit-ready reports dynamically! What data are you trying to assess today?",
      sender: 'bot',
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const { addOrUpdateData, utilityData, globalEmissions } = useDataContext();
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const prevUtilityLength = useRef(utilityData.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // The Listener Hook: React to external Data Tab changes silently
  useEffect(() => {
     if (utilityData.length !== prevUtilityLength.current) {
         if (utilityData.length < prevUtilityLength.current) {
            // A deletion occurred
            setMessages(prev => [...prev, { id: Date.now(), text: `I noticed some data was removed from the Data Tab. I have updated the global carbon footprint calculations for you. It's now ${globalEmissions.totalMT} Tons.`, sender: 'bot' }]);
         } else {
             // Let's assume an addition occurred manually if it wasn't triggered by our upload flow
             // Typically we'd check if the last item was `isEdited: true` flag.
             const latest = utilityData[utilityData.length - 1];
             if (latest && latest.isEdited) {
                  setMessages(prev => [...prev, { id: Date.now(), text: `I saw you manually adjusted the ${latest.type} entry! I've updated your dashboards.`, sender: 'bot' }]);
             }
         }
         prevUtilityLength.current = utilityData.length;
     }
  }, [utilityData, globalEmissions]);

  const handleFileUpload = (e) => {
     const file = e.target.files[0];
     if (!file) return;

     setMessages(prev => [...prev, { id: Date.now(), text: `Uploaded: ${file.name}`, sender: 'user' }]);
     
     const isImageOfCat = file.name.toLowerCase().includes('cat');
     const analyzingMsgId = Date.now() + 1;
     
     setIsTyping(true);

     setTimeout(() => {
        setIsTyping(false);
        if (isImageOfCat) {
             setMessages(prev => [...prev, { id: analyzingMsgId, text: "I couldn't find energy data in this file. Please ensure it's a clear photo of your utility bill.", sender: 'bot' }]);
             return;
        }

        const isMultiPage = file.name.toLowerCase().includes('annual');
        
        const botMsg = {
            id: analyzingMsgId,
            text: isMultiPage ? "I scanned all 5 pages and found your usage data on page 3. Here is what I extracted. Confirm to add it to the global Data Context!" : "I processed the bill. Please review the extracted data.",
            sender: 'bot',
            cardData: {
                type: file.name.toLowerCase().includes('gas') ? 'Gas' : 'Electricity',
                provider: 'AI-Extracted-Provider',
                billingPeriod: 'Apr 2026',
                value: 450,
                unit: file.name.toLowerCase().includes('gas') ? 'Therms' : 'kWh'
            }
        };
        
        setMessages(prev => [...prev, botMsg]);
        if (fileInputRef.current) fileInputRef.current.value = '';
     }, 1500);
  };

  const handleCardConfirm = (cardData, messageId) => {
     addOrUpdateData(cardData); // Dispatch to global state
     setMessages(prev => prev.map(m => m.id === messageId ? {...m, cardData: null, text: m.text + " ✅ Confirmed and Synced!"} : m));
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(async () => {
      const lowerInput = userMessage.text.toLowerCase();
      setIsTyping(false);

      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
         setMessages(prev => [...prev, { id: Date.now(), text: "Hello! Upload a bill using the paperclip, or type your energy usage here and I will sync it globally.", sender: 'bot' }]);
      } else {
         setMessages(prev => [...prev, { id: Date.now(), text: `I recommend uploading the bill document so I can accurately extract it. Our current global trajectory sits at ${globalEmissions.totalMT} Tons.`, sender: 'bot' }]);
      }
    }, 1000); 
  };

  // Mini-Form Card Component
  const MiniCard = ({ data, messageId }) => {
      return (
          <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-green-300 shadow-inner">
              <div className="flex justify-between items-center text-xs mb-2 border-b border-slate-200 pb-2">
                 <span className="font-semibold text-green-400">Extracted Values</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div><span className="text-slate-500 block">Type:</span> {data.type}</div>
                  <div><span className="text-slate-500 block">Date:</span> {data.billingPeriod}</div>
                  <div><span className="text-slate-500 block">Usage:</span> {data.value} {data.unit}</div>
              </div>
              <button 
                 onClick={() => handleCardConfirm(data, messageId)}
                 className="mt-3 w-full bg-green-600 hover:bg-green-500 text-white p-1.5 rounded-lg transition-colors text-xs font-semibold">
                 Confirm & Sync to Dashboards
              </button>
          </div>
      )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-[400px] h-[580px] bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-4"
          >
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center text-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-lg tracking-wide">Eco Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm font-sans flex flex-col">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col max-w-[85%]">
                      <div
                        className={`rounded-2xl p-3 shadow-md border ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white border-green-500 rounded-br-none'
                            : 'bg-slate-100 text-slate-700 border-slate-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                      {msg.cardData && <MiniCard data={msg.cardData} messageId={msg.id} />}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 text-slate-500 border border-slate-200 p-3 rounded-2xl rounded-bl-none flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2 items-center">
              <input type="file" accept=".pdf,image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-500 hover:text-green-600 p-2 rounded-xl transition-colors bg-white border border-slate-300"
                title="Upload Bill"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about emissions or upload..."
                className="flex-1 bg-white border border-slate-300 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed  text-white p-3 rounded-xl transition-colors shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-tr from-green-600 to-emerald-400 text-white p-4 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-shadow duration-300 z-50 border border-emerald-300/30"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
      </motion.button>

    </div>
  );
};

export default EcoAssistant;
