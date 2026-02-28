import type { Doc } from 'convex/_generated/dataModel'

export type Product = Doc<'products'>

export type ProductOmitId = Omit<Product, '_id' | '_creationTime'>
