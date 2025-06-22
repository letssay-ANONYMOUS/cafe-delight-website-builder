
import { Coffee, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const stats = [
    { number: "10+", label: "Years of Excellence" },
    { number: "50K+", label: "Happy Customers" },
    { number: "25+", label: "Coffee Varieties" },
    { number: "100%", label: "Organic Beans" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Coffee Enthusiast",
      text: "The best coffee experience I've ever had! The atmosphere is cozy and the baristas are true artists.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Local Business Owner",
      text: "Brew & Bliss has become my daily ritual. Their attention to detail and quality is unmatched.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Food Blogger",
      text: "From the first sip to the last bite of their pastries, everything is perfection. Highly recommended!",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section id="about" className="py-20 bg-coffee-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-800 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-coffee-600 mb-6 leading-relaxed">
              Founded in 2014, Brew & Bliss Cafe began as a dream to create the perfect coffee experience. 
              We source our beans directly from sustainable farms around the world, ensuring every cup 
              supports both exceptional quality and ethical practices.
            </p>
            <p className="text-lg text-coffee-600 mb-6 leading-relaxed">
              Our passionate team of baristas are trained in the art of coffee crafting, from the perfect 
              grind to the ideal brewing temperature. We believe that coffee is more than just a beverage – 
              it's a moment of connection, creativity, and comfort.
            </p>
            <div className="flex items-center space-x-4">
              <Coffee className="w-8 h-8 text-coffee-600" />
              <span className="text-coffee-700 font-semibold text-lg">
                Crafted with passion, served with love
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Coffee shop interior"
              className="rounded-2xl shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-lg border border-coffee-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-coffee-800">4.9</div>
                <div className="flex justify-center space-x-1 mb-1">
                  {renderStars(5)}
                </div>
                <div className="text-sm text-coffee-600">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-coffee-700 mb-2">
                {stat.number}
              </div>
              <div className="text-coffee-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h3 className="font-playfair text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
            What Our Customers Say
          </h3>
          <p className="text-xl text-coffee-600">
            Don't just take our word for it – hear from our happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-coffee-600 mb-4 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="text-center">
                  <div className="font-semibold text-coffee-800">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-coffee-500">
                    {testimonial.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
