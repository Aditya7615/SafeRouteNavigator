import { useState } from "react";
import RouteForm from "./RouteForm";
import delhiNightMap from "../assets/delhi-night-map.svg";

const Hero = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFindSafeRoute = (startLocation: string, endLocation: string) => {
    setIsLoading(true);
    // Set a brief loading state to show the loading indicator
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    // The redirection will be handled by the RouteForm component
  };

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 gradient-bg relative overflow-hidden fade-in">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 opacity-20"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-4">
              Navigate <span className="text-primary">Safely</span> Through Indian Cities
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              AI-powered real-time routing that prioritizes your safety using crime data, lighting conditions, and community insights.
            </p>
            
            <RouteForm onSubmit={handleFindSafeRoute} isLoading={isLoading} redirectToMap={true} />
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="rounded-xl overflow-hidden shadow-2xl relative h-80 md:h-96 transition-all duration-500 hover:shadow-primary/20">
              <img 
                src={delhiNightMap} 
                alt="Delhi city map at night" 
                className="w-full h-full object-cover bg-dark-100" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass p-3 rounded-lg">
                  <span className="text-white font-medium flex items-center">
                    <div className="safety-indicator pulse bg-accent"></div>
                    Safe Route Active for Delhi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
