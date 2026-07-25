'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  User,
  Package,
  X,
  Maximize2,
  Warehouse,
  Hash,
  Info,
  ChevronLeft,
  Loader2,
  Mail,
  AlertTriangle
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useRouter } from 'next/navigation';
import { useGetAdminProductByIdQuery } from '@/store/api/productApi';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isZoomedImageOpen, setIsZoomedImageOpen] = useState(false);

  // Fetch product data
  const { data: product, isLoading, error } = useGetAdminProductByIdQuery(id);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans">
      <AdminSidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {isLoading && (
          <div className="absolute inset-0 bg-[#020617]/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Loading Product Details...</p>
            </div>
          </div>
        )}

        <main className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar pb-16">
          {/* Header Action Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/admin/products')}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs text-slate-350 font-bold transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Products
            </button>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl flex flex-col items-center gap-2 max-w-md mx-auto mt-20 text-center">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Product Error</h3>
              <p className="text-xs text-slate-400">Failed to load the product. It may have been deleted or does not exist.</p>
            </div>
          )}

          {product && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
              
              {/* Product Image Section (Large Size) */}
              <div className="lg:col-span-5 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative group min-h-[350px] shadow-sm">
                <button
                  onClick={() => setIsZoomedImageOpen(true)}
                  className="absolute right-4 top-4 p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-md z-10"
                  title="Zoom Image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {product.imageUrl ? (
                  <div 
                    className="relative w-full aspect-square max-h-[300px] flex items-center justify-center cursor-zoom-in"
                    onClick={() => setIsZoomedImageOpen(true)}
                  >
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-contain rounded-2xl shadow-lg border border-slate-800 bg-slate-950/20" 
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-16">
                    <Package className="w-20 h-20 text-slate-700" />
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">No Product Image</span>
                  </div>
                )}

                {product.imageUrl && (
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">Click image to enlarge</p>
                )}
              </div>

              {/* Product Details Section */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Meta details Header */}
                <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {product.category || 'General'}
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-100 mt-2 leading-tight">{product.name}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry Date */}
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Expiry Date</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300 font-semibold">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(product.expiryDate).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Status / Days Left</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs font-bold">
                        <span className={`${
                          product.status === 'good' || product.status === 'Active'
                            ? 'text-emerald-400' 
                            : product.status === 'warning' || product.status === 'Expiring Soon'
                            ? 'text-orange-400'
                            : 'text-red-400'
                        }`}>
                          {product.status === 'good' ? 'Active' : product.status === 'warning' ? 'Expiring Soon' : product.status}
                          {product.daysLeft !== undefined && ` (${product.daysLeft} days left)`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structured Metadata Fields */}
                <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-850 pb-2">
                    Product Specifications
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    {/* Storage Location */}
                    {product.storageLocation && (
                      <div className="flex items-start gap-3 text-xs text-slate-350">
                        <Warehouse className="w-4.5 h-4.5 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Storage</p>
                          <p className="font-bold text-slate-200 mt-0.5 capitalize">{product.storageLocation.replace('_', ' ')}</p>
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    {product.quantity !== undefined && (
                      <div className="flex items-start gap-3 text-xs text-slate-350">
                        <Info className="w-4.5 h-4.5 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Quantity</p>
                          <p className="font-bold text-slate-200 mt-0.5">{product.quantity} {product.unit || 'units'}</p>
                        </div>
                      </div>
                    )}

                    {/* Barcode */}
                    {product.barcode && (
                      <div className="flex items-start gap-3 text-xs text-slate-355">
                        <Hash className="w-4.5 h-4.5 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Barcode</p>
                          <p className="font-bold text-slate-200 mt-0.5 tracking-wider">{product.barcode}</p>
                        </div>
                      </div>
                    )}

                    {/* Created Date */}
                    {product.created_at && (
                      <div className="flex items-start gap-3 text-xs text-slate-350">
                        <Calendar className="w-4.5 h-4.5 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-555 font-bold uppercase tracking-wider">Created Date</p>
                          <p className="font-bold text-slate-200 mt-0.5">{new Date(product.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-850 space-y-3.5">
                    {/* Added By details */}
                    <div className="flex items-start gap-3 text-xs text-slate-350">
                      <User className="w-4.5 h-4.5 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Added By</p>
                        <p className="font-bold text-slate-200 mt-0.5">{product.addedBy}</p>
                      </div>
                    </div>

                    {product.addedByEmail && (
                      <div className="flex items-start gap-3 text-xs text-slate-350">
                        <Mail className="w-4.5 h-4.5 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Creator Email</p>
                          <p className="font-bold text-slate-200 mt-0.5">{product.addedByEmail}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes Block */}
                {product.notes && (
                  <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Notes</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {product.notes}
                    </p>
                  </div>
                )}

                {/* Ingredients Block */}
                {product.ingredients && (
                  <div className="bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ingredients</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {product.ingredients}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}
        </main>
      </div>

      {/* ZOOMED LIGHTBOX */}
      <AnimatePresence>
        {isZoomedImageOpen && product?.imageUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomedImageOpen(false)}
              className="absolute inset-0 cursor-zoom-out"
            />
            <button 
              onClick={() => setIsZoomedImageOpen(false)}
              className="absolute right-6 top-6 p-2 bg-slate-900/85 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-all shadow-md z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-full max-h-[90vh] z-10 relative flex items-center justify-center"
            >
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl border border-slate-800" 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
