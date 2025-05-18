import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RouteComparisonCard from "./RouteComparisonCard";
import { useToast } from "@/hooks/use-toast";

const RouteComparison = () => {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const { data: routes, isLoading, error } = useQuery({
    queryKey: ['/api/routes/compare'],
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

  const handleNavigate = (routeType: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      toast({
        title: `${routeType} selected`,
        description: `Navigation started for the ${routeType.toLowerCase()} route.`,
      });
    }, 1000);
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
                isAnimating={isAnimating}
                onNavigate={() => handleNavigate(route.type)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RouteComparison;
