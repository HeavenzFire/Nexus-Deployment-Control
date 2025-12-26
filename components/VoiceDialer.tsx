
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

export const VoiceDialer: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [dialedNumber, setDialedNumber] = useState('');
  const [status, setStatus] = useState('READY');
  const [signalStrength, setSignalStrength] = useState(94);
  const [activeHops, setActiveHops] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  // Audio helper functions (manual implementation as per guidelines)
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startVisualizer = (stream: MediaStream) => {
    if (!canvasRef.current) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);
    analyzerRef.current = analyzer;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      const barWidth = (canvasRef.current!.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvasRef.current!.height;
        ctx.fillStyle = `rgba(34, 211, 238, ${0.3 + (barHeight / 100)})`;
        ctx.fillRect(x, canvasRef.current!.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  const startCall = async () => {
    if (isCalling) return;
    setIsCalling(true);
    setStatus('ENCRYPTING TUNNEL...');
    setActiveHops(['LOCAL-PEER', 'RELAY-01', 'GATEWAY-X']);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startVisualizer(stream);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: `You are the Nexus Global Mesh Operator. You are bridging a high-priority voice call for subscriber ${dialedNumber || 'UNDEFINED'}. 
          The user is calling out onto the decentralized mesh network. 
          1. Acknowledge the secure connection.
          2. Inform them of their current routing path (Hops: 3, Latency: 42ms).
          3. Maintain a professional, 'cyberpunk technician' persona.
          4. Confirm the voice link is active and end-to-end encrypted.`,
        },
        callbacks: {
          onopen: () => {
            setStatus('LINK ESTABLISHED');
          },
          onmessage: async (msg) => {
            if (msg.serverContent?.interrupted) {
              sources.forEach(s => s.stop());
              sources.clear();
              nextStartTime = 0;
              return;
            }

            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.onended = () => sources.delete(source);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sources.add(source);
            }
          },
          onclose: () => endCall(),
          onerror: (e) => {
            console.error('Session Error:', e);
            setStatus('LINK INTERRUPTED');
            setTimeout(endCall, 2000);
          }
        }
      });

      // Send audio data to the model
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16[i] = inputData[i] * 32768;
        }
        const pcmBlob = {
          data: encode(new Uint8Array(int16.buffer)),
          mimeType: 'audio/pcm;rate=16000',
        };
        sessionPromise.then(session => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };
      source.connect(processor);
      processor.connect(inputCtx.destination);
      
      sessionRef.current = {
        sessionPromise,
        stop: () => {
          stream.getTracks().forEach(t => t.stop());
          processor.disconnect();
          source.disconnect();
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

    } catch (err) {
      console.error(err);
      setStatus('PERMISSION DENIED');
      setIsCalling(false);
    }
  };

  const endCall = () => {
    if (sessionRef.current) {
      sessionRef.current.sessionPromise.then((s: any) => s.close());
      sessionRef.current.stop();
    }
    setIsCalling(false);
    setStatus('READY');
    setDialedNumber('');
    setActiveHops([]);
  };

  const addDigit = (d: string) => {
    if (isCalling) return;
    if (dialedNumber.length < 10) setDialedNumber(prev => prev + d);
  };

  const clearLast = () => {
    if (isCalling) return;
    setDialedNumber(prev => prev.slice(0, -1));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 bg-slate-900/30 p-8 rounded-3xl border border-slate-800/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-800 p-8 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        
        {/* Top Bezier / Camera */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10 flex items-center justify-center space-x-2">
           <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></div>
           <div className="w-8 h-1 bg-slate-900 rounded-full"></div>
        </div>

        {/* Signal HUD */}
        <div className="flex justify-between items-center mt-4 mb-8 px-2 relative z-10">
          <div className="flex items-end space-x-0.5 h-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1 rounded-full ${i <= 4 ? 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'bg-slate-700'} transition-all`} style={{ height: `${i * 20}%` }}></div>
            ))}
            <span className="text-[8px] font-mono text-cyan-500 ml-2">LTE-M</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-[9px] font-mono text-emerald-500 font-black animate-pulse">● SECURE</div>
            <div className="text-[9px] font-mono text-slate-500">12:42</div>
          </div>
        </div>

        {/* Display Area */}
        <div className="bg-black/80 border border-slate-800 rounded-3xl p-6 mb-8 text-center min-h-[140px] flex flex-col justify-center shadow-inner relative overflow-hidden group-hover:border-cyan-900/50 transition-colors">
          {/* Audio Visualizer Overlay */}
          <canvas ref={canvasRef} width={300} height={140} className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${isCalling ? 'opacity-40' : 'opacity-0'}`} />
          
          <div className="relative z-10">
            <div className="text-4xl font-mono text-white tracking-[0.15em] mb-3 h-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {dialedNumber || 'MESH CORE'}
            </div>
            <div className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-500 ${isCalling ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`}>
              {status}
            </div>
            {isCalling && (
              <div className="mt-4 flex justify-center space-x-1">
                {activeHops.map((hop, i) => (
                  <React.Fragment key={hop}>
                    <span className="text-[7px] font-mono text-emerald-500/80">{hop}</span>
                    {i < activeHops.length - 1 && <span className="text-[7px] text-slate-700">→</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-5 mb-10 relative z-10">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(digit => (
            <button
              key={digit}
              disabled={isCalling}
              onClick={() => addDigit(digit)}
              className="w-full aspect-square rounded-2xl bg-slate-900/50 border border-slate-800/80 text-slate-300 text-xl font-bold flex flex-col items-center justify-center hover:bg-slate-800 hover:border-cyan-500/30 active:scale-90 transition-all disabled:opacity-30 disabled:grayscale group/btn"
            >
              <span>{digit}</span>
              <span className="text-[7px] text-slate-600 font-mono mt-0.5 group-hover/btn:text-cyan-700 uppercase tracking-tighter">
                {digit === '2' ? 'abc' : digit === '3' ? 'def' : digit === '4' ? 'ghi' : digit === '5' ? 'jkl' : digit === '6' ? 'mno' : digit === '7' ? 'pqrs' : digit === '8' ? 'tuv' : digit === '9' ? 'wxyz' : ''}
              </span>
            </button>
          ))}
        </div>

        {/* Primary Controls */}
        <div className="flex space-x-4 relative z-10">
          {!isCalling ? (
            <>
              <button
                onClick={clearLast}
                className="flex-1 py-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Clear
              </button>
              <button
                onClick={startCall}
                disabled={!dialedNumber && false}
                className="flex-[2] py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:translate-y-1"
              >
                Uplink
              </button>
            </>
          ) : (
            <button
              onClick={endCall}
              className="w-full py-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] animate-pulse"
            >
              Terminate Link
            </button>
          )}
        </div>

        {/* Decorative Scratches / Industrial Look */}
        <div className="absolute top-1/4 left-0 w-1 h-20 bg-slate-800/30 rounded-r-full"></div>
        <div className="absolute top-1/4 right-0 w-1 h-20 bg-slate-800/30 rounded-l-full"></div>
      </div>

      <div className="flex flex-col items-center space-y-4 max-w-md w-full">
        <div className="flex space-x-6">
           <div className="text-center">
             <p className="text-[9px] font-mono text-slate-600 uppercase mb-1">Packet Loss</p>
             <p className="text-xs font-bold text-emerald-500">0.02%</p>
           </div>
           <div className="text-center border-l border-slate-800 pl-6">
             <p className="text-[9px] font-mono text-slate-600 uppercase mb-1">Cipher Suite</p>
             <p className="text-xs font-bold text-cyan-500">CHACHA20-POLY1305</p>
           </div>
           <div className="text-center border-l border-slate-800 pl-6">
             <p className="text-[9px] font-mono text-slate-600 uppercase mb-1">Latency</p>
             <p className="text-xs font-bold text-amber-500">38ms</p>
           </div>
        </div>
        
        <p className="text-[9px] font-mono text-slate-500 leading-relaxed text-center px-4 uppercase tracking-tighter opacity-60">
           This terminal routes voice data via localized peer clusters. Calls do not transit carrier base stations. Emergency services access is limited to mesh-connected responder nodes.
        </p>
      </div>
    </div>
  );
};
