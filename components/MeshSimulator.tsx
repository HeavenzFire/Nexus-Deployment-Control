
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Node, Link } from '../types';

const LIVE_INFRA: Node[] = [
  { id: 'RELAY-01-NY', x: 200, y: 200, type: 'Android-Relay', status: 'online', battery: 88, uptime: '14d 2h', throughput: '1.2Mbps', peers: 4 },
  { id: 'RELAY-02-NY', x: 450, y: 150, type: 'Android-Relay', status: 'routing', battery: 94, uptime: '8d 19h', throughput: '2.5Mbps', peers: 6 },
  { id: 'CLIENT-773', x: 600, y: 300, type: 'iOS-Client', status: 'online', battery: 42, uptime: '2h 11m', throughput: '400Kbps', peers: 2 },
  { id: 'GATEWAY-PRIMARY', x: 350, y: 400, type: 'Gateway-Hub', status: 'online', battery: 100, uptime: '156d 4h', throughput: '45Mbps', peers: 12 },
  { id: 'RELAY-05-BK', x: 150, y: 450, type: 'Android-Relay', status: 'degraded', battery: 12, uptime: '22d 8h', throughput: '120Kbps', peers: 1 },
];

export const MeshSimulator: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>(LIVE_INFRA);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [discoveryLog, setDiscoveryLog] = useState<{ id: string, msg: string, time: string }[]>([]);

  // Simulation of periodic peer discovery
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      const events = [
        `SCANNING: Looking for nearby Nexus nodes...`,
        `FOUND_SERVICE: Nexus_V1_Node@${randomNode.id.split('-').pop()}`,
        `RESOLVED: ${randomNode.id} [RSSI: -${Math.floor(Math.random() * 50 + 40)} dBm]`,
        `PROVISIONING: Exchanging handshake keys...`
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      setDiscoveryLog(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        msg: randomEvent,
        time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }, ...prev].slice(0, 10));
    }, 3000);
    return () => clearInterval(interval);
  }, [nodes]);

  useEffect(() => {
    const activeLinks: Link[] = [];
    nodes.forEach((n1, i) => {
      nodes.forEach((n2, j) => {
        if (i >= j) return;
        const dist = Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
        if (dist < 280) {
          activeLinks.push({
            source: n1.id,
            target: n2.id,
            rssi: -40 - (dist / 10),
            type: n1.type.includes('Android') && n2.type.includes('Android') ? 'WFD' : 'BLE',
            load: Math.random()
          });
        }
      });
    });
    setLinks(activeLinks);
  }, [nodes]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const g = svg.append('g');

    // Link Rendering
    g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', d => nodes.find(n => n.id === d.source)?.x || 0)
      .attr('y1', d => nodes.find(n => n.id === d.source)?.y || 0)
      .attr('x2', d => nodes.find(n => n.id === d.target)?.x || 0)
      .attr('y2', d => nodes.find(n => n.id === d.target)?.y || 0)
      .attr('stroke', d => d.type === 'WFD' ? '#22d3ee' : '#10b981')
      .attr('stroke-width', d => (d.load * 4) + 1)
      .attr('stroke-dasharray', d => d.type === 'BLE' ? '4,4' : 'none')
      .attr('opacity', 0.4);

    // Node Rendering
    const nodeGroups = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('click', (_, d) => setSelectedNode(d))
      .style('cursor', 'crosshair');

    // Status Ring (Pulsing for active routers)
    nodeGroups.append('circle')
      .attr('r', 28)
      .attr('fill', 'transparent')
      .attr('stroke', d => d.status === 'degraded' ? '#ef4444' : (d.status === 'routing' ? '#22d3ee' : '#10b981'))
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.2)
      .attr('class', d => d.status === 'routing' ? 'animate-pulse' : '');

    // Inner Glow
    nodeGroups.append('circle')
      .attr('r', 12)
      .attr('fill', d => d.type === 'Gateway-Hub' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 211, 238, 0.1)');

    // Main Node Body
    nodeGroups.append('rect')
      .attr('x', -10)
      .attr('y', -10)
      .attr('width', 20)
      .attr('height', 20)
      .attr('rx', 3)
      .attr('fill', d => d.type === 'Gateway-Hub' ? '#f59e0b' : '#1e293b')
      .attr('stroke', d => d.status === 'degraded' ? '#ef4444' : '#334155')
      .attr('stroke-width', 1.5);

    // Node Labels
    nodeGroups.append('text')
      .text(d => d.id.split('-').pop())
      .attr('text-anchor', 'middle')
      .attr('dy', 34)
      .attr('fill', '#94a3b8')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('class', 'mono');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
  }, [nodes, links]);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse delay-75"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse delay-150"></div>
          </div>
          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em]">Live Mesh Topology</h3>
            <p className="text-[9px] text-slate-500 font-mono tracking-tighter italic uppercase">Encrypted L2 Telemetry // Zone-01 (NYC)</p>
          </div>
        </div>
        <div className="flex space-x-6 text-right">
          <div>
            <p className="text-[8px] text-slate-500 uppercase font-bold">Aggregate Throughput</p>
            <p className="text-xs font-mono text-cyan-400">582.4 KB/S</p>
          </div>
          <div className="border-l border-slate-800 pl-6">
            <p className="text-[8px] text-slate-500 uppercase font-bold">Relay Health</p>
            <p className="text-xs font-mono text-emerald-400">92% AVG</p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] cursor-move flex overflow-hidden">
        <svg ref={svgRef} className="flex-1 h-full"></svg>
        
        {/* Discovery Log Sidebar Overlay */}
        <div className="absolute top-0 right-0 w-64 h-full bg-slate-900/60 backdrop-blur-md border-l border-slate-800 p-4 flex flex-col space-y-3 z-10 transition-transform hover:bg-slate-900/80">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <h4 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Discovery Log</h4>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scroll scrollbar-hide">
            {discoveryLog.map(log => (
              <div key={log.id} className="text-[9px] font-mono leading-tight border-l border-slate-700 pl-2 py-1">
                <span className="text-slate-600">[{log.time}]</span>{' '}
                <span className={log.msg.includes('FOUND') ? 'text-emerald-400' : 'text-slate-400'}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedNode && (
          <div className="absolute top-6 left-6 p-6 bg-slate-900/90 border border-slate-700 rounded-2xl w-80 backdrop-blur-xl shadow-2xl border-l-4 border-l-cyan-500 animate-in fade-in slide-in-from-left-4 z-20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-white font-black text-sm tracking-widest uppercase">{selectedNode.id}</h4>
                <p className="text-[9px] text-slate-500 font-mono uppercase mt-1">{selectedNode.type} // V1.4.2</p>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white transition-colors text-xl">×</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Battery</p>
                <div className="flex items-center">
                  <span className={`text-xs font-mono ${selectedNode.battery < 20 ? 'text-red-500' : 'text-emerald-500'}`}>{selectedNode.battery}%</span>
                  <div className="ml-2 flex-1 h-1 bg-slate-800 rounded-full">
                    <div className={`h-full rounded-full ${selectedNode.battery < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${selectedNode.battery}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Peers</p>
                <p className="text-xs font-mono text-white">{selectedNode.peers} Active</p>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-white rounded-lg uppercase tracking-widest transition-all flex items-center justify-center">
                <span className="mr-2">⚡</span> Remote Terminal
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-6 left-6 p-4 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md flex space-x-6 z-10">
           <div className="flex items-center space-x-2">
             <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
             <span className="text-[9px] font-mono text-slate-400 uppercase">Wi-Fi Direct Link</span>
           </div>
           <div className="flex items-center space-x-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="text-[9px] font-mono text-slate-400 uppercase">BLE Discovery</span>
           </div>
        </div>
      </div>

      <div className="p-2 px-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono">
        <div className="flex space-x-4 overflow-hidden">
          <span className="text-slate-600 uppercase tracking-tighter shrink-0">Status:</span>
          <div className="flex space-x-6 whitespace-nowrap animate-marquee">
             <span className="text-cyan-600">P2P_DISCOVERY: SCANNING_ACTIVE [CH_06]</span>
             <span className="text-emerald-600">NSD_BROADCAST: NEXUS_NODE_ID=0x7E3...</span>
             <span className="text-slate-500 opacity-50">HEARTBEAT_OK: 142 NODES_MESHED</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-slate-600 shrink-0">
          <span>LATENCY 14ms</span>
          <div className="w-px h-2 bg-slate-800"></div>
          <span>FPS 60</span>
        </div>
      </div>
    </div>
  );
};
