/**
 * ==============================================================================
 * GEOGRAPHIC COORDINATE MAPPER UTILITY
 * Problem Statement SKIT004 - Real-Time Geographic Threat Mapping
 * ==============================================================================
 * 
 * Maps city names and regional entities returned by Gemini AI Named Entity
 * Recognition (NER) to latitude/longitude coordinates.
 * 
 * Uses a predefined dictionary of major nodal points to avoid rate limits
 * from external geocoding APIs during live operation and hackathon demos.
 * ==============================================================================
 */

export const MAJOR_NODAL_POINTS = {
  // Required regional nodes
  Delhi: [28.7041, 77.1025],
  Mumbai: [19.0760, 72.8777],
  Jaipur: [26.9124, 75.7873],
  Bangalore: [12.9716, 77.5946],

  // Common aliases and national defense corridors
  'New Delhi': [28.6139, 77.2090],
  NCR: [28.7041, 77.1025],
  Bengaluru: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Pune: [18.5204, 73.8567],
  Ahmedabad: [23.0225, 72.5714],
  Noida: [28.5355, 77.3910],
  Gurgaon: [28.4595, 77.0266],
  Gurugram: [28.4595, 77.0266],
  Chandigarh: [30.7333, 76.7794],
  Lucknow: [26.8467, 80.9462],
  Indore: [22.7196, 75.8577],
  Bhopal: [23.2599, 77.4126],
  Nagpur: [21.1458, 79.0882],
  Patna: [25.6127, 85.1432],
  Kochi: [9.9312, 76.2673],
  Thiruvananthapuram: [8.5241, 76.9366],
  Srinagar: [34.0837, 74.7973],
  Kashmir: [34.0837, 74.7973],
  Amritsar: [31.6340, 74.8723],
  Punjab: [30.9010, 75.8573],
  Surat: [21.1702, 72.8311],
  Visakhapatnam: [17.6868, 83.2185],
  Guwahati: [26.1445, 91.7362],
  Goa: [15.2993, 74.1240],
  Kerala: [10.8505, 76.2711],
  Maharashtra: [19.7515, 75.7139],
  Rajasthan: [27.0238, 74.2179],
  Karnataka: [15.3173, 75.7139],

  // International threat hotspots
  Singapore: [1.3521, 103.8198],
  Dubai: [25.2048, 55.2708],
  London: [51.5074, -0.1278],
  'New York': [40.7128, -74.0060],
  Washington: [38.9072, -77.0369],
  Moscow: [55.7558, 37.6173],
  Kyiv: [50.4501, 30.5234],
  Tokyo: [35.6762, 139.6503],
  Frankfurt: [50.1109, 8.6821]
};

/**
 * Resolves a location string to latitude/longitude coordinates.
 * Handles case insensitivity, trimming, and common suffixes.
 * 
 * @param {string} rawLocation - City or region name
 * @returns {[number, number]|null} [latitude, longitude] or null if unresolved
 */
export function getCoordinatesForLocation(rawLocation) {
  if (!rawLocation || typeof rawLocation !== 'string') return null;

  const cleaned = rawLocation.trim();

  // 1. Direct dictionary match
  if (MAJOR_NODAL_POINTS[cleaned]) {
    return MAJOR_NODAL_POINTS[cleaned];
  }

  // 2. Case-insensitive dictionary match
  const lowerCleaned = cleaned.toLowerCase();
  for (const [key, coords] of Object.entries(MAJOR_NODAL_POINTS)) {
    if (key.toLowerCase() === lowerCleaned) {
      return coords;
    }
  }

  // 3. Substring / token matching (e.g., "Delhi NCR", "Greater Mumbai", "Bangalore Urban")
  for (const [key, coords] of Object.entries(MAJOR_NODAL_POINTS)) {
    const keyLower = key.toLowerCase();
    if (lowerCleaned.includes(keyLower) || keyLower.includes(lowerCleaned)) {
      return coords;
    }
  }

  return null;
}

/**
 * Aggregates an array of threat posts by geographic nodal location.
 * Counts active threat reports, calculates maximum severity, and bundles matching incidents.
 * 
 * @param {Array<Object>} threats - Ingested multi-platform threat objects
 * @returns {Array<Object>} Geolocated threat clusters ready for Leaflet rendering
 */
