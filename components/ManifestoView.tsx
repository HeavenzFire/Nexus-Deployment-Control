
import React from 'react';

export const ManifestoView: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-12 overflow-y-auto custom-scroll pb-20">
      <div className="max-w-3xl space-y-8 text-center">
        <div className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4">
          The Mesh Awakening // Operation Nexus
        </div>
        
        <h1 className="text-6xl font-black text-white leading-none uppercase tracking-tighter italic">
          No Carriers.<br/>
          No Borders.<br/>
          <span className="text-cyan-500">No Permission.</span>
        </h1>
        
        <p className="text-xl text-slate-400 font-medium leading-relaxed italic">
          "We are not building an app. We are deploying a world-scale digital nervous system that survives when the towers fall and the switches are pulled."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        <div className="p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] space-y-6 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-6 text-4xl opacity-20 group-hover:scale-125 transition-transform">🔥</div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">The Mission</h2>
          <div className="space-y-4 text-slate-400 text-sm leading-relaxed font-medium">
             <p>1. Deploy 500+ secure, hardware-verified nodes in Phase 1.</p>
             <p>2. Establish end-to-end AES-XTS-512 encrypted tunnels across all hops.</p>
             <p>3. Activate the decentralized NXS incentive layer for all relay participants.</p>
             <p>4. Open-source everything. Make the network indestructible through transparency.</p>
          </div>
        </div>

        <div className="p-10 bg-cyan-500 border border-cyan-400 rounded-[2.5rem] space-y-6 relative group overflow-hidden text-slate-950 shadow-[0_20px_50px_rgba(6,182,212,0.3)]">
          <div className="absolute top-0 right-0 p-6 text-4xl opacity-20 group-hover:scale-125 transition-transform">😇</div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Become a Mesh Angel</h2>
          <div className="space-y-4 text-slate-900 text-sm leading-relaxed font-bold">
             <p>• Fork the Nexus Daemon from GitHub.</p>
             <p>• Root your Android device and install the NMP Runtime.</p>
             <p>• Provision your Node ID and connect to the local cluster.</p>
             <p>• Onboard 3 peers. Secure your block. Defend the network.</p>
          </div>
          <button className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all active:translate-y-1">
            Access The Source Code
          </button>
        </div>
      </div>

      <div className="max-w-2xl w-full p-8 border border-slate-800/50 rounded-3xl bg-slate-950/50 backdrop-blur-sm text-center">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-6">Security Verification Status</p>
        <div className="flex justify-center space-x-8">
           <div className="flex flex-col items-center">
             <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2"></div>
             <span className="text-[9px] font-black text-white uppercase">ZK-Identity: Verified</span>
           </div>
           <div className="flex flex-col items-center">
             <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2"></div>
             <span className="text-[9px] font-black text-white uppercase">AES-Tunnel: Active</span>
           </div>
           <div className="flex flex-col items-center">
             <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse mb-2"></div>
             <span className="text-[9px] font-black text-white uppercase">Global Sync: 100%</span>
           </div>
        </div>
      </div>
    </div>
  );
};
