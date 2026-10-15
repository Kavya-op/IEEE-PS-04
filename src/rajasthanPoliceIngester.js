/**
 * ==============================================================================
 * RAJASTHAN POLICE CYBER THREAT INGESTION PIPELINE
 * Problem Statement SKIT004 - National Cyber Threat Intelligence Platform
 * ==============================================================================
 * 
 * Ingests, normalizes, and geolocates state cyber security telemetry
 * derived from official Rajasthan State Cyber Crime FIR & Complaint records.
 * Integrates directly with:
 *  - GeographicThreatMap.jsx (Leaflet spatial clustering)
 *  - AlertFeed.jsx (State Police Telemetry view)
 *  - SaaSChartsSection.jsx (Recharts timeline surge analytics)
 * ==============================================================================
 */

import rajasthanCyberData from './assets/rajasthan_cyber_data.json';

/**
 * Top district coordinate mapping dictionary strictly defined
 */
export const RAJASTHAN_DISTRICT_COORDINATES = {
  "JAIPUR (WEST)": [26.9200, 75.7600],
  "KOTPUTLI-BEHROR": [27.7000, 76.2000],
  "SIKAR": [27.6094, 75.1398],
  "BARAN": [25.1011, 76.5132],
  "JAIPUR": [26.9124, 75.7873],
  "ALWAR": [27.5530, 76.6346],
  "JODHPUR": [26.2389, 73.0243],
  "UDAIPUR": [24.5854, 73.7125],
  "AJMER": [26.4499, 74.6399],
  "BIKANER": [28.0229, 73.3119],
  "KOTA": [25.2138, 75.8648],
  "BHILWARA": [25.3407, 74.6313]
};

/**
 * Loads the local Rajasthan Cyber Security dataset.
 * @returns {Promise<Array<Object>>} Array of state cyber crime incident objects.
 */
export async function fetchRajasthanData() {
  if (Array.isArray(rajasthanCyberData) && rajasthanCyberData.length > 0) {
    return rajasthanCyberData;
  }

  try {
    const res = await fetch('/src/assets/rajasthan_cyber_data.json');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[rajasthanPoliceIngester] Fetch fallback error:', err);
  }

  return rajasthanCyberData || [];
}

/**
 * Normalizes raw Rajasthan Police records into the standard threat object schema
 * for AlertFeed.jsx and related surveillance widgets.
 * 
 * Maps:
 *  - Complaint Additional Info -> Card body
 *  - Sub Category -> Vibrant Lime flat badge tags (bg-[#F3FAEB] text-[#5C901A])
 *  - Suspect Mobile -> IOC indicator section (e.g. Suspect Indicator: +91-XXXXX)
 */
export function normalizeRajasthanPoliceThreats(rawData = rajasthanCyberData) {
  if (!Array.isArray(rawData)) return [];

  return rawData.map((item, idx) => {
    const complaintId = item['Complaint ID'] || `RAJ-CYBER-${1000 + idx}`;
    const firNumber = item['FIR Number'] || `FIR-${idx + 1}/2026/RAJ`;
    const district = item['District'] || 'JAIPUR';
    const category = item['Category'] || 'Online Financial Fraud';
    const subCategory = item['Sub Category'] || 'UPI Related Frauds';
    const complaintInfo = item['Complaint Additional Info'] || 'State cyber crime FIR recorded.';
    const suspectMobile = item['Suspect Mobile'] || '+91-9829XXXXXX';
    const incidentDate = item['Incident Date'] || '2026-10-14';
    const amountLost = Number(item['Amount Lost'] || 0);

    const isCritical = amountLost >= 100000;

    return {
      id: complaintId,
      firNumber,
      district,
      category,
      subCategory,
      complaintAdditionalInfo: complaintInfo,
      content: complaintInfo, // Card body requirement
      title: `${subCategory} | ${district} Cyber Unit`,
      suspectMobile, // IOC indicator requirement
      incidentDate,
      timestamp: incidentDate,
      amountLost,
      status: item['Status'] || 'Under Investigation',
      policeStation: item['Police Station'] || `${district} Cyber Police Station`,
      platform: 'Rajasthan Police',
      sourcePlatform: 'Rajasthan Police',
      source: `${district} Cyber Crime Unit`,
      sourceUrl: 'https://cybercrime.gov.in/',
      link: 'https://cybercrime.gov.in/',
      riskLevel: isCritical ? 'Critical' : 'High',
      threatLevel: isCritical ? 'Critical' : 'High',
      isPoliceTelemetry: true,
      aiExplanation: `State Police First Information Report (${firNumber}) registered at ${district} Cyber Police Station. Primary vector: ${subCategory}. Active suspect mobile indicator: ${suspectMobile}.`,
      aiConfidence: 99.4,
      cybercrime: {
        isCybercrimeThreat: true,
        threatSubcategory: subCategory,
        flaggedPhrases: [subCategory, district, suspectMobile]
      },
      keywords: [
        `#${district.toLowerCase().replace(/[\/\s()-]/g, '')}`,
        `#${subCategory.toLowerCase().replace(/[\/\s()-]/g, '')}`,
        '#rajasthan-police-fir',
        '#state-telemetry'
      ]
    };
  });
}

/**
 * Aggregates Rajasthan incidents by district into Leaflet-ready map clusters.
 * 
 * Requirements:
 *  - For every incident in "JAIPUR", increases the cluster count for that node.
 *  - Calculates dominant vector (e.g., "UPI Fraud").
 *  - Formats tooltip: [District Name] - [Count] Active FIRs (Dominant Vector: UPI Fraud)
 */
