import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Layers,
  Crosshair,
  ExternalLink,
  Info,
  Compass
} from 'lucide-react';
import { aggregateThreatsByLocation, MAJOR_NODAL_POINTS } from '../utils/geoMapper';

/**
 * Helper component to pan/zoom map programmatically when a node pill is clicked
 */
function MapFlyToController({ targetCoords }) {
  const map = useMap();
  React.useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 7, { duration: 1.2 });
    }
  }, [targetCoords, map]);
  return null;
}

/**
 * Creates custom pulsing Vibrant Lime Leaflet DivIcon
 * Styling: bg-[#9FE846] w-4 h-4 rounded-full shadow-[0_0_10px_#9FE846] animate-pulse
 */
function createPulsingLimeIcon(count = 1, severity = 'High') {
  const isCritical = severity === 'Critical';

  return L.divIcon({
    className: 'custom-lime-marker-wrapper',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
    html: `
      <div class="relative flex items-center justify-center w-7 h-7 cursor-pointer group">
        <!-- Outer radar ping wave -->
        <span class="absolute inline-flex h-full w-full rounded-full bg-[#9FE846] opacity-60 animate-ping"></span>
        
        <!-- Pulsing Vibrant Lime dot with glow -->
        <div class="relative w-4 h-4 rounded-full bg-[#9FE846] border-2 border-[#0B2115] shadow-[0_0_10px_#9FE846] animate-pulse flex items-center justify-center transition-transform group-hover:scale-125">
          ${
            count > 1
              ? `<span class="text-[9px] font-black font-mono text-[#0B2115] leading-none select-none">${count}</span>`
              : ''
          }
        </div>
      </div>
    `
  });
}

/**
 * Primary regional node coordinates strictly defined
 */
export const PRIMARY_NODAL_POINTS = {
  Delhi: [28.7041, 77.1025],
  Mumbai: [19.0760, 72.8777],
  Jaipur: [26.9124, 75.7873],
  Bangalore: [12.9716, 77.5946]
};

