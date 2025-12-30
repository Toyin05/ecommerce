import { Gift, Heart, ShoppingCart, Search, Sparkles, UserCircle, Menu, LogOut, User } from "lucide-react";
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
import { useState } from "react";
import { toast } from "sonner";

export function Header() {
  const { getTotalItems } = useCart();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
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
                <Button variant="default" size="lg" className="w-full gap-2 rounded-full bg-secondary hover:bg-secondary/90 mb-4 h-12 text-base">
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
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Gifted & Co.</span>
            <span className="text-xs text-muted-foreground hidden sm:block">Gift easy. Gift smart.</span>
          </div>
        </Link>

        {/* Main Navigation - Hidden on mobile */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[800px] p-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <h4 className="mb-3 text-sm text-muted-foreground">By Occasion</h4>
                      <ul className="space-y-2">
                        <li><Link to="/products?occasion=Birthdays" className="block py-1.5 hover:text-primary transition-colors">Birthdays</Link></li>
                        <li><Link to="/products?occasion=Weddings" className="block py-1.5 hover:text-primary transition-colors">Weddings</Link></li>
                        <li><Link to="/products?occasion=Anniversaries" className="block py-1.5 hover:text-primary transition-colors">Anniversaries</Link></li>
                        <li><Link to="/products?occasion=Baby%20Showers" className="block py-1.5 hover:text-primary transition-colors">Baby Showers</Link></li>
                        <li><Link to="/products?occasion=Graduations" className="block py-1.5 hover:text-primary transition-colors">Graduations</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm text-muted-foreground">By Recipient</h4>
                      <ul className="space-y-2">
                        <li><Link to="/products?tag=For%20Him" className="block py-1.5 hover:text-primary transition-colors">For Him</Link></li>
                        <li><Link to="/products?tag=For%20Her" className="block py-1.5 hover:text-primary transition-colors">For Her</Link></li>
                        <li><Link to="/products?tag=For%20Kids" className="block py-1.5 hover:text-primary transition-colors">For Kids</Link></li>
                        <li><Link to="/products" className="block py-1.5 hover:text-primary transition-colors">For Teens</Link></li>
                        <li><Link to="/products" className="block py-1.5 hover:text-primary transition-colors">For Colleagues</Link></li>
                        <li><Link to="/products" className="block py-1.5 hover:text-primary transition-colors">For Couples</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm text-muted-foreground">By Age</h4>
                      <ul className="space-y-2">
                        <li><Link to="/products" className="block py-1.5 hover:text-primary transition-colors">Children</Link></li>
                        <li><Link to="/products" className="block py-1.5 hover:text-primary transition-colors">Teens</Link></li>
                        <li><Link to="/products" className="block py-1.5 hover:text-primary transition-colors">Adults</Link></li>
                        <li><Link to="/products" className="block py-1.5 hover:text-primary transition-colors">Seniors</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm text-muted-foreground">By Type</h4>
                      <ul className="space-y-2">
                        <li><Link to="/products/toys-games" className="block py-1.5 hover:text-primary transition-colors">Toys & Games</Link></li>
                        <li><Link to="/products/home-living" className="block py-1.5 hover:text-primary transition-colors">Home & Living</Link></li>
                        <li><Link to="/products/beauty-wellness" className="block py-1.5 hover:text-primary transition-colors">Beauty & Wellness</Link></li>
                        <li><Link to="/products/fashion-accessories" className="block py-1.5 hover:text-primary transition-colors">Fashion & Accessories</Link></li>
                        <li><Link to="/products/tech-gadgets" className="block py-1.5 hover:text-primary transition-colors">Tech & Gadgets</Link></li>
                        <li><Link to="/products/food-beverages" className="block py-1.5 hover:text-primary transition-colors">Food & Beverages</Link></li>
                        <li><Link to="/products" className="block py-1.5 hover:text-primary transition-colors">View All</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/?openGiftFinder=true">
                <Button variant="default" size="sm" className="gap-2 rounded-full bg-secondary hover:bg-secondary/90">
                  <Sparkles className="h-4 w-4" />
                  Shopping Assistant
                </Button>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/bulk-orders" className="px-3 py-2 hover:text-primary transition-colors">
                  Souvenirs & Bulk Orders
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href="#" className="px-3 py-2 hover:text-primary transition-colors">
                Support
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for the perfect gift..."
              className="pl-10 rounded-full border-muted bg-accent/50"
            />
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </Button>
          
          {/* Auth Button / User Menu */}
          {loading ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="relative group">
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-5 w-5" />
              </Button>
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
              <Button variant="ghost" size="icon" className="rounded-full" title="Sign In">
                <UserCircle className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
