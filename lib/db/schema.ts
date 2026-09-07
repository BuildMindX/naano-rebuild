import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["brand", "creator"]);
export const collabStatusEnum = pgEnum("collab_status", [
  "invited",
  "applied",
  "accepted",
  "declined",
  "draft_submitted",
  "scheduled",
  "live",
  "completed",
]);
export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "active",
  "completed",
]);
export const payoutStatusEnum = pgEnum("payout_status", [
  "not_scheduled",
  "scheduled",
  "paid",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const creatorProfiles = pgTable("creator_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  headline: varchar("headline", { length: 255 }).notNull().default(""),
  bio: text("bio").notNull().default(""),
  niche: varchar("niche", { length: 120 }).notNull().default("B2B"),
  country: varchar("country", { length: 120 }).notNull().default(""),
  followerCount: integer("follower_count").notNull().default(0),
  pricePerPost: numeric("price_per_post", { precision: 10, scale: 2 }).notNull().default("0"),
  linkedinHandle: varchar("linkedin_handle", { length: 255 }).notNull().default(""),
  avgImpressions: integer("avg_impressions").notNull().default(0),
  avgClicks: integer("avg_clicks").notNull().default(0),
  avgLeads: integer("avg_leads").notNull().default(0),
  tags: text("tags").notNull().default(""), // comma separated
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  objective: text("objective").notNull().default(""),
  keyMessages: text("key_messages").notNull().default(""),
  creatorGuidelines: text("creator_guidelines").notNull().default(""),
  targetAudience: varchar("target_audience", { length: 255 }).notNull().default(""),
  landingUrl: text("landing_url").notNull().default(""),
  budget: numeric("budget", { precision: 10, scale: 2 }).notNull().default("0"),
  status: campaignStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const campaignCreators = pgTable("campaign_creators", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  creatorId: integer("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: collabStatusEnum("status").notNull().default("invited"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  postUrl: text("post_url"),
  trackingCode: varchar("tracking_code", { length: 32 }).notNull().unique(),
  scheduledDate: timestamp("scheduled_date"),
  liveDate: timestamp("live_date"),
  payoutStatus: payoutStatusEnum("payout_status").notNull().default("not_scheduled"),
  payoutDate: timestamp("payout_date"),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  leads: integer("leads").notNull().default(0),
  pipelineValue: numeric("pipeline_value", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clickEvents = pgTable("click_events", {
  id: serial("id").primaryKey(),
  campaignCreatorId: integer("campaign_creator_id").notNull().references(() => campaignCreators.id, { onDelete: "cascade" }),
  clickedAt: timestamp("clicked_at").notNull().defaultNow(),
  becameLead: boolean("became_lead").notNull().default(false),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  creatorProfile: one(creatorProfiles, {
    fields: [users.id],
    references: [creatorProfiles.userId],
  }),
  campaigns: many(campaigns),
  collaborations: many(campaignCreators),
}));

export const creatorProfilesRelations = relations(creatorProfiles, ({ one }) => ({
  user: one(users, { fields: [creatorProfiles.userId], references: [users.id] }),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  brand: one(users, { fields: [campaigns.brandId], references: [users.id] }),
  collaborations: many(campaignCreators),
}));

export const campaignCreatorsRelations = relations(campaignCreators, ({ one, many }) => ({
  campaign: one(campaigns, { fields: [campaignCreators.campaignId], references: [campaigns.id] }),
  creator: one(users, { fields: [campaignCreators.creatorId], references: [users.id] }),
  clicks: many(clickEvents),
}));
