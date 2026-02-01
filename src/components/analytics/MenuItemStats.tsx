import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface MenuItemStatsProps {
  dateRange: 'today' | '7days' | '30days';
}

interface MenuItemStat {
  name: string;
  views: number;
  addToCart: number;
  conversionRate: number;
}

export const MenuItemStats = ({ dateRange }: MenuItemStatsProps) => {
  const [data, setData] = useState<MenuItemStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      let startDate: Date;
      switch (dateRange) {
        case '7days':
          startDate = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = startOfToday;
      }

      const { data: menuViews } = await supabase
        .from('menu_item_views')
        .select('item_name, action')
        .gte('viewed_at', startDate.toISOString());

      if (!menuViews) {
        setData([]);
        setIsLoading(false);
        return;
      }

      // Aggregate by item
      const itemStats: Record<string, { views: number; addToCart: number }> = {};
      
      menuViews.forEach(mv => {
        if (!itemStats[mv.item_name]) {
          itemStats[mv.item_name] = { views: 0, addToCart: 0 };
        }
        if (mv.action === 'view') {
          itemStats[mv.item_name].views++;
        } else if (mv.action === 'add_to_cart') {
          itemStats[mv.item_name].addToCart++;
        }
      });

      // Convert to array and sort by views
      const statsArray: MenuItemStat[] = Object.entries(itemStats)
        .map(([name, stats]) => ({
          name,
          views: stats.views,
          addToCart: stats.addToCart,
          conversionRate: stats.views > 0 
            ? Math.round((stats.addToCart / stats.views) * 100) 
            : 0
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      setData(statsArray);
      setIsLoading(false);
    };

    fetchData();
  }, [dateRange]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Popular Menu Items</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No menu item data available
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Add to Cart</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">{index + 1}.</span>
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.views}</TableCell>
                  <TableCell className="text-right">{item.addToCart}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={item.conversionRate >= 20 ? 'default' : 'secondary'}
                      className={item.conversionRate >= 20 ? 'bg-green-500' : ''}
                    >
                      {item.conversionRate}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
