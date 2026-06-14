"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
} from "lucide-react";

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string | null };
  }>;
  topProducts: Array<{
    name: string;
    sold: number;
    price: number;
  }>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { title: "Total Products", value: data?.totalProducts || 0, icon: Package, color: "bg-blue-100 text-blue-600" },
    { title: "Total Orders", value: data?.totalOrders || 0, icon: ShoppingCart, color: "bg-purple-100 text-purple-600" },
    { title: "Revenue", value: `$${(data?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: "bg-green-100 text-green-600" },
    { title: "Customers", value: data?.totalCustomers || 0, icon: Users, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-foreground/50 text-sm mt-1">
          Real-time data from your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-foreground/50 mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-secondary hover:underline">View All</Link>
          </div>
          {data?.recentOrders && data.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-foreground/50 border-b">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                      <td className="py-3">{order.user?.name || order.user?.email || "Guest"}</td>
                      <td className="py-3 font-medium">${Number(order.total).toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-foreground/40 text-sm">No orders yet.</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Top Products</h2>
            <Link href="/admin/products" className="text-sm text-secondary hover:underline">View All</Link>
          </div>
          {data?.topProducts && data.topProducts.length > 0 ? (
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-secondary">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-foreground/50">{product.sold} sold</p>
                  </div>
                  <span className="text-sm font-semibold">${Number(product.price).toFixed(0)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-foreground/40 text-sm">No products yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
