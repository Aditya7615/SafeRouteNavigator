import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Define interface for the props
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

interface MapDisplayProps {
  routes?: RouteType[];
  markers?: MarkerType[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

// This component handles map display with route visualization
const MapDisplay: React.FC<MapDisplayProps> = ({ 
  routes = [], 
  markers = [],
  center = { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  zoom = 12
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Set mapbox token
  mapboxgl.accessToken = 'pk.eyJ1IjoicHVibGljLXNhZmV0eSIsImEiOiJjbHNna3VmOWkwMm51MnFwOGduYmxiNHQxIn0.qzCv-vB5DNzzzS1VHPhuJA';

  useEffect(() => {
    // Initialize map
    if (map.current) return; // already initialized
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [center.lng, center.lat],
        zoom: zoom
      });

      // Set map as loaded once ready
      map.current.on('load', () => {
        setMapLoaded(true);
      });
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom]);

  // Add routes when the map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current || !routes || routes.length === 0) return;
    
    // First remove any existing routes
    routes.forEach((_, index) => {
      const routeId = `route-${index}`;
      const glowId = `route-glow-${index}`;
      
      if (map.current && map.current.getLayer(routeId)) {
        map.current.removeLayer(routeId);
      }
      
      if (map.current && map.current.getLayer(glowId)) {
        map.current.removeLayer(glowId);
      }
      
      if (map.current && map.current.getSource(routeId)) {
        map.current.removeSource(routeId);
      }
    });
    
    // Add each route to the map
    routes.forEach((route, index) => {
      if (!map.current) return;
      
      try {
        const sourceId = `route-${index}`;
        const routeId = `route-${index}`;
        const glowId = `route-glow-${index}`;
        
        // Add the route data source
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.coordinates
            }
          }
        });
        
        // Add a glow effect for visibility
        map.current.addLayer({
          id: glowId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': route.color,
            'line-opacity': 0.6,
            'line-width': route.width + 4,
            'line-blur': 3
          }
        });
        
        // Add the main route line
        map.current.addLayer({
          id: routeId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': route.color,
            'line-width': route.width,
            'line-dasharray': [0, 4, 3] // Add dash pattern for better visibility
          }
        });
      } catch (error) {
        console.error(`Error adding route ${index}:`, error);
      }
    });
  }, [routes, mapLoaded]);

  // Add markers when the map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current || !markers || markers.length === 0) return;
    
    // Remove existing markers
    const markerElements = document.getElementsByClassName('mapboxgl-marker');
    while (markerElements[0]) {
      markerElements[0].remove();
    }
    
    // Add new markers
    markers.forEach((marker: MarkerType) => {
      const el = document.createElement('div');
      el.className = 'mapboxgl-marker';
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = marker.color || '#6366F1';
      el.style.border = '2px solid white';
      
      if (map.current) {
        const markerInstance = new mapboxgl.Marker(el)
          .setLngLat([marker.lng, marker.lat])
          .addTo(map.current);
          
        if (marker.popup) {
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<div class="text-gray-800">${marker.popup}</div>`);
          markerInstance.setPopup(popup);
        }
      }
    });
  }, [markers, mapLoaded]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden">
      {/* Map container */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="glass p-4 rounded-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            <span className="text-white">Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;