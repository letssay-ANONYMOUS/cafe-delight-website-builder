import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  LogOut, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  ChefHat,
  Package,
  ExternalLink
} from "lucide-react";
import { useKitchenAlert } from "@/hooks/useKitchenAlert";
import { OrderTable } from "@/components/kitchen/OrderTable";
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
  const [unacknowledgedOrders, setUnacknowledgedOrders] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPlaying, startAlert, stopAlert, initAudioContext } = useKitchenAlert();

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudioContext();
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [initAudioContext]);

  useEffect(() => {
    checkAuth();
    loadOrders();
    const channel = setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      stopAlert();
    };
  }, []);

  // Manage alert sound based on unacknowledged orders
  useEffect(() => {
    if (soundEnabled && unacknowledgedOrders.size > 0) {
      startAlert();
    } else {
      stopAlert();
    }
  }, [unacknowledgedOrders.size, soundEnabled, startAlert, stopAlert]);

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
          
          // Only show toast for new pending orders (no sound)
          if (newOrder.payment_status === 'pending') {
            toast({
              title: "📋 New Pending Order",
              description: `Order ${newOrder.order_number} from ${newOrder.customer_name}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('Order updated:', payload);
          const updatedOrder = payload.new as Order;
          const oldOrder = payload.old as Partial<Order>;
          
          // Check if order just changed to 'paid'
          if (updatedOrder.payment_status === 'paid' && oldOrder.payment_status !== 'paid') {
            // Fetch items if needed
            const { data: itemsData } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', updatedOrder.id);
            
            // Add to unacknowledged set to trigger alert
            setUnacknowledgedOrders(prev => new Set([...prev, updatedOrder.id]));
            
            toast({
              title: "💰 Order Paid!",
              description: `Order ${updatedOrder.order_number} from ${updatedOrder.customer_name} is ready!`,
              className: "bg-green-50 border-green-300"
            });
          }
          
          // Update order in state
          setOrders(prev => prev.map(order => 
            order.id === updatedOrder.id 
              ? { ...order, ...updatedOrder }
              : order
          ));
        }
      )
      .subscribe();

    return channel;
  };

  const handleAcknowledge = useCallback((orderId: string) => {
    setUnacknowledgedOrders(prev => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/staff/login');
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
                <div className="text-center px-4 py-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
                  <p className="text-xs text-yellow-700">Pending</p>
                </div>
                <div className="text-center px-4 py-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{paidOrders.length}</p>
                  <p className="text-xs text-green-700">Paid</p>
                </div>
                {unacknowledgedOrders.size > 0 && (
                  <div className="text-center px-4 py-2 bg-red-50 dark:bg-red-950/30 rounded-lg animate-pulse">
                    <p className="text-2xl font-bold text-red-600">{unacknowledgedOrders.size}</p>
                    <p className="text-xs text-red-700">New!</p>
                  </div>
                )}
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="sound" className="sr-only">Sound</Label>
                {soundEnabled ? (
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-red-500 animate-pulse' : 'text-foreground'}`} />
                ) : (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                )}
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

              {/* Fullscreen Link */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
              >
                <ExternalLink className="w-4 h-4" />
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
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pending Orders - Left */}
            <OrderTable
              orders={pendingOrders}
              type="pending"
            />
            
            {/* Paid Orders - Right */}
            <OrderTable
              orders={paidOrders}
              type="paid"
              unacknowledged={unacknowledgedOrders}
              onAcknowledge={handleAcknowledge}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default KitchenDashboard;
