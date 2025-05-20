// Type definitions for the application

// Types for routing
export interface SafeRouteOptions {
  alternatives?: boolean;
  geometries?: string;
  overview?: string;
  steps?: boolean;
}

// Interfaces for map data
export interface RouteData {
  coordinates: Array<[number, number]>;
  color: string;
  width: number;
  distance: string;
  time: string;
  safetyScore: number;
}

export interface MarkerData {
  lat: number;
  lng: number;
  color?: string;
  popup?: string;
}