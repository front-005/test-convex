import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
    sku: v.optional(v.string()),
    quantity: v.number(),
    isActive: v.boolean(),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
  })
    .index('by_category', ['category'])
    .index('by_price', ['price'])
    .searchIndex('search_name', { searchField: 'name' })
    .searchIndex('search_sku', { searchField: 'sku' }),
})
