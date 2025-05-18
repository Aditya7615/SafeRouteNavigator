import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { indianCities } from '@/lib/cities';
import { useToast } from '@/hooks/use-toast';
import MapDisplay from '@/components/MapDisplay';

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

  const { data: mapData, isLoading, error } = useQuery({
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
    
    let markers = [];
    
    if (activeLayers.crime && mapData.crimeHotspots) {
      markers.push(...mapData.crimeHotspots.map((spot: any) => ({
        lat: spot.lat,
        lng: spot.lng,
        color: '#EF4444',
        popup: `<strong>Crime Hotspot</strong><br/>${spot.description}`
      })));
    }
    
    if (activeLayers.lighting && mapData.poorLighting) {
      markers.push(...mapData.poorLighting.map((spot: any) => ({
        lat: spot.lat,
        lng: spot.lng,
        color: '#F59E0B',
        popup: `<strong>Poor Lighting</strong><br/>${spot.description}`
      })));
    }
    
    if (activeLayers.reports && mapData.communityReports) {
      markers.push(...mapData.communityReports.map((report: any) => ({
        lat: report.lat,
        lng: report.lng,
        color: '#8B5CF6',
        popup: `<strong>${report.type}</strong><br/>${report.description}`
      })));
    }
    
    return markers;
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
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="crime-layer-map" 
                className="mr-2 accent-primary" 
                checked={activeLayers.crime}
                onChange={() => toggleLayer('crime')}
              />
              <label htmlFor="crime-layer-map" className="text-white text-sm">Crime Hotspots</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="lighting-layer-map" 
                className="mr-2 accent-primary" 
                checked={activeLayers.lighting}
                onChange={() => toggleLayer('lighting')}
              />
              <label htmlFor="lighting-layer-map" className="text-white text-sm">Street Lighting</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="crowd-layer-map" 
                className="mr-2 accent-primary" 
                checked={activeLayers.crowd}
                onChange={() => toggleLayer('crowd')}
              />
              <label htmlFor="crowd-layer-map" className="text-white text-sm">Crowd Density</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="reports-layer-map" 
                className="mr-2 accent-primary" 
                checked={activeLayers.reports}
                onChange={() => toggleLayer('reports')}
              />
              <label htmlFor="reports-layer-map" className="text-white text-sm">Community Reports</label>
            </div>
          </div>
          
          <div>
            <select 
              className="bg-dark-200 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {indianCities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="glass rounded-xl overflow-hidden border border-gray-700 mb-8">
          {isLoading ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="glass p-4 rounded-lg flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                <span className="text-white">Loading map data...</span>
              </div>
            </div>
          ) : (
            <div className="relative h-[600px]">
              <MapDisplay 
                center={mapData?.cityCenter || { lat: 28.6139, lng: 77.2090 }}
                markers={getMarkers()}
                routes={mapData?.safeRoutes || []}
              />
              {/* Map overlay elements */}
              <div className="absolute bottom-4 left-4 glass rounded-lg p-3 z-10">
                <div className="text-white text-sm font-medium mb-2">Safety Level</div>
                <div className="flex items-center mb-1">
                  <div className="safety-indicator bg-green-500"></div>
                  <span className="text-white text-xs">High Safety</span>
                </div>
                <div className="flex items-center mb-1">
                  <div className="safety-indicator bg-yellow-500"></div>
                  <span className="text-white text-xs">Moderate Safety</span>
                </div>
                <div className="flex items-center">
                  <div className="safety-indicator bg-red-500"></div>
                  <span className="text-white text-xs">Low Safety</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 glass rounded-lg p-2 z-10">
                <span className="text-white text-xs">© SafeRoute Maps | Data © {new Date().getFullYear()}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="glass p-5 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Safety Tips for {selectedCity}</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Stay in well-lit areas, especially after dark</li>
            <li>Avoid known high-crime areas in the northeastern part of the city</li>
            <li>Be cautious in isolated areas with poor cellular connectivity</li>
            <li>Share your location with trusted contacts when traveling at night</li>
            <li>Use SafeRoute's real-time alerts to stay informed about protests or road blockades</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
