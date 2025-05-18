import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RouteFormProps {
  onSubmit: (startLocation: string, endLocation: string) => void;
  isLoading?: boolean;
}

const RouteForm = ({ onSubmit, isLoading = false }: RouteFormProps) => {
  const { toast } = useToast();
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startLocation.trim() || !endLocation.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both starting point and destination",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(startLocation, endLocation);
  };

  const popularIndianLocations = [
    "Connaught Place, Delhi",
    "India Gate, Delhi",
    "Juhu Beach, Mumbai",
    "MG Road, Bangalore",
    "Bandra, Mumbai",
    "Cyber City, Gurugram",
    "Salt Lake, Kolkata",
    "Hitech City, Hyderabad"
  ];

  return (
    <div className="glass rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-all duration-300">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Starting Point</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-circle text-accent text-sm"></i>
            </div>
            <input 
              type="text" 
              placeholder={popularIndianLocations[0]} 
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-primary focus:outline-none border border-gray-700"
              list="start-locations"
            />
            <datalist id="start-locations">
              {popularIndianLocations.map((location, index) => (
                <option key={`start-${index}`} value={location} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Destination</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-map-marker-alt text-destructive text-sm"></i>
            </div>
            <input 
              type="text" 
              placeholder={popularIndianLocations[1]} 
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-primary focus:outline-none border border-gray-700"
              list="end-locations"
            />
            <datalist id="end-locations">
              {popularIndianLocations.map((location, index) => (
                <option key={`end-${index}`} value={location} />
              ))}
            </datalist>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="gradient-purple rounded-lg py-3 px-5 w-full text-white font-medium transition hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                <span>Finding Routes...</span>
              </>
            ) : (
              <>
                <i className="fas fa-route"></i>
                <span>Find Safe Route</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RouteForm;
