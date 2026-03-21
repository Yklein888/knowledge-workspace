import { getDb } from '@/db'
import {
  pages,
  documents,
  links,
  agents,
  apiTokens,
  eq,
  desc,
  and,
  asc,
} from '@/db'
import crypto from 'crypto'

// Pages utilities
export async function getPagesByUser(userId: string) {
  const db = getDb()
  return db
    .select()
    .from(pages)
    .where(and(eq(pages.userId, userId), eq(pages.isArchived, false)))
    .orderBy(asc(pages.order))
}

export async function getPageById(pageId: string) {
  const db = getDb()
  const [page] = await db
    .select()
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1)
  return page || null
}

export async function createPage(data: {
  userId: string
  title: string
  slug: string
  icon?: string
  cover?: string
  parentId?: string
}) {
  const db = getDb()
  const [page] = await db.insert(pages).values(data).returning()
  return page
}

export async function updatePage(
  pageId: string,
  data: Partial<typeof pages.$inferInsert>,
) {
  const db = getDb()
  const [page] = await db
    .update(pages)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pages.id, pageId))
    .returning()
  return page
}

export async function deletePage(pageId: string) {
  const db = getDb()
  return db.update(pages).set({ isArchived: true }).where(eq(pages.id, pageId))
}

// Documents utilities
export async function getDocumentsByPage(pageId: string) {
  const db = getDb()
  return db
    .select()
    .from(documents)
    .where(eq(documents.pageId, pageId))
    .orderBy(asc(documents.order))
}

export async function createDocument(data: {
  pageId: string
  title: string
  content?: string
}) {
  const db = getDb()
  const [doc] = await db.insert(documents).values(data).returning()
  return doc
}

export async function updateDocument(
  documentId: string,
  data: Partial<typeof documents.$inferInsert>,
) {
  const db = getDb()
  const [doc] = await db
    .update(documents)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(documents.id, documentId))
    .returning()
  return doc
}

export async function deleteDocument(documentId: string) {
  const db = getDb()
  return db.delete(documents).where(eq(documents.id, documentId))
}

// Links utilities
export async function createLink(data: {
  fromPageId: string
  toPageId: string
  type?: string
}) {
  const db = getDb()
  const [link] = await db.insert(links).values(data).returning()
  return link
}

export async function getLinksForPage(pageId: string) {
  const db = getDb()
  return db
    .select()
    .from(links)
    .where(eq(links.fromPageId, pageId))
}

export async function deleteLink(linkId: string) {
  const db = getDb()
  return db.delete(links).where(eq(links.id, linkId))
}

// Agents utilities
export async function getAgentsByUser(userId: string) {
  const db = getDb()
  return db
    .select()
    .from(agents)
    .where(eq(agents.userId, userId))
    .orderBy(desc(agents.createdAt))
}

export async function getAgentById(agentId: string) {
  const db = getDb()
  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.id, agentId))
    .limit(1)
  return agent || null
}

export async function createAgent(data: typeof agents.$inferInsert) {
  const db = getDb()
  const [agent] = await db.insert(agents).values(data).returning()
  return agent
}

export async function updateAgent(
  agentId: string,
  data: Partial<typeof agents.$inferInsert>,
) {
  const db = getDb()
  const [agent] = await db
    .update(agents)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(agents.id, agentId))
    .returning()
  return agent
}

export async function deleteAgent(agentId: string) {
  const db = getDb()
  return db.delete(agents).where(eq(agents.id, agentId))
}

// API Tokens utilities
export async function getTokensByUser(userId: string) {
  const db = getDb()
  return db
    .select()
    .from(apiTokens)
    .where(eq(apiTokens.userId, userId))
    .orderBy(desc(apiTokens.createdAt))
}

export async function getTokenByValue(token: string) {
  const db = getDb()
  const [t] = await db
    .select()
    .from(apiTokens)
    .where(eq(apiTokens.token, token))
    .limit(1)
  return t || null
}

export async function createApiToken(data: { userId: string; name: string; scopes?: string[] }) {
  const db = getDb()
  const token = `agt_${crypto.randomBytes(32).toString('hex')}`
  const [t] = await db
    .insert(apiTokens)
    .values({ userId: data.userId, name: data.name, token, scopes: data.scopes ?? [] })
    .returning()
  return t
}

export async function deleteApiToken(tokenId: string, userId: string) {
  const db = getDb()
  return db.delete(apiTokens).where(and(eq(apiTokens.id, tokenId), eq(apiTokens.userId, userId)))
}
