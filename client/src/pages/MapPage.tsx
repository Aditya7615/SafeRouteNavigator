import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { indianCities } from '@/lib/cities';
import { useToast } from '@/hooks/use-toast';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const MapPage = () => {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState("Delhi NCR");
  const [activeLayers, setActiveLayers] = useState({
    crime: true,
    lighting: true,
    crowd: true,
    reports: true
  });

  // Update page title and meta description
  useEffect(() => {
    document.title = "Live Safety Map - SafeRoute";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Explore real-time safety data across major Indian cities visualized on our interactive map.");
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
  const convertCoordinates = (coords: Array<[number, number]>) => {
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
          <div className="xl:col-span-2 glass rounded-xl border border-gray-700 overflow-hidden">
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
                  
                  {/* Render routes */}
                  {mapData?.safeRoutes?.map((route, index) => (
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
                
                {/* Map overlay elements */}
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
                
                <div className="absolute bottom-4 right-4 glass rounded-lg p-2 z-[1000]">
                  <span className="text-white text-xs">© SafeRoute Maps | Data © {new Date().getFullYear()}</span>
                </div>
              </div>
            )}
          </div>
          
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