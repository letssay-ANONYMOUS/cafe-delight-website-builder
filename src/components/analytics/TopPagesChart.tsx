import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TopPagesChartProps {
  dateRange: 'today' | '7days' | '30days';
}

interface PageData {
  page: string;
  views: number;
}

const formatPagePath = (path: string): string => {
  if (path === '/') return 'Home';
  return path.replace(/^\//, '').split('/')[0].charAt(0).toUpperCase() + 
         path.replace(/^\//, '').split('/')[0].slice(1);
};

export const TopPagesChart = ({ dateRange }: TopPagesChartProps) => {
  const [data, setData] = useState<PageData[]>([]);
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

      const { data: pageViews } = await supabase
        .from('page_views')
        .select('page_path')
        .gte('viewed_at', startDate.toISOString());

      if (!pageViews) {
        setData([]);
        setIsLoading(false);
        return;
      }

      // Count by page
      const counts: Record<string, number> = {};
      pageViews.forEach(pv => {
        const page = formatPagePath(pv.page_path);
        counts[page] = (counts[page] || 0) + 1;
      });

      // Sort and take top 5
      const chartData = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([page, views]) => ({ page, views }));

      setData(chartData);
      setIsLoading(false);
    };

    fetchData();
  }, [dateRange]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical">
              <XAxis 
                type="number" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                allowDecimals={false}
              />
              <YAxis 
                type="category" 
                dataKey="page" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                width={60}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="views" 
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
