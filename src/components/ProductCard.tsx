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
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge */}
          {badge && (
            <Badge className="absolute top-3 left-3 bg-primary text-white border-0 shadow-md">
              {badge}
            </Badge>
          )}
          
          {/* Tag */}
          {tag && (
            <Badge className="absolute top-3 right-3 bg-secondary text-white border-0 shadow-md">
              {tag}
            </Badge>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-9 w-9 bg-white/90 hover:bg-white shadow-md"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Add to Cart - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              className="w-full rounded-full gap-2" 
              size="sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="line-clamp-2 min-h-[3rem]">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-primary">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
