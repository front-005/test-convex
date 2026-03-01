import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { Edit, Eye, Filter, Package, Plus, Search, Trash2 } from 'lucide-react';
import { AnimatePresence, motion, } from 'motion/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { formatCurrency } from '../../utils';

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
})

function RouteComponent() {

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const { data: filteredProducts, isFetching: loading } = useSuspenseQuery(convexQuery(api.products.searchProducts, { category: categoryFilter, search: searchQuery }))

  const handleDelete = useMutation(api.products.remove)

  const categories = ['All', ...new Set(filteredProducts.map(p => p.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-serif font-bold tracking-tight text-brand-900 mb-2">Inventory</h1>
          <p className="text-brand-500 font-medium">Manage your luxury product catalog and stock levels.</p>
        </div>
        <Link to='/products/add' className="btn-primary flex items-center gap-2 self-start md:self-auto">
          <Plus size={20} />
          <span>New Product</span>
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
            <select
              className="input-field pl-10 appearance-none pr-10"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card group"
              >
                <div className="relative aspect-4/5 overflow-hidden bg-brand-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-300">
                      <Package size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to='/products/details/$id'
                      params={{ id: product._id }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-brand-50 transition-colors"
                    >
                      <Eye size={18} className="text-brand-900" />
                    </Link>
                    <Link
                      to='/products/edit/$id'
                      params={{ id: product._id }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-brand-50 transition-colors"
                    >
                      <Edit size={18} className="text-brand-900" />
                    </Link>
                    <button
                      onClick={() => handleDelete({ id: product._id })}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                  {!product.isActive && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="px-3 py-1 bg-brand-900 text-white text-xs font-bold uppercase tracking-widest rounded-full">Inactive</span>
                    </div>
                  )}
                  {product.quantity === 0 && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">{product.category}</span>
                    <span className="text-sm font-mono text-brand-500">{product.sku}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-brand-900 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-brand-900">{formatCurrency(product.price)}</span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-brand-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-200">
          <Package size={48} className="mx-auto text-brand-200 mb-4" />
          <h3 className="text-xl font-serif font-bold text-brand-900 mb-2">No products found</h3>
          <p className="text-brand-500 mb-6">Try adjusting your search or filters, or add a new product.</p>
          <Link to="/products/add" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            <span>Add First Product</span>
          </Link>
        </div>
      )}
    </div>
  );
}
