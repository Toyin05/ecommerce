import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { allProducts } from "../data/products";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Gift,
  Tag,
} from "lucide-react";
import { useState } from "react";

export function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const subtotal = getTotalPrice();
  const discount = appliedPromo ? appliedPromo.discount : 0;
  const total = subtotal - discount;
  const deliveryFee = subtotal >= 50 ? 0 : 5.99;
  const finalTotal = total + deliveryFee;

  const handleApplyPromo = () => {
    if (promoCode === "GIFT10") {
      setAppliedPromo({ code: "GIFT10", discount: subtotal * 0.1 });
    } else if (promoCode === "WELCOME20") {
      setAppliedPromo({ code: "WELCOME20", discount: subtotal * 0.2 });
    }
  };

  // Get recommended products
  const recommendedProducts = allProducts.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 4);

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet. Let's find the perfect gift!
            </p>
            <Button size="lg" onClick={() => navigate("/products")} className="gap-2">
              <Gift className="h-5 w-5" />
              Start Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Progress Indicator */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-center gap-1 sm:gap-2 max-w-xs sm:max-w-md mx-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm">
                1
              </div>
              <span className="font-medium text-xs sm:text-sm hidden xs:inline">Cart</span>
            </div>
            <div className="h-0.5 w-8 sm:w-16 bg-muted-foreground/30" />
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs sm:text-sm">
                2
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm hidden xs:inline">Checkout</span>
            </div>
            <div className="h-0.5 w-8 sm:w-16 bg-muted-foreground/30" />
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs sm:text-sm">
                3
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm hidden xs:inline">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 hover:bg-primary/10 h-10 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Continue Shopping</span>
            <span className="xs:hidden">Back</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 order-2 lg:order-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-6">Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-lg border p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-full h-48 sm:h-40 lg:h-48 rounded-md overflow-hidden bg-muted flex-shrink-0 mx-auto sm:mx-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {item.category}
                    </p>
                    {item.personalization && (
                      <p className="text-xs sm:text-sm text-primary mt-1">
                        ✨ Personalized
                      </p>
                    )}
                    <p className="font-semibold text-sm sm:text-base mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <span className="w-8 sm:w-12 text-center text-sm sm:text-base">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      <Separator orientation="vertical" className="h-8 hidden sm:block" />

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 sm:gap-2 text-destructive hover:text-destructive px-2 sm:px-3 h-8 text-xs sm:text-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">Remove</span>
                      </Button>
                    </div>

                    <p className="font-semibold text-sm sm:text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-card rounded-lg border p-4 sm:p-6 sticky top-20 lg:top-24">
              <h2 className="text-lg sm:text-xl mb-3 sm:mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
                </div>

                {subtotal < 50 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free delivery!
                  </p>
                )}

                <Separator />

                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span className="font-semibold">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4 sm:mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Promo Code
                </label>
                <div className="flex flex-col xs:flex-row gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    className="gap-2 h-10"
                  >
                    <Tag className="h-4 w-4" />
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Try: GIFT10 or WELCOME20
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-sm sm:text-base"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12 text-sm sm:text-base"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-md text-sm">
                <p className="text-muted-foreground">
                  🎁 Estimated Delivery: 3-5 business days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {recommendedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-card rounded-lg border p-3 sm:p-4 hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-muted mb-2 sm:mb-3">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium line-clamp-2 mb-1 sm:mb-2 text-xs sm:text-sm">{product.title}</h3>
                  <p className="text-primary font-semibold text-xs sm:text-sm">${product.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