export default function GeographicThreatMap({ threats = [], liveThreatData: propLiveThreatData }) {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Maintain dynamic liveThreatData state for reactive marker rendering
  const [liveThreatData, setLiveThreatData] = useState(() => {
    return (Array.isArray(propLiveThreatData) && propLiveThreatData.length > 0)
      ? propLiveThreatData
      : (Array.isArray(threats) ? threats : []);
  });

  // Keep liveThreatData synchronized when incoming live intelligence updates
  React.useEffect(() => {
    const nextThreats = propLiveThreatData || threats || [];
    setLiveThreatData(nextThreats);
  }, [propLiveThreatData, threats]);

  // Aggregate threats by resolved geographic coordinates using Gemini NER results
  const geoClusters = useMemo(() => {
    return aggregateThreatsByLocation(liveThreatData);
  }, [liveThreatData]);

  // Total active nodal reports count
  const totalReports = useMemo(() => {
    return geoClusters.reduce((sum, c) => sum + (c.reportCount || 1), 0);
  }, [geoClusters]);

  // Exact coordinates of India center [20.5937, 78.9629]
  const indiaCenter = [20.5937, 78.9629];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden p-4 shadow-sm select-none">
      {/* Dark theme CSS filter for OpenStreetMap tiles without external API keys */}
      <style>{`
        .dark-map-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>

      {/* Map Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#9FE846] text-[#0B2115] flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#0B2115] tracking-tight">
              Geographic Threat Visualization
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#F3FAEB] text-[#0B2115] border border-[#9FE846]">
              <span className="w-2 h-2 rounded-full bg-[#9FE846] animate-pulse"></span>
              LIVE NER SENSORS
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time geospatial entity resolution extracted from social threat telemetry via Gemini AI NER.
          </p>
        </div>

        {/* Nodal Quick-Jump Navigation Chips */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {['Delhi', 'Mumbai', 'Jaipur', 'Bangalore'].map((city) => {
            const hasCluster = geoClusters.find((c) => c.locationName.toLowerCase() === city.toLowerCase());
            const coords = PRIMARY_NODAL_POINTS[city] || MAJOR_NODAL_POINTS[city];

            return (
              <button
                key={city}
                onClick={() => setSelectedCoords(coords)}
                className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#F3F5F6] hover:bg-[#9FE846] hover:text-[#0B2115] text-[#0B2115] border border-[#E5E7EB] transition-all cursor-pointer flex items-center gap-1"
                title={`Center map on ${city} node`}
              >
                <Crosshair className="w-3 h-3 text-[#0B2115]" />
                <span>{city}</span>
                {hasCluster && (
                  <span className="bg-[#0B2115] text-[#9FE846] text-[9px] px-1 rounded-full font-bold">
                    {hasCluster.reportCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Container: Fixed height h-[400px] w-full rounded-lg z-0 */}
      <div className="h-[400px] w-full rounded-lg z-0 relative overflow-hidden border border-[#E5E7EB]">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          style={{ background: '#0B2115' }}
        >
          {/* Dark-themed tile layer using standard OpenStreetMap endpoint with CSS inversion */}
          <TileLayer
            className="dark-map-tiles"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Programmatic fly-to handler */}
          {selectedCoords && <MapFlyToController targetCoords={selectedCoords} />}

          {/* Render Dynamic Marker components mapping over liveThreatData state */}
          {geoClusters.map((cluster) => {
            return (
              <Marker
                key={cluster.locationName}
                position={cluster.coordinates}
                icon={createPulsingLimeIcon(cluster.reportCount, cluster.maxSeverity)}
              >
                {/* Styled Leaflet Popup: bg-[#0B2115] text-[#F3F5F6] border-none */}
                <Popup className="custom-dark-popup">
                  <div className="bg-[#0B2115] text-[#F3F5F6] p-4 rounded-xl border border-[#153423] min-w-[260px] max-w-[320px]">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#153423]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#9FE846]" />
                        <span className="font-bold text-sm text-white tracking-wide">
                          {cluster.locationName} Regional Node
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          cluster.maxSeverity === 'Critical'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-[#153423] text-[#9FE846] border border-[#9FE846]/40'
                        }`}
                      >
                        {cluster.maxSeverity}
                      </span>
                    </div>

                    {/* Localized Threat Volume Text Requirement */}
                    <div className="bg-[#153423]/80 border border-[#9FE846]/30 px-3 py-2 rounded-lg mb-3">
                      <div className="text-xs font-bold text-[#9FE846] flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-[#9FE846]" />
                        <span>{cluster.reportCount} Active Reports in this region.</span>
                      </div>
                      <div className="text-[10px] text-gray-300 font-mono mt-0.5">
                        Last Telemetry Intercept: {cluster.lastReportTime}
                      </div>
                    </div>

                    {/* Incident List */}
                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto pr-1">
                      {cluster.threats.slice(0, 3).map((threat, idx) => (
                        <div
                          key={threat.id || idx}
                          className="bg-[#081a10] p-2 rounded-md border border-[#153423] text-xs text-gray-200"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-0.5">
                            <span className="text-[#9FE846] font-semibold">{threat.platform}</span>
                            <span>{threat.timestamp}</span>
                          </div>
                          <div className="font-medium line-clamp-2 text-white">
                            {threat.title}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Popup Footer */}
                    <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between pt-2 border-t border-[#153423]">
                      <span>LAT: {cluster.coordinates[0].toFixed(2)} N</span>
                      <span>LNG: {cluster.coordinates[1].toFixed(2)} E</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend Overlay */}
        <div className="absolute top-3 right-3 z-10 bg-[#0B2115]/90 backdrop-blur-xs border border-[#153423] text-white p-2.5 rounded-lg text-xs font-mono shadow-xl pointer-events-none">
          <div className="text-[10px] text-[#9FE846] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9FE846] animate-pulse"></span>
            ACTIVE NODES: {geoClusters.length}
          </div>
          <div className="text-gray-300 text-[11px]">
            Total Reports: <strong className="text-white">{totalReports}</strong>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STEP 5: STRICT DISCLAIMER BADGE AT BOTTOM OF MAP CARD
          [ ⚠️ Note: Map displays locations explicitly mentioned in threat telemetry,
            not necessarily the physical origin of the threat actor. Data coverage may
            be incomplete pending ISP verification. ]
          Style: text-xs text-gray-500 bg-[#F3F5F6] p-2 rounded mt-3
         ========================================================================= */}
      <div className="text-xs text-gray-500 bg-[#F3F5F6] p-2 rounded mt-3 flex items-start gap-2 border border-[#E5E7EB]">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-[#0B2115] font-semibold">Note:</strong> Map displays locations explicitly mentioned in threat telemetry, not necessarily the physical origin of the threat actor. Data coverage may be incomplete pending ISP verification.
        </span>
      </div>
    </div>
  );
}
