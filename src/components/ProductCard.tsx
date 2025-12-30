import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";
import { toast } from "sonner@2.0.3";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  tag?: string;
  category?: string;
}

export function ProductCard({ id, image, title, price, originalPrice, badge, tag, category }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      title,
      price: parseFloat(price.replace('$', '')),
      image,
      category: category || 'General',
    });
    toast.success(`${title} added to cart!`);
  };

  return (
    <Link to={`/product/${id}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl cursor-pointer">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-accent/50">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge */}
          {badge && (
            <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-white border-0 shadow-md text-xs">
              {badge}
            </Badge>
          )}
          
          {/* Tag */}
          {tag && (
            <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-secondary text-white border-0 shadow-md text-xs">
              {tag}
            </Badge>
          )}
          
          {/* Quick Actions - Always visible on mobile, hover on desktop */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9 bg-white/90 hover:bg-white shadow-md"
            >
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* Add to Cart - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/60 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button 
              className="w-full rounded-full gap-1 sm:gap-2 text-xs sm:text-sm" 
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Add to Cart</span>
              <span className="xs:hidden">Add</span>
            </Button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-3 sm:p-4 space-y-2">
          <h3 className="line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] text-sm sm:text-base leading-tight">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-primary font-semibold text-sm sm:text-base">{price}</span>
            {originalPrice && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
