import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RouteComparisonCard from "./RouteComparisonCard";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const RouteComparison = () => {
  const { toast } = useToast();
  const [animatingRouteIndex, setAnimatingRouteIndex] = useState<number | null>(null);
  const [_, setLocation] = useLocation();
  const [startLocation, setStartLocation] = useState("Connaught Place, Delhi");
  const [endLocation, setEndLocation] = useState("India Gate, Delhi");

  // Pass the locations as parameters to get meaningful distances
  const { data: routes, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/routes/compare', startLocation, endLocation],
    queryFn: async () => {
      const response = await fetch(`/api/routes/compare?start=${encodeURIComponent(startLocation)}&end=${encodeURIComponent(endLocation)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching routes",
        description: "Unable to load route comparison data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleNavigate = (routeType: string, index: number) => {
    setAnimatingRouteIndex(index);
    
    setTimeout(() => {
      setAnimatingRouteIndex(null);
      
      // Store the selected route info in sessionStorage
      if (routes && routes[index]) {
        // Make sure we have coordinates data
        const routeToStore = {
          ...routes[index],
          startLocation,
          endLocation
        };
        
        // Default coordinates if missing, in format expected by Leaflet
        if (!routeToStore.coordinates || !Array.isArray(routeToStore.coordinates)) {
          routeToStore.coordinates = [
            [77.2090, 28.6139], // From (Delhi center)
            [77.2300, 28.6500]  // To (some other location)
          ];
        }
        
        sessionStorage.setItem('selectedRoute', JSON.stringify(routeToStore));
      }
      
      toast({
        title: `${routeType} selected`,
        description: `Navigation started for the ${routeType.toLowerCase()} route.`,
      });
      
      // Navigate to the map page with query params
      setLocation(`/map?route=${encodeURIComponent(routeType)}&start=${encodeURIComponent(startLocation)}&end=${encodeURIComponent(endLocation)}`);
    }, 1500);
  };

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 gradient-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-white mb-4">Route Comparison</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">See how SafeRoute determines the safest path from multiple available options.</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {routes?.map((route: any, index: number) => (
              <RouteComparisonCard
                key={index}
                routeType={route.type}
                safetyScore={route.safetyScore}
                distance={route.distance}
                time={route.time}
                lighting={route.lighting}
                safetyFactors={route.safetyFactors}
                safetyIssues={route.safetyIssues}
                isRecommended={route.isRecommended}
                imageSrc={route.imageSrc}
                isAnimating={animatingRouteIndex === index}
                onNavigate={() => handleNavigate(route.type, index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RouteComparison;