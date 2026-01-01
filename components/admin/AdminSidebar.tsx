"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Gift,
  LogOut,
  Shield,
  Zap,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/airdrops", label: "Airdrops", icon: Gift },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`fixed lg:static left-0 top-0 h-screen w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-black border-r border-gray-800 dark:border-gray-800 z-40 lg:z-auto transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 shadow-2xl flex-shrink-0`}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-800 dark:border-gray-800">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg flex-shrink-0">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-400 hidden sm:block">Content Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform",
                  isActive ? "" : "group-hover:scale-110"
                )} />
                <span className="font-semibold text-sm sm:text-base truncate">{item.label}</span>
                {isActive && (
                  <div className="absolute right-2 sm:right-3 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white flex-shrink-0"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-800 dark:border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-400 w-full transition-all duration-200 group"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-sm sm:text-base">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

