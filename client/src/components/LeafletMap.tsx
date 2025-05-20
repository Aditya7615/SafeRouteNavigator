import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = Icon.Default.prototype;
DefaultIcon.options.iconUrl = icon;
DefaultIcon.options.shadowUrl = iconShadow;
Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: iconShadow
});

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
      {markers.map((marker, index) => (
        <Marker 
          key={`marker-${index}`}
          position={[marker.lat, marker.lng]}
        >
          {marker.popup && (
            <Popup>
              <div dangerouslySetInnerHTML={{ __html: marker.popup }} />
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;