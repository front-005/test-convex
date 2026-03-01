import { useState } from 'react';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { AlertCircle, Check, ChevronLeft, Edit, Package, Star, Tag, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';
import { useMutation } from 'convex/react';
import { cn, formatCurrency } from '../../../../utils';
import type { Id } from 'convex/_generated/dataModel';

export const Route = createFileRoute('/products/details/$id')({
    component: RouteComponent,
})

function RouteComponent() {

    const { id } = Route.useParams();
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState('');

    const { data: product, isFetching: loading, isError } = useSuspenseQuery(convexQuery(api.products.getById, { id: id as Id<"products"> }))


    const handleDelete = useMutation(api.products.remove,)

    if (isError) {
        navigate({ to: '/products' })
        return
    }
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-900"></div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate({ to: '/products' })}
                className="flex items-center gap-2 text-brand-500 hover:text-brand-900 transition-colors mb-8 group"
            >
                <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">Back to Inventory</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Media Section */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-4/5 rounded-3xl overflow-hidden bg-white border border-brand-100 shadow-sm"
                    >
                        {activeImage ? (
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-brand-200">
                                <Package size={80} />
                                <span className="mt-4 font-medium">No image available</span>
                            </div>
                        )}
                    </motion.div>

                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={cn(
                                        "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                                        activeImage === img ? "border-brand-900 scale-105 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-widest rounded-full">
                                {product.category}
                            </span>
                            {product.sku && (
                                <span className="text-sm font-mono text-brand-400">SKU: {product.sku}</span>
                            )}
                        </div>
                        <h1 className="text-5xl font-serif font-bold text-brand-900 mb-4 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-6 mb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-brand-900">{formatCurrency(product.price)}</span>
                                {product.compareAtPrice && (
                                    <span className="text-xl text-brand-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
                                )}
                            </div>
                            {product.rating && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-bold">{product.rating}</span>
                                    <span className="text-amber-400 text-sm">({product.reviewCount || 0})</span>
                                </div>
                            )}
                        </div>

                        <p className="text-lg text-brand-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="p-4 bg-white rounded-2xl border border-brand-100">
                                <span className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">Status</span>
                                <div className="flex items-center gap-2">
                                    {product.isActive ? (
                                        <>
                                            <Check size={18} className="text-emerald-500" />
                                            <span className="font-semibold text-emerald-700">Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle size={18} className="text-brand-400" />
                                            <span className="font-semibold text-brand-500">Inactive</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-brand-100">
                                <span className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-1">Inventory</span>
                                <div className="flex items-center gap-2">
                                    <Package size={18} className={cn(product.quantity > 0 ? "text-brand-900" : "text-red-500")} />
                                    <span className={cn("font-semibold", product.quantity > 0 ? "text-brand-900" : "text-red-600")}>
                                        {product.quantity} units available
                                    </span>
                                </div>
                            </div>
                        </div>

                        {product.tags && product.tags.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-400 mb-3 flex items-center gap-2">
                                    <Tag size={14} />
                                    Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-brand-50 text-brand-600 text-sm rounded-lg border border-brand-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-8 border-t border-brand-100 flex gap-4">
                        <Link
                            to={`/products/edit/$id`}
                            params={{ id: product._id }}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 py-4"
                        >
                            <Edit size={20} />
                            <span>Edit Product</span>
                        </Link>
                        <button
                            onClick={() => {
                                handleDelete({ id: product._id });
                                navigate({ to: '/products' })
                            }}
                            className="btn-secondary px-6 flex items-center justify-center text-red-500 border-red-100 hover:bg-red-50"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

