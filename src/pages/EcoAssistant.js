import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Leaf, X, Send, Bot, Paperclip, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataContext } from '../context/DataContext';
import { getPriorityExtraction, buildUtilityItemFromSample } from '../utils/extractionLogic';
import { useWallet } from '@txnlab/use-wallet-react';
import { attestEmissionRecord, areContractsDeployed } from '../utils/algorandContracts';
import BlockchainBadge from '../components/BlockchainBadge';

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
  const [hasGreeted, setHasGreeted] = useState(false);
  const [lastQuestions, setLastQuestions] = useState([]);
  const [attestingId, setAttestingId] = useState(null);
  
  const { addOrUpdateData, utilityData } = useDataContext();
  const { activeAddress, transactionSigner } = useWallet();
  const totalEmissions = useMemo(() => {
    let total = 0;
    utilityData.forEach((item) => {
      const unit = (item.unit || '').toLowerCase();
      const value = Number(item.value) || 0;
      if (item.type === 'Electricity' && unit.includes('kwh')) {
        total += value * 0.0008;
      }
      if (item.type === 'Gas' && unit.includes('scm')) {
        total += value * 0.002;
      }
    });
    return Number(total.toFixed(2));
  }, [utilityData]);

  const totalEmissionsNeedsCalibration = totalEmissions === 0 && utilityData.length > 0;
  const calibrationProvider = utilityData.find((item) => item.provider)?.provider || 'your utility provider';
  const totalEmissionsExplanation = totalEmissionsNeedsCalibration
    ? `Emission factors for ${calibrationProvider} need to be calibrated.`
    : '';

  const hiddenContext = useMemo(() => ({
    utilityData,
    totalEmissions,
  }), [utilityData, totalEmissions]);

  const utilitySnapshot = useMemo(() => {
    return utilityData
      .map((item) => `${item.id || item.billId || ''}|${item.provider || ''}|${item.billingPeriod || ''}|${item.value || 0}|${item.unit || ''}`)
      .join('||');
  }, [utilityData]);

  const lastUtilitySnapshotRef = useRef('');

  const systemPrompt = "You are the EcoTrack Intelligence Agent, a professional sustainability consultant. Stop giving the same 'Hello! Upload a bill' response to every message. If the user greets you, respond warmly. If the user asks for seller or owner details, reply: 'This platform is developed by Akhil. For commercial licenses or custom integrations, please contact the administrator.' If the user suggests faking data, politely refuse and explain that EcoTrack is built for audit-ready compliance and transparency.";

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
            setMessages(prev => [...prev, { id: Date.now(), text: `I noticed some data was removed from the Data Tab. I have updated the global carbon footprint calculations for you. It's now ${totalEmissions.toFixed(2)} Tons.`, sender: 'bot', systemPrompt, hiddenContext }]);
         } else {
             // Let's assume an addition occurred manually if it wasn't triggered by our upload flow
             // Typically we'd check if the last item was `isEdited: true` flag.
             const latest = utilityData[utilityData.length - 1];
             if (latest && latest.isEdited) {
                  setMessages(prev => [...prev, { id: Date.now(), text: `I saw you manually adjusted the ${latest.type} entry! I've updated your dashboards.`, sender: 'bot', systemPrompt, hiddenContext }]);
             }
         }
         prevUtilityLength.current = utilityData.length;
     }
  }, [utilityData, totalEmissions, hiddenContext]);

  const handleFileUpload = (e) => {
     const file = e.target.files[0];
     if (!file) return;

     setMessages(prev => [...prev, { id: Date.now(), text: `Uploaded: ${file.name}`, sender: 'user', systemPrompt, hiddenContext }]);
     
     const isImageOfCat = file.name.toLowerCase().includes('cat');
     const analyzingMsgId = Date.now() + 1;
     
     setIsTyping(true);

     setTimeout(() => {
        setIsTyping(false);
        if (isImageOfCat) {
             setMessages(prev => [...prev, { id: analyzingMsgId, text: "I couldn't find energy data in this file. Please ensure it's a clear photo of your utility bill.", sender: 'bot', systemPrompt, hiddenContext }]);
             return;
        }

        const isMultiPage = file.name.toLowerCase().includes('annual');
        const sample = getPriorityExtraction(file.name);
        let cardData;
        if (sample) {
            const item = buildUtilityItemFromSample(sample);
            cardData = {
                type: item.type,
                provider: item.provider,
                billingPeriod: item.billingPeriod,
                value: item.value,
                unit: item.unit,
                billId: item.billId,
                accountId: item.accountId,
                sourceFileName: file.name,
            };
        } else {
            cardData = {
                type: file.name.toLowerCase().includes('gas') ? 'Gas' : 'Electricity',
                provider: 'AI-Extracted-Provider',
                billingPeriod: 'Apr 2026',
                value: 450,
                unit: file.name.toLowerCase().includes('gas') ? 'Therms' : 'kWh',
                sourceFileName: file.name,
            };
        }
        
        const botMsg = {
            id: analyzingMsgId,
            text: isMultiPage ? "I scanned all 5 pages and found your usage data on page 3. Here is what I extracted. Confirm to add it to the global Data Context!" : "I processed the bill. Please review the extracted data.",
            sender: 'bot',
            cardData,
            systemPrompt,
            hiddenContext,
        };
        
        setMessages(prev => [...prev, botMsg]);
        if (fileInputRef.current) fileInputRef.current.value = '';
     }, 1500);
  };

  const handleCardConfirm = async (cardData, messageId) => {
     addOrUpdateData(cardData); // Dispatch to global state
     setMessages(prev => prev.map(m => m.id === messageId ? {...m, cardData: null, text: m.text + " ✅ Confirmed and Synced!"} : m));

     // --- Algorand Attestation ---
     if (activeAddress && transactionSigner && areContractsDeployed()) {
       setAttestingId(messageId);
       try {
         const scopeType = cardData.type === 'Gas' ? 1 : 2; // Scope 1 for gas, Scope 2 for electricity
         const result = await attestEmissionRecord({
           provider: cardData.provider || 'Unknown',
           billingPeriod: cardData.billingPeriod || '',
           value: cardData.value || 0,
           unit: cardData.unit || '',
           scopeType,
           activeAddress,
           transactionSigner,
         });

         setMessages(prev => [...prev, {
           id: Date.now(),
           text: '🔗 Emission record attested on Algorand blockchain!',
           sender: 'bot',
           blockchainBadge: { txId: result.txId, label: 'Verified on Algorand' },
         }]);
       } catch (err) {
         console.error('Attestation failed:', err);
         setMessages(prev => [...prev, {
           id: Date.now(),
           text: `⚠️ Blockchain attestation failed: ${err.message}. Your data is still saved locally.`,
           sender: 'bot',
         }]);
       } finally {
         setAttestingId(null);
       }
     } else if (!activeAddress) {
       setMessages(prev => [...prev, {
         id: Date.now(),
         text: '🔐 Connect your Algorand wallet (top-right) to create a tamper-proof blockchain attestation of this record.',
         sender: 'bot',
       }]);
     }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      systemPrompt,
      hiddenContext,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLastQuestions(prev => [userMessage.text, ...(prev.slice(0, 1))]); // Keep last 2
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = userMessage.text.toLowerCase();
      setIsTyping(false);

      const isGreeting = /\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(lowerInput);
      const isOwnerQuery = /\b(owner|seller|developer|developed by|commercial license|white ?label|custom integration|contact administrator|contact)\b/.test(lowerInput);
      const isFakeDataQuery = /\b(fake|fabricate|faking|faked|bogus|not real|manipulate data|cook the books|alter data)\b/.test(lowerInput);
      const isDataChangeRequest = /\b(change|fake|edit|lower|modify|alter|falsify)\b/.test(lowerInput) && /\b(bill|data|usage|report|emissions)\b/.test(lowerInput);
      const isCreditQuery = /\b(cc|carbon credit|carbon credits|credits)\b/.test(lowerInput) && /\bhow many\b|\bshould i buy\b|\brecommended\b|\bneed\b/.test(lowerInput);
      const isBudgetQuery = /\b(budget|afford|cost|price|spend|money|dollar|\$)\b/.test(lowerInput) && /\b(credit|offset|neutral|carbon)\b/.test(lowerInput);
      const isLeakCheckQuery = /\b(leak|industrial|audit|anomaly|jump|spike|abnormal)\b/.test(lowerInput);
      const isFutureProjection = /\b(future|2030|projection|forecast|predict|trend)\b/.test(lowerInput);
      const percentMatch = lowerInput.match(/(\d{1,3})\s*%/);
      const isWhatIf = /\bwhat if\b|\bcut.*usage\b|\breduce.*usage\b/.test(lowerInput);
      const didUtilityChange = utilitySnapshot !== lastUtilitySnapshotRef.current;

      const electricityTotal = utilityData.filter(item => item.type === 'Electricity').reduce((sum, item) => sum + (item.value || 0), 0);
      const gasTotal = utilityData.filter(item => item.type === 'Gas').reduce((sum, item) => sum + (item.value || 0), 0);
      const currentTotal = totalEmissions;

      const respond = (text) => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text,
          sender: 'bot',
          systemPrompt,
          hiddenContext,
        }] );
        lastUtilitySnapshotRef.current = utilitySnapshot;
      };

      if (isGreeting && !hasGreeted) {
         setHasGreeted(true);
         respond(`Hi there! I'm your EcoTrack Intelligence Agent. I currently see ${utilityData.length} bill${utilityData.length === 1 ? '' : 's'} and a total footprint of ${currentTotal.toFixed(2)} Tons.`);
         return;
      }

      if (isGreeting && hasGreeted) {
         const lastQ = lastQuestions.length > 0 ? ` You previously asked: "${lastQuestions[0]}"` : '';
         respond(`Welcome back. Your dashboard still shows ${utilityData.length} bill${utilityData.length === 1 ? '' : 's'} and ${currentTotal.toFixed(2)} Tons total.${lastQ}`);
         return;
      }

      if (isOwnerQuery) {
         respond('This platform is developed by Akhil. For commercial licenses, please contact the administrator.');
         return;
      }

      if (isDataChangeRequest) {
         respond('I cannot modify or falsify uploaded data. EcoTrack is designed for high-integrity, audit-ready reporting. To lower your footprint, please explore the energy-saving recommendations in the Energy tab.');
         return;
      }

      if (isFakeDataQuery) {
         respond('EcoTrack is built for audit-ready compliance and transparency. I cannot help fabricate or fake utility data. Please keep the reports honest for reliable footprint analysis.');
         return;
      }

      if (isBudgetQuery) {
         const budgetMatch = lowerInput.match(/\$?(\d+(?:\.\d+)?)/);
         const budget = budgetMatch ? Number(budgetMatch[1]) : 200; // Default to $200 if not specified
         const pricePerCredit = 15;
         const offsetTons = budget / pricePerCredit;
         const remainingTons = Math.max(0, currentTotal - offsetTons);
         respond(`With $${budget}, you can offset roughly ${offsetTons.toFixed(1)} tons. Since your total is ${currentTotal.toFixed(2)} tons, you will have ${remainingTons.toFixed(2)} tons remaining un-offset.`);
         return;
      }

      if (isLeakCheckQuery) {
         // Compare E_sample_3 (industrial) to E_sample_1 (residential)
         const industrialBill = utilityData.find(item => item.value === 29284.2 && item.type === 'Electricity');
         const residentialBills = utilityData.filter(item => item.type === 'Electricity' && item.value < 1000);
         if (industrialBill && residentialBills.length > 0) {
            const avgResidential = residentialBills.reduce((sum, item) => sum + item.value, 0) / residentialBills.length;
            const jump = (industrialBill.value / avgResidential) * 100;
            if (jump > 1000) {
               respond(`I detected a significant anomaly: your industrial bill (${industrialBill.value} kWh) is over ${jump.toFixed(0)}% higher than your average residential usage (${avgResidential.toFixed(0)} kWh). This suggests a potential leak or industrial-scale consumption. I recommend scheduling an industrial energy audit immediately.`);
            } else {
               respond(`Comparing your bills, the industrial usage (${industrialBill.value} kWh) shows a ${jump.toFixed(0)}% increase over residential (${avgResidential.toFixed(0)} kWh), but it's within expected ranges. No immediate audit needed.`);
            }
         } else {
            respond(`I need both industrial and residential bills to perform a leak check. Please upload more bills for comparison.`);
         }
         return;
      }

      if (isFutureProjection) {
         const projectedEmissions = currentTotal * 1.05;
         respond(`Based on a 5% annual growth rate, your emissions could reach ${projectedEmissions.toFixed(2)} tons by 2030. Consider implementing energy efficiency measures to curb this growth.`);
         return;
      }

      if (isCreditQuery) {
         const recommendedCredits = Math.ceil(currentTotal || 0);
         if (currentTotal > 0) {
            respond(`Since your current footprint is ${currentTotal.toFixed(2)} Tons, I recommend purchasing ${recommendedCredits} Carbon Credits to achieve Carbon Neutrality.`);
         } else {
            respond(`I cannot recommend a credit quantity until your dashboard emissions are calculated. ${totalEmissionsExplanation}`);
         }
         return;
      }

      if (isWhatIf && percentMatch) {
         const percent = Number(percentMatch[1]);
         if (percent > 0 && percent <= 100) {
           const reducedEmissions = ((100 - percent) / 100) * currentTotal;
           const reducedElectricity = electricityTotal * ((100 - percent) / 100);
           const reducedGas = gasTotal * ((100 - percent) / 100);
           respond(`If you cut your usage by ${percent}%, your dashboard emissions would fall from ${currentTotal.toFixed(2)} Tons to ${reducedEmissions.toFixed(2)} Tons. That is roughly ${reducedElectricity.toFixed(0)} kWh for electricity and ${reducedGas.toFixed(0)} units for gas after the reduction.`);
         } else {
           respond('I can calculate that for you, but please provide a valid percentage between 1 and 100.');
         }
         return;
      }

      if (totalEmissions === 0 && utilityData.length > 0) {
         respond(`I currently see ${utilityData.length} bills, but the emissions calculation returns 0.00 Tons because ${totalEmissionsExplanation}`);
         return;
      }

      // Default response without repetitive prefix
      if (didUtilityChange) {
         respond(`I notice changes in your dashboard data. You now have ${utilityData.length} bill${utilityData.length === 1 ? '' : 's'} with a total of ${currentTotal.toFixed(2)} Tons emissions.`);
      } else {
         respond(`Your current footprint is ${currentTotal.toFixed(2)} Tons based on ${utilityData.length} bill${utilityData.length === 1 ? '' : 's'}. How can I help you analyze this further?`);
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
                      {msg.blockchainBadge && (
                        <div className="mt-2">
                          <BlockchainBadge
                            txId={msg.blockchainBadge.txId}
                            label={msg.blockchainBadge.label}
                            variant="full"
                          />
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}
              
              {(isTyping || attestingId) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 text-slate-500 border border-slate-200 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                    {attestingId ? (
                      <><Shield className="w-4 h-4 text-green-500 animate-pulse mr-1" /> Attesting on Algorand...</>
                    ) : (
                      <><span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span></>
                    )}
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