export function aggregateThreatsByLocation(threats = []) {
  if (!Array.isArray(threats) || threats.length === 0) {
    return getDefaultGeographicClusters();
  }

  const clustersMap = new Map();

  threats.forEach((threat) => {
    // Direct coordinate support
    if (Array.isArray(threat.coordinates) && threat.coordinates.length === 2) {
      const locName = threat.locationName || threat.location || threat.city || threat.title || 'Regional Threat Node';
      if (!clustersMap.has(locName)) {
        clustersMap.set(locName, {
          locationName: locName,
          coordinates: threat.coordinates,
          reportCount: 0,
          threats: [],
          maxSeverity: 'Low',
          lastReportTime: threat.timestamp || 'Recent'
        });
      }
      const cluster = clustersMap.get(locName);
      cluster.reportCount += 1;
      cluster.threats.push({
        id: threat.id,
        title: threat.title,
        platform: threat.platform || threat.source || 'OSINT',
        riskLevel: threat.riskLevel || 'Medium',
        timestamp: threat.timestamp || 'Just now',
        summary: threat.aiExplanation || threat.content
      });
      return;
    }

    // Collect mentioned locations from threat object or extract on the fly
    let locations = [];
    if (threat.location) locations.push(threat.location);
    if (threat.city) locations.push(threat.city);
    if (Array.isArray(threat.mentioned_locations) && threat.mentioned_locations.length > 0) {
      locations.push(...threat.mentioned_locations);
    } else if (Array.isArray(threat.mentionedLocations) && threat.mentionedLocations.length > 0) {
      locations.push(...threat.mentionedLocations);
    } else {
      // Heuristic fallback search on title and content
      const text = `${threat.title || ''} ${threat.content || ''}`.toLowerCase();
      for (const key of Object.keys(MAJOR_NODAL_POINTS)) {
        if (text.includes(key.toLowerCase())) {
          locations.push(key);
        }
      }
    }

    // Dedup locations for this threat
    const uniqueLocs = [...new Set(locations)];

    uniqueLocs.forEach((locName) => {
      const coords = getCoordinatesForLocation(locName);
      if (!coords) return;

      // Canonical name
      const canonicalName = Object.keys(MAJOR_NODAL_POINTS).find(
        (k) => k.toLowerCase() === locName.toLowerCase()
      ) || locName;

      if (!clustersMap.has(canonicalName)) {
        clustersMap.set(canonicalName, {
          locationName: canonicalName,
          coordinates: coords,
          reportCount: 0,
          threats: [],
          maxSeverity: 'Low',
          lastReportTime: threat.timestamp || 'Recent'
        });
      }

      const cluster = clustersMap.get(canonicalName);
      cluster.reportCount += 1;
      cluster.threats.push({
        id: threat.id,
        title: threat.title,
        platform: threat.platform || threat.source || 'OSINT',
        riskLevel: threat.riskLevel || 'Medium',
        timestamp: threat.timestamp || 'Just now',
        summary: threat.aiExplanation || threat.content
      });

      // Severity precedence: Critical > High > Medium > Low
      const currentLevel = cluster.maxSeverity;
      const newLevel = threat.riskLevel || 'Medium';
      if (newLevel === 'Critical') {
        cluster.maxSeverity = 'Critical';
      } else if (newLevel === 'High' && currentLevel !== 'Critical') {
        cluster.maxSeverity = 'High';
      } else if (newLevel === 'Medium' && currentLevel !== 'Critical' && currentLevel !== 'High') {
        cluster.maxSeverity = 'Medium';
      }
    });
  });

  const results = Array.from(clustersMap.values());

  // If live ingestion produced fewer than 2 markers, merge with default nodal telemetry
  if (results.length < 2) {
    const defaults = getDefaultGeographicClusters();
    defaults.forEach((def) => {
      if (!clustersMap.has(def.locationName)) {
        results.push(def);
      }
    });
  }

  return results;
}

/**
 * Baseline nodal telemetry points for hackathon presentation and fallback reliability.
 */
