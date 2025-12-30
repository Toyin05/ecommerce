import { useState, useMemo } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FilterSidebar } from "../components/FilterSidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { allProducts } from "../data/products";
import { Search, SlidersHorizontal, X, ArrowLeft, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { toast } from "sonner";

export function ProductListPage() {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const occasionParam = searchParams.get("occasion");
  const tagParam = searchParams.get("tag");
  const fromGiftFinder = searchParams.get("fromGiftFinder") === "true";
  const relationshipParam = searchParams.get("relationship");
  const ageGroupParam = searchParams.get("ageGroup");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    occasionParam ? [occasionParam] : []
  );
  
  // Set search query from tag parameter
  useState(() => {
    if (tagParam && !searchQuery) {
      setSearchQuery(tagParam);
    }
  });
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Quick filter tags
  const quickFilters = [
    { label: "For Him", category: "Fashion & Accessories", tag: "For Him" },
    { label: "For Her", category: "Fashion & Accessories", tag: "For Her" },
    { label: "Under $50", priceMax: 50 },
    { label: "Personalized Gifts", tag: "Customizable" },
  ];

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleOccasionToggle = (occasion: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasion)
        ? prev.filter((o) => o !== occasion)
        : [...prev, occasion]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const handleAvailabilityToggle = (availability: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(availability)
        ? prev.filter((a) => a !== availability)
        : [...prev, availability]
    );
  };

  const handleDeliveryTimeToggle = (time: string) => {
    setSelectedDeliveryTime((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleQuickFilter = (filter: any) => {
    if (filter.priceMax) {
      setPriceRange([0, filter.priceMax]);
    }
    if (filter.category && !selectedCategories.includes(filter.category)) {
      setSelectedCategories([...selectedCategories, filter.category]);
    }
    if (filter.tag) {
      setSearchQuery(filter.tag);
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setSelectedOccasions(occasionParam ? [occasionParam] : []);
    setSelectedRatings([]);
    setSelectedAvailability([]);
    setSelectedDeliveryTime([]);
    setSearchQuery("");
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filter by category from URL
    if (category) {
      const categoryMap: Record<string, string> = {
        "toys-games": "Toys & Games",
        "home-living": "Home & Living",
        "beauty-wellness": "Beauty & Wellness",
        "fashion-accessories": "Fashion & Accessories",
        "tech-gadgets": "Tech & Gadgets",
        "food-beverages": "Food & Beverages",
        "books-stationery": "Books & Stationery",
      };
      
      const categoryName = categoryMap[category];
      if (categoryName) {
        filtered = filtered.filter((p) => p.category === categoryName);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tag?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tag from URL
    if (tagParam) {
      filtered = filtered.filter(
        (p) => p.tag?.toLowerCase() === tagParam.toLowerCase()
      );
    }

    // Filter by price range
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price.replace("$", ""));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // Filter by occasions
    if (selectedOccasions.length > 0) {
      filtered = filtered.filter((p) =>
        p.occasion.some((o) => selectedOccasions.includes(o))
      );
    }

    // Filter by rating
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // Filter by availability
    if (selectedAvailability.length > 0) {
      filtered = filtered.filter((p) =>
        selectedAvailability.includes(p.availability)
      );
    }

    // Filter by delivery time
    if (selectedDeliveryTime.length > 0) {
      filtered = filtered.filter((p) =>
        selectedDeliveryTime.includes(p.deliveryTime)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) =>
            parseFloat(a.price.replace("$", "")) -
            parseFloat(b.price.replace("$", ""))
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            parseFloat(b.price.replace("$", "")) -
            parseFloat(a.price.replace("$", ""))
        );
        break;
      case "newest":
        filtered.reverse();
        break;
      case "popularity":
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return filtered;
  }, [
    category,
    searchQuery,
    priceRange,
    selectedCategories,
    selectedOccasions,
    selectedRatings,
    selectedAvailability,
    selectedDeliveryTime,
    sortBy,
  ]);

  const pageTitle = category
    ? category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : tagParam || occasionParam || "All Products";

  const activeFiltersCount =
    selectedCategories.length +
    selectedOccasions.length +
    selectedRatings.length +
    selectedAvailability.length +
    selectedDeliveryTime.length +
    (priceRange[0] !== 0 || priceRange[1] !== 500 ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Back Button and Restart Button */}
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-primary/10 h-10 text-sm self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            {fromGiftFinder && (
              <Button
                variant="outline"
                onClick={() => navigate("/?openGiftFinder=true")}
                className="gap-2 rounded-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-white w-full sm:w-auto sm:fixed sm:bottom-6 sm:right-6 sm:z-50 shadow-lg hover:shadow-xl transition-shadow h-10"
              >
                <Sparkles className="h-4 w-4" />
                Restart Shopping Assistant
              </Button>
            )}
          </div>
          
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3">
              {fromGiftFinder ? "Perfect Gifts For You 🎁" : `${pageTitle} 🎁`}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {fromGiftFinder 
                ? `Based on your preferences, here are gifts ${relationshipParam ? `for your ${relationshipParam}` : ""} ${ageGroupParam ? `(${ageGroupParam})` : ""}`
                : "Explore our best-selling gifts — find something perfect for every occasion!"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex gap-1 sm:gap-2 flex-wrap items-center">
            <span className="text-xs sm:text-sm text-muted-foreground mr-2">Quick Filters:</span>
            {quickFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickFilter(filter)}
                className="rounded-full h-8 text-xs sm:text-sm"
              >
                {filter.label}
              </Button>
            ))}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="rounded-full text-primary ml-auto h-8 text-xs sm:text-sm"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Clear All ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 lg:top-32">
              <FilterSidebar
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryToggle}
                selectedOccasions={selectedOccasions}
                onOccasionChange={handleOccasionToggle}
                selectedRatings={selectedRatings}
                onRatingChange={handleRatingToggle}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={handleAvailabilityToggle}
                selectedDeliveryTime={selectedDeliveryTime}
                onDeliveryTimeChange={handleDeliveryTimeToggle}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Sort Bar */}
            <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 rounded-full h-10"
                />
              </div>

              <div className="flex flex-col xs:flex-row gap-3">
                {/* Mobile Filter Button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden rounded-full h-10 flex-1 xs:flex-none xs:w-auto"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2">{activeFiltersCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <div className="mt-6">
                      <FilterSidebar
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        selectedCategories={selectedCategories}
                        onCategoryChange={handleCategoryToggle}
                        selectedOccasions={selectedOccasions}
                        onOccasionChange={handleOccasionToggle}
                        selectedRatings={selectedRatings}
                        onRatingChange={handleRatingToggle}
                        selectedAvailability={selectedAvailability}
                        onAvailabilityChange={handleAvailabilityToggle}
                        selectedDeliveryTime={selectedDeliveryTime}
                        onDeliveryTimeChange={handleDeliveryTimeToggle}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full xs:w-[200px] rounded-full h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group"
                  >
                    <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative aspect-square overflow-hidden bg-accent">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary text-white text-xs">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        {product.tag && (
                          <Badge variant="outline" className="mb-2 text-xs">
                            {product.tag}
                          </Badge>
                        )}
                        <h3 className="mb-2 line-clamp-2 text-sm sm:text-base">
                          {product.title}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-primary text-sm sm:text-base">
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full rounded-full h-9 text-xs sm:text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            toast.success(`${product.title} added to cart!`);
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-16">
                <h3 className="text-lg sm:text-xl mb-2">No products found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearAllFilters} className="rounded-full h-10">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
