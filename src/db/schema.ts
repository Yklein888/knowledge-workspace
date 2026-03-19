import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Pages table (workspace)
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  content: text('content').default(''),
  icon: text('icon'),
  cover: text('cover'),
  parentId: uuid('parent_id'), // For nested pages
  order: integer('order').default(0),
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Documents table (within pages)
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull(),
  title: text('title').notNull(),
  content: text('content').default(''),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Links table (for connecting pages/documents)
export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromPageId: uuid('from_page_id').notNull(),
  toPageId: uuid('to_page_id').notNull(),
  type: text('type').default('reference'), // reference, depends, blocks, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Agents table (for agent builder)
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  goal: text('goal'),
  tools: jsonb('tools').default({}), // Array of tool configurations
  mcp: jsonb('mcp').default({}), // MCP server configurations
  config: jsonb('config').default({}), // Agent-specific config
  exportFormat: text('export_format').default('json'), // json, yaml, etc.
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Agent versions/exports
export const agentExports = pgTable('agent_exports', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').notNull(),
  version: integer('version').notNull(),
  exportedConfig: jsonb('exported_config').notNull(), // Full exportable config
  exportUrl: text('export_url'), // CDN or storage URL
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Audit logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: uuid('resource_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  pages: many(pages),
  agents: many(agents),
  auditLogs: many(auditLogs),
}))

export const pagesRelations = relations(pages, ({ one, many }) => ({
  user: one(users, { fields: [pages.userId], references: [users.id] }),
  documents: many(documents),
  linksFrom: many(links, { relationName: 'from' }),
  linksTo: many(links, { relationName: 'to' }),
  parent: one(pages, { fields: [pages.parentId], references: [pages.id] }),
  children: many(pages, { relationName: 'children' }),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  page: one(pages, { fields: [documents.pageId], references: [pages.id] }),
}))

export const linksRelations = relations(links, ({ one }) => ({
  fromPage: one(pages, { fields: [links.fromPageId], references: [pages.id] }),
  toPage: one(pages, { fields: [links.toPageId], references: [pages.id] }),
}))

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, { fields: [agents.userId], references: [users.id] }),
  exports: many(agentExports),
}))

export const agentExportsRelations = relations(agentExports, ({ one }) => ({
  agent: one(agents, { fields: [agentExports.agentId], references: [agents.id] }),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}))
