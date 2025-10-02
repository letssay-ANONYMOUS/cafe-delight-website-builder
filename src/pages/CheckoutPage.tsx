import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock } from 'lucide-react';

const CheckoutPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const total = 39.00;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Payment Successful!",
        description: "Your order has been confirmed. Thank you for your purchase!",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 bg-gradient-to-br from-coffee-800 to-coffee-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4">
            Checkout
          </h1>
          <p className="text-lg md:text-xl text-cream-100 max-w-2xl mx-auto">
            Complete your order securely
          </p>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12 md:py-20 bg-cream-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Lock className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-coffee-600">Secure payment powered by Stripe</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h2 className="text-xl font-semibold text-coffee-800 mb-4">Contact Information</h2>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="your@email.com"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h2 className="text-xl font-semibold text-coffee-800 mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Payment Details
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Cardholder Name</Label>
                            <Input
                              id="name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              required
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="4242 4242 4242 4242"
                              maxLength={19}
                              className="mt-1"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                name="expiry"
                                required
                                value={formData.expiry}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvc">CVC</Label>
                              <Input
                                id="cvc"
                                name="cvc"
                                required
                                value={formData.cvc}
                                onChange={handleInputChange}
                                placeholder="123"
                                maxLength={3}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full bg-coffee-600 hover:bg-coffee-700"
                      >
                        {loading ? 'Processing...' : `Pay AED ${total.toFixed(2)}`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold text-coffee-800 mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee-700">Espresso × 2</span>
                          <span className="text-coffee-700">AED 24.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-coffee-700">Cappuccino × 1</span>
                          <span className="text-coffee-700">AED 15.00</span>
                        </div>
                      </div>
                      <div className="border-t border-coffee-200 pt-4">
                        <div className="flex justify-between text-lg font-semibold text-coffee-800">
                          <span>Total</span>
                          <span>AED {total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
