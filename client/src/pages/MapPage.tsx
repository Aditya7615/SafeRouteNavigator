import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { indianCities } from '@/lib/cities';
import { useToast } from '@/hooks/use-toast';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import TurnByTurnDirections from '@/components/TurnByTurnDirections';
import RouteForm from '@/components/RouteForm';
import { Button } from '@/components/ui/button';

// Fix Leaflet icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Create custom marker icons to ensure they display properly
const DefaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const YellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const VioletIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const GreenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Route comparison data interface
interface RouteOption {
  id: string;
  type: string;
  startLocation: string;
  endLocation: string;
  coordinates: Array<[number, number]>;
  distance: string;
  time: string;
  safetyScore: number;
  lighting: string;
  color: string;
  width: number;
  safetyFactors?: string[];
  safetyIssues?: string[];
  isRecommended: boolean;
}

// Define interfaces for map data
interface MarkerData {
  lat: number;
  lng: number;
  color?: string;
  popup?: string;
  type?: string;
  description?: string;
}

interface RouteData {
  coordinates: Array<[number, number]>;
  color: string;
  width: number;
}

interface MapData {
  cityCenter?: { lat: number; lng: number };
  crimeHotspots?: MarkerData[];
  poorLighting?: MarkerData[];
  communityReports?: MarkerData[];
  safeRoutes?: RouteData[];
}

