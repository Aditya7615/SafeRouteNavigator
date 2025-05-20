import React from 'react';

interface TurnDirection {
  instruction: string;
  distance: string;
  time: string;
  streetName: string;
  safetyNote?: string;
}

interface NavigationDirectionsProps {
  directions: TurnDirection[];
  routeType: string;
  safetyScore: number;
}

const NavigationDirections: React.FC<NavigationDirectionsProps> = ({ 
  directions,
  routeType,
  safetyScore
}) => {
  // Determine the safety color class
  const getSafetyColorClass = () => {
    if (safetyScore >= 80) return "text-green-500";
    if (safetyScore >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getIconForInstruction = (instruction: string) => {
    switch(true) {
      case instruction.includes('Turn right'):
        return 'arrow-right';
      case instruction.includes('Turn left'):
        return 'arrow-left';
      case instruction.includes('Continue'):
        return 'arrow-up';
      case instruction.includes('U-turn'):
        return 'arrow-u-down';
      case instruction.includes('Arrive'):
        return 'map-marker-alt';
      case instruction.includes('Start'):
        return 'map-pin';
      default:
        return 'arrow-up';
    }
  };

  return (
    <div className="turn-by-turn-directions">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-medium">Turn-by-Turn Directions</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          safetyScore >= 80 ? "bg-green-500/20 text-green-500" : 
          safetyScore >= 60 ? "bg-yellow-500/20 text-yellow-500" : 
          "bg-red-500/20 text-red-500"
        }`}>
          {safetyScore}% Safe
        </div>
      </div>

      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {directions.map((direction, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg border ${index === 0 ? 'border-primary' : 'border-gray-700'} bg-dark-100`}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-full ${index === 0 ? 'bg-primary/20 text-primary' : 'bg-gray-800'} mr-3`}>
                <i className={`fas fa-${getIconForInstruction(direction.instruction)}`}></i>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{direction.instruction}</div>
                <div className="text-gray-400 text-sm">{direction.streetName}</div>
                
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{direction.distance}</span>
                  <span>{direction.time}</span>
                </div>
                
                {direction.safetyNote && (
                  <div className={`mt-2 text-xs ${getSafetyColorClass()} bg-gray-800 p-2 rounded`}>
                    <i className="fas fa-info-circle mr-1"></i>
                    {direction.safetyNote}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationDirections;