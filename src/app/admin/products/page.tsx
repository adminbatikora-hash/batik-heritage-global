"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAt: number | null;
  stock: number;
  published: boolean;
  featured: boolean;
  material: string | null;
  description: string;
  shortDesc: string | null;
  categoryId: string;
  category: { id: string; name: string; slug: string } | null;
  images: { url: string; alt: string | null }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<Array<{ url: string; type: string; name: string }>>([]);

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    sku: "",
    price: "",
    compareAt: "",
    cost: "",
    weight: "",
    material: "",
    categoryId: "",
    stock: "",
    featured: false,
    imageUrls: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products?limit=100&admin=true");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {}
  }

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setMediaFiles((prev) => [...prev, ...data.files]);
        toast.success(`${data.files.length} file(s) uploaded!`);
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function resetForm() {
    setForm({ name: "", slug: "", description: "", shortDesc: "", sku: "", price: "", compareAt: "", cost: "", weight: "", material: "", categoryId: "", stock: "", featured: false, imageUrls: "" });
    setEditingId(null);
    setMediaFiles([]);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // Combine uploaded media files with manual URLs
    const manualUrls = form.imageUrls.split("\n").filter(Boolean).map((url, i) => ({ url: url.trim(), alt: `${form.name} - Image ${i + 1}` }));
    const uploadedMedia = mediaFiles.map((m, i) => ({ url: m.url, alt: `${form.name} - ${m.type === "video" ? "Video" : "Image"} ${i + 1}` }));
    const allImages = [...uploadedMedia, ...manualUrls];

    const payload = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description,
      shortDesc: form.shortDesc || null,
      sku: form.sku,
      price: parseFloat(form.price),
      compareAt: form.compareAt ? parseFloat(form.compareAt) : null,
      cost: form.cost ? parseFloat(form.cost) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      material: form.material || null,
      categoryId: form.categoryId,
      stock: parseInt(form.stock) || 0,
      featured: form.featured,
      images: allImages.length > 0 ? allImages : undefined,
    };

    try {
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

      if (res.ok) {
        toast.success(editingId ? "Product updated!" : "Product created!");
        resetForm();
        fetchProducts();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save product");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
  }

  function handleEdit(product: Product) {
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDesc: product.shortDesc || "",
      sku: product.sku,
      price: String(Number(product.price)),
      compareAt: product.compareAt ? String(Number(product.compareAt)) : "",
      cost: "",
      weight: "",
      material: product.material || "",
      categoryId: product.categoryId || "",
      stock: String(product.stock),
      featured: product.featured,
      imageUrls: "",
    });
    // Load existing images as media files for preview
    setMediaFiles(product.images.map((img) => ({ url: img.url, type: "image", name: img.alt || "product-image" })));
    setEditingId(product.id);
    setShowForm(true);
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products ({products.length})</h1>
          <p className="text-foreground/50 text-sm mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl mx-4 my-8 relative">
            <button onClick={resetForm} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-6">{editingId ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} required className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="Batik Tulis Premium..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="auto-generated" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU *</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="BTK-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="275" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Compare At Price ($)</label>
                  <input type="number" step="0.01" value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="350" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock *</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="10" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Material</label>
                  <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="Premium Cotton" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Short Description (SEO)</label>
                  <input type="text" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="Brief SEO-friendly description..." maxLength={160} />
                  <p className="text-xs text-foreground/40 mt-1">{form.shortDesc.length}/160 characters</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Full Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder="Detailed product description for SEO..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Media (Images & Videos)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-accent/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/mp4,video/webm,video/mov"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Plus className="w-6 h-6 text-foreground/40" />
                        </div>
                        <p className="text-sm font-medium">Click to upload images or videos</p>
                        <p className="text-xs text-foreground/40">JPG, PNG, WebP, MP4, WebM (max 50MB each)</p>
                      </div>
                    </label>
                  </div>
                  {uploading && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-accent">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading files...
                    </div>
                  )}
                  {/* Preview uploaded media */}
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {mediaFiles.map((media, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border bg-gray-50">
                          {media.type === "video" ? (
                            <video src={media.url} className="w-full h-20 object-cover" muted />
                          ) : (
                            <div className="relative w-full h-20">
                              <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => setMediaFiles(mediaFiles.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1 py-0.5 truncate">
                            {media.type === "video" ? "🎬" : "🖼️"} {media.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Manual URL input as fallback */}
                  <details className="mt-3">
                    <summary className="text-xs text-foreground/40 cursor-pointer hover:text-foreground/60">Or paste URLs manually</summary>
                    <textarea value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} rows={2} className="w-full mt-2 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" placeholder={"/products/batik1.png\nhttps://example.com/video.mp4"} />
                  </details>
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                    Featured Product (shown on homepage)
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? "Update Product" : "Create Product"}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2.5 border rounded-xl text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Product</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">SKU</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Price</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Stock</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Status</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-gray-100 flex-shrink-0">
                      {product.images[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${product.images[0]?.url ? 'hidden' : ''}`}>
                        <span className="text-[10px] text-gray-400">IMG</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <p className="text-xs text-foreground/40">{product.category?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-foreground/50">{product.sku}</td>
                <td className="px-6 py-4 font-semibold">${Number(product.price).toFixed(0)}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 5 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {product.stock > 5 ? "Active" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(product)} className="p-1.5 hover:bg-gray-100 rounded-lg" aria-label="Edit">
                      <Edit className="w-4 h-4 text-foreground/40" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg" aria-label="Delete">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-foreground/40">
                  No products found. Click &quot;Add Product&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
