export const INITIAL_ALERTS = [
  {
    id: "ALT-9042",
    timestamp: "Just now",
    severity: "critical",
    title: "Zero-Day Remote Code Execution Detected",
    target: "prod-auth-cluster-04.us-east",
    sourceIp: "185.220.101.45 (Tor Exit Node)",
    vector: "CVE-2026-1049 (Memory Corrupt)",
    mitre: "T1203 - Exploitation for Client Execution",
    status: "active",
    aiConfidence: "99.2%",
    recommendation: "Immediate pod isolation & ephemeral cert revocation"
  },
  {
    id: "ALT-9041",
    timestamp: "2 mins ago",
    severity: "critical",
    title: "Distributed Volumetric SYN Flood (480 Gbps)",
    target: "edge-gateway-eu-west.cyberpulse.net",
    sourceIp: "Botnet Mirai-variant (3,400+ nodes)",
    vector: "L4 TCP SYN Infiltration",
    mitre: "T1498 - Network Denial of Service",
    status: "mitigating",
    aiConfidence: "98.7%",
    recommendation: "BGP Anycast diversion active. Scrubbing center routing."
  },
  {
    id: "ALT-9040",
    timestamp: "8 mins ago",
    severity: "high",
    title: "Suspicious Kerberos Ticket-Granting (Golden Ticket)",
    target: "CORP-DC01.INTERNAL",
    sourceIp: "10.240.18.92 (Compromised Workstation)",
    vector: "Pass-the-Ticket Attack",
    mitre: "T1558.001 - Golden Ticket",
    status: "active",
    aiConfidence: "95.4%",
    recommendation: "Invalidate KRBTGT password hash & force Kerberos ticket reset"
  },
  {
    id: "ALT-9039",
    timestamp: "14 mins ago",
    severity: "high",
    title: "Anomalous Data Exfiltration via DNS Tunneling",
    target: "finance-db-replica-02",
    sourceIp: "10.110.4.15",
    vector: "Base64 DNS TXT Record Flood",
    mitre: "T1071.004 - DNS Exfiltration",
    status: "investigating",
    aiConfidence: "93.1%",
    recommendation: "Block domain root *.ns-update-xyz.cc on resolver"
  },
  {
    id: "ALT-9038",
    timestamp: "27 mins ago",
    severity: "medium",
    title: "Credential Stuffing on Customer Portal API",
    target: "/api/v2/auth/token",
    sourceIp: "45.154.255.0/24 (Proxy Pool)",
    vector: "Automated Credential Spraying",
    mitre: "T1110.003 - Credential Stuffing",
    status: "mitigated",
    aiConfidence: "97.0%",
    recommendation: "Rate limit triggered, CAPTCHA challenge enforced"
  },
  {
    id: "ALT-9037",
    timestamp: "45 mins ago",
    severity: "low",
    title: "Port Scan & SSH Banner Grabbing",
    target: "bastion-host-ext-01",
    sourceIp: "193.163.125.8",
    vector: "Reconnaissance Port Sweep",
    mitre: "T1046 - Network Service Discovery",
    status: "mitigated",
    aiConfidence: "89.5%",
    recommendation: "Automated IP drop applied at edge firewall"
  }
];

export const SYSTEM_METRICS = {
  activeThreats: 14,
  mitigatedToday: 1428,
  endpointsProtected: "48,290",
  threatIndex: "7.8",
  bandwidthInspected: "4.2 Tbps",
  aiModelLatency: "14ms",
  neuralConfidenceAvg: "97.4%",
  defconLevel: 2
};

export const ATTACK_VECTORS = [
  { name: "Zero-Day / Exploit Chains", percentage: 38, count: "542 hits", color: "bg-rose-500", glow: "shadow-rose-500/50" },
  { name: "Credential Abuse / Brute Force", percentage: 27, count: "386 hits", color: "bg-amber-500", glow: "shadow-amber-500/50" },
  { name: "DDoS / Volumetric Reflection", percentage: 19, count: "271 hits", color: "bg-cyan-500", glow: "shadow-cyan-500/50" },
  { name: "Data Exfiltration & C2", percentage: 11, count: "157 hits", color: "bg-purple-500", glow: "shadow-purple-500/50" },
  { name: "Supply Chain & API Injection", percentage: 5, count: "72 hits", color: "bg-blue-500", glow: "shadow-blue-500/50" }
];

export const GEOGRAPHIC_SOURCES = [
  { country: "Eastern Europe", count: "1,420 attacks", risk: "Critical", flag: "🌐" },
  { country: "East Asia", count: "1,105 attacks", risk: "High", flag: "🌏" },
  { country: "North America", count: "890 attacks", risk: "Medium", flag: "🌎" },
  { country: "South America", count: "420 attacks", risk: "Low", flag: "🌎" },
  { country: "Western Europe", count: "310 attacks", risk: "Low", flag: "🌍" }
];
