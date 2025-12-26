
import React, { useState } from 'react';
import { ViewMode } from './types';
import { MeshSimulator } from './components/MeshSimulator';
import { ArchitectureView } from './components/ArchitectureView';
import { ProtocolSpec } from './components/ProtocolSpec';
import { GeminiTerminal } from './components/GeminiTerminal';
import { VoiceDialer } from './components/VoiceDialer';
import { IncentiveLedger } from './components/IncentiveLedger';
import { RoutingSpecView } from './components/RoutingSpecView';
import { DeploymentMap } from './components/DeploymentMap';
import { ManifestoView } from './components/ManifestoView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.MANIFESTO);

  const navItems = [
    { id: ViewMode.MANIFESTO, label: 'The Awakening', icon: '🔥' },
    { id: ViewMode.DASHBOARD, label: 'Systems Status', icon: '🏢' },
    { id: ViewMode.NETWORK_C2, label: 'Live Mesh Monitor', icon: '📡' },
    { id: ViewMode.DEPLOYMENT_MAP, label: 'Rollout Table', icon: '🗺️' },
    { id: ViewMode.VOICE_COMMS, label: 'Voice Comms', icon: '📞' },
    { id: ViewMode.PROTOCOL_SPEC, label: 'Protocol Specs', icon: '📖' },
    { id: ViewMode.PROVISIONING, label: 'Deployment Tool', icon: '🛠️' },
    { id: ViewMode.LEDGER, label: 'Incentive Ledger', icon: '💎' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Sidebar Command Center */}
      <nav className="w-full md:w-72 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col z-20 overflow-hidden shrink-0">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-black text-slate-950 text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">N</div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white leading-none">NEXUS CONTROL</h1>
              <p className="text-[9px] font-mono text-cyan-500 tracking-widest uppercase mt-1">Global Mesh Core</p>
            </div>
          </div>

          <div className="space-y-1.5 overflow-y-auto custom-scroll pr-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all border ${
                  currentView === item.id 
                  ? 'bg-white text-slate-950 border-white font-bold shadow-[0_10px_20px_rgba(255,255,255,0.1)]' 
                  : 'text-slate-500 hover:text-white hover:bg-slate-800/50 border-transparent font-medium'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] uppercase tracking-wide">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800 bg-slate-950/40">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase mb-2">
                <span>Core Temperature</span>
                <span className="text-emerald-500">Normal</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
                <div className="bg-emerald-500 h-full w-[14%] transition-all duration-1000"></div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg group hover:border-cyan-500/50 transition-all cursor-help">
               <div className="text-[9px] text-slate-500 font-bold uppercase mb-1 group-hover:text-cyan-500 transition-colors">Encrypted Tunnel</div>
               <div className="text-xs font-mono text-cyan-500">AES-XTS-512 ACTIVE</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Command Display */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-10 bg-slate-950/80 backdrop-blur-xl z-10 sticky top-0 shrink-0">
          <div className="flex items-center space-x-6">
             <div className="flex flex-col">
               <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Operation Mode</h2>
               <span className="text-sm font-black text-white uppercase tracking-tighter">{currentView.replace('_', ' ')}</span>
             </div>
             <div className="h-8 w-px bg-slate-800"></div>
             <div className="flex flex-col">
               <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Active Relay Count</h2>
               <span className="text-sm font-black text-emerald-500 tracking-tighter">142 ONLINE</span>
             </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <button className="px-5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-black text-white uppercase tracking-wider transition-all active:scale-95">
               Trigger Emergency Broadcast
             </button>
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black ring-2 ring-slate-900 ring-offset-2 ring-offset-slate-950">
               OP
             </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950 overflow-y-auto custom-scroll">
          {/* Central Intel Panel */}
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
            {currentView === ViewMode.DASHBOARD && <ArchitectureView />}
            {currentView === ViewMode.NETWORK_C2 && <MeshSimulator />}
            {currentView === ViewMode.PROVISIONING && <ProtocolSpec />}
            {currentView === ViewMode.VOICE_COMMS && <VoiceDialer />}
            {currentView === ViewMode.LEDGER && <IncentiveLedger />}
            {currentView === ViewMode.PROTOCOL_SPEC && <RoutingSpecView />}
            {currentView === ViewMode.DEPLOYMENT_MAP && <DeploymentMap />}
            {currentView === ViewMode.MANIFESTO && <ManifestoView />}
          </div>

          {/* Root Shell / Kernel Log */}
          <div className="lg:col-span-4 flex flex-col h-full max-h-[calc(100vh-10rem)]">
             <GeminiTerminal />
          </div>
        </div>
      </main>

      {/* HUD Accents */}
      <div className="fixed top-0 right-0 w-2 h-2 bg-cyan-500 m-2 rounded-full animate-ping z-50"></div>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50"></div>
    </div>
  );
};

export default App;
