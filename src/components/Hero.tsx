import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section 
      className="relative w-full max-w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/Landing Page Images/PerfectGift.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        minHeight: '100vh'
      }}
    >
      {/* Hero Content - Center vertically below navbar, left-aligned content */}
      <div className="container mx-auto px-4 min-h-screen flex items-center pt-16 max-w-full">
        <div className="w-full max-w-2xl ml-0 md:ml-8 lg:ml-16">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-4 w-4 text-white flex-shrink-0" />
            <span 
              className="text-white whitespace-nowrap"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '400',
                fontStyle: 'normal',
                fontSize: '16px',
                lineHeight: '160%',
                letterSpacing: '0%',
                verticalAlign: 'middle'
              }}
            >
              Thoughtful Gifts, Delivered with Love
            </span>
          </div>

          <h1 
            className="text-white mb-3"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '500',
              fontStyle: 'normal',
              fontSize: '48px',
              lineHeight: '120%',
              letterSpacing: '0%',
              verticalAlign: 'middle'
            }}
          >
            Find the Perfect Gift for Every Occasion
          </h1>
          
          <p 
            className="text-white mb-6"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '400',
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '160%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              marginBottom: '24px'
            }}
          >
            From birthdays to weddings, surprise moments to 'just because', we've got something special for everyone.
          </p>
          
          <Button 
            size="lg" 
            asChild
            style={{
              backgroundColor: '#FF8C42',
              color: 'white',
              borderRadius: '9999px',
              padding: '10px 28px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: 'none',
              boxShadow: '0 4px 14px rgba(255, 140, 66, 0.4)'
            }}
            className="hover:opacity-90 transition-opacity"
          >
            <Link to="/products">
              Shop Gifts →
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


