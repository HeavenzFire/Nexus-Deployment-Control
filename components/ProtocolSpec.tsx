
import React, { useState } from 'react';
import { getProvisioningConfig } from '../services/gemini';

export const ProtocolSpec: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<string | null>(null);
  const [activeTarget, setActiveTarget] = useState<string | null>(null);

  const generateConfig = async (hardware: string) => {
    setLoading(true);
    setActiveTarget(hardware);
    try {
      const result = await getProvisioningConfig(hardware);
      setConfig(result);
    } catch (e) {
      setConfig("Error generating deployment spec. Verification required.");
    } finally {
      setLoading(false);
    }
  };

  const targets = [
    { id: 'Nexus Mesh Protocol (NMP) v1 - Routing Engine', label: 'Routing Engine', icon: '🌀', desc: 'Gossip & TTL Logic' },
    { id: 'Android WifiP2pManager - Group Owner Logic', label: 'GO Initialization', icon: '👑', desc: 'Core P2P group arbitration' },
    { id: 'Secure TCP/QUIC Transport Layer over P2P Sockets', label: 'Secure Sockets', icon: '🔒', desc: 'E2EE transport pipeline' },
    { id: 'Android P2P Peer Discovery & Service Broadcast', label: 'Mesh Discovery', icon: '📡', desc: 'Zero-config peer finding' },
    { id: 'Ed25519 Cryptographic Identity Generation (Android)', label: 'Node Auth', icon: '🔑', desc: 'Secure ID provisioning' }
  ];

  return (
    <div className="space-y-8 h-full overflow-y-auto pr-4 custom-scroll">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 p-6">
          <div className="w-16 h-16 border-t-2 border-r-2 border-cyan-500 rounded-tr-3xl opacity-20"></div>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Hardware Provisioner</h2>
          <p className="text-slate-400 text-sm max-w-xl font-medium">
            Generate production-grade infrastructure logic for the Nexus Mesh backbone. 
            Targeting low-level Android APIs and specialized mesh routing firmware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-10">
          {targets.map((target) => (
            <button 
              key={target.id}
              onClick={() => generateConfig(target.id)}
              className={`group p-4 border rounded-2xl text-[10px] font-bold transition-all flex flex-col items-center text-center space-y-3 uppercase tracking-widest relative overflow-hidden ${
                activeTarget === target.id 
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : 'bg-slate-950/50 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-2xl mb-1 transition-transform group-hover:scale-125 duration-300">{target.icon}</span>
              <div className="flex flex-col">
                <span className="block">{target.label}</span>
                <span className={`text-[7px] mt-1 normal-case font-mono opacity-50 ${activeTarget === target.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {target.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="p-20 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-700">
           <div className="relative">
             <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-cyan-500 tracking-tighter">NXS</div>
           </div>
           <div className="text-center space-y-2">
             <p className="text-xs font-mono text-cyan-500 uppercase tracking-[0.4em] animate-pulse font-bold">Initializing Compiler...</p>
             <p className="text-[9px] font-mono text-slate-600 uppercase">Generating L2/L3 Peer Arbitration Logic</p>
           </div>
        </div>
      )}

      {config && !loading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-between items-center px-6">
             <div className="flex items-center space-x-3">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Module: <span className="text-white">{activeTarget}</span></h3>
             </div>
             <button 
               onClick={() => {
                 navigator.clipboard.writeText(config);
               }}
               className="px-4 py-1.5 border border-cyan-500/30 text-[10px] text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all uppercase font-black rounded-full tracking-widest shadow-lg"
             >
               Copy Payload
             </button>
          </div>
          <div className="bg-black/80 border-2 border-slate-800 p-10 rounded-[2.5rem] font-mono text-[11px] overflow-x-auto text-slate-300 leading-relaxed shadow-2xl relative group/code">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-transparent to-transparent opacity-30"></div>
            <div className="absolute top-4 right-8 text-[8px] text-slate-700 font-bold tracking-[0.5em] uppercase opacity-40">Nexus-V1 Runtime</div>
            <pre className="whitespace-pre-wrap">{config}</pre>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
        {[
          { id: '0x01', title: 'Group Arbitration', text: 'Autonomous selection of Group Owners based on hardware thermal limits and battery cycle health.' },
          { id: '0x02', title: 'Routing Probabilities', text: 'Directed gossip mechanism using RSSI and node uptime to weight packet forwarding decisions.' },
          { id: '0x03', title: 'TTL Safety', text: 'Packet lifetime management ensuring zero cyclic traffic loops within high-density mobile clusters.' }
        ].map(feat => (
          <div key={feat.id} className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl relative group hover:border-slate-700 transition-all">
             <div className="absolute top-4 right-6 text-[10px] font-black text-slate-800 group-hover:text-cyan-900 transition-colors">{feat.id}</div>
             <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em] group-hover:text-cyan-500 transition-colors">{feat.title}</h4>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">{feat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
