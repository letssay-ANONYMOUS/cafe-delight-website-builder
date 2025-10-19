import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, Award, Package } from 'lucide-react';
import StoreProductCard from '@/components/StoreProductCard';

const StorePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const products = [
    {
      id: 1,
      name: "Premium Extra Virgin Olive Oil",
      description: "Cold-pressed from hand-picked olives in the Mediterranean. Rich, fruity flavor with peppery finish.",
      price: 28.99,
      image: "/olive-oils/premium-evoo.jpg",
      rating: 5,
      badge: "Bestseller",
      volume: "500ml",
      origin: "Italy"
    },
    {
      id: 2,
      name: "Organic Single Estate Olive Oil",
      description: "Certified organic, single-origin olive oil with delicate notes of grass and artichoke.",
      price: 34.99,
      image: "/olive-oils/organic-estate.jpg",
      rating: 5,
      badge: "Organic",
      volume: "750ml",
      origin: "Spain"
    },
    {
      id: 3,
      name: "Infused Garlic & Herb Olive Oil",
      description: "Premium olive oil infused with fresh garlic, rosemary, and Mediterranean herbs.",
      price: 24.99,
      image: "/olive-oils/garlic-herb.jpg",
      rating: 4,
      badge: "Limited",
      volume: "250ml",
      origin: "Greece"
    },
    {
      id: 4,
      name: "Early Harvest Olive Oil",
      description: "Made from green, early-harvest olives for intense flavor and maximum health benefits.",
      price: 39.99,
      image: "/olive-oils/early-harvest.jpg",
      rating: 5,
      badge: "Premium",
      volume: "500ml",
      origin: "Italy"
    },
    {
      id: 5,
      name: "Lemon Infused Olive Oil",
      description: "Bright and zesty olive oil infused with fresh Mediterranean lemons. Perfect for salads.",
      price: 26.99,
      image: "/olive-oils/lemon-infused.jpg",
      rating: 5,
      badge: "New",
      volume: "250ml",
      origin: "Greece"
    },
    {
      id: 6,
      name: "Gift Set Collection",
      description: "Curated selection of three premium olive oils in an elegant gift box.",
      price: 79.99,
      image: "/olive-oils/gift-set.jpg",
      rating: 5,
      badge: "Gift Set",
      volume: "3x250ml",
      origin: "Mixed"
    }
  ];

  const features = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "No additives or preservatives"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Internationally recognized quality"
    },
    {
      icon: Package,
      title: "Direct Import",
      description: "From farm to your table"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coffee-50 via-cream-50 to-background">
        <div className="container mx-auto text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-coffee-900 mb-6 animate-fade-in">
            Artisan Olive Oil Collection
          </h1>
          <p className="text-xl text-coffee-700 max-w-3xl mx-auto mb-8 animate-fade-in">
            Discover our carefully curated selection of premium olive oils, sourced directly from the finest estates 
            in the Mediterranean. Each bottle tells a story of tradition, quality, and exceptional taste.
          </p>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 animate-scale-in">
                <div className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-coffee-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-coffee-900">{feature.title}</div>
                  <div className="text-sm text-coffee-600">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="font-playfair text-4xl font-bold text-coffee-900 text-center mb-12">
            Our Premium Selection
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <StoreProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-coffee-100 via-cream-50 to-coffee-50">
        <div className="container mx-auto">
          <h2 className="font-playfair text-4xl font-bold text-coffee-900 text-center mb-12">
            Why Choose Our Olive Oil?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "First Cold Press",
                description: "Extracted at optimal temperature to preserve nutrients and flavor"
              },
              {
                title: "Lab Tested",
                description: "Each batch is tested for purity and quality standards"
              },
              {
                title: "Sustainably Sourced",
                description: "Supporting small family farms and sustainable practices"
              },
              {
                title: "Fresh Harvest",
                description: "Bottled within days of harvest for maximum freshness"
              }
            ].map((benefit, index) => (
              <Card key={index} className="text-center border-coffee-200 hover:border-coffee-400 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-coffee-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white font-bold">{index + 1}</span>
                  </div>
                  <CardTitle className="text-xl text-coffee-900">{benefit.title}</CardTitle>
                  <CardDescription className="text-coffee-700">{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-coffee-800 via-coffee-700 to-coffee-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Experience Mediterranean Excellence
          </h2>
          <p className="text-xl text-cream-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have elevated their cooking with our premium olive oils.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-white text-coffee-700 hover:bg-cream-50 rounded-full px-8"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StorePage;