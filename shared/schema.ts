import { pgTable, text, serial, integer, timestamp, real, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Safety route model
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  distance: real("distance").notNull(), // in km
  duration: integer("duration").notNull(), // in minutes
  safetyScore: integer("safety_score").notNull(), // 0-100
  routeType: text("route_type").notNull(), // "safest", "shortest", etc.
  routeData: jsonb("route_data").notNull(), // GeoJSON data
  isRecommended: boolean("is_recommended").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Safety alerts model
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // "Road Blockade", "Street Lights Out", etc.
  description: text("description").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  reporterName: text("reporter_name").notNull(),
  confirms: integer("confirms").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Safety data model
export const safetyData = pgTable("safety_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  dataType: text("data_type").notNull(), // "crime", "lighting", "crowd"
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  severity: integer("severity").notNull(), // 1-10
  description: text("description"),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create schemas for data insertion
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertRouteSchema = createInsertSchema(routes).omit({ id: true, createdAt: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, confirms: true, isActive: true, createdAt: true });
export const insertSafetyDataSchema = createInsertSchema(safetyData).omit({ id: true, createdAt: true, updatedAt: true });

// Create types for use in the application
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertSafetyData = z.infer<typeof insertSafetyDataSchema>;

export type User = typeof users.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type SafetyData = typeof safetyData.$inferSelect;
