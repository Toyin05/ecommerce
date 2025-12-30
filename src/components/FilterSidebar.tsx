import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Star } from "lucide-react";

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  selectedOccasions: string[];
  onOccasionChange: (occasion: string) => void;
  selectedRatings: number[];
  onRatingChange: (rating: number) => void;
  selectedAvailability: string[];
  onAvailabilityChange: (availability: string) => void;
  selectedDeliveryTime: string[];
  onDeliveryTimeChange: (time: string) => void;
}

export function FilterSidebar({
  priceRange,
  onPriceChange,
  selectedCategories,
  onCategoryChange,
  selectedOccasions,
  onOccasionChange,
  selectedRatings,
  onRatingChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedDeliveryTime,
  onDeliveryTimeChange,
}: FilterSidebarProps) {
  const categories = [
    "Toys & Games",
    "Home & Living",
    "Fashion & Accessories",
    "Beauty & Wellness",
    "Food & Beverages",
    "Tech & Gadgets",
    "Books & Stationery",
  ];

  const occasions = [
    "Birthdays",
    "Weddings",
    "Anniversaries",
    "Baby Showers",
    "Graduations",
    "Corporate Events",
  ];

  const availabilityOptions = ["In Stock", "Pre-Order", "Limited Stock"];
  const deliveryTimeOptions = ["Same Day", "Next Day", "2-3 Days", "1 Week"];

  return (
    <div className="space-y-4 sm:space-y-6 pr-4 sm:pr-6">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Filters</h3>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={onPriceChange}
          max={500}
          step={10}
          className="mb-2 sm:mb-3"
        />
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Category</Label>
        <div className="space-y-1 sm:space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <label
                htmlFor={`category-${category}`}
                className="text-xs sm:text-sm cursor-pointer leading-tight"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Occasions */}
      <div>
        <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Occasion</Label>
        <div className="space-y-1 sm:space-y-2">
          {occasions.map((occasion) => (
            <div key={occasion} className="flex items-center space-x-2">
              <Checkbox
                id={`occasion-${occasion}`}
                checked={selectedOccasions.includes(occasion)}
                onCheckedChange={() => onOccasionChange(occasion)}
              />
              <label
                htmlFor={`occasion-${occasion}`}
                className="text-xs sm:text-sm cursor-pointer leading-tight"
              >
                {occasion}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Rating</Label>
        <div className="space-y-1 sm:space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={() => onRatingChange(rating)}
              />
              <label
                htmlFor={`rating-${rating}`}
                className="text-xs sm:text-sm cursor-pointer flex items-center gap-1 leading-tight"
              >
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-2 w-2 sm:h-3 sm:w-3 fill-primary text-primary" />
                ))}
                <span className="ml-1">& Up</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Availability</Label>
        <div className="space-y-1 sm:space-y-2">
          {availabilityOptions.map((availability) => (
            <div key={availability} className="flex items-center space-x-2">
              <Checkbox
                id={`availability-${availability}`}
                checked={selectedAvailability.includes(availability)}
                onCheckedChange={() => onAvailabilityChange(availability)}
              />
              <label
                htmlFor={`availability-${availability}`}
                className="text-xs sm:text-sm cursor-pointer leading-tight"
              >
                {availability}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Delivery Time */}
      <div>
        <Label className="mb-2 sm:mb-3 block text-sm sm:text-base">Delivery Time</Label>
        <div className="space-y-1 sm:space-y-2">
          {deliveryTimeOptions.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Checkbox
                id={`delivery-${time}`}
                checked={selectedDeliveryTime.includes(time)}
                onCheckedChange={() => onDeliveryTimeChange(time)}
              />
              <label
                htmlFor={`delivery-${time}`}
                className="text-xs sm:text-sm cursor-pointer leading-tight"
              >
                {time}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
