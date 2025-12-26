
import React, { useState, useRef, useEffect } from 'react';
import { getNetworkAdvice, simulateScenario } from '../services/gemini';

export const GeminiTerminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<{ type: 'user' | 'ai' | 'system', text: string }[]>([
    { type: 'system', text: 'Nexus Architecture Assistant Initialized.' },
    { type: 'system', text: 'Ready to simulate scenarios or provide protocol guidance.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setLogs(prev => [...prev, { type: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      let response = '';
      if (userMsg.toLowerCase().includes('simulate')) {
        response = await simulateScenario(userMsg);
      } else {
        response = await getNetworkAdvice(userMsg);
      }
      setLogs(prev => [...prev, { type: 'ai', text: response }]);
    } catch (err) {
      setLogs(prev => [...prev, { type: 'system', text: 'Error: API connection failed.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-sm border border-slate-800 rounded-xl overflow-hidden">
      <div className="flex items-center px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-2 h-2 rounded-full bg-green-500 mr-4"></div>
        <span className="text-xs text-slate-500">nexus-architect-v1.0.sh</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {logs.map((log, i) => (
          <div key={i} className={`flex ${log.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-lg ${
              log.type === 'user' ? 'bg-cyan-900/30 text-cyan-200 border border-cyan-500/30' : 
              log.type === 'system' ? 'text-slate-500 text-xs italic' :
              'bg-slate-900 text-slate-300 border border-slate-800'
            }`}>
              {log.type === 'ai' && <div className="text-[10px] text-emerald-400 mb-1 uppercase tracking-widest font-bold">Architect Response:</div>}
              <div className="whitespace-pre-wrap leading-relaxed">{log.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 text-slate-500 px-3 py-2 rounded-lg animate-pulse">
              Computing network topology...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center">
        <span className="text-cyan-500 mr-2 font-bold">$</span>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about protocol or type 'simulate protest scenario'..."
          className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-600"
        />
        <button type="submit" className="hidden">Execute</button>
      </form>
    </div>
  );
};
