import { Gift, Heart, ShoppingCart, Search, Sparkles, UserCircle, Menu, LogOut, User, Bell, ChevronDown, Headphones } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export function Header() {
  const { getTotalItems } = useCart();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };

    if (categoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoriesOpen]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 max-w-full overflow-hidden pt-2">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden rounded-full h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-80 p-0 flex flex-col h-full">
            <SheetHeader className="p-4 sm:p-6 pb-4">
              <SheetTitle className="text-left flex items-center gap-2">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Gift className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base sm:text-base">Gifted & Co.</span>
                  <span className="text-xs text-muted-foreground hidden sm:block">Gift easy. Gift smart.</span>
                </div>
              </SheetTitle>
              <SheetDescription className="text-sm">
                Navigate our gift collections and services
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
              {/* Search Bar */}
              <div className="mb-4 sm:mb-6">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for the perfect gift..."
                    className="pl-10 rounded-full border-muted bg-accent/50 h-10"
                  />
                </div>
              </div>

              {/* Shopping Assistant */}
              <Link to="/?openGiftFinder=true" onClick={() => setMobileMenuOpen(false)}>
                <Button 
                  size="lg" 
                  style={{
                    backgroundColor: '#FF8C42',
                    color: 'white',
                    borderRadius: '9999px',
                    fontWeight: '600',
                    border: 'none',
                    width: '100%',
                    height: '48px'
                  }}
                  className="gap-2 mb-4 hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="h-5 w-5" />
                  Shopping Assistant
                </Button>
              </Link>

              <Separator className="my-6" />

              {/* Auth Section - Mobile */}
              {!loading && (
                <div className="mb-4 sm:mb-6">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-xl">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm sm:text-base">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Signed in</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full gap-2 h-10"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full h-10">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-10">
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  )}
                  <Separator className="my-4 sm:my-6" />
                </div>
              )}

              {/* Categories */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-primary text-base sm:text-sm">By Occasion</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li>
                      <Link 
                        to="/products?occasion=Birthdays" 
                        className="block py-2 hover:text-primary transition-colors text-sm sm:text-base"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Birthdays
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products?occasion=Weddings" 
                        className="block py-2 hover:text-primary transition-colors text-sm sm:text-base"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Weddings
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products?occasion=Anniversaries" 
                        className="block py-2 hover:text-primary transition-colors text-sm sm:text-base"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Anniversaries
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products?occasion=Baby%20Showers" 
                        className="block py-2 hover:text-primary transition-colors text-sm sm:text-base"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Baby Showers
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products?occasion=Graduations" 
                        className="block py-2 hover:text-primary transition-colors text-sm sm:text-base"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Graduations
                      </Link>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 text-primary">By Recipient</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/products?tag=For%20Him" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Him
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products?tag=For%20Her" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Her
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products?tag=For%20Kids" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Kids
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Teens
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Colleagues
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        For Couples
                      </Link>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 text-primary">By Age</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/products" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Children
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Teens
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Adults
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Seniors
                      </Link>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 text-primary">By Type</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/products/toys-games" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Toys & Games
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products/home-living" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home & Living
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products/beauty-wellness" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Beauty & Wellness
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products/fashion-accessories" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Fashion & Accessories
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products/tech-gadgets" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tech & Gadgets
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products/food-beverages" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Food & Beverages
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/products" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        View All
                      </Link>
                    </li>
                  </ul>
                </div>

                <Separator />

                {/* Quick Links */}
                <div>
                  <h3 className="font-semibold mb-3 text-primary">Quick Links</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link 
                        to="/bulk-orders" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Souvenirs & Bulk Orders
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="#" 
                        className="block py-2 hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex flex-col flex-shrink-0 hover:opacity-80 transition-opacity">
          <span className="font-semibold text-white text-lg">Product Name</span>
          <span className="text-white/80 text-sm">Gift easy. Gift smart.</span>
        </Link>

        {/* Main Navigation - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2 flex-1 justify-center max-w-5xl">
          {/* Center-Left: Navigation Links */}
          <div className="flex items-center gap-2 xl:gap-3">
            {/* Categories with Mega Menu */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 px-2 py-2 text-white cursor-pointer whitespace-nowrap text-sm"
                style={{ opacity: 0.7 }}
              >
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Mega Menu Dropdown */}
              {categoriesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 rounded-2xl shadow-2xl border border-gray-200 bg-white"
                  style={{
                    width: '600px',
                    backgroundColor: '#FFFFFF',
                    padding: '24px',
                    opacity: 1,
                    zIndex: 99999,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    position: 'fixed',
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-4 gap-8 w-full">
                    {/* Column 1: By Occasion */}
                    <div className="min-h-[200px]">
                      <h3 className="font-medium text-gray-600 text-sm mb-4 font-semibold">By Occasion</h3>
                      <ul className="space-y-3">
                        <li><Link to="/products?occasion=Birthdays" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Birthdays</Link></li>
                        <li><Link to="/products?occasion=Weddings" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Weddings</Link></li>
                        <li><Link to="/products?occasion=Anniversaries" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Anniversaries</Link></li>
                        <li><Link to="/products?occasion=Baby%20Showers" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Baby Showers</Link></li>
                        <li><Link to="/products?occasion=Graduations" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Graduations</Link></li>
                      </ul>
                    </div>
                    
                    {/* Column 2: By Recipient */}
                    <div className="min-h-[200px]">
                      <h3 className="font-medium text-gray-600 text-sm mb-4 font-semibold">By Recipient</h3>
                      <ul className="space-y-3">
                        <li><Link to="/products?tag=For%20Him" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Him</Link></li>
                        <li><Link to="/products?tag=For%20Her" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Her</Link></li>
                        <li><Link to="/products?tag=For%20Kids" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Kids</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Teens</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Colleagues</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">For Couples</Link></li>
                      </ul>
                    </div>
                    
                    {/* Column 3: By Age */}
                    <div className="min-h-[200px]">
                      <h3 className="font-medium text-gray-600 text-sm mb-4 font-semibold">By Age</h3>
                      <ul className="space-y-3">
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Babies</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Toddlers</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Children</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Teens</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Adults</Link></li>
                        <li><Link to="/products" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Seniors</Link></li>
                      </ul>
                    </div>
                    
                    {/* Column 4: By Type */}
                    <div className="min-h-[200px]">
                      <h3 className="font-medium text-gray-600 text-sm mb-4 font-semibold">By Type</h3>
                      <ul className="space-y-3">
                        <li><Link to="/products/toys-games" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Toys & Games</Link></li>
                        <li><Link to="/products/home-living" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Home & Livings</Link></li>
                        <li><Link to="/products/beauty-wellness" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Beauty & Wellness</Link></li>
                        <li><Link to="/products/fashion-accessories" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Fashion & Accessories</Link></li>
                        <li><Link to="/products/tech-gadgets" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Tech & Gadgets</Link></li>
                        <li><Link to="/products/food-beverages" className="text-sm text-gray-800 hover:text-[#FF8C42] hover:underline cursor-pointer block py-1 transition-colors">Food & Beverages</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Other Navigation Items */}
            <div className="flex items-center gap-2 xl:gap-3">
              <Link 
                to="/bulk-orders" 
                className="px-2 py-2 text-white cursor-pointer whitespace-nowrap text-sm" 
                style={{ opacity: 0.7 }}
              >
                Souvenirier & Bulk Orders
              </Link>
            </div>
          </div>

          {/* Center: Shopping Assistant Button */}
          <Link to="/?openGiftFinder=true">
            <div 
              className="flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              style={{
                width: '160px',
                height: '36px',
                backgroundColor: '#FF8C42',
                borderRadius: '24px',
                paddingLeft: '14px',
                paddingRight: '14px',
                gap: '4px',
                opacity: 1,
                boxShadow: '0 4px 14px rgba(255, 140, 66, 0.4)',
                border: 'none'
              }}
            >
              <Sparkles className="h-3 w-3 text-white flex-shrink-0" />
              <span 
                className="text-white whitespace-nowrap"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}
              >
                Shopping Assistant
              </span>
            </div>
          </Link>

          {/* Center-Right: Search Bar */}
          <div className="relative flex-shrink-0">
            <div 
              className="flex items-center justify-between"
              style={{
                width: '180px',
                height: '36px',
                backgroundColor: '#F6F6F6',
                borderRadius: '24px',
                borderWidth: '0.2px',
                paddingLeft: '10px',
                paddingRight: '12px',
                gap: '6px',
                opacity: 1
              }}
            >
              <Input
                placeholder="Search..."
                className="border-0 bg-transparent text-gray-600 placeholder:text-[#717182] flex-1 px-0 text-xs"
                style={{ color: '#717182' }}
              />
              <Search className="h-3 w-3 text-[#717182]" />
            </div>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Cart Icon */}
          <Link to="/cart">
            <div
              className="rounded-full relative transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: getTotalItems() > 0 ? '#FF8C42' : 'transparent',
                padding: '6px',
                border: getTotalItems() > 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <ShoppingCart 
                className="h-4 w-4" 
                style={{
                  color: getTotalItems() > 0 ? '#FFFFFF' : '#FFFFFF'
                }}
              />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white text-[#FF8C42] text-xs flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </div>
          </Link>
          
          {/* Heart Icon */}
          <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer" title="Wishlist">
            <Heart className="h-4 w-4" />
          </Button>
          
          {/* Headphone Icon */}
          <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer" title="Support">
            <Headphones className="h-4 w-4" />
          </Button>
          
          {/* User Profile Icon */}
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="relative group">
              <Link to="/auth/login">
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer" title="Account">
                  <UserCircle className="h-4 w-4" />
                </Button>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b">
                  <p className="font-medium truncate">{user.email}</p>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/auth/login">
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:text-white/80 hover:bg-white/10 transition-all duration-200 cursor-pointer" title="Sign In">
                <UserCircle className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}








