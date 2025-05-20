import { 
  User, InsertUser, Route, InsertRoute, 
  Alert, InsertAlert, SafetyData, InsertSafetyData,
  users, routes, alerts, safetyData
} from "@shared/schema";
import { mockRouteComparisonData, mockAlertsData, mockSafetyData, mockMapData } from "./mockData";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Route operations
  getRouteComparison(): any[];
  createRoute(route: InsertRoute): Route;
  
  // Alert operations
  getAlerts(): any[];
  createAlert(alert: InsertAlert): Alert;
  confirmAlert(id: number): Alert | undefined;
  
  // Safety data operations
  getSafetyData(city: string): any;
  getMapData(city: string): any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private routes: Map<number, Route>;
  private alerts: Map<number, Alert>;
  private safetyData: Map<number, SafetyData>;
  
  private nextUserId: number;
  private nextRouteId: number;
  private nextAlertId: number;
  private nextSafetyDataId: number;

  constructor() {
    this.users = new Map();
    this.routes = new Map();
    this.alerts = new Map();
    this.safetyData = new Map();
    
    this.nextUserId = 1;
    this.nextRouteId = 1;
    this.nextAlertId = 1;
    this.nextSafetyDataId = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock alerts
    mockAlertsData.forEach(alert => {
      const newAlert: Alert = {
        id: this.nextAlertId++,
        type: alert.type,
        description: alert.description,
        latitude: alert.latitude,
        longitude: alert.longitude,
        reporterName: alert.reporterName,
        confirms: alert.confirms,
        isActive: true,
        createdAt: new Date()
      };
      this.alerts.set(newAlert.id, newAlert);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Route operations
  getRouteComparison(start?: string, end?: string): any[] {
    // If we have start and end locations, customize the route data
    if (start && end) {
      // Create a copy of the mock data
      const customRoutes = JSON.parse(JSON.stringify(mockRouteComparisonData));
      
      // Update the locations
      customRoutes[0].startLocation = start;
      customRoutes[0].endLocation = end;
      customRoutes[1].startLocation = start;
      customRoutes[1].endLocation = end;
      
      // Generate unique coordinates for each route based on location string
      // In a real app, we would geocode these locations and use actual coordinates
      const generateCoordinates = (baseLat: number, baseLng: number, isSafeRoute: boolean): Array<[number, number]> => {
        // Create a basic pattern based on location strings to simulate different routes
        const startHash = this.hashString(start) % 100 / 1000;
        const endHash = this.hashString(end) % 100 / 1000;
        
        // Base coordinates around Delhi (or adjust based on city)
        const lat = baseLat + startHash;
        const lng = baseLng + endHash;
        
        // Generate a path with 5-7 points
        const pointCount = 5 + Math.floor(Math.random() * 3);
        const path: Array<[number, number]> = [];
        
        // Create a path from start to end with some variation
        for (let i = 0; i < pointCount; i++) {
          const progress = i / (pointCount - 1); // 0 to 1
          
          // Create two slightly different paths for safe vs regular routes
          let waypointLat, waypointLng;
          
          if (isSafeRoute) {
            // Safe route - more direct path with slight northern curve
            waypointLat = lat + (baseLat - lat) * progress + (Math.sin(progress * Math.PI) * 0.01);
            waypointLng = lng + (baseLng - lng) * progress;
          } else {
            // Regular route - slightly longer southern path
            waypointLat = lat + (baseLat - lat) * progress - (Math.sin(progress * Math.PI) * 0.01);
            waypointLng = lng + (baseLng - lng) * progress + (Math.sin(progress * Math.PI) * 0.005);
          }
          
          path.push([waypointLng, waypointLat]);
        }
        
        return path;
      };
      
      // Generate route data with more realistic paths
      const safeRoute = generateCoordinates(28.6139, 77.209, true);
      const regularRoute = generateCoordinates(28.6139, 77.209, false);
      
      // Set the coordinates for both routes
      customRoutes[0].coordinates = safeRoute;
      customRoutes[1].coordinates = regularRoute;
      
      // Calculate realistic distance based on path length
      const calcDistance = (coords: Array<[number, number]>): number => {
        let total = 0;
        for (let i = 1; i < coords.length; i++) {
          total += this.haversineDistance(
            coords[i-1][1], coords[i-1][0], 
            coords[i][1], coords[i][0]
          );
        }
        return total;
      };
      
      // Calculate distances
      const safeDistance = calcDistance(safeRoute);
      const regularDistance = calcDistance(regularRoute);
      
      // Update the distances and times
      customRoutes[0].distance = `${safeDistance.toFixed(1)} km`;
      customRoutes[0].time = `${Math.ceil(safeDistance * 12)} min`; // Approx. 5 km/h walking speed
      
      customRoutes[1].distance = `${regularDistance.toFixed(1)} km`;
      customRoutes[1].time = `${Math.ceil(regularDistance * 10)} min`; // Slightly faster but less safe
      
      return customRoutes;
    }
    
    // If no start/end provided, return the default mock data
    return mockRouteComparisonData;
  }
  
  // Helper method to calculate distance between coordinates using Haversine formula
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  private toRad(value: number): number {
    return value * Math.PI / 180;
  }
  
  // Simple string hash function to get consistent variation based on location names
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  createRoute(insertRoute: InsertRoute): Route {
    const id = this.nextRouteId++;
    const now = new Date();
    const route: Route = { ...insertRoute, id, createdAt: now };
    this.routes.set(id, route);
    return route;
  }

  // Alert operations
  getAlerts(): any[] {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(alert => ({
        id: alert.id,
        type: alert.type,
        description: alert.description,
        time: this.formatTimeAgo(alert.createdAt),
        reporter: alert.reporterName,
        confirms: alert.confirms,
        lat: alert.latitude,
        lng: alert.longitude
      }));
  }

  createAlert(insertAlert: InsertAlert): Alert {
    const id = this.nextAlertId++;
    const now = new Date();
    const alert: Alert = { 
      ...insertAlert, 
      id, 
      confirms: 0, 
      isActive: true, 
      createdAt: now 
    };
    this.alerts.set(id, alert);
    return alert;
  }

  confirmAlert(id: number): Alert | undefined {
    const alert = this.alerts.get(id);
    if (!alert) {
      return undefined;
    }
    
    const updatedAlert: Alert = {
      ...alert,
      confirms: alert.confirms + 1
    };
    
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  // Safety data operations
  getSafetyData(city: string): any {
    return mockSafetyData[city] || mockSafetyData['Delhi NCR'];
  }
  
  getMapData(city: string): any {
    return mockMapData[city] || mockMapData['Delhi NCR'];
  }

  // Helper methods
  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMins < 1) {
      return 'just now';
    } else if (diffInMins < 60) {
      return `${diffInMins} mins ago`;
    } else if (diffInMins < 1440) {
      const hours = Math.floor(diffInMins / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInMins / 1440);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  }
}

export const storage = new MemStorage();
