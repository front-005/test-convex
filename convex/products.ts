import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const getAll = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.query('products').collect()
  },
})

export const getById = query({
  args: {
    id: v.id('products'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get('products', args.id)
  },
})
export const create = mutation({
  args: {
    product: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('products', args.product)
  },
})

export const searchProducts = query({
  args: {
    search: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const search = args.search.trim()
    if (!search) return await ctx.db.query('products').collect()
    const [byName, bySku] = await Promise.all([
      ctx.db
        .query('products')
        .withSearchIndex('search_name', (q) => q.search('name', search))
        .collect(),
      ctx.db
        .query('products')
        .withSearchIndex('search_sku', (q) => q.search('sku', search))
        .collect(),
    ])
    const seen = new Set(byName.map((p) => p._id))
    const merged = [...byName]
    for (const p of bySku) {
      if (!seen.has(p._id)) {
        seen.add(p._id)
        merged.push(p)
      }
    }
    return args.category === 'All'
      ? merged
      : merged.filter((p) => p.category === args.category)
  },
})

export const update = mutation({
  args: {
    product: v.object({
      _id: v.id('products'),
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
    }),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get('products', args.product._id)
    if (!product) throw new Error('no product found')
    await ctx.db.patch('products', args.product._id, { ...args.product })
  },
})

export const remove = mutation({
  args: { id: v.id('products') },
  handler: async (ctx, args) => {
    const product = await ctx.db.get('products', args.id)
    if (!product) throw new Error('no product found')
    await ctx.db.delete('products', args.id)
  },
})
