import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function SubHeroStrip() {
  return (
    <section className="w-full bg-[#6FC2E4] py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Text (Left) */}
          <div className="text-white text-center sm:text-left">
            <p className="text-lg sm:text-xl font-medium">
              Not sure what to get? 🎁 Let's help you find the perfect gift — tell us about the receiver!
            </p>
          </div>
          
          {/* Button (Right) */}
          <div>
            <Button 
              className="rounded-full bg-white text-[#FF8C42] hover:bg-white/90 border-0 px-6 py-3 font-semibold shadow-lg"
              asChild
            >
              <Link to="/?openGiftFinder=true">
                Get Started With Shopping Assistant
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
