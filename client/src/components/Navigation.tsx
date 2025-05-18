import { useState } from "react";
import { Link } from "wouter";
import { Shield } from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-heading font-bold text-xl text-white">SafeRoute</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              How it Works
            </Link>
            <Link href="/map" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Live Map
            </Link>
            <Link href="/#community" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Community
            </Link>
            <button className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Sign In
            </button>
          </div>
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/#features">
              <a className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
            </Link>
            <Link href="/#how-it-works">
              <a className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">How it Works</a>
            </Link>
            <Link href="/map">
              <a className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Live Map</a>
            </Link>
            <Link href="/#community">
              <a className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Community</a>
            </Link>
            <button className="w-full bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-md font-medium transition-colors mt-3">
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
