// Mapbox routing API helper functions
// Import types for safety routes
interface SafeRouteOptions {
  alternatives?: boolean;
  geometries?: string;
  overview?: string;
  steps?: boolean;
}

// Function to get routes between two points using Mapbox Directions API
export async function getMapboxDirections(
  start: [number, number], 
  end: [number, number],
  accessToken: string,
  options?: SafeRouteOptions
): Promise<any> {
  // Default options for routing
  const defaultOptions = {
    alternatives: true, // Get alternative routes
    geometries: 'geojson',
    overview: 'full',
    steps: true,
    ...options
  };
  
  try {
    // Build Mapbox Directions API URL
    const startCoords = `${start[0]},${start[1]}`;
    const endCoords = `${end[0]},${end[1]}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${startCoords};${endCoords}?` + 
      new URLSearchParams({
        access_token: accessToken,
        alternatives: String(defaultOptions.alternatives),
        geometries: String(defaultOptions.geometries),
        overview: String(defaultOptions.overview),
        steps: String(defaultOptions.steps)
      });
    
    // Fetch directions from Mapbox API
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching directions: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting directions:", error);
    throw error;
  }
}

// Convert Mapbox route response to our app's route format
export function processMapboxRoute(routeData: any, safetyFactor: number = 1.0) {
  if (!routeData || !routeData.routes || routeData.routes.length === 0) {
    return null;
  }
  
  // Get the main route
  const mainRoute = routeData.routes[0];
  
  // Extract coordinates
  const coordinates = mainRoute.geometry.coordinates;
  
  // Calculate safety score based on route and additional factors
  // This is where custom safety logic would be implemented in a real app
  const baseSafetyScore = 60 + Math.floor(Math.random() * 30); // Base score between 60-90
  const safetyScore = Math.min(Math.round(baseSafetyScore * safetyFactor), 100);
  
  // Extract distance and duration
  const distance = (mainRoute.distance / 1000).toFixed(1); // km
  const duration = Math.round(mainRoute.duration / 60); // minutes
  
  // Return formatted route data
  return {
    coordinates,
    distance: `${distance} km`,
    time: `${duration} min`,
    safetyScore,
    // We would calculate these in a real app based on actual data
    safetyFactor,
    isSafest: safetyFactor > 0.8
  };
}

// Get safe and alternative routes between two locations
export async function getSafeRoutes(
  startLocation: string,
  endLocation: string,
  mapboxToken: string
): Promise<any> {
  try {
    // In a real app, we would geocode these locations to coordinates
    // For now, use mock coordinates for Delhi
    const startCoords: [number, number] = [77.2090, 28.6139]; // Delhi center
    const endCoords: [number, number] = [77.2300, 28.6500]; // Slightly northeast
    
    // Get directions from Mapbox API
    const routeData = await getMapboxDirections(startCoords, endCoords, mapboxToken);
    
    // Process the routes with different safety factors
    const safeRoute = processMapboxRoute(routeData, 1.2); // Higher safety factor
    const regularRoute = processMapboxRoute(routeData, 0.8); // Lower safety factor
    
    // Format routes for the app
    return [
      {
        type: "Safest Route",
        ...safeRoute,
        color: "#10B981", // Green
        width: 4,
        startLocation,
        endLocation,
        lighting: "Well Lit",
        safetyFactors: ["Police Patrols", "Well Lit Areas", "High Foot Traffic"],
        isRecommended: true,
        routeType: "Safest"
      },
      {
        type: "Regular Route",
        ...regularRoute,
        color: "#EF4444", // Red
        width: 3,
        startLocation,
        endLocation,
        lighting: "Partial",
        safetyIssues: ["Low Visibility Areas", "Fewer Pedestrians", "Previous Incidents"],
        isRecommended: false,
        routeType: "Regular"
      }
    ];
  } catch (error) {
    console.error("Error getting safe routes:", error);
    throw error;
  }
}