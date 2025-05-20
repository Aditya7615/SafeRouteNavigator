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
      
      // Update the distance and time based on the actual locations
      customRoutes[0].startLocation = start;
      customRoutes[0].endLocation = end;
      customRoutes[1].startLocation = start;
      customRoutes[1].endLocation = end;
      
      // Generate slightly different distance and time for different locations
      const distance = (5 + Math.random() * 3).toFixed(1); // Between 5 and 8 km
      const safestDistance = (parseFloat(distance) - 0.5).toFixed(1); // Slightly shorter
      
      const time = Math.floor(10 + Math.random() * 5); // Between 10 and 15 minutes
      const safestTime = Math.floor(time * 1.1); // Slightly longer
      
      customRoutes[0].distance = `${safestDistance} km`; // Safest route
      customRoutes[0].time = `${safestTime} min`;
      
      customRoutes[1].distance = `${distance} km`; // Regular route
      customRoutes[1].time = `${time} min`;
      
      return customRoutes;
    }
    
    // If no start/end provided, return the default mock data
    return mockRouteComparisonData;
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