export function getDefaultGeographicClusters() {
  return [
    {
      locationName: 'Delhi',
      coordinates: MAJOR_NODAL_POINTS.Delhi,
      reportCount: 4,
      maxSeverity: 'Critical',
      lastReportTime: '4 mins ago',
      threats: [
        {
          id: 'DEL-ALT-01',
          title: 'Leaked Citizen Identity Records on Dark Telegram Node',
          platform: 'Telegram',
          riskLevel: 'Critical',
          timestamp: '4 mins ago',
          summary: 'Exfiltration of regional registrar registry entries with unredacted biometric keys.'
        },
        {
          id: 'DEL-ALT-02',
          title: 'Coordinated Transit Hub Radio Jamming Plans',
          platform: 'Facebook',
          riskLevel: 'High',
          timestamp: '18 mins ago',
          summary: 'Encrypted coordination proposing communication disruption near capital transit perimeter.'
        }
      ]
    },
    {
      locationName: 'Mumbai',
      coordinates: MAJOR_NODAL_POINTS.Mumbai,
      reportCount: 3,
      maxSeverity: 'High',
      lastReportTime: '12 mins ago',
      threats: [
        {
          id: 'MUM-ALT-01',
          title: 'Municipal Surveillance Mirai Botnet Scanner Probe',
          platform: 'Telegram',
          riskLevel: 'High',
          timestamp: '12 mins ago',
          summary: 'Automated telnet port credential brute-forcing targeting port authority perimeter.'
        },
        {
          id: 'MUM-ALT-02',
          title: 'Financial Clearinghouse Spoofed Domain Campaign',
          platform: 'X (Twitter)',
          riskLevel: 'High',
          timestamp: '32 mins ago',
          summary: 'Fast-flux DNS resolving lookalike banking gateway for transaction spoofing.'
        }
      ]
    },
    {
      locationName: 'Jaipur',
      coordinates: MAJOR_NODAL_POINTS.Jaipur,
      reportCount: 2,
      maxSeverity: 'High',
      lastReportTime: '24 mins ago',
      threats: [
        {
          id: 'JAI-ALT-01',
          title: 'Regional Transit Hub Disruption Chatter',
          platform: 'Telegram',
          riskLevel: 'High',
          timestamp: '24 mins ago',
          summary: 'Flash mob coordination claiming planned transit blockades in capital sector.'
        }
      ]
    },
    {
      locationName: 'Bangalore',
      coordinates: MAJOR_NODAL_POINTS.Bangalore,
      reportCount: 5,
      maxSeverity: 'Critical',
      lastReportTime: '2 mins ago',
      threats: [
        {
          id: 'BLR-ALT-01',
          title: '400kV Substation Industrial SCADA Command Injection',
          platform: 'Telegram',
          riskLevel: 'Critical',
          timestamp: '2 mins ago',
          summary: 'Weaponized Modbus script attempting unauthorized breaker trip commands.'
        },
        {
          id: 'BLR-ALT-02',
          title: 'Zero-Day RCE Exploit in Telecom Core Router Firmware',
          platform: 'Reddit',
          riskLevel: 'Critical',
          timestamp: '15 mins ago',
          summary: 'Proof-of-concept shellcode circulating across infosec discussion channels.'
        }
      ]
    },
    {
      locationName: 'Hyderabad',
      coordinates: MAJOR_NODAL_POINTS.Hyderabad,
      reportCount: 2,
      maxSeverity: 'High',
      lastReportTime: '19 mins ago',
      threats: [
        {
          id: 'HYD-ALT-01',
          title: 'Deepfake Disinformation Viral Broadcast Alert',
          platform: 'Facebook',
          riskLevel: 'High',
          timestamp: '19 mins ago',
          summary: 'Synthetic speech video fabricating emergency bank closure directives.'
        }
      ]
    },
    {
      locationName: 'Pune',
      coordinates: MAJOR_NODAL_POINTS.Pune,
      reportCount: 2,
      maxSeverity: 'High',
      lastReportTime: '38 mins ago',
      threats: [
        {
          id: 'PUN-ALT-01',
          title: 'Municipal Water Infrastructure Contamination Hoax',
          platform: 'Facebook',
          riskLevel: 'High',
          timestamp: '38 mins ago',
          summary: 'Viral alarmist narrative inciting civil panic regarding municipal water supply.'
        }
      ]
    }
  ];
}
