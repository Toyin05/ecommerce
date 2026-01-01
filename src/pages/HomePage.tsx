import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { GiftFinder } from "../components/GiftFinder";
import { CategorySection } from "../components/CategorySection";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { Footer } from "../components/Footer";
import {
  Cake,
  Heart,
  Baby,
  Trophy,
  Sparkles,
  PartyPopper,
  Users,
  User,
} from "lucide-react";

export function HomePage() {
  // Mock data for categories
  const celebrationCategories = [
    {
      name: "Birthdays",
      image: "https://images.unsplash.com/photo-1619252872371-c82ac4d9e86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwYmFsbG9vbnN8ZW58MXx8fHwxNzYxNTU1NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Cake,
      description: "Make their day extra special",
    },
    {
      name: "Weddings",
      image: "https://images.unsplash.com/photo-1581720848209-9721f8fa30ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvd2VycyUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxNTQ0OTU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Heart,
      description: "Celebrate their forever",
    },
    {
      name: "Baby Showers",
      image: "https://images.unsplash.com/photo-1696527014341-a874bd839540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwdG95cyUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MTY0MDc4OHww&ixlib=rb-4.1.0&q=80&w=1080",
      icon: Baby,
      description: "Welcome the little one",
    },
    {
      name: "Life Milestones & Achievements",
      image: "https://images.unsplash.com/photo-1758607235130-f199d2a17b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VsZWJyYXRpb24lMjBhY2hpZXZlbWVudHxlbnwxfHx8fDE3NjE2NDkwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: Trophy,
      description: "Celebrate their success",
    },
  ];

  const recipientCategories = [
    {
      name: "For Him",
      image: "/Landing Page Images/Recipient1.png",
      icon: User,
      description: "Gifts he'll love",
    },
    {
      name: "For Her",
      image: "/Landing Page Images/Recipient2.png",
      icon: Sparkles,
      description: "Elegant & beautiful",
    },
    {
      name: "For Kids",
      image: "/Landing Page Images/Recipient3.png",
      icon: PartyPopper,
      description: "Fun & playful",
    },
    {
      name: "Corporate Gifts",
      image: "/Landing Page Images/Recipient4.png",
      icon: Users,
      description: "Professional & thoughtful",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1602347880090-a144f5b4d62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzYxNTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Deluxe Gift Hamper - Premium Collection",
      price: "$89.99",
      originalPrice: "$129.99",
      badge: "30% OFF",
      tag: "Bestseller",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1761049293052-47731d0a304f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwZWxlZ2FudCUyMG5lY2tsYWNlfGVufDF8fHx8MTc2MTY0MDc5MHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Elegant Pearl Necklace with Gift Box",
      price: "$149.99",
      tag: "For Her",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1735197087482-9bda482f6204?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZ2FkZ2V0cyUyMG1vZGVybnxlbnwxfHx8fDE3NjE2MzUwODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Smart Tech Bundle - Gadget Lover's Dream",
      price: "$199.99",
      badge: "New Arrival",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1695649912699-435a5bc20203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwY2hvY29sYXRlJTIwdHJlYXRzfGVufDF8fHx8MTc2MTY0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Artisan Chocolate Gift Box - 24 Pieces",
      price: "$49.99",
      tag: "For Foodies",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1681394962525-45cb10b65d9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBjYW5kbGVzfGVufDF8fHx8MTc2MTY0MDc5MHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Luxury Scented Candle Set - Home Spa",
      price: "$59.99",
      originalPrice: "$79.99",
      badge: "25% OFF",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1605204376600-72ed73f1f9ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc2MTU1OTg3NXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Premium Skincare Gift Set - Self Care",
      price: "$119.99",
      tag: "Staff Pick",
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1554301840-913d3250f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwd2F0Y2glMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjE2MDQ2OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Classic Timepiece with Leather Strap",
      price: "$299.99",
      tag: "For Him",
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1696527014341-a874bd839540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwdG95cyUyMGNvbG9yZnVsfGVufDF8fHx8MTc2MTY0MDc4OHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Creative Kids Art & Craft Bundle",
      price: "$39.99",
      badge: "For Kids",
    },
  ];

  const trendingProducts = [
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1619252872371-c82ac4d9e86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwYmFsbG9vbnN8ZW58MXx8fHwxNzYxNTU1NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Birthday Party Surprise Box - Deluxe",
      price: "$69.99",
      tag: "Trending",
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1581720848209-9721f8fa30ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvd2VycyUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxNTQ0OTU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Wedding Wishes - Elegant Flower Arrangement",
      price: "$179.99",
      badge: "Premium",
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1695649912699-435a5bc20203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwY2hvY29sYXRlJTIwdHJlYXRzfGVufDF8fHx8MTc2MTY0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Gourmet Treats Collection - Sweet Indulgence",
      price: "$79.99",
      originalPrice: "$99.99",
      badge: "20% OFF",
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1602347880090-a144f5b4d62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzYxNTU2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Personalized Gift Box - Make it Special",
      price: "$99.99",
      tag: "Customizable",
    },
  ];

  const personalizedProducts = [
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1759158963837-ce2f1524b813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBtdWclMjBjdXN0b218ZW58MXx8fHwxNzYxNjUwMjcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Custom Name Ceramic Mug - Personalized",
      price: "$24.99",
      tag: "Bestseller",
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1724490056260-44bf1de2617e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjB0c2hpcnQlMjBkZXNpZ258ZW58MXx8fHwxNzYxNTkzMjc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Personalized T-Shirt - Your Design",
      price: "$29.99",
      tag: "Popular",
    },
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBkaWFyeSUyMG5vdGVib29rfGVufDF8fHx8MTc2MTY1MDI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Leather Journal with Custom Monogram",
      price: "$39.99",
      tag: "Premium",
    },
    {
      id: 16,
      image: "https://images.unsplash.com/photo-1761210875101-1273b9ae5600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdyYXZlZCUyMGpld2VscnklMjBuZWNrbGFjZXxlbnwxfHx8fDE3NjE2NTAyNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Engraved Name Necklace - Sterling Silver",
      price: "$89.99",
      originalPrice: "$119.99",
      badge: "25% OFF",
    },
    {
      id: 17,
      image: "https://images.unsplash.com/photo-1592999641298-434e28c11d14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjB3YXRlciUyMGJvdHRsZSUyMGZsYXNrfGVufDF8fHx8MTc2MTY1MDI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Custom Stainless Steel Flask - Engraved",
      price: "$34.99",
      tag: "For Him",
    },
    {
      id: 18,
      image: "https://images.unsplash.com/photo-1717687620648-71efdd468192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBwaG90byUyMGZyYW1lfGVufDF8fHx8MTc2MTY1MDI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Personalized Photo Frame - Family Memories",
      price: "$44.99",
      tag: "Sentimental",
    },
    {
      id: 19,
      image: "https://images.unsplash.com/photo-1759493946930-150aee20977c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbGl6ZWQlMjBrZXljaGFpbnxlbnwxfHx8fDE3NjE2NTAyNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Custom Keychain with Initials",
      price: "$19.99",
      badge: "New",
    },
    {
      id: 20,
      image: "https://images.unsplash.com/photo-1651936485213-55d235bef896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vZ3JhbSUyMHRvdGUlMjBiYWd8ZW58MXx8fHwxNzYxNjUwMjc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Monogrammed Canvas Tote Bag",
      price: "$32.99",
      tag: "For Her",
    },
  ];

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden">
      <Header />
      <div className="w-full max-w-full overflow-x-hidden">
        <Hero />
        <GiftFinder />
      
      <CategorySection
        title="Find the Perfect Gift for Every Occassion"
        subtitle="Find the perfect gift for every special moment"
        categories={celebrationCategories}
        type="occasion"
      />

      <FeaturedProducts
        title="Trending Now ✨"
        subtitle="The most loved gifts this week — handpicked just for you!"
        products={featuredProducts}
      />

      <CategorySection
        title="Shop by Recipient"
        subtitle="Gifts curated for everyone on your list"
        categories={recipientCategories}
        type="recipient"
      />

      <FeaturedProducts
        title="Staff Picks "
        subtitle="Our team's favorite gifts that never disappoint"
        products={trendingProducts}
      />

      <FeaturedProducts
        title="Personalized Gifts 🎁"
        subtitle="Make it unique — add their name, initials, or a special message!"
        products={personalizedProducts}
      />

      {/* CTA Section */}
      <section 
        className="text-white relative overflow-hidden"
        style={{
          backgroundColor: '#3B82F6',
          width: '100%',
          minHeight: '320px',
          paddingTop: '60px',
          paddingRight: '60px',
          paddingBottom: '60px',
          paddingLeft: '60px'
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl mb-4">Need Something Custom?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            We specialize in personalized gifts and bulk orders. Let us help you create something truly memorable!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-3 rounded-full cursor-pointer hover:shadow-lg"
              style={{
                backgroundColor: '#FF8C42',
                color: 'white',
                border: 'none'
              }}
            >
              Request Custom Gift
            </button>
            <button 
              className="px-8 py-3 rounded-full cursor-pointer hover:shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#FF8C42',
                border: 'none'
              }}
            >
              Corporate Gifting
            </button>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  );
}


