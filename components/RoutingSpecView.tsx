
import React from 'react';

export const RoutingSpecView: React.FC = () => {
  const packetStructure = [
    { offset: '00-03', field: 'MAGIC', type: 'uint32', desc: 'Protocol Identifier (0x4E585553)', color: 'text-cyan-400' },
    { offset: '04', field: 'VER', type: 'uint8', desc: 'Protocol Version (0x01)', color: 'text-slate-400' },
    { offset: '05', field: 'TTL', type: 'uint8', desc: 'Hop Limit (Max 64, Drop @ 0)', color: 'text-amber-400' },
    { offset: '06-07', field: 'FLAGS', type: 'uint16', desc: 'Bitmask (0: Encrypted, 1: Critical, 2-15: Res)', color: 'text-slate-400' },
    { offset: '08-23', field: 'MSG_ID', type: 'bytes[16]', desc: 'Unique UUID/Hash for Deduplication', color: 'text-emerald-400' },
    { offset: '24-55', field: 'SENDER', type: 'bytes[32]', desc: 'Ed25519 Source Public Key', color: 'text-purple-400' },
    { offset: '56-119', field: 'SIG', type: 'bytes[64]', desc: 'Ed25519 Signature of Header+Payload', color: 'text-red-400' },
    { offset: '120-N', field: 'PAYLOAD', type: 'bytes[M]', desc: 'XChaCha20-Poly1305 Ciphertext', color: 'text-blue-400' },
  ];

  const logicSteps = [
    { title: 'Deduplication', icon: '🧹', desc: 'Check local LRU cache of MSG_IDs. If present, discard packet immediately to prevent loops.' },
    { title: 'TTL Decrement', icon: '⏳', desc: 'Decrement TTL. If result <= 0, packet has exceeded lifetime and is dropped.' },
    { title: 'Gossip Selection', icon: '🎲', desc: 'Select a subset of N neighbors (N = sqrt(Total Neighbors)) for forwarding to reduce network congestion.' },
    { title: 'Signed Verification', icon: '🔏', desc: 'Verify SIG against SENDER key. If signature mismatch, discard to prevent injection attacks.' },
  ];

  return (
    <div className="space-y-8 h-full overflow-y-auto pr-4 custom-scroll pb-10">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">NMP v1 Specification</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl font-mono leading-relaxed uppercase opacity-80">
          Application-Layer Routing Protocol for Decentralized Mobile Ad-Hoc Networks (MANETs).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Packet Layout */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Binary Frame Layout</span>
            <span className="text-[9px] font-mono text-cyan-500">BIG ENDIAN</span>
          </div>
          <div className="p-6 space-y-1 font-mono text-[11px]">
            {packetStructure.map((item, idx) => (
              <div key={idx} className="flex border-b border-slate-800/30 py-2 group hover:bg-slate-800/20 transition-colors">
                <span className="w-16 text-slate-600 font-bold">{item.offset}</span>
                <span className={`w-24 font-black ${item.color}`}>{item.field}</span>
                <span className="w-20 text-slate-500">{item.type}</span>
                <span className="flex-1 text-slate-400 italic">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Routing Logic */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Propagation Algorithm</h3>
          {logicSteps.map((step, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-start space-x-4 hover:border-cyan-500/30 transition-all">
              <span className="text-2xl">{step.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="bg-cyan-900/10 border border-cyan-500/20 p-6 rounded-2xl">
            <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-3">Gossip Probability Matrix</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-500 italic">Neighbor Density &lt; 5</span>
                <span className="text-emerald-500 font-bold">Flood (P=1.0)</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-500 italic">Neighbor Density 5-20</span>
                <span className="text-cyan-500 font-bold">Directed (P=0.6)</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-500 italic">Neighbor Density &gt; 20</span>
                <span className="text-amber-500 font-bold">Gossip (P=0.3)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Visual Packet Journey</h3>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 hidden md:block"></div>
          
          {[
            { label: 'Origin', desc: 'Signature Generated', color: 'bg-emerald-500' },
            { label: 'Relay 1', desc: 'TTL: 64 -> 63', color: 'bg-cyan-500' },
            { label: 'Relay 2', desc: 'Gossip Prob: 0.6', color: 'bg-cyan-500' },
            { label: 'Dest', desc: 'Auth Verified', color: 'bg-purple-500' },
          ].map((hop, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center group">
              <div className={`w-4 h-4 rounded-full ${hop.color} shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-150 transition-transform`}></div>
              <div className="mt-4 text-center">
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">{hop.label}</p>
                <p className="text-[8px] text-slate-500 font-mono mt-1 italic">{hop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
