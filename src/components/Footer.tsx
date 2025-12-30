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
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Gift className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm sm:text-base">Gifted & Co.</span>
                <span className="text-xs text-gray-400 hidden xs:block">Gift easy. Gift smart.</span>
              </div>
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
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base">Weekly Gift Ideas 💝</h4>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">
              Get inspiration and exclusive deals delivered to your inbox!
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full h-10 flex-1"
              />
              <Button className="rounded-full h-10 w-10 sm:w-auto px-4">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Subscribe</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © 2025 Gifted & Co. All rights reserved. Made with <Heart className="inline h-3 w-3 sm:h-4 sm:w-4 text-red-500" /> for thoughtful givers.
            </p>
            <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 flex-wrap justify-center">
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

