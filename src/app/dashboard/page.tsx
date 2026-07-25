'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Tags, 
  Plus, 
  Search, 
  Trash2, 
  Calendar, 
  Layers, 
  LogOut, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  X,
  User,
  FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService } from '@/services/auth.service';
import { CONFIG } from '@/services/config';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '@/store/api/productApi';
import { useGetAllCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '@/store/api/categoryApi';
import CustomSelect from '@/components/CustomSelect';
import AdSenseUnit from '@/components/AdSenseUnit';
import { toast } from 'react-hot-toast';

export default function UserDashboardPage() {
  const router = useRouter();

  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      if (hostname.includes("localhost") || hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        return `${protocol}//${hostname}:5000/api`;
      }
    }
    return CONFIG.API_URL;
  };
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<string>('expiryDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductAdOpen, setIsProductAdOpen] = useState(false);
  const [savedProductName, setSavedProductName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

  const handleDownloadReport = async () => {
    setIsDownloadingReport(true);
    const toastId = toast.loading('Generating and downloading your PDF report...');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${getApiUrl()}/products/export/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to download report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expirely_inventory_report_${currentUser?.username?.replace(/\s+/g, '_') || 'user'}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Report downloaded successfully!', { id: toastId });
    } catch (err: any) {
      toast.error('Failed to generate or download report.', { id: toastId });
    } finally {
      setIsDownloadingReport(false);
    }
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setIsUploadingImage(true);
    const toastId = toast.loading('Uploading image...');
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${getApiUrl()}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const result = await response.json();
      const uploadedUrl = result.data?.imageUrl || result.imageUrl;
      
      if (!uploadedUrl) throw new Error('No image URL returned');

      setProductForm(prev => ({ ...prev, imageUrl: uploadedUrl }));
      toast.success('Product image uploaded successfully!', { id: toastId });
    } catch (err: any) {
      toast.error('Failed to upload image.', { id: toastId });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // New Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    expiryDate: '',
    qty: 1,
    storageLocation: 'other',
    notes: '',
    imageUrl: ''
  });

  // Queries & Mutations
  const { data: productsResponse, isLoading: isProductsLoading, refetch: refetchProducts } = useGetProductsQuery();
  const { data: categoriesResponse, isLoading: isCategoriesLoading, refetch: refetchCategories } = useGetAllCategoriesQuery();
  
  const [createProduct, { isLoading: isCreatingProduct }] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const products = productsResponse?.data || [];
  const categories = categoriesResponse || [];

  // Authenticate user check
  useEffect(() => {
    const loggedUser = authService.getUser();
    if (!loggedUser) {
      router.push('/login');
    } else {
      setCurrentUser(loggedUser);
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p: any) => p.status === 'good' || p.status === 'Active').length;
    const warning = products.filter((p: any) => p.status === 'warning' || p.status === 'Expiring Soon').length;
    const expired = products.filter((p: any) => p.status === 'expired' || p.status === 'Expired').length;
    return { total, active, warning, expired };
  }, [products]);

  // Sort handlers
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search term
    if (searchTerm) {
      list = list.filter((p: any) => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category Filter
    if (categoryFilter !== 'All') {
      list = list.filter((p: any) => p.category === categoryFilter);
    }

    // Status Filter
    if (statusFilter !== 'All') {
      const matchStatus = statusFilter.toLowerCase();
      list = list.filter((p: any) => {
        if (matchStatus === 'active') return p.status === 'good' || p.status === 'Active';
        if (matchStatus === 'warning') return p.status === 'warning' || p.status === 'Expiring Soon';
        if (matchStatus === 'expired') return p.status === 'expired' || p.status === 'Expired';
        return true;
      });
    }

    // Sorting
    list.sort((a: any, b: any) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle nested fields or date formatting
      if (sortBy === 'expiryDate') {
        aVal = new Date(a.expiryDate || a.expiry_date || '').getTime();
        bVal = new Date(b.expiryDate || b.expiry_date || '').getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [products, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

  // Options for Category Select Filters
  const categoryFilterOptions = useMemo(() => {
    const opts = [{ value: 'All', label: 'All Categories' }];
    categories.forEach((c: any) => {
      opts.push({ value: c.name, label: c.name });
    });
    return opts;
  }, [categories]);

  // Options for Status Select Filters
  const statusFilterOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Warning', label: 'Expiring Soon' },
    { value: 'Expired', label: 'Expired' }
  ];

  // Options for Storage Location select form field
  const storageLocationOptions = [
    { value: 'fridge', label: 'Fridge' },
    { value: 'freezer', label: 'Freezer' },
    { value: 'pantry', label: 'Pantry' },
    { value: 'medicine_box', label: 'Medicine Box' },
    { value: 'other', label: 'Other' }
  ];

  // Options for Category select form field
  const categoryFormOptions = useMemo(() => {
    return categories.map((c: any) => ({ value: c.name, label: c.name }));
  }, [categories]);

  // Add category handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await createCategory({ name: newCategoryName }).unwrap();
      toast.success('Custom category created successfully!');
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
      refetchCategories();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create category');
    }
  };

  // Delete category handler
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully');
      refetchCategories();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete category');
    }
  };

  // Add Product Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category || !productForm.expiryDate) {
      toast.error('Please fill in Name, Category, and Expiry Date');
      return;
    }

    if (!productForm.imageUrl) {
      toast.error('Product image is required');
      return;
    }

    try {
      const payload = {
        name: productForm.name,
        category: productForm.category,
        expiry_date: productForm.expiryDate,
        quantity: Number(productForm.qty),
        storage_location: productForm.storageLocation,
        notes: productForm.notes,
        image_url: productForm.imageUrl
      };

      await createProduct(payload).unwrap();
      toast.success('Product added successfully!');
      setSavedProductName(productForm.name);
      setIsProductAdOpen(true);
      
      // Reset form
      setProductForm({
        name: '',
        category: '',
        expiryDate: '',
        qty: 1,
        storageLocation: 'other',
        notes: '',
        imageUrl: ''
      });
      setActiveTab('products');
      refetchProducts();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add product');
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pantry item?')) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted successfully');
      refetchProducts();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 overflow-y-auto flex flex-col justify-between font-sans">
      
      {/* Top Banner Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative shadow-md shadow-emerald-500/10">
            <Image src="/logo1.png" alt="Expirely Logo" fill className="object-cover" priority />
          </div>
          <div>
            <h1 className="text-md font-extrabold tracking-tight text-slate-900">Expirely Dashboard</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pantry & Expiry Manager</p>
          </div>
        </div>

        {currentUser && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-700">{currentUser.username}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{currentUser.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all cursor-pointer"
              title="Logout Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-3">
        
        {/* Profile Card / Dashboard Welcome */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/[0.02] blur-[100px] pointer-events-none" />
          
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              Welcome Back, {currentUser?.username || 'Pantry Owner'}!
            </h2>
            <p className="text-slate-500 text-xs max-w-xl">
              Track expiry dates, catalog grocery categories, and minimize household inventory waste easily.
            </p>
          </div>

          <div className="flex gap-3 shrink-0 w-full md:w-auto z-10">
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex-1 md:flex-none bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-400" />
              Add Category
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-sm p-4.5 text-center md:text-left space-y-1 relative shadow-sm">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Products</p>
            <h4 className="text-2xl font-black text-slate-900">{stats.total}</h4>
            <div className="absolute right-4 bottom-4 w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm p-4.5 text-center md:text-left space-y-1 relative shadow-sm">
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Good Status</p>
            <h4 className="text-2xl font-black text-emerald-500">{stats.active}</h4>
            <div className="absolute right-4 bottom-4 w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm p-4.5 text-center md:text-left space-y-1 relative shadow-sm">
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Expiring Soon</p>
            <h4 className="text-2xl font-black text-amber-500">{stats.warning}</h4>
            <div className="absolute right-4 bottom-4 w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-sm p-4.5 text-center md:text-left space-y-1 relative shadow-sm">
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Expired</p>
            <h4 className="text-2xl font-black text-rose-500">{stats.expired}</h4>
            <div className="absolute right-4 bottom-4 w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs - Scrollable on one line */}
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 shrink-0 relative ${
              activeTab === 'products' ? 'text-emerald-650' : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <Package className="w-4.5 h-4.5" />
            My Products
            {activeTab === 'products' && (
              <motion.div layoutId="userTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 shrink-0 relative ${
              activeTab === 'categories' ? 'text-emerald-650' : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <Tags className="w-4.5 h-4.5" />
            Categories list
            {activeTab === 'categories' && (
              <motion.div layoutId="userTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          {isProductsLoading || isCategoriesLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Dashboard Data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* TAB 1: PRODUCTS LIST */}
              {activeTab === 'products' && (
                <motion.div
                  key="products-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <AnimatePresence>
                    {isProductAdOpen && (
                      <motion.section
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        aria-labelledby="product-saved-title"
                        className="space-y-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 id="product-saved-title" className="text-sm font-extrabold text-slate-900">
                                Pantry item added
                              </h3>
                              <p className="mt-1 text-xs text-slate-500">
                                {savedProductName} is now in your pantry.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsProductAdOpen(false)}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            aria-label="Dismiss saved item message and advertisement"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="space-y-1.5 border-t border-slate-100 pt-3">
                          <p className="text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Advertisement
                          </p>
                          <AdSenseUnit slot={process.env.NEXT_PUBLIC_ADSENSE_PANTRY_SLOT || ''} />
                        </div>
                      </motion.section>
                    )}
                  </AnimatePresence>

                  {/* Search and Filters Bar */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-grow max-w-md">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    {/* Custom Dropdown Filters */}
                    <div className="flex gap-3 items-center">
                      <CustomSelect
                        options={categoryFilterOptions}
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                        placeholder="Select Category"
                        lightMode={true}
                      />
                      <CustomSelect
                        options={statusFilterOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        placeholder="Select Status"
                        lightMode={true}
                      />
                      <button
                        onClick={handleDownloadReport}
                        disabled={isDownloadingReport}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50 animate-fade-in"
                        title="Download Inventory PDF Report"
                      >
                        {isDownloadingReport ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span className="hidden sm:inline">Export PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Responsive Table Grid */}
                  <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <th onClick={() => handleSort('name')} className="px-6 py-4 cursor-pointer hover:text-slate-600 transition-colors">
                              <span className="flex items-center gap-1">
                                Product Name
                                {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-555" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-555" />)}
                              </span>
                            </th>
                            <th onClick={() => handleSort('category')} className="px-6 py-4 cursor-pointer hover:text-slate-600 transition-colors">
                              <span className="flex items-center gap-1">
                                Category
                                {sortBy === 'category' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-555" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-555" />)}
                              </span>
                            </th>
                            <th onClick={() => handleSort('expiryDate')} className="px-6 py-4 cursor-pointer hover:text-slate-600 transition-colors">
                              <span className="flex items-center gap-1">
                                Expiry Date
                                {sortBy === 'expiryDate' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-555" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-555" />)}
                              </span>
                            </th>
                            <th onClick={() => handleSort('qty')} className="px-6 py-4 cursor-pointer text-center hover:text-slate-600 transition-colors">
                              <span className="flex items-center justify-center gap-1">
                                Qty
                                {sortBy === 'qty' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-emerald-555" /> : <ChevronDown className="w-3.5 h-3.5 text-emerald-555" />)}
                              </span>
                            </th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {filteredProducts.map((product: any) => {
                            const expDate = product.expiryDate || product.expiry_date;
                            const status = product.status;
                            let statusText = 'Active';
                            let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';

                            if (status === 'warning' || status === 'Expiring Soon') {
                              statusText = 'Expiring Soon';
                              statusColor = 'text-amber-605 bg-amber-50 border-amber-100';
                            } else if (status === 'expired' || status === 'Expired') {
                              statusText = 'Expired';
                              statusColor = 'text-rose-600 bg-rose-50 border-rose-100';
                            }

                            return (
                              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-800">{product.name || 'Unnamed Product'}</td>
                                <td className="px-6 py-4 text-slate-600">{product.category || 'General'}</td>
                                <td className="px-6 py-4 text-slate-600">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    {expDate ? new Date(expDate).toLocaleDateString() : 'N/A'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-800 text-center font-bold">{product.qty || product.quantity || 1}</td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`inline-flex px-2 py-1 rounded-full text-[9px] font-bold border ${statusColor}`}>
                                    {statusText}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2.5">
                                    <button
                                      onClick={() => handleDeleteProduct(product.id)}
                                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all cursor-pointer"
                                      title="Delete item"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          
                          {filteredProducts.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-20 text-center text-slate-400 text-sm font-medium">
                                No items found in your inventory.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: CATEGORIES LIST */}
              {activeTab === 'categories' && (
                <motion.div
                  key="categories-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      Active Grocery Categories
                    </h3>
                    <button
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-slate-400" />
                      New Custom Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((c: any) => (
                      <div key={c.id} className="bg-white border border-slate-200 rounded-sm p-4.5 flex justify-between items-center group shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-500">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                              {c.user_id ? 'User Custom' : 'System Standard'}
                            </p>
                          </div>
                        </div>

                        {c.user_id && (
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-405 hover:text-rose-500 hover:border-rose-100 transition-all shrink-0 cursor-pointer"
                            title="Delete custom category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {categories.length === 0 && (
                      <div className="col-span-full py-20 text-center text-slate-400 text-sm">
                        No categories found.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}



            </AnimatePresence>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-6 text-center text-[10px] text-slate-400 font-medium bg-white">
        © 2026 Expirely. All rights reserved. Registered normal user console access dashboard.
      </footer>

      {/* MODAL 1: ADD CATEGORY */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-[#020617] backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 relative z-10 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-800">Add Custom Category</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dairy, Spices"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingCategory}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {isCreatingCategory ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Category
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
