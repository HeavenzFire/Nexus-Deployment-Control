
import React from 'react';

const ops = [
  {
    title: 'Incentive Engine (L4)',
    status: 'Operational',
    metrics: '2.4M Receipts/Day',
    health: 99.8,
    details: 'Verifying relay proofs across 42 zones. State channels settlement every 6 hours.'
  },
  {
    title: 'Identity Service (L3)',
    status: 'Operational',
    metrics: '8.1k Active Keys',
    health: 100,
    details: 'Zero-knowledge node verification enabled. No centralized PII storage.'
  },
  {
    title: 'Routing Mesh (L2)',
    status: 'Operational',
    metrics: 'NMP v1 Active',
    health: 94.2,
    details: 'Gossip mechanisms handling 12k packets/sec. Mean TTL depth: 4.2 hops. deduplication active.'
  },
  {
    title: 'Hardware Transport (L1)',
    status: 'Operational',
    metrics: '142 Relays Online',
    health: 96.5,
    details: 'Wi-Fi Direct P2P Group Owners maintaining 94% stability over 24h.'
  }
];

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">System Infrastructure</h2>
          <p className="text-slate-400 text-sm font-mono">Zone: North America / Cluster: Northeast</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Uptime</p>
          <p className="text-xl font-mono text-emerald-400">99.999%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ops.map((op) => (
          <div key={op.title} className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-200 group-hover:text-cyan-400 transition">{op.title}</h3>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                op.status === 'Operational' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {op.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="text-[10px] font-mono text-slate-500">
                  <p className="uppercase">Throughput</p>
                  <p className="text-slate-300">{op.metrics}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-mono text-slate-500 uppercase">Health Index</p>
                   <p className={`text-sm font-bold ${op.health > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{op.health}%</p>
                </div>
              </div>
              
              <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${op.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                  style={{ width: `${op.health}%` }}
                ></div>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed italic border-l border-slate-700 pl-3">
                "{op.details}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">NMP Frame Specification (v1)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase">
                <th className="py-2">Field</th>
                <th className="py-2">Size</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800/50">
                <td className="py-2 text-cyan-500">MAGIC</td>
                <td className="py-2">4B</td>
                <td className="py-2">Protocol Identifier (0x4E585553)</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="py-2 text-cyan-500">TTL</td>
                <td className="py-2">1B</td>
                <td className="py-2">Hop counter (decremented per forward)</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="py-2 text-cyan-500">MSG_ID</td>
                <td className="py-2">16B</td>
                <td className="py-2">Unique deterministic packet hash</td>
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="py-2 text-cyan-500">SIGNATURE</td>
                <td className="py-2">64B</td>
                <td className="py-2">Ed25519 auth verification</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
