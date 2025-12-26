
export interface Node {
  id: string;
  x: number;
  y: number;
  type: 'Android-Relay' | 'iOS-Client' | 'Gateway-Hub';
  status: 'online' | 'routing' | 'degraded';
  battery: number;
  uptime: string;
  throughput: string;
  peers: number;
}

export interface Link {
  source: string;
  target: string;
  rssi: number;
  type: 'WFD' | 'BLE';
  load: number;
}

export interface TelemetryPacket {
  id: string;
  source: string;
  hops: number;
  latency: number;
  size: string;
  protocol: 'NEXUS-V1';
}

export interface Receipt {
  id: string;
  timestamp: string;
  nodeId: string;
  dataRelayed: string;
  reward: string;
  status: 'PENDING' | 'SETTLED' | 'VERIFIED';
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  PROVISIONING = 'PROVISIONING',
  NETWORK_C2 = 'NETWORK_C2',
  LEDGER = 'LEDGER',
  VOICE_COMMS = 'VOICE_COMMS',
  PROTOCOL_SPEC = 'PROTOCOL_SPEC',
  DEPLOYMENT_MAP = 'DEPLOYMENT_MAP',
  MANIFESTO = 'MANIFESTO'
}

export interface NMPPacketHeader {
  magic: number; // 4 bytes: 0x4E585553
  version: number; // 1 byte
  ttl: number; // 1 byte
  flags: number; // 2 bytes
  messageId: string; // 16 bytes (hex string)
  senderId: string; // 32 bytes (public key)
}