const MapPage = () => {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState("Delhi NCR");
  
  // Parse URL parameters for start and end locations if they exist
  const getURLParams = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return {
        start: params.get('start') || "",
        end: params.get('end') || ""
      };
    }
    return { start: "", end: "" };
  };
  
  const urlParams = getURLParams();
  const [startLocation, setStartLocation] = useState<string>(urlParams.start);
  const [endLocation, setEndLocation] = useState<string>(urlParams.end);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [navigationActive, setNavigationActive] = useState(false);
  const [directions, setDirections] = useState<any[]>([]);
  const [activeLayers, setActiveLayers] = useState({
    crime: true,
    lighting: true,
    crowd: true,
    reports: true
  });
  
  // Generate directions based on the route
  const generateDirections = (route: any) => {
    if (!route || !route.coordinates || route.coordinates.length < 2) {
      return [];
    }
    
    // Generate turn by turn directions based on the coordinates
    const directions = [];
    
    // Add starting direction
    directions.push({
      instruction: "Start your journey",
      distance: "0 km",
      time: "0 min",
      streetName: route.startLocation,
      safetyNote: route.type === "Safest Route" ? 
        "You're on the safest route with good visibility and security" : 
        "Take caution, this route includes some less secure areas"
    });
    
    // If we have enough points, create turn directions
    if (route.coordinates.length >= 3) {
      // Generate some turns based on number of coordinates
      const streets = [
        "Main Road", "MG Road", "Station Road", "Ring Road", 
        "Market Street", "College Road", "Temple Street", "Gandhi Marg"
      ];
      
      // Generate directions for intermediate points
      for (let i = 1; i < route.coordinates.length - 1; i++) {
        // Alternate between left and right turns for demo purposes
        const turnDirection = i % 2 === 0 ? "Turn right" : "Turn left";
        const segment = {
          instruction: `${turnDirection} onto ${streets[i % streets.length]}`,
          distance: `${(0.3 + Math.random() * 0.7).toFixed(1)} km`,
          time: `${Math.floor(3 + Math.random() * 5)} min`,
          streetName: streets[i % streets.length],
        };
        
        // Add safety notes for some segments
        if (i % 3 === 0) {
          if (route.type === "Safest Route") {
            segment.safetyNote = "This area has good street lighting and security presence";
          } else {
            segment.safetyNote = "Stay alert, this area has limited visibility at night";
          }
        }
        
        directions.push(segment);
      }
    }
    
    // Add final direction
    directions.push({
      instruction: "Arrive at destination",
      distance: route.distance,
      time: route.time,
      streetName: route.endLocation,
      safetyNote: "You have arrived safely at your destination!"
    });
    
    return directions;
  };

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routeType = params.get('route');
    const start = params.get('start');
    const end = params.get('end');
    
    // If we have route parameters, set navigation mode
    if (routeType && start && end) {
      setNavigationActive(true);
      
      // Try to get the stored route data
      const storedRoute = sessionStorage.getItem('selectedRoute');
      if (storedRoute) {
        try {
          const routeData = JSON.parse(storedRoute);
          setSelectedRoute(routeData);
          
          // Generate directions for this route
          const directionsList = generateDirections(routeData);
          setDirections(directionsList);
          
          // Show toast about active navigation
          toast({
            title: "Navigation Active",
            description: `Following ${routeType} from ${start} to ${end}`,
          });
        } catch (e) {
          console.error("Error parsing stored route:", e);
        }
      }
    }
  }, [toast]);

  // Update page title and meta description
  useEffect(() => {
    document.title = "Live Safety Map - SafeRoute";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Explore real-time safety data across major Indian cities visualized on our interactive map.");
    }
  }, []);
  
  // Check URL parameters and auto-search for routes
  useEffect(() => {
    const params = getURLParams();
    if (params.start && params.end) {
      handleFindRoute(params.start, params.end);
    }
  }, []);

  const { data: mapData, isLoading, error } = useQuery<MapData>({
    queryKey: ['/api/map-data', selectedCity],
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading map data",
        description: "Unable to fetch safety data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Compile markers based on active layers
  const getMarkers = () => {
    if (!mapData) return [];
    
    let markers: MarkerData[] = [];
    
    if (navigationActive && selectedRoute) {
      // Add start and end markers for navigation
      const startCoords = selectedRoute.coordinates?.[0];
      const endCoords = selectedRoute.coordinates?.[selectedRoute.coordinates.length - 1];
      
      if (startCoords) {
        markers.push({
          lat: startCoords[1],
          lng: startCoords[0],
          color: '#10B981', // Green
          popup: `<strong>Start:</strong> ${selectedRoute.startLocation}`
        });
      }
      
      if (endCoords) {
        markers.push({
          lat: endCoords[1],
          lng: endCoords[0],
          color: '#EF4444', // Red
          popup: `<strong>Destination:</strong> ${selectedRoute.endLocation}`
        });
      }
      
      return markers;
    }
    
    // Regular markers when not navigating
    if (activeLayers.crime && mapData.crimeHotspots) {
      markers.push(...mapData.crimeHotspots.map((spot) => ({
        ...spot,
        color: '#EF4444',
        popup: `<strong>Crime Hotspot</strong><br/>${spot.description}`
      })));
    }
    
    if (activeLayers.lighting && mapData.poorLighting) {
      markers.push(...mapData.poorLighting.map((spot) => ({
        ...spot,
        color: '#F59E0B',
        popup: `<strong>Poor Lighting</strong><br/>${spot.description}`
      })));
    }
    
    if (activeLayers.reports && mapData.communityReports) {
      markers.push(...mapData.communityReports.map((report) => ({
        ...report,
        color: '#8B5CF6',
        popup: `<strong>${report.type || 'Community Report'}</strong><br/>${report.description}`
      })));
    }
    
    return markers;
  };

  // Convert coordinates format for Leaflet
  const convertCoordinates = (coords: Array<[number, number]> | undefined) => {
    if (!coords || !Array.isArray(coords)) {
      // Return a default coordinate if coords is undefined
      return [[28.6139, 77.2090]]; // Default to Delhi center
    }
    
    // For debugging
    console.log("Original coordinates:", coords);
    const converted = coords.map(([lng, lat]) => [lat, lng]);
    console.log("Converted coordinates:", converted);
    return converted;
  };

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8 gradient-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-white mb-4">Live Safety Map</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Explore real-time safety data across major Indian cities visualized on our interactive map.</p>
        </div>
        
        <div className="mb-6 glass p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-dark-200 text-white border border-gray-700 rounded-lg px-4 py-2"
            >
              {indianCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toggleLayer('crime')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 ${
                activeLayers.crime ? 'bg-red-500/20 text-red-500' : 'bg-dark-100 text-gray-400'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              Crime Hotspots
            </button>
            
            <button
              onClick={() => toggleLayer('lighting')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 ${
                activeLayers.lighting ? 'bg-amber-500/20 text-amber-500' : 'bg-dark-100 text-gray-400'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              Poor Lighting
            </button>
            
            <button
              onClick={() => toggleLayer('reports')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 ${
                activeLayers.reports ? 'bg-purple-500/20 text-purple-500' : 'bg-dark-100 text-gray-400'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              Community Reports
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className={`${navigationActive ? 'xl:col-span-3' : 'xl:col-span-2'} glass rounded-xl border border-gray-700 overflow-hidden`}>
            {isLoading ? (
              <div className="h-[600px] flex items-center justify-center">
                <div className="glass p-4 rounded-lg flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  <span className="text-white">Loading map data...</span>
                </div>
              </div>
            ) : (
              <div className="relative h-[600px]">
                <MapContainer 
                  center={[mapData?.cityCenter?.lat || 28.6139, mapData?.cityCenter?.lng || 77.2090]} 
                  zoom={12} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Render markers */}
                  {getMarkers().map((marker, index) => {
                    let markerIcon = DefaultIcon;
                    
                    // Determine which icon to use based on color
                    if (marker.color?.includes('#EF4444') || marker.color?.includes('red')) {
                      markerIcon = RedIcon;
                    } else if (marker.color?.includes('#F59E0B') || marker.color?.includes('amber') || marker.color?.includes('yellow')) {
                      markerIcon = YellowIcon;
                    } else if (marker.color?.includes('#8B5CF6') || marker.color?.includes('purple') || marker.color?.includes('violet')) {
                      markerIcon = VioletIcon;
                    } else if (marker.color?.includes('#10B981') || marker.color?.includes('green')) {
                      markerIcon = GreenIcon;
                    }
                    
                    return (
                      <Marker 
                        key={`marker-${index}`}
                        position={[marker.lat, marker.lng]}
                        icon={markerIcon}
                      >
                        {marker.popup && (
                          <Popup>
                            <div dangerouslySetInnerHTML={{ __html: marker.popup }} />
                          </Popup>
                        )}
                      </Marker>
                    );
                  })}
                  
                  {/* Render selected route if in navigation mode */}
                  {navigationActive && selectedRoute && (
                    <Polyline 
                      key="selected-route"
                      positions={convertCoordinates(selectedRoute.coordinates) as any}
                      pathOptions={{ 
                        color: selectedRoute.color, 
                        weight: selectedRoute.width + 2, // Make it slightly wider for emphasis 
                        opacity: 0.9,
                        dashArray: selectedRoute.type === "Regular Route" ? '5, 5' : undefined
                      }}
                    />
                  )}
                  
                  {/* Render default routes when not navigating */}
                  {!navigationActive && mapData?.safeRoutes?.map((route, index) => (
                    <Polyline 
                      key={`route-${index}`}
                      positions={convertCoordinates(route.coordinates) as any}
                      pathOptions={{ 
                        color: route.color, 
                        weight: route.width, 
                        opacity: 0.8,
                        dashArray: route.color.includes('green') ? undefined : '5, 5'
                      }} 
                    />
                  ))}
                </MapContainer>
                
                {/* Active navigation panel */}
                {navigationActive && selectedRoute && (
                  <div className="absolute top-4 left-4 right-4 glass rounded-lg p-4 z-[1000] border border-primary">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${selectedRoute.type === "Safest Route" ? "bg-green-500/20" : "bg-red-500/20"} mr-3`}>
                          <i className={`fas fa-${selectedRoute.type === "Safest Route" ? "shield-alt" : "exclamation-triangle"} text-${selectedRoute.type === "Safest Route" ? "green" : "red"}-500`}></i>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{selectedRoute.type} Navigation</h3>
                          <p className="text-gray-400 text-xs">
                            {selectedRoute.startLocation} → {selectedRoute.endLocation}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedRoute.safetyScore >= 80 ? "bg-green-500/20 text-green-500" : 
                        selectedRoute.safetyScore >= 60 ? "bg-yellow-500/20 text-yellow-500" : 
                        "bg-red-500/20 text-red-500"
                      }`}>
                        {selectedRoute.safetyScore}% Safe
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-white mb-2">
                      <div className="flex items-center">
                        <i className="fas fa-road mr-1 text-gray-400"></i> {selectedRoute.distance}
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-1 text-gray-400"></i> {selectedRoute.time}
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-lightbulb mr-1 text-gray-400"></i> {selectedRoute.lighting}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Map overlay elements - only show when not navigating */}
                {!navigationActive && (
                  <div className="absolute bottom-4 left-4 glass rounded-lg p-3 z-[1000]">
                    <div className="text-white text-sm font-medium mb-2">Safety Level</div>
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-white text-xs">High Safety</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-white text-xs">Moderate Safety</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-white text-xs">Low Safety</span>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 right-4 glass rounded-lg p-2 z-[1000]">
                  <span className="text-white text-xs">© SafeRoute Maps | Data © {new Date().getFullYear()}</span>
                </div>
              </div>
            )}
          </div>
          
          {navigationActive && selectedRoute ? (
            <div className="glass p-5 rounded-xl border border-primary">
              <NavigationDirections 
                directions={directions}
                routeType={selectedRoute.type}
                safetyScore={selectedRoute.safetyScore}
              />
            </div>
          ) : (
            <div className="glass p-5 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold font-heading text-white mb-4">Safety Insights</h2>
              <div className="mb-5">
                <div className="text-gray-400 text-sm mb-1">Safety Score</div>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-primary mr-2">76%</div>
                  <div className="text-green-500 text-sm flex items-center">
                    <span className="mr-1">+2%</span>
                    <span>↑</span>
                  </div>
                </div>
                <div className="h-2 bg-dark-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
            
            <div className="mb-6">
              <div className="text-gray-400 text-sm mb-3">Safety Breakdown</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Crime Rate</span>
                    <span className="text-white">Low</span>
                  </div>
                  <div className="h-1.5 bg-dark-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Street Lighting</span>
                    <span className="text-white">Good</span>
                  </div>
                  <div className="h-1.5 bg-dark-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Crowd Density</span>
                    <span className="text-white">Moderate</span>
                  </div>
                  <div className="h-1.5 bg-dark-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Emergency Services</span>
                    <span className="text-white">High</span>
                  </div>
                  <div className="h-1.5 bg-dark-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-gray-400 text-sm mb-3">Recent Community Alerts</div>
              <div className="space-y-3">
                <div className="bg-dark-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-red-500/20 text-red-500 p-1 rounded mr-2">
                        <span>⚠️</span>
                      </div>
                      <span className="text-white text-sm font-medium">Road Blockade</span>
                    </div>
                    <span className="text-gray-400 text-xs">10 min ago</span>
                  </div>
                  <p className="text-gray-300 text-sm">Construction blocking main road near Central Market. Use alternate routes.</p>
                </div>
                
                <div className="bg-dark-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-amber-500/20 text-amber-500 p-1 rounded mr-2">
                        <span>⚠️</span>
                      </div>
                      <span className="text-white text-sm font-medium">Poor Lighting</span>
                    </div>
                    <span className="text-gray-400 text-xs">1 hr ago</span>
                  </div>
                  <p className="text-gray-300 text-sm">Street lights not working on Avenue Road. Area is dark at night.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;