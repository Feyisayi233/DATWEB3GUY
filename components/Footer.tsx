import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-black text-gray-300 border-t border-gray-800 dark:border-gray-800 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.png"
                  alt="DAT WEB3 GUY Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-white">
                DAT WEB3 GUY
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md mb-6">
              Your trusted source for Web3 airdrops. Track the latest opportunities and never miss a chance to earn free tokens.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-sm font-semibold">X</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-sm font-semibold">in</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors cursor-pointer">
                <span className="text-sm font-semibold">tg</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/airdrops"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-500 transition-colors"></span>
                  Airdrops
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-500 transition-colors"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-500 transition-colors"></span>
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-500 transition-colors"></span>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-500 transition-colors"></span>
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-500 transition-colors"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} DAT WEB3 GUY. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Made with ❤️ for Web3</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

