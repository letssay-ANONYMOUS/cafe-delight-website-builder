
import { Coffee, Star, Award, Users, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const stats = [
    { number: "10+", label: "Years of Excellence", icon: Award },
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "25+", label: "Coffee Varieties", icon: Coffee },
    { number: "100%", label: "Organic Beans", icon: Leaf }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Coffee Enthusiast",
      text: "The best coffee experience I've ever had! The atmosphere is cozy and the baristas are true artists.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Michael Chen",
      role: "Local Business Owner",
      text: "Brew & Bliss has become my daily ritual. Their attention to detail and quality is unmatched.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Emily Rodriguez",
      role: "Food Blogger",
      text: "From the first sip to the last bite of their pastries, everything is perfection. Highly recommended!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
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
    <section id="about" className="py-20 bg-gradient-to-br from-cream-50 to-coffee-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="animate-fade-in">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-coffee-100 text-coffee-700 rounded-full text-sm font-medium">
                Our Story
              </span>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-800 mb-6">
              Brewing Excellence Since 2014
            </h2>
            <p className="text-lg text-coffee-600 mb-6 leading-relaxed">
              Founded with a vision to create the perfect coffee experience, Brew & Bliss Cafe has become 
              a cornerstone of artisanal coffee culture. We source our beans directly from sustainable farms 
              around the world, ensuring every cup supports both exceptional quality and ethical practices.
            </p>
            <p className="text-lg text-coffee-600 mb-8 leading-relaxed">
              Our passionate team of certified baristas are trained in the art of coffee crafting, from the perfect 
              grind to the ideal brewing temperature. We believe that coffee is more than just a beverage – 
              it's a moment of connection, creativity, and pure comfort.
            </p>
            <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-lg">
              <Coffee className="w-10 h-10 text-coffee-600" />
              <div>
                <p className="text-coffee-800 font-semibold text-lg">
                  Crafted with passion, served with love
                </p>
                <p className="text-coffee-600">— Our Promise to You</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1559496417-e7f25cb247cd?auto=format&fit=crop&w=400&q=80"
                alt="Coffee roasting process"
                className="rounded-2xl shadow-xl w-full h-48 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=400&q=80"
                alt="Barista at work"
                className="rounded-2xl shadow-xl w-full h-48 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80"
                alt="Fresh coffee beans"
                className="rounded-2xl shadow-xl w-full h-48 object-cover -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80"
                alt="Coffee cup art"
                className="rounded-2xl shadow-xl w-full h-48 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-coffee-200">
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
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="text-center animate-scale-in bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IconComponent className="w-8 h-8 text-coffee-600 mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-bold text-coffee-700 mb-2">
                  {stat.number}
                </div>
                <div className="text-coffee-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-coffee-100 text-coffee-700 rounded-full text-sm font-medium">
              Testimonials
            </span>
          </div>
          <h3 className="font-playfair text-3xl md:text-4xl font-bold text-coffee-800 mb-4">
            What Our Customers Say
          </h3>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            Don't just take our word for it – hear from our community of coffee lovers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-coffee-600 mb-6 leading-relaxed italic text-lg">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-coffee-800 text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-coffee-500">
                      {testimonial.role}
                    </div>
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
