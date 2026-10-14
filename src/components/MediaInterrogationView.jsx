import React, { useState, useMemo } from 'react';
import {
  Search,
  Zap,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Link2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  Lock,
  Layers,
  Cpu,
  Eye,
  RefreshCw,
  X,
  Clock,
  Radio,
  FileCode,
  Terminal,
  Database,
  Sliders,
  Check
} from 'lucide-react';
import MultimodalSweepAnalyzer from './MultimodalSweepAnalyzer';

export default function MediaInterrogationView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('visuals'); // 'text' | 'visuals' | 'video' | 'audio' | 'urls'
  const [isScanning, setIsScanning] = useState(false);
  const [scanStats, setScanStats] = useState({
    totalScanned: '14,892,104',
    matchedAssets: 18,
    activeFeeds: 42,
    quarantinedCount: 3
  });
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [selectedAssetForModal, setSelectedAssetForModal] = useState(null);
  const [quarantinedMap, setQuarantinedMap] = useState({
    'vis-01': true,
    'aud-01': false,
    'vid-01': false,
    'txt-01': true,
    'url-01': true
  });
  const [statusMessage, setStatusMessage] = useState(null);

  // Trigger brief alert feedback
  const triggerNotification = (title, msg) => {
    setStatusMessage({ title, msg });
    setTimeout(() => setStatusMessage(null), 3800);
  };

  // Run Multimodal Sweep simulation
  const handleRunSweep = () => {
    setIsScanning(true);
    triggerNotification('Multimodal Sweep Dispatched', 'Triangulating cross-media channels, Tor nodes, and audio wiretaps...');
    
    setTimeout(() => {
      setIsScanning(false);
      setScanStats((prev) => ({
        ...prev,
        matchedAssets: prev.matchedAssets + 2,
        totalScanned: (parseInt(prev.totalScanned.replace(/,/g, '')) + 84210).toLocaleString()
      }));
      triggerNotification('Multimodal Sweep Complete', 'Identified 2 new high-fidelity threat intercepts matching surveillance profile.');
    }, 1200);
  };

  // Toggle Quarantine Asset state
  const handleToggleQuarantine = (id, title) => {
    setQuarantinedMap((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        triggerNotification('Asset Quarantined', `Asset [${id}] - "${title}" has been locked and isolated from all gateway egress.`);
      } else {
        triggerNotification('Asset Released', `Asset [${id}] removed from containment quarantine.`);
      }
      return { ...prev, [id]: nextState };
    });
  };

  // Comprehensive forensic mock dataset tailored for Law Enforcement & Cyber Defense
  const forensicAssets = useMemo(() => [
    // --- VISUALS (IMAGES) ---
    {
      id: 'vis-01',
      category: 'visuals',
      title: 'Indian Citizen Identity & Aadhaar Batch Exfiltration',
      source: 'Telegram @BlackHat_Exfil_VIP',
      timestamp: '12 mins ago (2026-10-15 03:49 UTC)',
      severity: 'CRITICAL',
      matchedKeyword: 'Aadhaar',
      matchedSnippet: 'Exfiltrated citizen master identity scan containing unredacted UID 4829-8812-9930, PAN number, and biometric linkage.',
      summary: 'OCR entity recognition extracted 14 UIDAI biometric registration numbers from a photographic capture of a district registrar registry book. Forensic image analysis confirms zero photographic tampering; authentic scanned physical document leaked via insider credentials.',
      confidence: '99.4%',
      extractedEntities: ['UID 4829-8812-9930', 'DOB 1988-04-12', 'Biometric Linked: YES', 'Registrar: North Sector'],
      fileMetadata: {
        filename: 'aadhaar_batch_registry_scan_04.jpg',
        resolution: '2400 x 3200 px',
        sha256: '9f8e7d6c5b4a3928170e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
        size: '4.8 MB'
      },
      imageOverlay: {
        boundingLabel: 'CONFIDENTIAL AADHAAR RECORD',
        boxText: 'UID: 4829 8812 9930 [VERIFIED]',
        leakChannel: 'DarkWeb Forum // Dump #401'
      }
    },
    {
      id: 'vis-02',
      category: 'visuals',
      title: 'High-Voltage Power Substation 400kV SCADA Schematic',
      source: 'Private Discord Server // Threat Group APT-41',
      timestamp: '41 mins ago (2026-10-15 03:20 UTC)',
      severity: 'CRITICAL',
      matchedKeyword: 'Power Grid Substation 400kV',
      matchedSnippet: 'Engineering blueprint depicting remote breaker trip relays, RTU modbus topology, and fiber backup ring routing.',
      summary: 'Computer Vision layout segmentation recognized high-level critical infrastructure single-line diagram (SLD). Visual watermark indicates leak originates from contractor maintenance portal CAD repository.',
      confidence: '97.8%',
      extractedEntities: ['Substation: 400kV Sector-7', 'RTU IP: 10.14.88.2', 'Protocol: IEC-60870-5-104', 'Safety Interlock Bypasses'],
      fileMetadata: {
        filename: 'scada_relay_schematic_rev3.png',
        resolution: '3840 x 2160 px',
        sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        size: '12.4 MB'
      },
      imageOverlay: {
        boundingLabel: 'CRITICAL INFRASTRUCTURE ASSET',
        boxText: 'RTU MODBUS RELAY 10.14.88.2',
        leakChannel: 'Closed Telegram Channel // APT-41'
      }
    },
    {
      id: 'vis-03',
      category: 'visuals',
      title: 'Doxxed Federal Officer Badges & Encrypted Radio Call Signs',
      source: 'BreachForums v2 Onion Mirror',
      timestamp: '2 hours ago (2026-10-15 02:01 UTC)',
      severity: 'HIGH',
      matchedKeyword: 'Police Officer Identity',
      matchedSnippet: 'High-res image of duty credentials, encrypted Motorola APX radio serial, and patrol frequency bands.',
      summary: 'Facial detection matched active duty special task force inspector. Text OCR extracted radio encryption key ID and assigned tactical precinct call signs. Immediate operational safety concern.',
      confidence: '96.2%',
      extractedEntities: ['Officer ID: POL-2024-884', 'Call Sign: EAGLE-ONE', 'Band: 412.550 MHz', 'Station: Metro Central'],
      fileMetadata: {
        filename: 'duty_cred_badge_inspect.jpeg',
        resolution: '1600 x 1200 px',
        sha256: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
        size: '2.1 MB'
      },
      imageOverlay: {
        boundingLabel: 'DOXING ALERT - LAW ENFORCEMENT',
        boxText: 'OFFICER POL-2024-884 // APX SERIAL #88492',
        leakChannel: 'DarkNet Onion Repository'
      }
    },

    // --- AUDIO INTERCEPTS ---
    {
      id: 'aud-01',
      category: 'audio',
      title: 'C2 Botnet Node Deployment Wiretap Voice Intercept',
      source: 'SIGINT Sensor Alpha-04 (Encrypted VoIP Sniffer)',
      timestamp: '8 mins ago (2026-10-15 03:53 UTC)',
      severity: 'CRITICAL',
      matchedKeyword: 'botnet deployment',
      matchedSnippet: '"...synchronize the DNS reflection bots before 04:00 hours. We trigger the botnet deployment once the banking clearinghouse starts settlement..."',
      summary: 'Whisper AI neural transcription detected explicit command-and-control synchronization chatter. Voice biometrics matches high-profile actor "Volkov-Syndicate". Acoustic analysis reveals server room background noise (fan frequency ~120 Hz).',
      confidence: '98.9%',
      extractedEntities: ['Target: Banking Settlement System', 'Trigger Time: 04:00 UTC', 'Attack Vector: DNS Reflection DDoS', 'Language: Hinglish / Russian Mix'],
      fileMetadata: {
        filename: 'voip_sigint_session_88192.wav',
        duration: '02:44 min',
        sampleRate: '48 kHz / 24-bit PCM',
        sha256: 'bb88cceeff00112233445566778899aabbccddeeff00112233445566778899aa',
        size: '15.8 MB'
      },
      audioSpecs: {
        speaker: 'Actor Identified: RU-THREAT-VOLKOV',
        peakFrequency: '3.4 kHz (Vocal formant)',
        ambientNoise: 'Rack cooling exhaust (~62 dB)'
      }
    },
    {
      id: 'aud-02',
      category: 'audio',
      title: 'Ransomware Extortion Call Intercept - Hospital Critical Care',
      source: 'Cellular Intercept Cell Tower #812',
      timestamp: '1 hour ago (2026-10-15 03:00 UTC)',
      severity: 'CRITICAL',
      matchedKeyword: 'decryptor key auction',
      matchedSnippet: '"...if the 35 BTC deposit is not confirmed on blockchain within 60 minutes, the decryptor key auction will be published on our leak site..."',
      summary: 'Automated keyword trigger on "decryptor key auction". Voice synthesis detection shows natural human voice with VoIP compression artifacts. Extortion group "BlackCat / ALPHV" affiliate signature.',
      confidence: '97.5%',
      extractedEntities: ['Ransom Demand: 35 BTC', 'Target: Regional Hospital Trust', 'Wallet: bc1q8x9...492', 'Deadline: 60 Minutes'],
      fileMetadata: {
        filename: 'extortion_wiretap_rec_09.mp3',
        duration: '01:18 min',
        sampleRate: '44.1 kHz / 16-bit',
        sha256: '778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566',
        size: '4.2 MB'
      },
      audioSpecs: {
        speaker: 'Unknown Extortion Negotiator',
        peakFrequency: '2.8 kHz',
        ambientNoise: 'Cellular jitter / latency ~180ms'
      }
    },

    // --- VIDEO FEEDS ---
    {
      id: 'vid-01',
      category: 'video',
      title: 'Synthetic Deepfake State Official Banking Moratorium Broadcast',
      source: 'Viral Video Feed // X (Twitter) & WhatsApp Broadcast',
      timestamp: '22 mins ago (2026-10-15 03:39 UTC)',
      severity: 'CRITICAL',
      matchedKeyword: 'emergency currency recall',
      matchedSnippet: 'Manipulated video stream of Finance Ministry spokesperson claiming sudden nationwide digital transaction shutdown and currency freeze.',
      summary: 'Deep learning spatial-temporal artifact detector flagged 96.4% deepfake probability. Eye-blinking frequency anomaly (0 blinks in 28 seconds) and unnatural phoneme-to-viseme lip synchronization artifacts.',
      confidence: '96.4% Deepfake Score',
      extractedEntities: ['Target: National Banking Confidence', 'Subject: Finance Ministry Spox', 'Artifacts: Lip Sync & Eye Jitter', 'Origin: Synthetic GAN v3'],
      fileMetadata: {
        filename: 'deepfake_spox_panic_broadcast.mp4',
        resolution: '1080p @ 30 FPS',
        duration: '00:45 sec',
        sha256: 'eeff00112233445566778899aabbccddeeff00112233445566778899aabbccdd',
        size: '28.1 MB'
      },
      videoSpecs: {
        codec: 'H.264 / AAC',
        ganModel: 'FaceForensics++ Neural Match',
        syntheticAnomaly: 'Pupil reflection asymmetry detected'
      }
    },
    {
      id: 'vid-02',
      category: 'video',
      title: 'Physical Perimeter CCTV Feed Looping & Frame Interpolation Attack',
      source: 'Government Data Vault Sector-4 Surveillance Feed',
      timestamp: '35 mins ago (2026-10-15 03:26 UTC)',
      severity: 'HIGH',
      matchedKeyword: 'physical perimeter breach',
      matchedSnippet: 'Looping 12-second RTSP video segment concealing unauthorized physical badge bypass at server room access corridor.',
      summary: 'Motion vector variance detector uncovered repetitive pixel flow vectors matching a 12-second loop. The live video timestamp was re-rendered in realtime while the background security camera was hijacked.',
      confidence: '98.1%',
      extractedEntities: ['Camera: CAM-SRV-VAULT-04', 'Attack Type: Video Loop Injection', 'Bypass Door: Sector 4 North Gate', 'Loop Interval: 12.4s'],
      fileMetadata: {
        filename: 'rtsp_loop_stream_vault_04.mkv',
        resolution: '4K @ 25 FPS',
        duration: '03:12 min',
        sha256: '445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233',
        size: '142 MB'
      },
      videoSpecs: {
        codec: 'H.265 / HEVC',
        ganModel: 'Frame Difference Threshold > 94%',
        syntheticAnomaly: 'Frozen shadow trajectory detected'
      }
    },

    // --- TEXT LOG ---
    {
      id: 'txt-01',
      category: 'text',
      title: 'Underground Zero-Day Brokerage Auction Log (CVE-2026-8812)',
      source: 'IRC Channel #0day-market & Jabber OTR',
      timestamp: '5 mins ago (2026-10-15 03:56 UTC)',
      severity: 'CRITICAL',
      matchedKeyword: 'CVE-2026-8812 RCE exploit',
      matchedSnippet: '[03:55:12] <c0de_runner> selling zero-day pre-auth RCE in telecom edge router firmware. Works on all 2025/2026 deployed gateways. 180k USD in Monero.',
      summary: 'Natural Language Processing classifier flagged commercial exploit negotiation for unpatched core telecom equipment. Payload analysis references shellcode injection vector bypassing ASLR and stack canaries.',
      confidence: '99.1%',
      extractedEntities: ['Vulnerability: Pre-Auth RCE in Edge Gateways', 'Price: $180,000 XMR', 'Seller: c0de_runner', 'Escrow: Jabber otr-escrow@crypt.im'],
      fileMetadata: {
        filename: 'irc_jabber_intercept_cve8812.log',
        lines: '412 lines captured',
        sha256: '112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00',
        size: '48.2 KB'
      },
      terminalDump: [
        '[03:54:01] *** Joined channel #0day-market',
        '[03:54:15] <c0de_runner> CVE-2026-8812 RCE exploit ready for deployment.',
        '[03:54:40] <broker_99> Does it survive firmware reflash or memory only?',
        '[03:55:12] <c0de_runner> NVRAM persistence hook included. Overwrites partition 4.',
        '[03:55:48] <broker_99> Moving 180k XMR to multisig escrow. Send PoC.'
      ]
    },
    {
      id: 'txt-02',
      category: 'text',
      title: 'Exfiltrated Enterprise Personnel LDAP & SHA-256 Hashes',
      source: 'Pastebin Clone // GhostBin Onion Drop',
      timestamp: '50 mins ago (2026-10-15 03:11 UTC)',
      severity: 'HIGH',
      matchedKeyword: 'password_hash SHA-256',
      matchedSnippet: 'admin:d8578edf8458ce06fbc5bb76a58c5ca4:uid=1001,ou=SecurityOps,dc=gov,dc=in',
      summary: 'Data leak scanner detected 1,420 privileged government admin credentials leaked in plaintext and unsalted SHA-256 hashes. Automated credential stuffing attacks against VPN gateways likely imminent.',
      confidence: '98.5%',
      extractedEntities: ['Accounts Leaked: 1,420', 'Privilege: Domain Admins', 'Hash Format: SHA-256 (Unsalted)', 'Domain: gov.in Subnetwork'],
      fileMetadata: {
        filename: 'ldap_dump_breach_oct2026.txt',
        lines: '1,420 records',
        sha256: '5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344',
        size: '184 KB'
      },
      terminalDump: [
        '# LDAP DIRECTORY DUMP - CLASSIFIED - RESTRICTED',
        'dn: uid=secops_lead,ou=Admins,dc=gov,dc=in',
        'userPassword: {SHA256}e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'telephoneNumber: +91-98112-XXXXX',
        'status: ACTIVE_AUTHENTICATED'
      ]
    },

    // --- EXTRACTED URLS ---
    {
      id: 'url-01',
      category: 'urls',
      title: 'Fast-Flux Dynamic C2 Beacon Gateway & Staging Dropper',
      source: 'DNS Telemetry & Sinkhole Sensor 02',
      timestamp: '3 mins ago (2026-10-15 03:58 UTC)',
      severity: 'CRITICAL',
      matchedKeyword: 'beacon.apt41-telemetry.net',
      matchedSnippet: 'https://beacon.apt41-telemetry.net/api/v4/worker/sync?hwid=482910&session=enc',
      summary: 'Dynamic Fast-Flux domain rotating across 48 Bulletproof VPS IP addresses every 120 seconds. Delivers encrypted polymorphic shellcode to compromised endpoints upon successful user-agent handshake.',
      confidence: '99.8%',
      extractedEntities: ['Host: beacon.apt41-telemetry.net', 'Nameserver: ns1.bulletproof-russia.su', 'TTL: 60 seconds', 'Protocol: Encrypted TLS 1.3'],
      fileMetadata: {
        filename: 'dns_fastflux_trace_01.json',
        ips: '48 Bulletproof IPs',
        sha256: '99aabbccddeeff00112233445566778899aabbccddeeff001122334455667788',
        size: '14.5 KB'
      },
      terminalDump: [
        'GET /api/v4/worker/sync?hwid=482910 HTTP/2.0',
        'Host: beacon.apt41-telemetry.net',
        'X-Encrypted-Session: AES-GCM-256 (IV: 8f9a2b)',
        'HTTP/2.0 200 OK -> Payload: 84,204 bytes (Encrypted Beacon Stage 2)',
        'DNS Rotation: 185.220.101.4 -> 94.142.138.12 -> 45.154.255.88'
      ]
    },
    {
      id: 'url-02',
      category: 'urls',
      title: 'Deceptive National Citizen Identity Renewal Phishing Portal',
      source: 'Anti-Phishing Crawler & Certificate Transparency Logs',
      timestamp: '18 mins ago (2026-10-15 03:43 UTC)',
      severity: 'HIGH',
      matchedKeyword: 'aadhaar-kyc-gov-update.top',
      matchedSnippet: 'https://aadhaar-kyc-gov-update.top/auth/verify?step=biometric_bypass',
      summary: 'Lookalike spoofing portal designed to mimic national identity card online revalidation. Harvesting OTP, Aadhaar numbers, and banking details. Free Let’s Encrypt wildcard certificate deployed 2 hours ago.',
      confidence: '99.0%',
      extractedEntities: ['Domain: aadhaar-kyc-gov-update.top', 'Registrar: NameCheap Inc.', 'Hosting: Offshore Cloud Host', 'SSL: Issued 2026-10-15'],
      fileMetadata: {
        filename: 'phish_clone_site_headers.json',
        ips: '194.26.29.112',
        sha256: '2233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011',
        size: '8.9 KB'
      },
      terminalDump: [
        'CONNECT aadhaar-kyc-gov-update.top:443',
        'Certificate: CN=*.aadhaar-kyc-gov-update.top (Let’s Encrypt Authority)',
        'POST /auth/verify -> Captures: aadhaar_num, otp_code, bank_card_pin',
        'Exfiltration Destination: Telegram Bot API (Token: bot749204...)'
      ]
    }
  ], []);

  // Filter based on active media tab and search query
  const filteredAssets = useMemo(() => {
    return forensicAssets.filter((item) => {
      const matchesCategory = item.category === activeTab;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.matchedKeyword.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    });
  }, [forensicAssets, activeTab, searchQuery]);

  // Tab definitions matching Step 3
  const mediaTabs = [
    { id: 'text', label: 'Text Log', icon: FileText, count: forensicAssets.filter((a) => a.category === 'text').length },
    { id: 'visuals', label: 'Visuals (Images)', icon: ImageIcon, count: forensicAssets.filter((a) => a.category === 'visuals').length },
    { id: 'video', label: 'Video Feeds', icon: Video, count: forensicAssets.filter((a) => a.category === 'video').length },
    { id: 'audio', label: 'Audio Intercepts', icon: Mic, count: forensicAssets.filter((a) => a.category === 'audio').length },
    { id: 'urls', label: 'Extracted URLs', icon: Link2, count: forensicAssets.filter((a) => a.category === 'urls').length }
  ];

  return (
    <div className="w-full flex flex-col -m-5 sm:-m-6 min-h-full">
      {/* Toast / Status banner */}
      {statusMessage && (
        <div className="fixed top-5 right-6 z-50 bg-[#0B2115] border-2 border-[#9FE846] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-lg bg-[#9FE846] text-[#0B2115] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#9FE846] tracking-wide uppercase">
              {statusMessage.title}
            </div>
            <div className="text-xs text-gray-200 mt-0.5">
              {statusMessage.msg}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: HEADER AREA
          Flat white header bar at the top (bg-white border-b border-[#E5E7EB] p-6)
          Title: Deep Media Interrogation (text-[#0B2115] text-2xl font-bold)
          Subtitle: AI-driven multimodal forensic extraction across text, images, video, and audio.
         ========================================================================= */}
      <header className="bg-white border-b border-[#E5E7EB] p-6 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0B2115] tracking-tight">
                Deep Media Interrogation
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F3FAEB] text-[#0B2115] border border-[#9FE846]">
                <span className="w-2 h-2 rounded-full bg-[#9FE846] animate-pulse"></span>
                MULTIMODAL V4.2 ACTIVE
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              AI-driven multimodal forensic extraction across text, images, video, and audio.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 self-start md:self-auto text-xs">
            <div className="bg-[#F3F5F6] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#0B2115]">
              <span className="text-gray-500 block text-[10px] uppercase font-mono">Scanned Corpus</span>
              <span className="font-bold font-mono">{scanStats.totalScanned} assets</span>
            </div>
            <div className="bg-[#F3F5F6] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#0B2115]">
              <span className="text-gray-500 block text-[10px] uppercase font-mono">Matched Intercepts</span>
              <span className="font-bold font-mono text-[#0B2115]">{scanStats.matchedAssets} verified</span>
            </div>
            <div className="bg-[#F3F5F6] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#0B2115]">
              <span className="text-gray-500 block text-[10px] uppercase font-mono">Quarantined</span>
              <span className="font-bold font-mono text-emerald-800">
                {Object.values(quarantinedMap).filter(Boolean).length} isolated
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CANVAS
          Background: bg-[#F3F5F6] p-6 h-full overflow-y-auto
         ========================================================================= */}
      <main className="bg-[#F3F5F6] p-6 flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* =========================================================================
              STEP 3: BUILD THE INPUT & MEDIA TABS COMPONENT
              Flat white container (bg-white border border-[#E5E7EB] rounded-xl p-4 flex gap-4 mb-6)
             ========================================================================= */}
          <section aria-label="Search and Interrogation Controls">
            {/* Step 1 & Step 4: Unified Threat Ingestion Dropzone & Cyber Crime Report Render */}
            <MultimodalSweepAnalyzer
              className="mb-6"
              onAssetInterrogated={(report) => {
                triggerNotification(
                  `Cyber Crime Report Generated: ${report.risk_category}`,
                  `Threat Score: ${report.threat_score}/100. ${report.extracted_iocs?.length || 0} IOCs extracted.`
                );
              }}
            />

            {/* Live Media Feed Filtering & Keyword Query Bar */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 flex flex-col sm:flex-row gap-3 mb-4 shadow-sm">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter interrogated stream by keyword, IOC, or target entity (e.g. 'Aadhaar', 'botnet', 'C2', 'scada')..."
                  className="w-full bg-[#F3F5F6] border-none rounded-lg pl-10 pr-10 py-2 text-[#0B2115] placeholder-gray-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#9FE846] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-gray-400 hover:text-[#0B2115] p-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action Button: [ ⚡ Run Multimodal Sweep ] */}
              <button
                onClick={handleRunSweep}
                disabled={isScanning}
                className="bg-[#0B2115] hover:bg-[#081a10] text-[#9FE846] font-semibold px-5 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0 disabled:opacity-70"
              >
                <Zap className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Sweeping Streams...' : 'Run Multimodal Sweep'}</span>
              </button>
            </div>

            {/* Media Tabs Row: [ Text Log ], [ Visuals (Images) ], [ Video Feeds ], [ Audio Intercepts ], [ Extracted URLs ] */}
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] overflow-x-auto pb-0">
              {mediaTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#9FE846] text-[#0B2115] font-bold border-b-4 border-[#0B2115] shadow-sm'
                        : 'bg-white text-gray-500 hover:text-[#0B2115] border-b-4 border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono transition-colors ${
                        isActive
                          ? 'bg-[#0B2115] text-[#9FE846]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* =========================================================================
              STEP 4: SPLIT-VIEW FORENSIC RESULT CARDS
              Render a grid of flat white result cards:
              bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col md:flex-row
             ========================================================================= */}
          <section aria-label="Forensic Result Cards" className="space-y-5">
            {filteredAssets.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#F3FAEB] text-[#0B2115] mx-auto flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-[#0B2115]" />
                </div>
                <h3 className="text-base font-bold text-[#0B2115]">
                  No matching media assets found
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                  No intercepts in <strong className="text-[#0B2115]">{mediaTabs.find((t) => t.id === activeTab)?.label}</strong> matched your query "{searchQuery}".
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 bg-[#0B2115] text-[#9FE846] text-xs font-semibold rounded-lg hover:bg-[#081a10] transition-colors"
                >
                  Clear Interrogation Filter
                </button>
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const isQuarantined = !!quarantinedMap[asset.id];

                return (
                  <article
                    key={asset.id}
                    className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:border-[#9FE846]/80 transition-all duration-200"
                  >
                    {/* -----------------------------------------------------------
                        LEFT COLUMN (Raw Media - 40% width)
                       ----------------------------------------------------------- */}
                    <div className="w-full md:w-[40%] bg-[#FAFBFC] p-4 border-b md:border-b-0 md:border-r border-[#E5E7EB] flex flex-col justify-between select-none">
                      
                      {/* Media Header & Category Tag */}
                      <div className="flex items-center justify-between text-xs mb-3 font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-[#0B2115]">
                          <span className="w-2 h-2 rounded-full bg-[#9FE846]"></span>
                          {asset.category.toUpperCase()} FORENSIC FEED
                        </span>
                        <span className="text-gray-400 text-[11px] font-mono">
                          {asset.fileMetadata.filename}
                        </span>
                      </div>

                      {/* Dynamic Media Container based on Active Tab */}
                      <div className="flex-1 flex flex-col justify-center items-center py-2">
                        {/* 1. VISUALS (IMAGES) */}
                        {asset.category === 'visuals' && (
                          <div className="w-full relative rounded-lg overflow-hidden border border-[#E5E7EB] bg-gray-900 group">
                            {/* Realistic Simulated Forensic Image Card */}
                            <div className="w-full h-52 bg-gradient-to-br from-slate-900 via-gray-900 to-[#0B2115] p-4 flex flex-col justify-between text-white relative">
                              {/* Background Grid Pattern */}
                              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#9FE846_1px,transparent_1px)] [background-size:16px_16px]"></div>
                              
                              {/* Top Document Metadata */}
                              <div className="relative z-10 flex items-center justify-between border-b border-gray-700/60 pb-2">
                                <span className="text-[10px] tracking-widest text-[#9FE846] font-mono uppercase font-bold">
                                  FORENSIC OCR CAMERA 01
                                </span>
                                <span className="text-[10px] font-mono bg-red-950/80 text-red-400 border border-red-700 px-1.5 py-0.5 rounded">
                                  LEAKED CLASSIFIED
                                </span>
                              </div>

                              {/* Center OCR Bounding Box Overlay */}
                              <div className="relative z-10 border-2 border-dashed border-[#9FE846] bg-[#9FE846]/10 p-3 rounded-md backdrop-blur-xs">
                                <div className="text-[10px] font-mono font-bold text-[#9FE846] uppercase flex items-center justify-between mb-1">
                                  <span>{asset.imageOverlay?.boundingLabel}</span>
                                  <span className="bg-[#9FE846] text-[#0B2115] text-[9px] px-1 rounded font-black">
                                    OCR 99.4%
                                  </span>
                                </div>
                                <div className="font-mono text-xs font-bold text-white tracking-wider">
                                  {asset.imageOverlay?.boxText}
                                </div>
                                <div className="text-[9px] text-gray-300 font-mono mt-1">
                                  CHANNEL: {asset.imageOverlay?.leakChannel}
                                </div>
                              </div>

                              {/* Bottom Details */}
                              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-gray-400 pt-2 border-t border-gray-800">
                                <span>{asset.fileMetadata.resolution}</span>
                                <span className="text-[#9FE846] font-semibold">{asset.fileMetadata.size}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. VIDEO FEEDS */}
                        {asset.category === 'video' && (
                          <div className="w-full relative rounded-lg overflow-hidden border border-[#E5E7EB] bg-black text-white">
                            <div className="w-full h-52 bg-slate-950 p-4 flex flex-col justify-between relative overflow-hidden">
                              {/* Scanline Effect */}
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#9FE846]/5 to-transparent pointer-events-none animate-pulse"></div>

                              {/* Camera Feed Watermark */}
                              <div className="flex items-center justify-between text-[11px] font-mono z-10">
                                <span className="flex items-center gap-1.5 text-red-500 font-bold">
                                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                  LIVE INTERCEPT
                                </span>
                                <span className="text-gray-400">2026-10-15 03:39:12 UTC</span>
                              </div>

                              {/* Center Deepfake Face Mesh Target */}
                              <div className="z-10 border-2 border-[#9FE846] bg-black/60 p-3 rounded-lg flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#0B2115] border border-[#9FE846] flex items-center justify-center shrink-0">
                                  <Eye className="w-5 h-5 text-[#9FE846]" />
                                </div>
                                <div>
                                  <div className="text-[11px] font-mono font-bold text-[#9FE846] uppercase">
                                    {asset.videoSpecs?.ganModel}
                                  </div>
                                  <div className="text-xs font-semibold text-white">
                                    {asset.videoSpecs?.syntheticAnomaly}
                                  </div>
                                </div>
                              </div>

                              {/* Video Playback Bar */}
                              <div className="z-10 flex items-center justify-between text-xs font-mono pt-2 border-t border-gray-800">
                                <button
                                  onClick={() => setPlayingVideoId(playingVideoId === asset.id ? null : asset.id)}
                                  className="flex items-center gap-1.5 text-[#9FE846] hover:text-white transition-colors cursor-pointer"
                                >
                                  {playingVideoId === asset.id ? (
                                    <>
                                      <Pause className="w-3.5 h-3.5 fill-current" />
                                      <span>PAUSE STREAM</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                      <span>PLAY ANALYSIS</span>
                                    </>
                                  )}
                                </button>
                                <span className="text-gray-400">{asset.fileMetadata.duration}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. AUDIO INTERCEPTS */}
                        {asset.category === 'audio' && (
                          <div className="w-full relative rounded-lg border border-[#E5E7EB] bg-[#0B2115] text-white p-4 flex flex-col justify-between h-52">
                            {/* Audio Intercept Specs */}
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#9FE846]">
                              <span className="flex items-center gap-1.5 font-bold">
                                <Mic className="w-3.5 h-3.5" />
                                {asset.audioSpecs?.speaker}
                              </span>
                              <span className="text-gray-400">{asset.fileMetadata.duration}</span>
                            </div>

                            {/* Simulated Animated Waveform Visualizer */}
                            <div className="my-2 bg-[#081a10] border border-[#153423] p-3 rounded-lg flex items-center justify-between gap-1 h-20">
                              {[35, 60, 45, 80, 95, 40, 70, 85, 30, 90, 65, 40, 75, 90, 50, 70, 85, 60, 45, 90, 100, 35, 60, 80].map((height, i) => (
                                <div
                                  key={i}
                                  style={{ height: `${height}%` }}
                                  className={`flex-1 rounded-full transition-all duration-300 ${
                                    playingAudioId === asset.id
                                      ? 'bg-[#9FE846] animate-pulse'
                                      : 'bg-[#9FE846]/60'
                                  }`}
                                ></div>
                              ))}
                            </div>

                            {/* Audio Controls */}
                            <div className="flex items-center justify-between text-xs font-mono pt-1">
                              <button
                                onClick={() => setPlayingAudioId(playingAudioId === asset.id ? null : asset.id)}
                                className="flex items-center gap-2 bg-[#9FE846] text-[#0B2115] font-bold px-3 py-1.5 rounded-lg hover:bg-[#8fd83b] transition-all cursor-pointer"
                              >
                                {playingAudioId === asset.id ? (
                                  <>
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                    <span>STOP INTERCEPT</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>LISTEN WIRE</span>
                                  </>
                                )}
                              </button>
                              <span className="text-[11px] text-gray-400 font-mono">
                                Peak: {asset.audioSpecs?.peakFrequency}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 4. TEXT LOG & 5. EXTRACTED URLS */}
                        {(asset.category === 'text' || asset.category === 'urls') && (
                          <div className="w-full bg-[#0B2115] text-lime-400 font-mono text-xs p-4 rounded-lg overflow-x-auto h-52 flex flex-col justify-between border border-[#153423]">
                            <div>
                              <div className="text-[10px] text-[#9FE846]/70 uppercase tracking-wider mb-2 border-b border-[#153423] pb-1 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                  <Terminal className="w-3 h-3 text-[#9FE846]" />
                                  RAW FORENSIC INTERCEPT STREAM
                                </span>
                                <span>{asset.fileMetadata.size || asset.fileMetadata.lines}</span>
                              </div>
                              <div className="space-y-1 text-[11px] text-lime-300 font-mono">
                                {asset.terminalDump?.slice(0, 4).map((line, idx) => (
                                  <div key={idx} className="truncate hover:text-white transition-colors">
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono pt-2 border-t border-[#153423] flex items-center justify-between">
                              <span>SHA: {asset.fileMetadata.sha256.substring(0, 16)}...</span>
                              <span className="text-[#9FE846] font-bold">READY</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Left Column Footer Info */}
                      <div className="text-[11px] font-mono text-gray-500 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                        <span className="truncate">Source: {asset.source}</span>
                        <span className="shrink-0 font-semibold text-[#0B2115]">{asset.confidence} match</span>
                      </div>
                    </div>

                    {/* -----------------------------------------------------------
                        RIGHT COLUMN (AI Context - 60% width)
                       ----------------------------------------------------------- */}
                    <div className="w-full md:w-[60%] p-6 flex flex-col justify-between bg-white">
                      <div>
                        {/* Top Metadata Row: Severity, Category, and Timestamp */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wide ${
                                asset.severity === 'CRITICAL'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {asset.severity} THREAT
                            </span>
                            <span className="text-xs font-mono text-gray-500">
                              {asset.timestamp}
                            </span>
                          </div>

                          {/* Quarantine Badge if active */}
                          {isQuarantined && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0B2115] text-[#9FE846]">
                              <Lock className="w-3 h-3" />
                              QUARANTINED [GATEWAY BLOCKED]
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold text-[#0B2115] tracking-tight">
                          {asset.title}
                        </h2>

                        {/* Matched Keyword Highlight: in text-[#0B2115] font-bold */}
                        <div className="mt-2 text-sm text-gray-700">
                          <span className="text-xs font-mono uppercase text-gray-500 tracking-wider mr-2 font-semibold">
                            Matched Keyword:
                          </span>
                          <span className="text-[#0B2115] font-bold bg-[#9FE846]/40 px-2 py-0.5 rounded border border-[#9FE846]">
                            "{asset.matchedKeyword}"
                          </span>
                        </div>

                        {/* Raw Intercept Snippet */}
                        <p className="mt-2 text-xs font-mono text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 italic">
                          "{asset.matchedSnippet}"
                        </p>

                        {/* Light Lime Forensic Summary Box:
                            bg-[#F3FAEB] border border-[#9FE846] text-[#0B2115] p-3 rounded-lg text-sm */}
                        <div className="mt-4 bg-[#F3FAEB] border border-[#9FE846] text-[#0B2115] p-3 rounded-lg text-sm">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[#0B2115] flex items-center gap-1.5 mb-1">
                            <Cpu className="w-3.5 h-3.5 text-[#0B2115]" />
                            AI Forensic Evaluation & Context
                          </div>
                          <p className="text-xs text-[#0B2115] leading-relaxed">
                            {asset.summary}
                          </p>
                        </div>

                        {/* Extracted Entity Tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {asset.extractedEntities.map((entity, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-mono bg-gray-100 text-[#0B2115] px-2 py-0.5 rounded border border-gray-200"
                            >
                              {entity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* -----------------------------------------------------------
                          FOOTER ACTIONS: Anchored to Bottom Right
                          [ View Source ] (outline) and [ Quarantine Asset ] (bg-[#0B2115] text-white)
                         ----------------------------------------------------------- */}
                      <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
                        <div className="text-[11px] font-mono text-gray-400 truncate max-w-[200px]">
                          SHA-256: {asset.fileMetadata.sha256.substring(0, 14)}...
                        </div>

                        <div className="flex items-center gap-2.5">
                          {/* [ View Source ] (outline) */}
                          <button
                            onClick={() => setSelectedAssetForModal(asset)}
                            className="border border-[#E5E7EB] hover:border-[#0B2115] text-[#0B2115] hover:bg-gray-50 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Source</span>
                          </button>

                          {/* [ Quarantine Asset ] (bg-[#0B2115] text-white) */}
                          <button
                            onClick={() => handleToggleQuarantine(asset.id, asset.title)}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                              isQuarantined
                                ? 'bg-[#9FE846] text-[#0B2115] hover:bg-[#8ddb37]'
                                : 'bg-[#0B2115] hover:bg-[#081a10] text-white'
                            }`}
                          >
                            {isQuarantined ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Quarantined ✓</span>
                              </>
                            ) : (
                              <>
                                <ShieldAlert className="w-3.5 h-3.5 text-[#9FE846]" />
                                <span>Quarantine Asset</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>

      {/* =========================================================================
          FORENSIC EVIDENCE SOURCE MODAL
         ========================================================================= */}
      {selectedAssetForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#0B2115] text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-[#9FE846] uppercase font-bold tracking-wider">
                  Raw Intercept Dossier // Chain of Custody
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedAssetForModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssetForModal(null)}
                className="w-8 h-8 rounded-lg bg-[#153423] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-sm text-[#0B2115]">
              <div className="bg-[#F3FAEB] border border-[#9FE846] p-4 rounded-xl">
                <span className="text-xs font-bold text-[#0B2115] uppercase tracking-wider block mb-1">
                  Matched Keyword Highlight
                </span>
                <span className="text-base font-bold text-[#0B2115]">
                  "{selectedAssetForModal.matchedKeyword}"
                </span>
                <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                  {selectedAssetForModal.summary}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-[#F3F5F6] p-3 rounded-lg border border-[#E5E7EB]">
                  <span className="text-gray-500 block uppercase">Source Node</span>
                  <span className="font-bold text-[#0B2115]">{selectedAssetForModal.source}</span>
                </div>
                <div className="bg-[#F3F5F6] p-3 rounded-lg border border-[#E5E7EB]">
                  <span className="text-gray-500 block uppercase">Severity Classification</span>
                  <span className="font-bold text-red-600">{selectedAssetForModal.severity}</span>
                </div>
                <div className="bg-[#F3F5F6] p-3 rounded-lg border border-[#E5E7EB]">
                  <span className="text-gray-500 block uppercase">Timestamp Intercepted</span>
                  <span className="font-bold text-[#0B2115]">{selectedAssetForModal.timestamp}</span>
                </div>
                <div className="bg-[#F3F5F6] p-3 rounded-lg border border-[#E5E7EB]">
                  <span className="text-gray-500 block uppercase">AI Model Confidence</span>
                  <span className="font-bold text-[#0B2115]">{selectedAssetForModal.confidence}</span>
                </div>
              </div>

              {/* Raw SHA-256 Checksum */}
              <div className="bg-[#0B2115] text-lime-400 font-mono text-xs p-4 rounded-xl border border-[#153423] space-y-1">
                <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                  CRYPTOGRAPHIC CHECKSUM (SHA-256)
                </div>
                <div className="break-all font-bold text-lime-300">
                  {selectedAssetForModal.fileMetadata.sha256}
                </div>
              </div>

              {/* Raw Payload Dump */}
              {selectedAssetForModal.terminalDump && (
                <div>
                  <span className="text-xs font-bold text-[#0B2115] uppercase tracking-wider block mb-2 font-mono">
                    Extracted Packet Payload Stream
                  </span>
                  <div className="bg-[#0B2115] text-lime-400 font-mono text-xs p-4 rounded-xl max-h-40 overflow-y-auto border border-[#153423] space-y-1">
                    {selectedAssetForModal.terminalDump.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedAssetForModal(null)}
                className="px-4 py-2 border border-[#E5E7EB] text-[#0B2115] text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
              <button
                onClick={() => {
                  handleToggleQuarantine(selectedAssetForModal.id, selectedAssetForModal.title);
                  setSelectedAssetForModal(null);
                }}
                className="px-4 py-2 bg-[#0B2115] text-[#9FE846] text-xs font-semibold rounded-lg hover:bg-[#081a10] transition-colors cursor-pointer"
              >
                {quarantinedMap[selectedAssetForModal.id] ? 'Release Asset' : 'Execute Quarantine'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
