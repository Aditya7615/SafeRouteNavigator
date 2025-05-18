import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { indianCities } from "@/lib/cities";

interface SafetyMapProps {
  className?: string;
}

const SafetyMap = ({ className = "" }: SafetyMapProps) => {
  const [selectedCity, setSelectedCity] = useState("Delhi NCR");
  const [layers, setLayers] = useState({
    crime: true,
    lighting: true,
    crowd: true,
    reports: true
  });

  const { data: safetyData, isLoading } = useQuery({
    queryKey: ['/api/safety-data', selectedCity],
    staleTime: 60000, // 1 minute
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <section id="safety-map" className={`py-16 px-4 sm:px-6 lg:px-8 gradient-bg ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-white mb-4">Live Safety Map</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Explore real-time safety data across major Indian cities visualized on our interactive map.</p>
        </div>
        
        <div className="map-container rounded-xl overflow-hidden glass border border-gray-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')" }}>
          <div className="absolute inset-0 bg-dark-300 bg-opacity-60"></div>
          
          {/* Map controls overlay */}
          <div className="absolute top-4 left-4 glass rounded-lg p-3 flex flex-col space-y-3 z-10">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="crime-layer" 
                className="mr-2 accent-primary" 
                checked={layers.crime}
                onChange={() => toggleLayer('crime')}
              />
              <label htmlFor="crime-layer" className="text-white text-sm">Crime Hotspots</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="lighting-layer" 
                className="mr-2 accent-primary" 
                checked={layers.lighting}
                onChange={() => toggleLayer('lighting')}
              />
              <label htmlFor="lighting-layer" className="text-white text-sm">Street Lighting</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="crowd-layer" 
                className="mr-2 accent-primary" 
                checked={layers.crowd}
                onChange={() => toggleLayer('crowd')}
              />
              <label htmlFor="crowd-layer" className="text-white text-sm">Crowd Density</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="reports-layer" 
                className="mr-2 accent-primary" 
                checked={layers.reports}
                onChange={() => toggleLayer('reports')}
              />
              <label htmlFor="reports-layer" className="text-white text-sm">Community Reports</label>
            </div>
          </div>
          
          {/* City selector */}
          <div className="absolute top-4 right-4 glass rounded-lg p-3 z-10">
            <select 
              className="bg-dark-200 text-white border border-gray-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {indianCities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          {/* Safety Legend */}
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
          
          {/* Map attribution */}
          <div className="absolute bottom-4 right-4 glass rounded-lg p-2 z-10">
            <span className="text-white text-xs">© SafeRoute Maps | Data © 2023</span>
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="glass p-4 rounded-lg flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                <span className="text-white">Loading safety data...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SafetyMap;
