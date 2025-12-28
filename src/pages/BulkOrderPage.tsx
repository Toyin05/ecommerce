import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useBulkOrder } from "../context/BulkOrderContext";
import { allProducts } from "../data/products";
import {
  Search,
  Filter,
  ShoppingBag,
  MessageSquare,
  Upload,
  Package,
  Minus,
  Plus,
  X,
  Check,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner@2.0.3";

export function BulkOrderPage() {
  const { items, addItem, removeItem, updateQuantity, updateCustomization, getTotalItems, getTotalPrice, clearOrder } = useBulkOrder();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOccasion, setSelectedOccasion] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [currentStep, setCurrentStep] = useState<"selection" | "customization" | "checkout">("selection");
  const [sheetOpen, setSheetOpen] = useState(false);

  // Company/checkout details
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    deliveryDate: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Filter products (only show products suitable for bulk orders)
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesOccasion = selectedOccasion === "all" || product.occasion.includes(selectedOccasion);
    
    let matchesPrice = true;
    const price = parseFloat(product.price.replace("$", ""));
    if (priceRange === "under50") matchesPrice = price < 50;
    else if (priceRange === "50to100") matchesPrice = price >= 50 && price <= 100;
    else if (priceRange === "over100") matchesPrice = price > 100;

    return matchesSearch && matchesCategory && matchesOccasion && matchesPrice;
  });

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));
  const occasions = Array.from(new Set(allProducts.flatMap((p) => p.occasion)));

  const handleAddToBulkOrder = (product: typeof allProducts[0]) => {
    addItem(product, 10); // Default minimum quantity
    toast.success(`Added ${product.title} to bulk order`);
  };

  const handleProceedToCustomization = () => {
    if (items.length === 0) {
      toast.error("Please add items to your bulk order first");
      return;
    }
    setCurrentStep("customization");
    setSheetOpen(false);
    window.scrollTo(0, 0);
  };

  const handleProceedToCheckout = () => {
    setCurrentStep("checkout");
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = () => {
    if (!companyDetails.companyName || !companyDetails.contactPerson || !companyDetails.email) {
      toast.error("Please fill in all required company details");
      return;
    }
    toast.success("Bulk order placed successfully! We'll contact you shortly. 🎉");
    clearOrder();
    setCurrentStep("selection");
    setCompanyDetails({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      deliveryDate: "",
    });
  };

  const calculateBulkDiscount = (totalPrice: number) => {
    if (totalPrice > 1000) return 0.15; // 15% discount
    if (totalPrice > 500) return 0.10; // 10% discount
    if (totalPrice > 250) return 0.05; // 5% discount
    return 0;
  };

  const subtotal = getTotalPrice();
  const discountRate = calculateBulkDiscount(subtotal);
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      {currentStep === "selection" && (
        <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1745970649913-2edb9dca4f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBnaWZ0cyUyMHRlYW18ZW58MXx8fHwxNzYxNjY0MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Bulk gifts"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 py-16 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl mb-4">
                Need gifts for your team, clients, or event? We've got you covered 🎁
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Bulk discounts, personalized packaging, and fast delivery — all in one place.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    document.getElementById("product-selection")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Start a Bulk Order
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-secondary text-secondary hover:bg-secondary/10"
                >
                  <MessageSquare className="h-5 w-5" />
                  Talk to a Gift Consultant
                </Button>
              </div>

              {/* Bulk Discount Info */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-card/80 backdrop-blur-sm rounded-lg border p-4">
                  <p className="font-semibold text-primary">5% OFF</p>
                  <p className="text-sm text-muted-foreground">Orders $250+</p>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-lg border p-4">
                  <p className="font-semibold text-primary">10% OFF</p>
                  <p className="text-sm text-muted-foreground">Orders $500+</p>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-lg border p-4">
                  <p className="font-semibold text-primary">15% OFF</p>
                  <p className="text-sm text-muted-foreground">Orders $1000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Product Selection Step */}
        {currentStep === "selection" && (
          <div id="product-selection">
            {/* Filter and Search Bar */}
            <div className="mb-8 bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Filter & Search</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Occasion</Label>
                  <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Occasions</SelectItem>
                      {occasions.map((occ) => (
                        <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Price Range</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under50">Under $50</SelectItem>
                      <SelectItem value="50to100">$50 - $100</SelectItem>
                      <SelectItem value="over100">Over $100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Delivery Time</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="next-day">Next Day</SelectItem>
                      <SelectItem value="2-3-days">2-3 Days</SelectItem>
                      <SelectItem value="1-week">Within 1 Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for gifts available in bulk..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="customizable"
                    checked={customizableOnly}
                    onCheckedChange={(checked) => setCustomizableOnly(checked as boolean)}
                  />
                  <Label htmlFor="customizable" className="cursor-pointer">
                    Customizable Items Only
                  </Label>
                </div>
              </div>
            </div>

            {/* Floating Bulk Order Button */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SheetTrigger asChild>
                        <Button
                          size="lg"
                          className="fixed bottom-8 right-8 h-20 w-20 rounded-full shadow-lg hover:shadow-xl transition-all z-50 p-0 bg-gradient-to-br from-primary to-secondary hover:scale-110"
                        >
                          <div className="flex flex-col items-center justify-center relative w-full h-full">
                            <ShoppingBag className="h-7 w-7" />
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                              <defs>
                                <path
                                  id="circlePath"
                                  d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                                />
                              </defs>
                              <text className="fill-white text-[8px] tracking-wider" style={{ fontWeight: 600 }}>
                                <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
                                  BULK ORDER CHECKOUT
                                </textPath>
                              </text>
                            </svg>
                            {getTotalItems() > 0 && (
                              <Badge className="absolute -top-3 -right-3 h-8 w-8 rounded-full p-0 flex items-center justify-center font-semibold bg-red-500 border-4 border-white shadow-md animate-in zoom-in duration-200">
                                {getTotalItems()}
                              </Badge>
                            )}
                          </div>
                        </Button>
                      </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Review My Bulk Order</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>My Bulk Order 🎁</SheetTitle>
                    <SheetDescription>
                      Review your bulk order items and proceed to customization
                    </SheetDescription>
                  </SheetHeader>

                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">No items in bulk order</p>
                        <p className="text-sm text-muted-foreground">
                          Add items from the product list
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 py-6">
                          {items.map((item) => (
                            <div key={item.product.id} className="flex gap-3 border rounded-lg p-3">
                              <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                <ImageWithFallback
                                  src={item.product.image}
                                  alt={item.product.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium line-clamp-2 text-sm mb-1">
                                  {item.product.title}
                                </p>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {item.product.price} per unit
                                </p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    disabled={item.quantity <= 10}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium w-12 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 ml-auto"
                                    onClick={() => removeItem(item.product.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="space-y-2 py-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          {discountRate > 0 && (
                            <div className="flex justify-between text-sm text-primary">
                              <span>Bulk Discount ({(discountRate * 100).toFixed(0)}%)</span>
                              <span>-${discount.toFixed(2)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleProceedToCustomization}
                        >
                          Proceed to Customization
                        </Button>
                      </>
                    )}
                  </SheetContent>
              </Sheet>

            {/* Product Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">
                  {filteredProducts.length} products available for bulk orders
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          Min. 10 units
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Personalize
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Per unit</p>
                          <p className="font-semibold">{product.price}</p>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleAddToBulkOrder(product)}
                      >
                        Add to Bulk Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customization Step */}
        {currentStep === "customization" && (
          <div>
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("selection")}
                className="mb-4"
              >
                ← Back to Product Selection
              </Button>
              <h2 className="text-3xl mb-2">Customize Your Bulk Order</h2>
              <p className="text-muted-foreground">
                Add personalization to make your gifts extra special
              </p>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="bg-card rounded-lg border p-6">
                  <div className="flex gap-4 mb-6">
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} units
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`logo-${item.product.id}`}>Add Company Logo</Label>
                      <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload logo (PNG, JPG)
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`message-${item.product.id}`}>
                        Personalized Message Card
                      </Label>
                      <Textarea
                        id={`message-${item.product.id}`}
                        placeholder="Enter your message for the gift card..."
                        rows={4}
                        className="mt-2"
                        onChange={(e) =>
                          updateCustomization(item.product.id, { message: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor={`packaging-${item.product.id}`}>
                        Packaging Option
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          updateCustomization(item.product.id, { packaging: value })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select packaging" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Gift Box</SelectItem>
                          <SelectItem value="premium">Premium Gift Wrap (+$2/unit)</SelectItem>
                          <SelectItem value="branded">Branded Box (+$3/unit)</SelectItem>
                          <SelectItem value="eco">Eco-Friendly Wrap (+$1.50/unit)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`delivery-note-${item.product.id}`}>
                        Delivery Instructions
                      </Label>
                      <Textarea
                        id={`delivery-note-${item.product.id}`}
                        placeholder="e.g., Deliver directly to employees"
                        rows={4}
                        className="mt-2"
                        onChange={(e) =>
                          updateCustomization(item.product.id, { deliveryNote: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center bg-card rounded-lg border p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Order Value</p>
                <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
                {discountRate > 0 && (
                  <p className="text-sm text-primary">
                    {(discountRate * 100).toFixed(0)}% bulk discount applied
                  </p>
                )}
              </div>
              <Button size="lg" onClick={handleProceedToCheckout}>
                Continue to Checkout
              </Button>
            </div>
          </div>
        )}

        {/* Checkout Step */}
        {currentStep === "checkout" && (
          <div>
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("customization")}
                className="mb-4"
              >
                ← Back to Customization
              </Button>
              <h2 className="text-3xl mb-2">Complete Your Bulk Order</h2>
              <p className="text-muted-foreground">
                Enter your company details and finalize the order
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Company Details */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="font-semibold mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Company Name *</Label>
                      <Input
                        id="company-name"
                        placeholder="Your Company Ltd."
                        value={companyDetails.companyName}
                        onChange={(e) =>
                          setCompanyDetails({ ...companyDetails, companyName: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-person">Contact Person *</Label>
                        <Input
                          id="contact-person"
                          placeholder="John Doe"
                          value={companyDetails.contactPerson}
                          onChange={(e) =>
                            setCompanyDetails({
                              ...companyDetails,
                              contactPerson: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={companyDetails.email}
                          onChange={(e) =>
                            setCompanyDetails({ ...companyDetails, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={companyDetails.phone}
                          onChange={(e) =>
                            setCompanyDetails({ ...companyDetails, phone: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="delivery-date">Preferred Delivery Date</Label>
                        <Input
                          id="delivery-date"
                          type="date"
                          value={companyDetails.deliveryDate}
                          onChange={(e) =>
                            setCompanyDetails({
                              ...companyDetails,
                              deliveryDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        placeholder="123 Business Street, Suite 100, New York, NY 10001"
                        rows={3}
                        value={companyDetails.address}
                        onChange={(e) =>
                          setCompanyDetails({ ...companyDetails, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-lg border p-6">
                  <h3 className="font-semibold mb-4">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          Credit / Debit Card
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                          Bank Transfer
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="invoice" id="invoice" />
                        <Label htmlFor="invoice" className="flex-1 cursor-pointer">
                          Invoice Request (30-day terms)
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "invoice" && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <Check className="inline h-4 w-4 mr-1 text-primary" />
                        We'll send you an invoice after order confirmation. Payment due within 30 days.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border p-6 sticky top-20">
                  <h3 className="font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-3 text-sm">
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <ImageWithFallback
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="line-clamp-2">{item.product.title}</p>
                          <p className="text-muted-foreground">
                            {item.quantity} × {item.product.price}
                          </p>
                          {item.customization?.packaging && (
                            <p className="text-xs text-muted-foreground">
                              {item.customization.packaging} packaging
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discountRate > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Bulk Discount ({(discountRate * 100).toFixed(0)}%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Items</span>
                      <span>{getTotalItems()} units</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    onClick={handlePlaceOrder}
                  >
                    Place Bulk Order
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    A gift consultant will contact you within 24 hours to confirm your order
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
