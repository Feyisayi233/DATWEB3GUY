"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Home, Gift, Heart, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useSession } from "next-auth/react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/airdrops", label: "Airdrops", icon: Gift },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/bookmarks", label: "Bookmarks", icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 sm:h-28 items-center gap-4 lg:gap-6">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center group transition-transform hover:scale-105"
            >
              <div className="relative h-20 w-48 sm:h-24 sm:w-60 md:h-28 md:w-72 lg:h-32 lg:w-80">
                <Image
                  src="/logo.png"
                  alt="DAT WEB3 GUY Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-2 lg:flex-1 lg:justify-start lg:pl-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative group",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  )}
                >
                  <Icon className={cn(
                    "h-4 w-4 transition-transform",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Search, Notifications & Mobile menu button */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
            <div className="hidden lg:block">
              <SearchBar />
            </div>
            
            {session && (
              <div className="hidden lg:block">
                <NotificationBell />
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 animate-slide-up">
            <div className="px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-2 space-y-2">
                <SearchBar />
                {session && (
                  <div className="px-4">
                    <NotificationBell />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

