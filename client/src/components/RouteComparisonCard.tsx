import { useState } from "react";

interface RouteComparisonCardProps {
  routeType: string;
  safetyScore: number;
  distance: string;
  time: string;
  lighting: string;
  safetyFactors?: string[];
  safetyIssues?: string[];
  isRecommended: boolean;
  imageSrc: string;
  isAnimating?: boolean;
  onNavigate: () => void;
}

const RouteComparisonCard = ({
  routeType,
  safetyScore,
  distance,
  time,
  lighting,
  safetyFactors = [],
  safetyIssues = [],
  isRecommended,
  imageSrc,
  isAnimating = false,
  onNavigate
}: RouteComparisonCardProps) => {
  const [hovered, setHovered] = useState(false);
  const isSafe = routeType === "Safest Route";

  const headerClass = isSafe ? "gradient-purple" : "gradient-bg";
  const borderClass = isSafe ? "border-primary" : "border-gray-700";
  const routeColor = isSafe ? "bg-accent" : "bg-destructive";
  
  const scoreColorClass = () => {
    if (safetyScore >= 80) return "text-primary";
    if (safetyScore >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  return (
    <div 
      className={`route-card glass rounded-xl overflow-hidden border ${borderClass} ${hovered ? 'shadow-lg' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`p-4 ${headerClass} flex items-center justify-between`}>
        <div className="flex items-center">
          <div className="rounded-full bg-white p-2 mr-3">
            <i className={`fas fa-${isSafe ? 'shield-alt' : 'route'} ${isSafe ? 'text-primary' : 'text-gray-700'}`}></i>
          </div>
          <h3 className="text-white font-heading font-bold">{routeType}</h3>
        </div>
        <div className={`bg-white font-bold px-3 py-1 rounded-full text-sm ${scoreColorClass()}`}>
          {safetyScore}% Safe
        </div>
      </div>
      
      {/* Route map image */}
      <div className="relative h-48">
        <img src={imageSrc} alt={`${routeType} map visualization`} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)" }}></div>
        
        {/* Route path overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${isSafe ? 'w-3/4' : 'w-2/3'} h-1 ${routeColor}`}></div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-gray-400 text-sm">Distance</div>
            <div className="text-white font-medium">{distance}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Time</div>
            <div className="text-white font-medium">{time}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Lighting</div>
            <div className="text-white font-medium">{lighting}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-gray-400 text-sm mb-1">
            {isSafe ? "Safety Factors" : "Safety Concerns"}
          </div>
          <div className="flex flex-wrap gap-2">
            {isSafe ? (
              safetyFactors.map((factor, idx) => (
                <span key={idx} className="bg-accent/20 text-accent text-xs px-2.5 py-1 rounded-full">
                  {factor}
                </span>
              ))
            ) : (
              safetyIssues.map((issue, idx) => (
                <span key={idx} className="bg-destructive/20 text-destructive text-xs px-2.5 py-1 rounded-full">
                  {issue}
                </span>
              ))
            )}
          </div>
        </div>
        
        <button 
          className={`${
            isSafe 
              ? "gradient-purple" 
              : "bg-dark-100 hover:bg-dark-200 border border-gray-700"
          } rounded-lg py-2 px-4 w-full text-white font-medium transition hover:shadow-lg flex items-center justify-center space-x-2`}
          onClick={onNavigate}
          disabled={isAnimating}
        >
          {isAnimating ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>Starting Navigation...</span>
            </>
          ) : (
            <>
              <i className={`fas fa-${isSafe ? 'walking' : 'exclamation-triangle'} ${!isSafe && 'text-destructive'}`}></i>
              <span>{isSafe ? "Navigate This Route" : "Not Recommended"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RouteComparisonCard;
