import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { PaystackPayment } from "../components/PaystackPayment";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Truck,
  Gift,
  Calendar as CalendarIcon,
  Check,
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";

// Helper function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatShortDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Delivery Info State
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [sendToRecipient, setSendToRecipient] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState({
    name: "",
    phone: "",
    note: "",
  });

  // Gift Options State
  const [giftOptions, setGiftOptions] = useState({
    addMessageCard: false,
    message: "",
    giftWrap: false,
    deliveryDate: undefined as Date | undefined,
    deliverASAP: true,
  });



  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 50 ? 0 : 5.99;
  const giftWrapFee = giftOptions.giftWrap ? 4.99 : 0;
  const total = subtotal + deliveryFee + giftWrapFee;

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate delivery info
      if (!deliveryInfo.name || !deliveryInfo.email || !deliveryInfo.address) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (sendToRecipient && !recipientInfo.name) {
        toast.error("Please fill in recipient information");
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSuccess = (payment: any) => {
    // Payment has been verified by the server
    toast.success("Order placed successfully! 🎉");
    clearCart();
    navigate("/");
  };

  // Redirect to cart if no items
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  const steps = [
    { number: 1, label: "Delivery Info" },
    { number: 2, label: "Gift Options" },
    { number: 3, label: "Payment" },
  ];

  // Don't render checkout if cart is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Progress Indicator */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={cn(
                      "transition-colors hidden sm:inline",
                      currentStep >= step.number
                        ? "font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-12 sm:w-16 mx-2 transition-colors",
                      currentStep > step.number
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="gap-2 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Information */}
            {currentStep === 1 && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl mb-6">Delivery Information</h2>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={deliveryInfo.name}
                        onChange={(e) =>
                          setDeliveryInfo({ ...deliveryInfo, name: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={deliveryInfo.email}
                        onChange={(e) =>
                          setDeliveryInfo({ ...deliveryInfo, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={deliveryInfo.address}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
                      }
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={deliveryInfo.city}
                        onChange={(e) =>
                          setDeliveryInfo({ ...deliveryInfo, city: e.target.value })
                        }
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={deliveryInfo.state}
                        onChange={(e) =>
                          setDeliveryInfo({ ...deliveryInfo, state: e.target.value })
                        }
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={deliveryInfo.zipCode}
                        onChange={(e) =>
                          setDeliveryInfo({ ...deliveryInfo, zipCode: e.target.value })
                        }
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Send to Recipient Option */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label htmlFor="recipient-toggle" className="cursor-pointer">
                        Send directly to recipient
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        We'll deliver the gift directly to your recipient
                      </p>
                    </div>
                    <Switch
                      id="recipient-toggle"
                      checked={sendToRecipient}
                      onCheckedChange={setSendToRecipient}
                    />
                  </div>

                  {sendToRecipient && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-medium">Recipient Information</h3>
                      <div>
                        <Label htmlFor="recipient-name">Recipient Name *</Label>
                        <Input
                          id="recipient-name"
                          value={recipientInfo.name}
                          onChange={(e) =>
                            setRecipientInfo({ ...recipientInfo, name: e.target.value })
                          }
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipient-phone">Recipient Phone</Label>
                        <Input
                          id="recipient-phone"
                          type="tel"
                          value={recipientInfo.phone}
                          onChange={(e) =>
                            setRecipientInfo({ ...recipientInfo, phone: e.target.value })
                          }
                          placeholder="+1 (555) 987-6543"
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipient-note">Delivery Note</Label>
                        <Textarea
                          id="recipient-note"
                          value={recipientInfo.note}
                          onChange={(e) =>
                            setRecipientInfo({ ...recipientInfo, note: e.target.value })
                          }
                          placeholder="Special delivery instructions..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button size="lg" onClick={handleNextStep}>
                    Continue to Gift Options
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Gift Options */}
            {currentStep === 2 && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl mb-6">Gift Options</h2>

                <div className="space-y-6">
                  {/* Message Card */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Gift className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="message-card" className="cursor-pointer">
                            Add a personalized message card
                          </Label>
                          <p className="text-sm text-muted-foreground">FREE</p>
                        </div>
                      </div>
                      <Switch
                        id="message-card"
                        checked={giftOptions.addMessageCard}
                        onCheckedChange={(checked) =>
                          setGiftOptions({ ...giftOptions, addMessageCard: checked })
                        }
                      />
                    </div>

                    {giftOptions.addMessageCard && (
                      <div>
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea
                          id="message"
                          value={giftOptions.message}
                          onChange={(e) =>
                            setGiftOptions({ ...giftOptions, message: e.target.value })
                          }
                          placeholder="Write your heartfelt message here... (max 200 characters)"
                          rows={4}
                          maxLength={200}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {giftOptions.message.length}/200 characters
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Gift Wrap */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Gift className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <Label htmlFor="gift-wrap" className="cursor-pointer">
                            Premium Gift Wrapping
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Beautiful wrap with ribbon - $4.99
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="gift-wrap"
                        checked={giftOptions.giftWrap}
                        onCheckedChange={(checked) =>
                          setGiftOptions({ ...giftOptions, giftWrap: checked })
                        }
                      />
                    </div>
                  </div>

                  {/* Delivery Date */}
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">Delivery Schedule</h3>
                    
                    <RadioGroup
                      value={giftOptions.deliverASAP ? "asap" : "scheduled"}
                      onValueChange={(value) =>
                        setGiftOptions({
                          ...giftOptions,
                          deliverASAP: value === "asap",
                        })
                      }
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <RadioGroupItem value="asap" id="asap" />
                        <Label htmlFor="asap" className="cursor-pointer">
                          Deliver ASAP (3-5 business days)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <Label htmlFor="scheduled" className="cursor-pointer">
                          Schedule delivery date
                        </Label>
                      </div>
                    </RadioGroup>

                    {!giftOptions.deliverASAP && (
                      <div className="mt-4">
                        <Label>Select Delivery Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left mt-2",
                                !giftOptions.deliveryDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {giftOptions.deliveryDate ? (
                                formatDate(giftOptions.deliveryDate)
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={giftOptions.deliveryDate}
                              onSelect={(date) =>
                                setGiftOptions({ ...giftOptions, deliveryDate: date })
                              }
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum 3 days from today
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Back
                  </Button>
                  <Button size="lg" onClick={handleNextStep}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl mb-6">Payment Method</h2>

                {/* Authentication Check */}
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You must be logged in to complete your purchase</p>
                    <Button onClick={() => navigate('/login')} className="mr-2">
                      Log In
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/signup')}>
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Order Information */}
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">Order Details</h3>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Items:</span>
                          <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery to:</span>
                          <span>{deliveryInfo.address}, {deliveryInfo.city}</span>
                        </div>
                        {sendToRecipient && (
                          <div className="flex justify-between">
                            <span>Recipient:</span>
                            <span>{recipientInfo.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Paystack Payment Component */}
                    <PaystackPayment
                      amount={total}
                      currency="NGN"
                      onPaymentSuccess={handlePaymentSuccess}
                    />

                    {/* Back Button */}
                    <div className="flex justify-start">
                      <Button variant="outline" onClick={handlePreviousStep}>
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6 sticky top-20">
              <h3 className="font-semibold mb-4">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                {giftOptions.giftWrap && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gift Wrapping</span>
                    <span>${giftWrapFee.toFixed(2)}</span>
                  </div>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Selected Options */}
              {currentStep >= 2 && (
                <>
                  <Separator className="my-4" />
                  <div className="text-sm space-y-2">
                    <p className="font-medium mb-2">Selected Options:</p>
                    {giftOptions.addMessageCard && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        <span>Message Card</span>
                      </div>
                    )}
                    {giftOptions.giftWrap && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        <span>Gift Wrapping</span>
                      </div>
                    )}
                    {!giftOptions.deliverASAP && giftOptions.deliveryDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        <span>
                          Scheduled: {formatShortDate(giftOptions.deliveryDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



