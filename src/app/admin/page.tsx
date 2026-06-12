"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Eye,
} from "lucide-react";

const stats = [
  {
    title: "Revenue Today",
    value: "$2,847",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Revenue This Month",
    value: "$48,392",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Orders",
    value: "156",
    change: "+23.1%",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Customers",
    value: "5,234",
    change: "+4.7%",
    trend: "up",
    icon: Users,
    color: "bg-orange-100 text-orange-600",
  },
];

const recentOrders = [
  { id: "BTK-A7X9-K2M", customer: "Sarah Mitchell", total: "$349", status: "Shipped", date: "2 hours ago" },
  { id: "BTK-B3F1-N8P", customer: "James Thompson", total: "$189", status: "Processing", date: "4 hours ago" },
  { id: "BTK-C5H2-Q4R", customer: "Yuki Tanaka", total: "$499", status: "Paid", date: "6 hours ago" },
  { id: "BTK-D8J4-T6S", customer: "Marie Dubois", total: "$259", status: "Delivered", date: "1 day ago" },
  { id: "BTK-E1K6-V9W", customer: "Hans Mueller", total: "$178", status: "Pending", date: "1 day ago" },
];

const topProducts = [
  { name: "Royal Parang Silk Shirt", sold: 128, revenue: "$24,192" },
  { name: "Mega Mendung Dress", sold: 96, revenue: "$24,864" },
  { name: "Kawung Premium Blazer", sold: 74, revenue: "$25,826" },
  { name: "Truntum Elegant Gown", sold: 52, revenue: "$25,948" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Paid: "bg-blue-100 text-blue-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-foreground/50 text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
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
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </span>
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
            <button className="text-sm text-secondary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-foreground/50 border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs">{order.id}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3 font-medium">{order.total}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-foreground/50">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Top Products</h2>
            <button className="text-sm text-secondary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-secondary">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-foreground/50">{product.sold} sold</p>
                </div>
                <span className="text-sm font-semibold">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Rate Card */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Conversion Rate</h3>
            <p className="text-4xl font-bold mt-2">3.8%</p>
            <p className="text-white/60 text-sm mt-1">+0.5% from last month</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Visitors Today</p>
            <p className="text-2xl font-bold">1,247</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-white/60">
                <Eye className="w-3 h-3" />
                Page Views: 4,891
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
