import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlertSchema, insertRouteSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get('/api/routes/compare', (req, res) => {
    const { start, end } = req.query;
    const routes = storage.getRouteComparison(start as string, end as string);
    res.json(routes);
  });

  app.post('/api/routes', (req, res) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const route = storage.createRoute(validatedData);
      res.json(route);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Invalid route data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create route' });
      }
    }
  });

  app.get('/api/safety-data', (req, res) => {
    const city = req.query.city as string || 'Delhi NCR';
    const safetyData = storage.getSafetyData(city);
    res.json(safetyData);
  });
  
  app.get('/api/map-data', (req, res) => {
    const city = req.query.city as string || 'Delhi NCR';
    const mapData = storage.getMapData(city);
    res.json(mapData);
  });

  app.get('/api/alerts', (req, res) => {
    const alerts = storage.getAlerts();
    res.json(alerts);
  });

  app.post('/api/alerts', (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = storage.createAlert(validatedData);
      res.json(alert);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: 'Invalid alert data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create alert' });
      }
    }
  });

  app.post('/api/alerts/:id/confirm', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid alert ID' });
    }
    
    try {
      const updatedAlert = storage.confirmAlert(id);
      if (!updatedAlert) {
        return res.status(404).json({ message: 'Alert not found' });
      }
      res.json(updatedAlert);
    } catch (error) {
      res.status(500).json({ message: 'Failed to confirm alert' });
    }
  });

  app.get('/api/map-data', (req, res) => {
    const city = req.query.city as string || 'Delhi NCR';
    const mapData = storage.getMapData(city);
    res.json(mapData);
  });

  const httpServer = createServer(app);

  return httpServer;
}
