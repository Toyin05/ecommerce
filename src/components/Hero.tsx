import { Button } from "./ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-white to-secondary/10">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-secondary/10 blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Thoughtful Gifts, Delivered with Love</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight">
              Find the Perfect Gift for Every Occasion 🎉
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              From birthdays to weddings, surprises to 'just because,' we've got something special for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="rounded-full gap-2 shadow-lg hover:shadow-xl transition-shadow" asChild>
                <Link to="/products">
                  Shop Gifts
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

            </div>
          </div>

          {/* Right Content - Featured Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1602347880090-a144f5b4d62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzYxNTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Beautiful gift presentation"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
