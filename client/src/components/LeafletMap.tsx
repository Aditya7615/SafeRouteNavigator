import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom icons for different marker types
const markerIcons = {
  default: new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  crime: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  lighting: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  reports: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

interface RouteType {
  coordinates: Array<[number, number]>;
  color: string;
  width: number;
}

interface MarkerType {
  lat: number;
  lng: number;
  color?: string;
  popup?: string;
}

interface LeafletMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  routes?: RouteType[];
  markers?: MarkerType[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center = { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  zoom = 12,
  routes = [],
  markers = []
}) => {
  // Convert coordinates format for Leaflet from [lng, lat] to [lat, lng]
  const convertCoordinates = (coords: Array<[number, number]>): LatLngExpression[] => {
    return coords.map(([lng, lat]) => [lat, lng] as LatLngExpression);
  };

  return (
    <MapContainer 
      center={[center.lat, center.lng]} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Render routes */}
      {routes.map((route, index) => (
        <Polyline 
          key={`route-${index}`}
          positions={convertCoordinates(route.coordinates)}
          pathOptions={{ 
            color: route.color, 
            weight: route.width, 
            opacity: 0.8,
            dashArray: route.color.includes('green') ? undefined : '5, 5'
          }} 
        />
      ))}
      
      {/* Render markers */}
      {markers.map((marker, index) => {
        // Determine which icon to use based on color
        let iconType = 'default';
        if (marker.color?.includes('red')) iconType = 'crime';
        else if (marker.color?.includes('yellow') || marker.color?.includes('amber')) iconType = 'lighting';
        else if (marker.color?.includes('purple') || marker.color?.includes('violet')) iconType = 'reports';
        
        return (
          <Marker 
            key={`marker-${index}`}
            position={[marker.lat, marker.lng]}
            icon={markerIcons[iconType as keyof typeof markerIcons]}
          >
            {marker.popup && (
              <Popup>
                <div dangerouslySetInnerHTML={{ __html: marker.popup }} />
              </Popup>
            )}
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LeafletMap;