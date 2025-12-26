
import React, { useState } from 'react';

interface Cluster {
  id: string;
  zone: string;
  targetNodes: number;
  priority: 'CRITICAL' | 'HIGH' | 'STARDARD';
  relayMode: 'WFD' | 'BATMAN' | 'LORA';
}

export const DeploymentMap: React.FC = () => {
  const [clusters, setClusters] = useState<Cluster[]>([
    { id: 'C-01-NYC-FIN', zone: 'Financial District, NY', targetNodes: 50, priority: 'CRITICAL', relayMode: 'WFD' },
    { id: 'C-02-NYC-BK', zone: 'Brooklyn Hub', targetNodes: 120, priority: 'HIGH', relayMode: 'BATMAN' },
    { id: 'C-03-SF-SOMA', zone: 'SoMa, San Francisco', targetNodes: 80, priority: 'HIGH', relayMode: 'WFD' },
    { id: 'C-04-LDN-CITY', zone: 'The City, London', targetNodes: 150, priority: 'CRITICAL', relayMode: 'WFD' },
    { id: 'C-05-BER-MIT', zone: 'Mitte, Berlin', targetNodes: 100, priority: 'STARDARD', relayMode: 'LORA' },
  ]);

  const generateNodeID = () => {
    return 'NXS-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Global Rollout Orchestrator</h2>
            <p className="text-slate-400 text-sm font-mono mt-1">Targeting 500+ Hardware-Verified Relay Nodes.</p>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Target Capacity</div>
             <div className="text-2xl font-mono text-cyan-500">500 / 500</div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <div className="w-32 h-32 border-8 border-cyan-500 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clusters.map((cluster) => (
          <div key={cluster.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={`text-[8px] font-black px-2 py-0.5 rounded ${
                cluster.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 
                cluster.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-500/20 text-slate-500'
              }`}>
                {cluster.priority}
              </span>
            </div>
            
            <h3 className="text-white font-black text-sm mb-1 tracking-tight group-hover:text-cyan-400 transition-colors">{cluster.id}</h3>
            <p className="text-[10px] text-slate-500 font-mono mb-6 uppercase tracking-widest">{cluster.zone}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-[10px] font-mono text-slate-400">
                  <span className="block opacity-50 uppercase text-[8px] mb-0.5">Relay Protocol</span>
                  <span className="font-bold">{cluster.relayMode} // NMPv1</span>
                </div>
                <div className="text-right">
                  <span className="block opacity-50 uppercase text-[8px] mb-0.5">Provisioned</span>
                  <span className="font-mono text-xs text-white">{cluster.targetNodes} NODES</span>
                </div>
              </div>
              
              <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: '100%' }}></div>
              </div>
            </div>

            <button className="w-full mt-6 py-2 border border-slate-800 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all">
              Download Provisioning Zip
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col flex-1">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-8">
           <h3 className="text-xs font-black text-white uppercase tracking-widest">Master Node Assignment Table</h3>
           <button className="text-[9px] font-black text-cyan-500 uppercase hover:underline">Export CSV</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
           {[...Array(15)].map((_, i) => (
             <div key={i} className="flex items-center justify-between p-3 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:bg-slate-800/20 transition-all font-mono">
               <div className="flex items-center space-x-4">
                 <span className="text-[10px] text-slate-600 font-bold">{String(i + 1).padStart(3, '0')}</span>
                 <span className="text-xs text-cyan-500 font-black">{generateNodeID()}</span>
               </div>
               <div className="flex items-center space-x-8">
                 <div className="text-right">
                   <p className="text-[8px] text-slate-500 uppercase tracking-widest">Relay Weight</p>
                   <p className="text-[10px] text-white">0.{Math.floor(Math.random() * 90) + 10}</p>
                 </div>
                 <div className="text-right w-24">
                   <p className="text-[8px] text-slate-500 uppercase tracking-widest">Status</p>
                   <p className="text-[9px] font-black text-emerald-500">ASSIGNED</p>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