export function aggregateRajasthanClusters(rawData = rajasthanCyberData) {
  const data = Array.isArray(rawData) && rawData.length > 0 ? rawData : rajasthanCyberData;
  const clusterMap = new Map();

  data.forEach((item) => {
    let district = (item['District'] || 'JAIPUR').trim();
    
    // Normalize case and match coordinates dictionary
    let matchKey = Object.keys(RAJASTHAN_DISTRICT_COORDINATES).find(
      (k) => k.toLowerCase() === district.toLowerCase()
    );

    if (!matchKey) {
      if (district.toLowerCase().includes('jaipur')) matchKey = 'JAIPUR';
      else if (district.toLowerCase().includes('kotputli')) matchKey = 'KOTPUTLI-BEHROR';
      else if (district.toLowerCase().includes('sikar')) matchKey = 'SIKAR';
      else if (district.toLowerCase().includes('baran')) matchKey = 'BARAN';
      else matchKey = 'JAIPUR';
    }

    const coords = RAJASTHAN_DISTRICT_COORDINATES[matchKey] || [26.9124, 75.7873];

    if (!clusterMap.has(matchKey)) {
      clusterMap.set(matchKey, {
        locationName: matchKey,
        coordinates: coords,
        reportCount: 0,
        threats: [],
        vectorCounts: {},
        dominantVector: 'UPI Fraud',
        maxSeverity: 'High',
        lastReportTime: item['Incident Date'] || 'Recent'
      });
    }

    const cluster = clusterMap.get(matchKey);
    cluster.reportCount += 1;

    // Tally subcategories to determine Dominant Vector
    const subCat = item['Sub Category'] || 'UPI Related Frauds';
    const simplifiedVector = subCat.toLowerCase().includes('upi')
      ? 'UPI Fraud'
      : subCat.toLowerCase().includes('internet banking') || subCat.toLowerCase().includes('banking')
      ? 'Banking Trojan'
      : subCat.toLowerCase().includes('social media') || subCat.toLowerCase().includes('sextortion')
      ? 'Social Engineering'
      : subCat.toLowerCase().includes('crypto')
      ? 'Investment Scam'
      : 'UPI Fraud';

    cluster.vectorCounts[simplifiedVector] = (cluster.vectorCounts[simplifiedVector] || 0) + 1;

    const amount = Number(item['Amount Lost'] || 0);
    if (amount >= 100000) cluster.maxSeverity = 'Critical';

    cluster.threats.push({
      id: item['Complaint ID'] || `FIR-${cluster.threats.length + 1}`,
      title: `${item['Sub Category'] || 'Cybercrime'} - FIR Registered`,
      platform: 'Rajasthan Police',
      riskLevel: amount >= 100000 ? 'Critical' : 'High',
      timestamp: item['Incident Date'] || 'Recent',
      summary: item['Complaint Additional Info'],
      suspectMobile: item['Suspect Mobile']
    });
  });

  // Calculate dominant vector and tooltip string for each cluster
  const results = [];
  clusterMap.forEach((cluster) => {
    let topVector = 'UPI Fraud';
    let maxCount = 0;
    for (const [vec, cnt] of Object.entries(cluster.vectorCounts)) {
      if (cnt > maxCount) {
        maxCount = cnt;
        topVector = vec;
      }
    }
    cluster.dominantVector = topVector;
    // Strict Tooltip specification: [District Name] - [Count] Active FIRs (Dominant Vector: UPI Fraud)
    cluster.tooltipText = `${cluster.locationName} - ${cluster.reportCount} Active FIRs (Dominant Vector: ${topVector})`;
    results.push(cluster);
  });

  return results;
}

/**
 * Aggregates incident timeline data by Incident Date for Recharts visualization.
 * Compares "Online Financial Fraud" vs "Social Media Crime" counts.
 * 
 * @returns {Array<Object>} Sorted chronological array:
 *   [{ date: '2026-10-01', displayDate: '01 Oct', onlineFinancialFraud: 4, socialMediaCrime: 2, total: 6 }, ...]
 */
export function aggregateTimelineTrends(rawData = rajasthanCyberData) {
  const data = Array.isArray(rawData) && rawData.length > 0 ? rawData : rajasthanCyberData;
  const dateMap = new Map();

  data.forEach((item) => {
    const rawDate = item['Incident Date'] || '2026-10-01';
    const category = (item['Category'] || '').toLowerCase();

    if (!dateMap.has(rawDate)) {
      const parts = rawDate.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2] || '01';
      const displayDate = `${day} ${monthNames[monthIdx] || 'Oct'}`;

      dateMap.set(rawDate, {
        rawDate,
        date: displayDate,
        fullDate: rawDate,
        onlineFinancialFraud: 0,
        socialMediaCrime: 0,
        total: 0
      });
    }

    const entry = dateMap.get(rawDate);
    entry.total += 1;

    if (category.includes('financial') || category.includes('upi') || category.includes('banking') || category.includes('fraud')) {
      entry.onlineFinancialFraud += 1;
    } else if (category.includes('social') || category.includes('stalking') || category.includes('harassment') || category.includes('media')) {
      entry.socialMediaCrime += 1;
    } else {
      entry.onlineFinancialFraud += 1;
    }
  });

  // Sort chronologically by ISO date
  return Array.from(dateMap.values()).sort((a, b) => a.rawDate.localeCompare(b.rawDate));
}

export default {
  fetchRajasthanData,
  normalizeRajasthanPoliceThreats,
  aggregateRajasthanClusters,
  aggregateTimelineTrends,
  RAJASTHAN_DISTRICT_COORDINATES
};
