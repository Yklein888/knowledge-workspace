import { z } from 'zod'

// API Response wrapper
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Page schemas
export const CreatePageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional(),
  cover: z.string().optional(),
  parentId: z.string().uuid().optional(),
})

export type CreatePageInput = z.infer<typeof CreatePageSchema>

export const UpdatePageSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  icon: z.string().optional(),
  cover: z.string().optional(),
  content: z.string().optional(),
  parentId: z.string().uuid().optional(),
  isArchived: z.boolean().optional(),
})

export type UpdatePageInput = z.infer<typeof UpdatePageSchema>

export const PageResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  icon: z.string().nullable(),
  cover: z.string().nullable(),
  parentId: z.string().uuid().nullable(),
  order: z.number(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type PageResponse = z.infer<typeof PageResponseSchema>

// Document schemas
export const CreateDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
})

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>

export const UpdateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  order: z.number().optional(),
})

export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>

export const DocumentResponseSchema = z.object({
  id: z.string().uuid(),
  pageId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type DocumentResponse = z.infer<typeof DocumentResponseSchema>

// Link schemas
export const CreateLinkSchema = z.object({
  toPageId: z.string().uuid('Invalid target page ID'),
  type: z.string().default('reference'),
})

export type CreateLinkInput = z.infer<typeof CreateLinkSchema>

// Agent schemas
export const AgentToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  inputSchema: z.record(z.unknown()).optional(),
})

export const MCPConfigSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  auth: z.object({}).optional(),
})

export const CreateAgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  description: z.string().optional(),
  goal: z.string().optional(),
  tools: z.array(AgentToolSchema).default([]),
  mcp: z.array(MCPConfigSchema).default([]),
  config: z.record(z.unknown()).optional(),
})

export type CreateAgentInput = z.infer<typeof CreateAgentSchema>

export const AgentResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  goal: z.string().nullable(),
  tools: z.record(z.unknown()),
  mcp: z.record(z.unknown()),
  config: z.record(z.unknown()),
  exportFormat: z.string(),
  isPublished: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type AgentResponse = z.infer<typeof AgentResponseSchema>

// Agent export schema (for external use)
export const AgentExportSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  version: z.number(),
  goal: z.string().optional(),
  tools: z.array(AgentToolSchema),
  mcp: z.array(MCPConfigSchema),
  config: z.record(z.unknown()),
  exportedAt: z.date(),
})

export type AgentExport = z.infer<typeof AgentExportSchema>
