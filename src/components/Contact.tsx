
import { Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
  const contactInfo = [
    {
      title: "Visit Us",
      details: ["Al Banafsaj St. Hazza Bin Zayed Stadium", "Bldg. 15 - Al Tiwayya - Abu Dhabi", "United Arab Emirates"],
      icon: "📍"
    },
    {
      title: "Call Us",
      details: ["037800030", "0506584176", "Mon-Fri: 6AM-9PM | Sat-Sun: 7AM-10PM"],
      icon: "📞"
    },
    {
      title: "Email Us",
      details: ["nawacafe22@gmail.com"],
      icon: "✉️"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-cream-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-coffee-800 mb-4">
            Visit Our Cafe
          </h2>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            Come experience the warmth and aroma of our cozy coffee haven
          </p>
          <div className="w-24 h-1 bg-coffee-400 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{info.icon}</div>
                    <div>
                      <h3 className="font-playfair text-xl font-semibold text-coffee-800 mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-coffee-600 leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="bg-coffee-600 text-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-playfair text-2xl font-bold mb-4">
                Join Our Coffee Club!
              </h3>
              <p className="mb-6 leading-relaxed">
                Get exclusive offers, new menu updates, and be the first to know about our special events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full text-coffee-800 focus:outline-none focus:ring-2 focus:ring-cream-400"
                />
                <Button className="bg-cream-400 hover:bg-cream-500 text-coffee-800 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Map and Hours */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-coffee-200 to-coffee-300 flex items-center justify-center">
                <div className="text-center text-coffee-700">
                  <Coffee className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Interactive Map</p>
                  <p className="text-sm">Coming Soon</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <h3 className="font-playfair text-2xl font-bold text-coffee-800 mb-4">
                  Opening Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-coffee-600">Monday - Friday</span>
                    <span className="font-semibold text-coffee-800">6:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-coffee-600">Saturday</span>
                    <span className="font-semibold text-coffee-800">7:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-coffee-600">Sunday</span>
                    <span className="font-semibold text-coffee-800">7:00 AM - 10:00 PM</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-cream-100 rounded-lg">
                  <p className="text-sm text-coffee-600 text-center">
                    <strong>Happy Hour:</strong> Monday-Friday 3-5 PM<br />
                    Get 20% off all beverages!
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button className="bg-coffee-600 hover:bg-coffee-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Coffee className="w-5 h-5 mr-2" />
                Order for Pickup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
