import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AlertCard from "./AlertCard";

const CommunityReports = () => {
  const [viewAll, setViewAll] = useState(false);

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    staleTime: 30000, // 30 seconds
  });

  const displayAlerts = viewAll ? alerts : (alerts?.slice(0, 3) || []);

  const handleViewAll = () => {
    setViewAll((prev) => !prev);
  };

  return (
    <section id="community" className="py-16 px-4 sm:px-6 lg:px-8 gradient-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading text-white mb-4">Community Reports & Alerts</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Stay informed with real-time safety alerts and community reports from users like you.</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayAlerts.map((alert: any, index: number) => (
                <AlertCard 
                  key={index}
                  type={alert.type}
                  time={alert.time}
                  description={alert.description}
                  reporter={alert.reporter}
                  confirms={alert.confirms}
                />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <button 
                onClick={handleViewAll}
                className="glass border border-primary rounded-lg px-6 py-3 text-primary hover:text-white hover:bg-primary transition-colors font-medium"
              >
                {viewAll ? "Show Less" : "View All Community Reports"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CommunityReports;
