import { Gift, Heart, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Gifted & Co.</span>
                <span className="text-xs text-gray-400">Gift easy. Gift smart.</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Because every gift deserves a little thought. We help you celebrate life's special moments with the perfect presents.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">By Occasion</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">By Recipient</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">By Age</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">By Type</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Gift Finder</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Personalize</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-4">Help & Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Gift Wrapping</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4">Weekly Gift Ideas 💝</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get inspiration and exclusive deals delivered to your inbox!
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full"
              />
              <Button className="rounded-full">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 Gifted & Co. All rights reserved. Made with <Heart className="inline h-4 w-4 text-red-500" /> for thoughtful givers.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
