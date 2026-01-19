import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  LogOut, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  ChefHat,
  Clock,
  User,
  Phone,
  Mail,
  ShoppingBag,
  CreditCard,
  FileText,
  Utensils,
  Package,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const KitchenDashboard = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    checkAuth();
    loadOrders();
    const channel = setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_session');
    if (!token) {
      navigate('/staff/login');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-session', {
        headers: { 'x-admin-token': token }
      });

      if (error || (!data?.valid && !data?.authenticated)) {
        localStorage.removeItem('admin_session');
        navigate('/staff/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate('/staff/login');
    }
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map(o => o.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        const ordersWithItems: OrderWithItems[] = ordersData.map(order => ({
          ...order,
          items: (itemsData || []).filter(item => item.order_id === order.id)
        }));

        setOrders(ordersWithItems);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('New order received:', payload);
          
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', payload.new.id);

          const newOrder: OrderWithItems = {
            ...payload.new as Order,
            items: itemsData || []
          };

          setOrders(prev => [newOrder, ...prev]);
          
          if (soundEnabled) {
            playNotificationSound();
          }

          toast({
            title: "🆕 New Order!",
            description: `Order ${newOrder.order_number} from ${newOrder.customer_name}`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order updated:', payload);
          setOrders(prev => prev.map(order => 
            order.id === payload.new.id 
              ? { ...order, ...payload.new as Order }
              : order
          ));
        }
      )
      .subscribe();

    return channel;
  };

  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/staff/login');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-AE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Dubai'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      paid: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      refunded: 'bg-purple-100 text-purple-800 border-purple-300',
      cancelled: 'bg-muted text-muted-foreground border-border'
    };
    return styles[status] || styles.pending;
  };

  const getOrderTypeBadge = (type: string) => {
    return type === 'dine_in' 
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : 'bg-orange-100 text-orange-800 border-orange-300';
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const paidOrders = orders.filter(o => o.payment_status === 'paid');
  const pendingOrders = orders.filter(o => o.payment_status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Kitchen Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-4">
                <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{paidOrders.length}</p>
                  <p className="text-xs text-green-700">Paid</p>
                </div>
                <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
                  <p className="text-xs text-yellow-700">Pending</p>
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="sound" className="sr-only">Sound</Label>
                {soundEnabled ? <Volume2 className="w-4 h-4 text-foreground" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              {/* Refresh */}
              <Button variant="outline" size="icon" onClick={loadOrders} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>

              {/* Logout */}
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold text-muted-foreground mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground/70">New orders will appear here in real-time</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Today's Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[100px]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Time
                        </div>
                      </TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Customer
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Phone
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <Utensils className="w-3 h-3" />
                          Items
                        </div>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          Status
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Notes
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <>
                        <TableRow 
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleOrderExpand(order.id)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              {expandedOrder === order.id ? (
                                <ChevronUp className="w-3 h-3 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                              )}
                              {formatTime(order.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {order.order_number}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.customer_name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {order.customer_phone}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {order.customer_email || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {order.items.length} items
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getOrderTypeBadge(order.order_type)}`}
                            >
                              {order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={`text-xs capitalize ${getStatusBadge(order.payment_status)}`}
                            >
                              {order.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            AED {order.total_amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                            {order.extra_notes || order.notes || '-'}
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded Row - Order Items */}
                        {expandedOrder === order.id && (
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={10} className="p-4">
                              <div className="bg-card rounded-lg border p-4">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                  <ShoppingBag className="w-4 h-4" />
                                  Order Items
                                </h4>
                                <div className="grid gap-2">
                                  {order.items.map((item) => (
                                    <div 
                                      key={item.id}
                                      className="flex items-start justify-between p-3 bg-muted/50 rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">{item.quantity}x</span>
                                          <span>{item.item_name}</span>
                                          {item.item_category && (
                                            <Badge variant="outline" className="text-xs">
                                              {item.item_category}
                                            </Badge>
                                          )}
                                        </div>
                                        {item.extras && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            Extras: {item.extras}
                                          </p>
                                        )}
                                        {item.notes && (
                                          <p className="text-sm text-orange-600 mt-1">
                                            Note: {item.notes}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">AED {item.total_price.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">
                                          @ AED {item.unit_price.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    Subtotal: AED {order.subtotal.toFixed(2)}
                                  </span>
                                  <span className="font-bold">
                                    Total: AED {order.total_amount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default KitchenDashboard;
