"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Render login page without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Render other admin pages with sidebar (middleware handles auth)
  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all"
          aria-label="Toggle Admin Menu"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 w-full min-w-0 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

