import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getProductById, getRelatedProducts } from "../data/products";
import { useCart } from "../context/CartContext";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  CheckCircle,
  Truck,
  Package,
  PenLine,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = id ? getProductById(parseInt(id)) : null;
  const relatedProducts = id ? getRelatedProducts(parseInt(id)) : [];

  const [quantity, setQuantity] = useState(1);
  const [addMessageCard, setAddMessageCard] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendDirectly, setSendDirectly] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [personalizeGift, setPersonalizeGift] = useState(false);
  const [personalizationText, setPersonalizationText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl mb-4">Product Not Found</h1>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span>{product.title}</span>
        </div>

        {/* Product Details Section */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Image */}
          <div className="rounded-3xl overflow-hidden bg-accent">
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover aspect-square"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges and Tags */}
            <div className="flex gap-2 flex-wrap">
              {product.badge && (
                <Badge className="bg-primary text-white">{product.badge}</Badge>
              )}
              {product.tag && (
                <Badge variant="outline">{product.tag}</Badge>
              )}
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {product.availability}
              </Badge>
            </div>

            {/* Title and Price */}
            <div>
              <h1 className="text-3xl lg:text-4xl mb-3">{product.title}</h1>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < product.rating
                          ? "fill-primary text-primary"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div>
              <h3 className="mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-6 p-4 bg-accent rounded-2xl">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">{product.deliveryTime} Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm">Free Gift Wrap</span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-accent transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-accent transition-colors"
                >
                  +
                </button>
              </div>
              <Button 
                className="flex-1 rounded-full h-auto py-3"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      price: parseFloat(product.price.replace('$', '')),
                      image: product.image,
                      category: product.category,
                      personalization: personalizeGift ? personalizationText : undefined,
                    });
                  }
                  toast.success(`${product.title} added to cart!`);
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full">
                <Heart className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" className="flex-1 rounded-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Additional Options Section */}
        <div className="max-w-3xl mx-auto space-y-8 mb-16">
          <h2 className="text-2xl md:text-3xl text-center mb-8">
            Make It Extra Special ✨
          </h2>

          {/* Add Custom Message Card */}
          <div className="p-6 border-2 border-dashed rounded-3xl hover:border-primary transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <PenLine className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="mb-1">Add a Custom Message Card ✍️</h3>
                  <p className="text-sm text-muted-foreground">
                    Include a heartfelt message with your gift
                  </p>
                </div>
              </div>
              <Switch
                checked={addMessageCard}
                onCheckedChange={setAddMessageCard}
              />
            </div>
            {addMessageCard && (
              <div className="mt-4">
                <Textarea
                  placeholder="Write your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="rounded-2xl"
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Send Directly to Receiver */}
          <div className="p-6 border-2 border-dashed rounded-3xl hover:border-primary transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <Package className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="mb-1">Send Directly to Receiver 📦</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll ship it straight to their door
                  </p>
                </div>
              </div>
              <Switch
                checked={sendDirectly}
                onCheckedChange={setSendDirectly}
              />
            </div>
            {sendDirectly && (
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input
                    id="recipient-name"
                    placeholder="Enter recipient's name"
                    className="rounded-full mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="recipient-address">Delivery Address</Label>
                  <Textarea
                    id="recipient-address"
                    placeholder="Enter full delivery address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="rounded-2xl mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="recipient-phone">Phone Number</Label>
                  <Input
                    id="recipient-phone"
                    type="tel"
                    placeholder="Enter phone number"
                    className="rounded-full mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Personalize Gift */}
          <div className="p-6 border-2 border-dashed rounded-3xl hover:border-primary transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <Upload className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="mb-1">Personalize Gift 🎨</h3>
                  <p className="text-sm text-muted-foreground">
                    Add custom text or upload an image
                  </p>
                </div>
              </div>
              <Switch
                checked={personalizeGift}
                onCheckedChange={setPersonalizeGift}
              />
            </div>
            {personalizeGift && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="personalization-text">Custom Text</Label>
                  <Input
                    id="personalization-text"
                    placeholder="Enter name, initials, or message"
                    value={personalizationText}
                    onChange={(e) => setPersonalizationText(e.target.value)}
                    className="rounded-full mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="personalization-image">Upload Image</Label>
                  <div className="mt-1">
                    <label
                      htmlFor="personalization-image"
                      className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-2xl cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <span className="text-sm text-muted-foreground">
                          {selectedImage
                            ? selectedImage.name
                            : "Click to upload image"}
                        </span>
                      </div>
                      <input
                        id="personalization-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl text-center mb-8">
                You May Also Love... 💝
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow">
                      <div className="aspect-square overflow-hidden bg-accent">
                        <ImageWithFallback
                          src={relatedProduct.image}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 line-clamp-2">
                          {relatedProduct.title}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-primary">
                            {relatedProduct.price}
                          </span>
                          {relatedProduct.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {relatedProduct.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
