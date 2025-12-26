
import React, { useState, useEffect } from 'react';
import { Receipt } from '../types';

export const IncentiveLedger: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial mock data
    const mockReceipts: Receipt[] = [
      { id: 'REC-8921-X', timestamp: '2025-05-14 12:04:11', nodeId: 'RELAY-01-NY', dataRelayed: '42.1 MB', reward: '0.42 NXS', status: 'SETTLED' },
      { id: 'REC-8922-A', timestamp: '2025-05-14 12:05:45', nodeId: 'RELAY-02-NY', dataRelayed: '128.5 MB', reward: '1.28 NXS', status: 'VERIFIED' },
      { id: 'REC-8923-B', timestamp: '2025-05-14 12:06:12', nodeId: 'RELAY-01-NY', dataRelayed: '12.4 MB', reward: '0.12 NXS', status: 'PENDING' },
      { id: 'REC-8924-C', timestamp: '2025-05-14 12:07:01', nodeId: 'RELAY-05-BK', dataRelayed: '2.1 MB', reward: '0.02 NXS', status: 'PENDING' },
    ];
    setReceipts(mockReceipts);
  }, []);

  const syncLedger = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Simulate settling pending receipts
      setReceipts(prev => prev.map(r => r.status === 'PENDING' ? { ...r, status: 'VERIFIED' } : r));
    }, 2000);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Decentralized Settlement</h2>
            <p className="text-slate-400 text-sm font-mono mt-1">Off-chain accounting via signed relay proofs.</p>
          </div>
          <button 
            onClick={syncLedger}
            disabled={isSyncing}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              isSyncing ? 'bg-slate-800 text-slate-500' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
            }`}
          >
            {isSyncing ? 'Syncing...' : 'Force Settle Batch'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Global Rewards Pool</p>
            <p className="text-2xl font-mono text-white">4,291.82 <span className="text-cyan-500">NXS</span></p>
          </div>
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Throughput (24h)</p>
            <p className="text-2xl font-mono text-white">842.1 <span className="text-emerald-500">GB</span></p>
          </div>
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Active Nodes Paid</p>
            <p className="text-2xl font-mono text-white">128 <span className="text-amber-500">NODES</span></p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
           <span className="w-40">Receipt ID</span>
           <span className="w-32">Node</span>
           <span className="flex-1">Relayed Payload</span>
           <span className="w-24 text-right">Reward</span>
           <span className="w-32 text-right">Status</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scroll">
          {receipts.map(receipt => (
            <div key={receipt.id} className="bg-slate-950/30 hover:bg-slate-800/30 p-4 rounded-xl border border-slate-800/50 flex justify-between items-center transition-all group">
               <span className="w-40 text-xs font-mono text-slate-400 group-hover:text-cyan-500">{receipt.id}</span>
               <span className="w-32 text-xs font-bold text-slate-300">{receipt.nodeId}</span>
               <span className="flex-1 text-xs text-slate-500 font-mono">{receipt.dataRelayed}</span>
               <span className="w-24 text-right text-xs font-black text-emerald-500">{receipt.reward}</span>
               <div className="w-32 text-right">
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                    receipt.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-500' :
                    receipt.status === 'VERIFIED' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'
                  }`}>
                    {receipt.status}
                  </span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
