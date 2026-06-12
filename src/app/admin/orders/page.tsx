"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Printer, Package } from "lucide-react";

const orders = [
  { id: "BTK-A7X9-K2M", customer: "Sarah Mitchell", email: "sarah@example.com", total: 349, items: 2, status: "Shipped", payment: "Paid", date: "2024-12-10" },
  { id: "BTK-B3F1-N8P", customer: "James Thompson", email: "james@example.com", total: 189, items: 1, status: "Processing", payment: "Paid", date: "2024-12-10" },
  { id: "BTK-C5H2-Q4R", customer: "Yuki Tanaka", email: "yuki@example.com", total: 499, items: 1, status: "Paid", payment: "Paid", date: "2024-12-09" },
  { id: "BTK-D8J4-T6S", customer: "Marie Dubois", email: "marie@example.com", total: 259, items: 1, status: "Delivered", payment: "Paid", date: "2024-12-08" },
  { id: "BTK-E1K6-V9W", customer: "Hans Mueller", email: "hans@example.com", total: 178, items: 1, status: "Pending", payment: "Unpaid", date: "2024-12-08" },
  { id: "BTK-F2L7-X1Y", customer: "Emily Chen", email: "emily@example.com", total: 698, items: 3, status: "Cancelled", payment: "Refunded", date: "2024-12-07" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Paid: "bg-blue-100 text-blue-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Unpaid: "bg-yellow-100 text-yellow-700",
  Refunded: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-foreground/50 text-sm mt-1">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Order</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Customer</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Total</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Items</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Status</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Payment</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Date</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-xs text-foreground/40">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold">${order.total}</td>
                <td className="px-6 py-4">{order.items}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentColors[order.payment]}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground/50">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg" aria-label="View order">
                      <Eye className="w-4 h-4 text-foreground/40" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg" aria-label="Print invoice">
                      <Printer className="w-4 h-4 text-foreground/40" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg" aria-label="Track shipping">
                      <Package className="w-4 h-4 text-foreground/40" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
