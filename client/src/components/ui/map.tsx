import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// In Vite, we access environment variables through import.meta.env
// Make sure the token is prefixed with VITE_ in the .env file
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoicHJvamVjdC10ZXN0aW5nIiwiYSI6ImNsc2ZzNXZ3MzAydjQyanRlMXRoejdtMDgifQ.1wF33V15u_0dDMzv9jzHwg';

interface MapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  style?: string;
  width?: string;
  height?: string;
  className?: string;
  onMapLoaded?: (map: mapboxgl.Map) => void;
  markers?: Array<{
    lat: number;
    lng: number;
    color?: string;
    popup?: string;
  }>;
  routes?: Array<{
    coordinates: Array<[number, number]>;
    color: string;
    width: number;
  }>;
  children?: React.ReactNode;
}

const Map: React.FC<MapProps> = ({
  latitude = 28.6139,  // Default to Delhi
  longitude = 77.2090,
  zoom = 12,
  style = 'mapbox://styles/mapbox/dark-v11',
  width = '100%',
  height = '450px',
  className = '',
  onMapLoaded,
  markers = [],
  routes = [],
  children
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: [longitude, latitude],
        zoom: zoom,
        attributionControl: false
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        if (onMapLoaded && map.current) {
          onMapLoaded(map.current);
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, zoom, style, onMapLoaded]);

  // Add markers when the map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Clear existing markers
    const markersElements = document.getElementsByClassName('mapboxgl-marker');
    while (markersElements[0]) {
      markersElements[0].remove();
    }
    
    // Add new markers
    markers.forEach(marker => {
      const el = document.createElement('div');
      el.className = 'mapboxgl-marker';
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = marker.color || '#6366F1';
      el.style.border = '2px solid white';
      
      const markerInstance = new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current!);
        
      if (marker.popup) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div class="text-gray-800">${marker.popup}</div>`);
        markerInstance.setPopup(popup);
      }
    });
  }, [markers, mapLoaded]);

  // Add routes when the map is loaded
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Remove existing route layers
    routes.forEach((_, index) => {
      if (map.current?.getLayer(`route-${index}`)) {
        map.current.removeLayer(`route-${index}`);
      }
      if (map.current?.getSource(`route-${index}`)) {
        map.current.removeSource(`route-${index}`);
      }
    });
    
    // Add new route layers
    routes.forEach((route, index) => {
      if (!map.current) return;
      
      try {
        map.current.addSource(`route-${index}`, {
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
        
        // Add glow effect layer first (below the main route)
        map.current.addLayer({
          id: `route-glow-${index}`,
          type: 'line',
          source: `route-${index}`,
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
        
        // Add main route layer
        map.current.addLayer({
          id: `route-${index}`,
          type: 'line',
          source: `route-${index}`,
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

  return (
    <div ref={mapContainer} className={className} style={{ width, height }}>
      {children}
    </div>
  );
};

export default Map;
