import { Gift, Heart, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base text-white">Product Name</span>
              <span className="text-xs text-gray-400">Gift easy. Gift smart.</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Because every gift deserves a little thought. We help you celebrate life's special moments with the perfect presents.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base">Shop</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors block py-1">By Occasion</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">By Recipient</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">By Age</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">By Type</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">Gift Finder</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">Personalize</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base">Help & Support</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors block py-1">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">Gift Wrapping</a></li>
              <li><a href="#" className="hover:text-primary transition-colors block py-1">FAQs</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base">Ideas in Your Mail</h4>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">
              Get inspiration and exclusive deals delivered to your inbox!
            </p>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div style={{ width: '300px', minWidth: '200px', maxWidth: '200px' }}>
                <Input
                  type="text"
                  placeholder="Search for the Perfect Gift"
                  className="border-0 bg-transparent text-white placeholder:text-gray-400"
                  style={{
                    width: '100%',
                    height: '36px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    borderRadius: '20px',
                    borderWidth: '0.2px',
                    backgroundColor: '#FFFFFF',
                    color: '#717182',
                    fontSize: '12px'
                  }}
                />
              </div>
              <button 
                className="rounded-full border-0 text-white flex items-center justify-center whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity hover:shadow-lg"
                style={{
                  width: '80px',
                  height: '36px',
                  gap: '6px',
                  paddingLeft: '8px',
                  paddingRight: '10px',
                  borderRadius: '16px',
                  backgroundColor: '#FF8C42',
                  opacity: 1,
                  fontSize: '11px',
                  fontWeight: '600',
                  flexShrink: 0
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left">
              <p className="text-xs sm:text-sm text-gray-400">
                @2025 Product Name. All rights reserved.
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs sm:text-sm text-gray-400">
                Made with <Heart className="inline h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#FF8C42' }} /> for thoughtful givers
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 flex-wrap justify-center sm:justify-end">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

