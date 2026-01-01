import { ProductCard } from "./ProductCard";

interface Product {
  id: number;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  tag?: string;
}

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function FeaturedProducts({ title, subtitle, products }: FeaturedProductsProps) {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-accent/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{title}</h2>
          {subtitle && <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">{subtitle}</p>}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {products.map((product) => {
            const { id, image, title, price, originalPrice, badge, tag } = product;
            return (
              <div key={id}>
                <ProductCard 
                  id={id}
                  image={image}
                  title={title}
                  price={price}
                  originalPrice={originalPrice}
                  badge={badge}
                  tag={tag}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
