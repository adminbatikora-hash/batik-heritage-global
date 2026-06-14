"use client";

import { useEffect, useState } from "react";
import { Search, Package } from "lucide-react";
import toast from "react-hot-toast";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user: { name: string | null; email: string | null };
  items: Array<{ name: string; quantity: number }>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

const paymentColors: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  UNPAID: "bg-yellow-100 text-yellow-700",
  REFUNDED: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders() {
    try {
      const url = statusFilter === "all" ? "/api/orders" : `/api/orders?status=${statusFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Order updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Network error");
    }
  }

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase())
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
      <div>
        <h1 className="text-2xl font-bold">Orders ({orders.length})</h1>
        <p className="text-foreground/50 text-sm mt-1">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50">
          <option value="all">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
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
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Status</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Payment</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Date</th>
              <th className="text-left px-6 py-4 font-medium text-foreground/50">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs">{order.orderNumber}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.user?.name || "Guest"}</p>
                    <p className="text-xs text-foreground/40">{order.user?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold">${Number(order.total).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status] || "bg-gray-100"}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus] || "bg-gray-100"}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-foreground/50">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg" aria-label="View order">
                    <Package className="w-4 h-4 text-foreground/40" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-foreground/40">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
