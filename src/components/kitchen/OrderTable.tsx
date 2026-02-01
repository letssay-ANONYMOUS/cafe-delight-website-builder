import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronDown,
  ChevronUp,
  Bell,
  Clock,
  User,
  Phone,
  ShoppingBag,
  FileText,
  Check,
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;

interface OrderWithItems extends Order {
  items: OrderItem[];
}

interface OrderTableProps {
  orders: OrderWithItems[];
  type: 'pending' | 'paid';
  unacknowledged?: Set<string>;
  onAcknowledge?: (orderId: string) => void;
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-AE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Dubai',
  });
};

const getItemsPreview = (items: OrderItem[]) => {
  if (items.length === 0) return '-';
  const names = items.slice(0, 2).map(item => item.item_name);
  const remaining = items.length - 2;
  return remaining > 0 ? `${names.join(', ')} +${remaining} more` : names.join(', ');
};

export const OrderTable = ({
  orders,
  type,
  unacknowledged = new Set(),
  onAcknowledge,
}: OrderTableProps) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const isPending = type === 'pending';
  const headerColor = isPending ? 'bg-yellow-50 dark:bg-yellow-950/30' : 'bg-green-50 dark:bg-green-950/30';
  const icon = isPending ? '⏳' : '✅';
  const title = isPending ? 'Pending Orders' : 'Paid Orders';

  return (
    <Card className="h-full">
      <CardHeader className={`pb-3 ${headerColor}`}>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>{icon}</span>
          {title} ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No {type} orders</p>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Time
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Customer
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Phone
                    </div>
                  </TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  {!isPending && <TableHead className="w-[100px]">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const isUnacked = unacknowledged.has(order.id);
                  const isExpanded = expandedOrder === order.id;
                  
                  return (
                    <>
                      <TableRow
                        key={order.id}
                        className={`cursor-pointer transition-all ${
                          isUnacked 
                            ? 'bg-red-50 dark:bg-red-950/20 animate-pulse border-l-4 border-l-red-500' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => toggleExpand(order.id)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-1">
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-muted-foreground" />
                            )}
                            {formatTime(order.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.customer_name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {order.customer_phone}
                        </TableCell>
                        <TableCell className="text-sm max-w-[150px] truncate">
                          {getItemsPreview(order.items)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          AED {order.total_amount.toFixed(2)}
                        </TableCell>
                        {!isPending && (
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            {isUnacked ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="animate-pulse"
                                onClick={() => onAcknowledge?.(order.id)}
                              >
                                <Bell className="w-3 h-3 mr-1" />
                                ACK
                              </Button>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                <Check className="w-3 h-3 mr-1" />
                                Done
                              </Badge>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                      
                      {/* Expanded Details */}
                      {isExpanded && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={isPending ? 5 : 6} className="p-4">
                            <div className="bg-card rounded-lg border p-4 space-y-4">
                              {/* Customer Info */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Order #:</span>
                                  <p className="font-mono font-medium">{order.order_number}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Phone:</span>
                                  <p className="font-medium">{order.customer_phone}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Email:</span>
                                  <p className="font-medium">{order.customer_email || '-'}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Type:</span>
                                  <Badge variant="outline" className="ml-1">
                                    {order.order_type === 'dine_in' ? 'Dine In' : 'Takeaway'}
                                  </Badge>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
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
                                          <span className="font-bold">{item.quantity}x</span>
                                          <span className="font-medium">{item.item_name}</span>
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
                                          <p className="text-sm text-primary mt-1 italic">
                                            Note: {item.notes}
                                          </p>
                                        )}
                                      </div>
                                      <span className="font-semibold text-sm">
                                        AED {item.total_price.toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Notes */}
                              {(order.extra_notes || order.notes) && (
                                <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-lg">
                                  <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Order Notes
                                  </h4>
                                  <p className="text-sm">{order.extra_notes || order.notes}</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTable;
