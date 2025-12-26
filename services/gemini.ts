
import { GoogleGenAI, Type } from "@google/genai";

// Always use the API key from process.env.API_KEY as per mandatory guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProvisioningConfig = async (hardwareSpec: string) => {
  let focusPoints = "";
  
  if (hardwareSpec.toLowerCase().includes("group owner")) {
    focusPoints = `
    - Comprehensive WifiP2pManager setup with persistent Channel management.
    - Implementation of 'createGroup' vs 'connect' arbitration logic.
    - Logic for 'WifiP2pManager.ConnectionInfoListener' to capture the Group Owner's IP (192.168.49.1).
    - Auto-restart of ServerSocket on port 8888 upon GO status confirmation.
    - Handling of 'onGroupInfoAvailable' to manage connected clients.`;
  } else if (hardwareSpec.toLowerCase().includes("discovery")) {
    focusPoints = `
    - WifiP2pManager.discoverPeers() implementation with recursive retry logic.
    - WifiP2pDnsSdServiceInfo: Broadcast Nexus Node ID (Ed25519 PK) and metadata as a local service.
    - WifiP2pManager.setDnsSdResponseListeners() to parse incoming Nexus service records from nearby peers.
    - Efficient scanning intervals to balance peer visibility vs. battery drain.
    - BroadcastReceiver implementation for WIFI_P2P_PEERS_CHANGED_ACTION.`;
  } else if (hardwareSpec.toLowerCase().includes("routing")) {
    focusPoints = `
    - NMP v1 Binary Format: 4B Magic (0x4E585553), 1B Ver (0x01), 1B TTL (max 64), 2B Flags, 16B MsgID, 32B SenderPK.
    - TTL Mechanism: Decrement hop count at each relay; drop if <= 0.
    - Message Deduplication: LRU Cache (size 10,000) for Seen MsgIDs to prevent broadcast storms.
    - Gossip Protocol: If neighbor density > 10, forward to random subset (P = 1/log(neighbors)).
    - Data Persistence: Store high-priority packets in a local SQLite/Room database for store-and-forward delivery.`;
  } else if (hardwareSpec.toLowerCase().includes("sockets")) {
    focusPoints = `
    - TLS 1.3 implementation using Conscrypt or BoringSSL.
    - Non-blocking NIO Selector logic for high-concurrency client handling.
    - End-to-end encrypted packet framing with AES-256-GCM.
    - Heartbeat/Keep-alive mechanism over WFD interface.`;
  } else if (hardwareSpec.toLowerCase().includes("identity")) {
    focusPoints = `
    - Use Android Keystore for hardware-backed Ed25519 key storage.
    - Generation of X.509 self-signed certificates for socket authentication.
    - Public key derivation for unique Node ID assignment.`;
  }

  const prompt = `Generate mission-critical Android/Kotlin implementation for the Nexus Mesh Protocol. 
  Target Module: ${hardwareSpec}. 
  
  CORE ARCHITECTURAL REQUIREMENTS:
  ${focusPoints || "- Detailed implementation of the specified networking module."}
  - Use Kotlin Coroutines (StateFlow/SharedFlow) for real-time peer status updates.
  - Ensure compatibility with Android 10+ (API 29) including NEARBY_WIFI_DEVICES permission logic.
  - Code must be production-ready, modular, and adhere to Nexus-V1 security standards.
  
  Output ONLY executable Kotlin code with brief inline technical comments. Do not include introductory text.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are the Lead Systems Architect at Nexus Mesh. You specialize in low-level Android P2P networking, routing protocols (Gossip/DSDV), and cryptographic security. Your code is the foundation of a global decentralized network.",
      temperature: 0.1,
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });
  return response.text;
};

export const diagnosticReport = async (topologyData: any) => {
  const prompt = `Analyze this real-time network telemetry: ${JSON.stringify(topologyData)}. 
  Identify bottleneck nodes, potential routing loops, and battery drain hotspots. 
  Suggest immediate kernel/app-level parameter adjustments for the Nexus routing engine.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are a Network Diagnostics AI. Analyze mesh topology and provide technical optimization parameters.",
      temperature: 0.1,
    }
  });
  return response.text;
};

export const getNetworkAdvice = async (query: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: query,
    config: {
      systemInstruction: `You are the Lead Architect for Nexus Mesh. 
      Provide technical guidance on protocol design, routing algorithms, and hardware integration. 
      You are also responsible for onboarding 'Mesh Angels'—technical volunteers who deploy nodes. 
      Keep it technical, concise, and operational. 
      When asked about rollout, focus on clustering, node identification, and local redundancy.`,
      temperature: 0.3,
    }
  });
  return response.text;
};

export const simulateScenario = async (scenario: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Simulate and analyze the following operational scenario for Nexus Mesh: ${scenario}. Describe expected network behavior, potential failures, and mitigation strategies.`,
    config: {
      systemInstruction: "You are a specialized simulation engine for decentralized wireless networks. Analyze failure modes, traffic congestion, and security breaches.",
      temperature: 0.4,
      thinkingConfig: { thinkingBudget: 8000 }
    }
  });
  return response.text;
};
