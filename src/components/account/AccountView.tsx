"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, Settings, LogOut } from "lucide-react";

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "orders", name: "Orders", icon: Package },
  { id: "wishlist", name: "Wishlist", icon: Heart },
  { id: "addresses", name: "Addresses", icon: MapPin },
  { id: "settings", name: "Settings", icon: Settings },
];

export default function AccountView() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card-solid p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-accent/10 text-secondary font-medium"
                      : "text-foreground/60 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </button>
              ))}
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-solid p-8"
            >
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  <form className="space-y-4 max-w-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+1 234 567 8900"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>
                  <div className="text-center py-12 text-foreground/40">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No orders yet. Start shopping!</p>
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
                  <div className="text-center py-12 text-foreground/40">
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Your wishlist is empty. Browse our collections!</p>
                  </div>
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
                  <div className="text-center py-12 text-foreground/40">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No saved addresses. Add one for faster checkout!</p>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                  <div className="space-y-6 max-w-lg">
                    <div className="p-4 border rounded-xl">
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-foreground/50 mt-1">
                        Update your password for security
                      </p>
                      <button className="text-sm text-secondary mt-3 hover:underline">
                        Change Password
                      </button>
                    </div>
                    <div className="p-4 border rounded-xl">
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-foreground/50 mt-1">
                        Manage your email preferences
                      </p>
                      <label className="flex items-center gap-2 mt-3 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        Order updates
                      </label>
                      <label className="flex items-center gap-2 mt-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        New arrivals & promotions
                      </label>
                    </div>
                    <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                      <h3 className="font-medium text-red-700">Delete Account</h3>
                      <p className="text-sm text-red-600/70 mt-1">
                        Permanently delete your account and all data
                      </p>
                      <button className="text-sm text-red-600 mt-3 hover:underline">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
