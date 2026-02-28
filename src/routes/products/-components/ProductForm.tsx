import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { X, Plus, Image as ImageIcon, Upload } from 'lucide-react';
import { type Product } from '../-types';
import { cn } from '../../../utils';
import type { Id } from 'convex/_generated/dataModel';

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: Product) => Promise<void>;
    title: string;
}

export default function ProductForm({ initialData, onSubmit, title }: ProductFormProps) {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<Product>(initialData || {
        _id: '1' as Id<'products'>,
        _creationTime: 0,
        name: '',
        description: '',
        price: 0,
        compareAtPrice: 0,
        sku: '',
        imageUrl: '',
        rating: 0,
        reviewCount: 0,
        category: '',
        quantity: 0,
        isActive: true,
        images: [],
        tags: [],
    });

    const [tagInput, setTagInput] = useState('');
    const [imageInput, setImageInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
        }));
    };

    const handleToggleActive = () => {
        setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (!formData.tags?.includes(newTag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), newTag]
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(t => t !== tagToRemove)
        }));
    };

    const handleAddImage = () => {
        if (imageInput.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), imageInput.trim()],
                imageUrl: prev.imageUrl || imageInput.trim() // Set first image as main if not set
            }));
            setImageInput('');
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => {
            const newImages = prev.images?.filter((_, i) => i !== index) || [];
            return {
                ...prev,
                images: newImages,
                imageUrl: prev.imageUrl === prev.images?.[index] ? newImages[0] || '' : prev.imageUrl
            };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        // try {
        //     const res = await fetch('/api/upload', {
        //         method: 'POST',
        //         body: formData,
        //     });
        //     const data = await res.json();
        //     if (data.url) {
        //         setFormData(prev => ({
        //             ...prev,
        //             images: [...(prev.images || []), data.url],
        //             imageUrl: prev.imageUrl || data.url
        //         }));
        //     }
        // } catch (error) {
        //     console.error('Error uploading file:', error);
        //     alert('Failed to upload image. Please try again.');
        // } finally {
        //     setUploading(false);
        //     if (fileInputRef.current) fileInputRef.current.value = '';
        // }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData)
        navigate({ to: '/products' })
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-serif font-bold">{title}</h1>
                <button
                    onClick={() => navigate({ to: '/products' })}
                    className="text-brand-500 hover:text-brand-900 transition-colors"
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <section className="card p-6 space-y-4">
                        <h2 className="text-lg font-semibold border-b border-brand-100 pb-2">Basic Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-brand-600 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. Silk Evening Gown"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-600 mb-1">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Describe the product details..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-600 mb-1">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Apparel"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-600 mb-1">SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku || ''}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="SKU-12345"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="card p-6 space-y-4">
                        <h2 className="text-lg font-semibold border-b border-brand-100 pb-2">Pricing & Inventory</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-600 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price ?? ''}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-600 mb-1">Compare at Price ($)</label>
                                <input
                                    type="number"
                                    name="compareAtPrice"
                                    min="0"
                                    step="0.01"
                                    value={formData.compareAtPrice?.toString() ?? ''}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-600 mb-1">Quantity in Stock</label>
                            <input
                                type="number"
                                name="quantity"
                                required
                                min="0"
                                value={formData.quantity ?? ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div className="flex items-center space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={handleToggleActive}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                                    formData.isActive ? "bg-brand-900" : "bg-brand-200"
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                        formData.isActive ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                            <span className="text-sm font-medium text-brand-700">Product is Active</span>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="card p-6 space-y-4">
                        <h2 className="text-lg font-semibold border-b border-brand-100 pb-2">Media</h2>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-brand-600">Media Assets</label>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="text-xs font-semibold text-brand-900 hover:underline flex items-center gap-1 disabled:opacity-50"
                                >
                                    <Upload size={12} />
                                    {uploading ? 'Uploading...' : 'Upload from PC'}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    className="input-field"
                                    placeholder="Or paste image URL..."
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="p-2 bg-brand-100 text-brand-900 rounded-lg hover:bg-brand-200 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {formData.images?.map((url, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-brand-100">
                                    <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} className="text-red-500" />
                                    </button>
                                </div>
                            ))}
                            {(!formData.images || formData.images.length === 0) && (
                                <div className="col-span-3 py-8 flex flex-col items-center justify-center border-2 border-dashed border-brand-200 rounded-xl text-brand-400">
                                    <ImageIcon size={32} className="mb-2" />
                                    <span className="text-xs">No images added yet</span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="card p-6 space-y-4">
                        <h2 className="text-lg font-semibold border-b border-brand-100 pb-2">Organization</h2>
                        <div>
                            <label className="block text-sm font-medium text-brand-600 mb-1">Tags</label>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="input-field"
                                placeholder="Type and press Space or Enter"
                            />
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.tags?.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-800 border border-brand-200 shadow-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-2 text-brand-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="btn-primary w-full py-3 text-lg font-medium shadow-lg shadow-brand-900/10"
                        >
                            Save Product
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
