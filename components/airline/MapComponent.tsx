"use client"

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/helpers";
import greatCircle from "@turf/great-circle";
import { MapAirport } from "@/lib/route-map-data";

// Fix leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const customIcon = new L.DivIcon({
  html: `<div style="background-color: #1d4ed8; width: 12px; height: 12px; border-radius: 50%;"></div>`,
  className: 'custom-div-icon-selected',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const defaultIcon = new L.DivIcon({
  html: `<div style="background-color: #888888; width: 8px; height: 8px; border-radius: 50%;"></div>`,
  className: 'custom-div-icon',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});


interface MapComponentProps {
  airports: MapAirport[];
  selectedFrom: string;
  selectedTo: string;
  onAirportSelect: (iata: string) => void;
}

// Map controller to automatically fit bounds
function MapController({ selectedFrom, selectedTo, airports }: MapComponentProps) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedFrom && selectedTo) {
      const fromAirport = airports.find(a => a.iata === selectedFrom);
      const toAirport = airports.find(a => a.iata === selectedTo);
      if (fromAirport && toAirport) {
        const bounds = L.latLngBounds([fromAirport.coordinates, toAirport.coordinates]);
        map.flyToBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedFrom, selectedTo, airports, map]);

  return null;
}

export default function MapComponent({ airports, selectedFrom, selectedTo, onAirportSelect }: MapComponentProps) {
  const [arcPositions, setArcPositions] = useState<[number, number][]>([]);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/vietnam.json")
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Could not load geojson", err));
  }, []);

  useEffect(() => {
    if (selectedFrom && selectedTo) {
      const fromAirport = airports.find(a => a.iata === selectedFrom);
      const toAirport = airports.find(a => a.iata === selectedTo);
      
      if (fromAirport && toAirport) {
        // Turf uses [longitude, latitude]
        const fromPoint = turf.point([fromAirport.coordinates[1], fromAirport.coordinates[0]]);
        const toPoint = turf.point([toAirport.coordinates[1], toAirport.coordinates[0]]);
        
        try {
          // Generate great circle line
          const line = greatCircle(fromPoint, toPoint, { npoints: 100 });
          // Convert back to [latitude, longitude] for Leaflet
          const positions = line.geometry.coordinates.map(c => [c[1], c[0]] as [number, number]);
          setArcPositions(positions);
        } catch (e) {
          // Fallback to straight line
          setArcPositions([fromAirport.coordinates, toAirport.coordinates]);
        }
      } else {
        setArcPositions([]);
      }
    } else {
      setArcPositions([]);
    }
  }, [selectedFrom, selectedTo, airports]);

  return (
    <MapContainer 
      center={[16.0, 107.5]} 
      zoom={6} 
      style={{ height: '100%', width: '100%', zIndex: 10 }}
      zoomControl={true}
    >
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />

      {geoData && (
        <GeoJSON 
          data={geoData} 
          style={{
            color: '#111827',
            weight: 2.5,
            fillOpacity: 0,
            opacity: 0.8
          }} 
        />
      )}
      
      {airports.map((airport) => {
        const isSelected = airport.iata === selectedFrom || airport.iata === selectedTo;
        return (
          <Marker 
            key={airport.iata} 
            position={airport.coordinates}
            icon={isSelected ? customIcon : defaultIcon}
            eventHandlers={{
              click: () => onAirportSelect(airport.iata)
            }}
          >
            <Tooltip 
              permanent 
              direction="right" 
              offset={[5, 0]} 
              opacity={1}
              className="bg-transparent border-none shadow-none text-black font-semibold text-xs before:hidden p-0 m-0"
            >
              <div>
                <span>{airport.city}</span>
                {isSelected && (
                  <div className="mt-0.5 text-[10px] font-bold text-[#1d4ed8] bg-white/80 px-1 rounded inline-block">
                    Giá từ 799.000đ
                  </div>
                )}
              </div>
            </Tooltip>
          </Marker>
        );
      })}

      {arcPositions.length > 0 && (
        <Polyline 
          positions={arcPositions} 
          pathOptions={{ color: '#1d4ed8', weight: 2, opacity: 1 }} 
        />
      )}

      <MapController 
        airports={airports} 
        selectedFrom={selectedFrom} 
        selectedTo={selectedTo} 
        onAirportSelect={onAirportSelect} 
      />
    </MapContainer>
  );
}
