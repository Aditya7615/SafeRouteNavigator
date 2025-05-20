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

let DefaultIcon = L.Icon.Default.prototype;
DefaultIcon.options.iconUrl = icon;
DefaultIcon.options.shadowUrl = iconShadow;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: iconShadow
});

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

// Turn direction interface
interface TurnDirection {
  instruction: string;
  distance: string;
  time: string;
  streetName: string;
  safetyNote?: string;
}

const GoogleMapsStyle = () => {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState("Delhi NCR");
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [navigationActive, setNavigationActive] = useState(false);
  const [directions, setDirections] = useState<TurnDirection[]>([]);
  const [activeLayers, setActiveLayers] = useState({
    crime: true,
    lighting: true,
    crowd: true,
    reports: true
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate directions based on the route
  const generateDirections = (route: RouteOption): TurnDirection[] => {
    if (!route || !route.coordinates || route.coordinates.length < 2) {
      return [];
    }
    
    // Generate turn by turn directions based on the coordinates
    const directions: TurnDirection[] = [];
    
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
        if (i % 3 === 0) { // Only add significant turns for readability
          // Alternate between left and right turns for demo purposes
          const turnDirection = i % 2 === 0 ? "Turn right" : "Turn left";
          const segment: TurnDirection = {
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
      setStartLocation(start);
      setEndLocation(end);
      handleRouteSearch(start, end);
    }
  }, []);

  // Update page title and meta description
  useEffect(() => {
    document.title = "Live Safety Map - SafeRoute";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Explore real-time safety data across major Indian cities visualized on our interactive map.");
    }
  }, []);

  const { data: mapData, error: mapError } = useQuery<MapData>({
    queryKey: ['/api/map-data', selectedCity],
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    if (mapError) {
      toast({
        title: "Error loading map data",
        description: "Unable to fetch safety data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [mapError, toast]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Compile markers based on active layers
  const getMarkers = () => {
    if (!mapData) return [];
    
    let markers: MarkerData[] = [];
    
    if (navigationActive && selectedRoute) {
      // Add start and end markers for navigation
      const startCoords = selectedRoute.coordinates[0];
      const endCoords = selectedRoute.coordinates[selectedRoute.coordinates.length - 1];
      
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
  
  // Get random coordinate variations based on a starting point
  const getRandomRouteVariations = (baseLat: number, baseLng: number, destinationLat: number, destinationLng: number) => {
    // Create different route variations between the two points
    
    // Calculate midpoints with variations
    const midLat1 = baseLat + (destinationLat - baseLat) * 0.3 + (Math.random() * 0.01);
    const midLng1 = baseLng + (destinationLng - baseLng) * 0.3 + (Math.random() * 0.01);
    
    const midLat2 = baseLat + (destinationLat - baseLat) * 0.5 + (Math.random() * 0.015);
    const midLng2 = baseLng + (destinationLng - baseLng) * 0.5 - (Math.random() * 0.01);
    
    const midLat3 = baseLat + (destinationLat - baseLat) * 0.7 - (Math.random() * 0.012);
    const midLng3 = baseLng + (destinationLng - baseLng) * 0.7 + (Math.random() * 0.008);
    
    // Create three different route variations
    const mainRoute = [
      [baseLng, baseLat],
      [baseLng + (destinationLng - baseLng) * 0.25, baseLat + (destinationLat - baseLat) * 0.25],
      [midLng1, midLat1],
      [midLng2, midLat2],
      [midLng3, midLat3],
      [destinationLng, destinationLat]
    ];
    
    const alternateRoute = [
      [baseLng, baseLat],
      [baseLng - 0.01, baseLat + 0.01],
      [baseLng - 0.005, baseLat + (destinationLat - baseLat) * 0.4],
      [baseLng + (destinationLng - baseLng) * 0.6, baseLat + (destinationLat - baseLat) * 0.6],
      [destinationLng, destinationLat]
    ];
    
    const shortestRoute = [
      [baseLng, baseLat],
      [baseLng + (destinationLng - baseLng) * 0.3, baseLat + (destinationLat - baseLat) * 0.3],
      [baseLng + (destinationLng - baseLng) * 0.6, baseLat + (destinationLat - baseLat) * 0.6],
      [destinationLng, destinationLat]
    ];
    
    return {
      mainRoute,
      alternateRoute,
      shortestRoute
    };
  };
  
  // Calculate distance and time based on coordinates
  const calculateDistanceAndTime = (coordinates: Array<[number, number]>) => {
    let totalDistance = 0;
    
    // Calculate rough distance along the route
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lng1, lat1] = coordinates[i];
      const [lng2, lat2] = coordinates[i + 1];
      
      // Simple Haversine distance calculation
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const distance = R * c; // Distance in km
      
      totalDistance += distance;
    }
    
    // Format distance and calculate approximate time (assuming 20 km/h average speed)
    const formattedDistance = `${totalDistance.toFixed(1)} km`;
    const timeInMinutes = Math.round(totalDistance / 20 * 60); // Time in minutes
    const formattedTime = `${timeInMinutes} min`;
    
    return { distance: formattedDistance, time: formattedTime };
  };

  // Handle route search submission
  const handleRouteSearch = async (start: string, end: string) => {
    setIsLoading(true);
    
    try {
      // Generate different coordinates based on location names
      // In a real app, you would use geocoding API to get real coordinates
      // For demo, use a simple hash function to get consistent random coordinates
      
      // Generate hash values from the location names for consistency
      const startHash = start.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const endHash = end.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Base coordinates for Delhi (Center: 28.6139, 77.2090)
      const baseLat = 28.6139 + (startHash % 10) * 0.001;
      const baseLng = 77.2090 + (startHash % 15) * 0.001;
      
      // Destination coordinates with some variation based on end location
      const destLat = 28.6139 + (endHash % 20) * 0.002;
      const destLng = 77.2090 + (endHash % 25) * 0.002;
      
      // Get route variations between these points
      const { mainRoute, alternateRoute, shortestRoute } = getRandomRouteVariations(baseLat, baseLng, destLat, destLng);
      
      // Calculate distances and times
      const mainRouteMetrics = calculateDistanceAndTime(mainRoute);
      const alternateRouteMetrics = calculateDistanceAndTime(alternateRoute);
      const shortestRouteMetrics = calculateDistanceAndTime(shortestRoute);
      
      // Create route options
      const mockRouteOptions: RouteOption[] = [
        {
          id: "safest-route",
          type: "Safest Route",
          startLocation: start,
          endLocation: end,
          coordinates: mainRoute,
          distance: mainRouteMetrics.distance,
          time: mainRouteMetrics.time,
          safetyScore: 92,
          lighting: "Excellent",
          color: "#3875f6", // Google maps blue
          width: 5,
          safetyFactors: ["Well-lit streets", "High police presence", "Busy commercial area"],
          safetyIssues: [],
          isRecommended: true
        },
        {
          id: "alternate-route",
          type: "Alternate Route",
          startLocation: start,
          endLocation: end,
          coordinates: alternateRoute,
          distance: alternateRouteMetrics.distance,
          time: alternateRouteMetrics.time,
          safetyScore: 75,
          lighting: "Good",
          color: "#777777", // Gray for alternate
          width: 4,
          safetyFactors: ["CCTV cameras", "Moderate traffic"],
          safetyIssues: ["Isolated areas", "Poor lighting in some sections"],
          isRecommended: false
        },
        {
          id: "shortest-route",
          type: "Shortest Route",
          startLocation: start,
          endLocation: end,
          coordinates: shortestRoute,
          distance: shortestRouteMetrics.distance,
          time: shortestRouteMetrics.time,
          safetyScore: 64,
          lighting: "Fair",
          color: "#777777", // Gray for alternate
          width: 4,
          safetyFactors: ["Shortest distance"],
          safetyIssues: ["Poor lighting", "Crime incidents reported recently", "Isolated areas"],
          isRecommended: false
        }
      ];
      
      setRouteOptions(mockRouteOptions);
      setShowRouteOptions(true);
      
      // Set recommended route as selected by default
      const recommended = mockRouteOptions.find(r => r.isRecommended);
      if (recommended) {
        setSelectedRoute(recommended);
      }
      
    } catch (error) {
      console.error("Error fetching route options:", error);
      toast({
        title: "Error fetching routes",
        description: "Unable to fetch route options. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start navigation with selected route
  const startNavigation = (route: RouteOption) => {
    setSelectedRoute(route);
    setNavigationActive(true);
    
    // Generate directions
    const directionsList = generateDirections(route);
    setDirections(directionsList);
    
    // Store route data for session persistence
    sessionStorage.setItem('selectedRoute', JSON.stringify(route));
    
    // Show success toast
    toast({
      title: "Navigation Started",
      description: `Following ${route.type} from ${route.startLocation} to ${route.endLocation}`,
    });
    
    // Update URL for sharing
    window.history.pushState(
      {}, 
      '', 
      `?route=${encodeURIComponent(route.type)}&start=${encodeURIComponent(route.startLocation)}&end=${encodeURIComponent(route.endLocation)}`
    );
  };
  
  // End navigation
  const endNavigation = () => {
    setNavigationActive(false);
    setSelectedRoute(null);
    setDirections([]);
    sessionStorage.removeItem('selectedRoute');
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8 gradient-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-white mb-4">Live Safety Map</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Explore real-time safety data across major Indian cities visualized on our interactive map.</p>
        </div>
        
        {/* Route planner at the top of the page */}
        <div className="mb-6 glass rounded-xl border border-gray-700 p-4">
          <h2 className="text-xl font-bold font-heading text-white mb-4">Plan Your Route</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <RouteForm 
                onSubmit={(start, end) => {
                  setStartLocation(start);
                  setEndLocation(end);
                  handleRouteSearch(start, end);
                }}
                isLoading={isLoading} 
              />
            </div>
            <div className="flex items-center">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-dark-200 text-black border border-gray-700 rounded-lg px-4 py-2"
              >
                {indianCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Map layers control */}
        {!navigationActive && (
          <div className="mb-6 glass p-4 rounded-lg flex flex-wrap gap-3 justify-center md:justify-start">
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
        )}
        
        {/* Route comparison cards - Google Maps style */}
        {showRouteOptions && routeOptions.length > 0 && !navigationActive && (
          <div className="mb-6">
            <h2 className="text-xl font-bold font-heading text-white mb-4">Route Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {routeOptions.map((route) => (
                <div 
                  key={route.id} 
                  className={`glass rounded-xl p-4 border ${
                    selectedRoute?.id === route.id 
                      ? 'border-primary' 
                      : 'border-gray-700 hover:border-gray-500'
                  } cursor-pointer transition-all`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div 
                        className={`w-3 h-3 rounded-full mr-2`} 
                        style={{backgroundColor: route.color}}
                      ></div>
                      <span className="text-white font-medium">{route.type}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      route.safetyScore >= 80 ? "bg-green-500/20 text-green-500" : 
                      route.safetyScore >= 60 ? "bg-yellow-500/20 text-yellow-500" : 
                      "bg-red-500/20 text-red-500"
                    }`}>
                      {route.safetyScore}% Safe
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-white mb-3">
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-1">Distance:</span> {route.distance}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-1">Time:</span> {route.time}
                    </div>
                  </div>
                  
                  {route.safetyFactors && route.safetyFactors.length > 0 && (
                    <div className="mb-2">
                      <span className="text-green-400 text-xs">Safety factors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {route.safetyFactors.map((factor, idx) => (
                          <span key={idx} className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {route.safetyIssues && route.safetyIssues.length > 0 && (
                    <div className="mb-2">
                      <span className="text-red-400 text-xs">Safety concerns:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {route.safetyIssues.map((issue, idx) => (
                          <span key={idx} className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded">
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      startNavigation(route);
                    }}
                    className="w-full mt-3"
                    variant={route.isRecommended ? "default" : "outline"}
                  >
                    {route.isRecommended ? "Navigate this route (Recommended)" : "Navigate this route"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Main map display */}
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
                  {getMarkers().map((marker, index) => (
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
                  
                  {/* Render routes from route comparison */}
                  {showRouteOptions && routeOptions.length > 0 && (
                    <>
                      {routeOptions.map((route, index) => (
                        <Polyline 
                          key={`route-${index}`}
                          positions={convertCoordinates(route.coordinates) as L.LatLngExpression[]}
                          pathOptions={{ 
                            color: route.color, 
                            weight: selectedRoute?.id === route.id ? route.width + 2 : route.width, 
                            opacity: selectedRoute?.id === route.id ? 0.9 : 0.7
                          }} 
                        />
                      ))}
                    </>
                  )}
                  
                  {/* Render selected route if in navigation mode */}
                  {navigationActive && selectedRoute && (
                    <Polyline 
                      key="selected-route"
                      positions={convertCoordinates(selectedRoute.coordinates) as L.LatLngExpression[]}
                      pathOptions={{ 
                        color: selectedRoute.color, 
                        weight: selectedRoute.width + 2, 
                        opacity: 0.9
                      }}
                    />
                  )}
                  
                  {/* Render default routes when no specific routes */}
                  {!showRouteOptions && !navigationActive && mapData?.safeRoutes?.map((route, index) => (
                    <Polyline 
                      key={`default-route-${index}`}
                      positions={convertCoordinates(route.coordinates) as L.LatLngExpression[]}
                      pathOptions={{ 
                        color: route.color, 
                        weight: route.width, 
                        opacity: 0.8
                      }} 
                    />
                  ))}
                </MapContainer>
                
                {/* Active navigation panel - Google Maps style */}
                {navigationActive && selectedRoute && (
                  <div className="absolute top-4 left-4 right-4 glass rounded-lg p-4 z-[1000] border border-primary">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${selectedRoute.safetyScore >= 80 ? "bg-green-500/20" : "bg-yellow-500/20"} mr-3`}>
                          <span className="text-white">🧭</span>
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
                        <span className="text-gray-400 mr-1">Distance:</span> {selectedRoute.distance}
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-1">Time:</span> {selectedRoute.time}
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-1">Lighting:</span> {selectedRoute.lighting}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={endNavigation}
                      className="mt-1"
                    >
                      End Navigation
                    </Button>
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
              <TurnByTurnDirections 
                directions={directions}
                routeType={selectedRoute.type}
                safetyScore={selectedRoute.safetyScore}
              />
            </div>
          ) : (
            !navigationActive && !showRouteOptions && (
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsStyle;