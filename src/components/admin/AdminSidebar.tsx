"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  Settings,
  BarChart3,
  Truck,
  LogOut,
  Image as ImageIcon,
  MessageCircle,
  Headphones,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Chat (AI)", href: "/admin/chat", icon: MessageCircle },
  { name: "Live Chat", href: "/admin/chat/live", icon: Headphones },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
  { name: "Shipping", href: "/admin/shipping", icon: Truck },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-primary text-white flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex flex-col items-center space-y-2">
          <Image
            src="/batikora.png"
            alt="Batikora"
            width={150}
            height={150}
            className="h-14 w-auto"
          />
        </Link>
        <p className="text-[9px] tracking-widest text-accent uppercase mt-2 text-center">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-white/10 text-accent"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
