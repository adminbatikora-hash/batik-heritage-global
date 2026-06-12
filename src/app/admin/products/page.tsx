"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Upload,
} from "lucide-react";

const products = [
  { id: "1", name: "Royal Parang Silk Shirt", sku: "BHG-MEN-001", price: 189, stock: 15, status: "Active", category: "Men Batik" },
  { id: "2", name: "Mega Mendung Dress", sku: "BHG-WMN-001", price: 259, stock: 8, status: "Active", category: "Women Batik" },
  { id: "3", name: "Kawung Premium Blazer", sku: "BHG-MEN-002", price: 349, stock: 5, status: "Active", category: "Men Batik" },
  { id: "4", name: "Truntum Elegant Gown", sku: "BHG-WMN-002", price: 499, stock: 3, status: "Low Stock", category: "Women Batik" },
  { id: "5", name: "Sogan Classic Kemeja", sku: "BHG-MEN-003", price: 149, stock: 22, status: "Active", category: "Men Batik" },
  { id: "6", name: "Ceplok Modern Blouse", sku: "BHG-WMN-003", price: 179, stock: 0, status: "Out of Stock", category: "Women Batik" },
];

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-foreground/50 text-sm mt-1">
            Manage your product catalog
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Product</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">SKU</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Category</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Price</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Stock</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Status</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-foreground/50">
                  {product.sku}
                </td>
                <td className="px-6 py-4 text-foreground/60">{product.category}</td>
                <td className="px-6 py-4 font-semibold">${product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : product.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="View">
                      <Eye className="w-4 h-4 text-foreground/40" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Edit">
                      <Edit className="w-4 h-4 text-foreground/40" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
