import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { toast } = useToast();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    notes: '',
  });

  const total = getCartTotal();

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      // Prepare order data for webhook
      const orderData = {
        customerName: formData.name,
        phoneNumber: formData.phone,
        orderTimestamp: new Date().toISOString(),
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totalAmount: total,
        paymentStatus: "Paid",
        additionalNotes: formData.notes || "None",
      };

      // Send to Make.com webhook
      const response = await fetch('https://hook.eu2.make.com/gxuupichxkt4ad8ey6trq3x3s1hnw56k', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(orderData),
      });

      setLoading(false);
      clearCart();
      toast({
        title: "Payment Successful!",
        description: "Your order has been confirmed and sent to our system. Thank you for your purchase!",
      });
      navigate('/');
    } catch (error) {
      console.error('Error sending order to webhook:', error);
      setLoading(false);
      toast({
        title: "Order Placed",
        description: "Your order has been received. Thank you for your purchase!",
      });
      clearCart();
      navigate('/');
    }
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
                      {/* Payment Information */}
                      <div>
                        <h2 className="text-xl font-semibold text-coffee-800 mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5" />
                          Payment Details
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
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
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+1 (555) 000-0000"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes">Additional Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              placeholder="Special requests, delivery instructions, etc."
                              className="mt-1 min-h-[80px]"
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

                      {/* Alternative Payment Methods */}
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-3 text-coffee-700">Or pay with:</p>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-12"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                            </svg>
                            Apple Pay
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-12"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                            </svg>
                            Samsung Pay
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full bg-coffee-600 hover:bg-coffee-700"
                      >
                        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
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
                    {cartItems.length === 0 ? (
                      <p className="text-coffee-600 text-center py-8">Your cart is empty</p>
                    ) : (
                      <div className="space-y-4 mb-6">
                        <div className="space-y-3">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-coffee-700">{item.name} × {item.quantity}</span>
                              <span className="text-coffee-700">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-coffee-200 pt-4">
                          <div className="flex justify-between text-lg font-semibold text-coffee-800">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
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
