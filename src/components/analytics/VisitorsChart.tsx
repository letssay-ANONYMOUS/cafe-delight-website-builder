import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VisitorsChartProps {
  dateRange: 'today' | '7days' | '30days';
}

interface ChartDataPoint {
  label: string;
  visitors: number;
}

export const VisitorsChart = ({ dateRange }: VisitorsChartProps) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
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

      const { data: sessions } = await supabase
        .from('visitor_sessions')
        .select('session_start')
        .gte('session_start', startDate.toISOString())
        .order('session_start');

      if (!sessions) {
        setData([]);
        setIsLoading(false);
        return;
      }

      // Group by hour (today) or day (7/30 days)
      const grouped: Record<string, number> = {};

      if (dateRange === 'today') {
        // Group by hour
        for (let h = 0; h <= now.getHours(); h++) {
          grouped[`${h}:00`] = 0;
        }
        sessions.forEach(s => {
          const hour = new Date(s.session_start).getHours();
          const key = `${hour}:00`;
          grouped[key] = (grouped[key] || 0) + 1;
        });
      } else {
        // Group by day
        const days = dateRange === '7days' ? 7 : 30;
        for (let d = days - 1; d >= 0; d--) {
          const date = new Date(startOfToday.getTime() - d * 24 * 60 * 60 * 1000);
          const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          grouped[key] = 0;
        }
        sessions.forEach(s => {
          const date = new Date(s.session_start);
          const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (grouped[key] !== undefined) {
            grouped[key] = (grouped[key] || 0) + 1;
          }
        });
      }

      const chartData = Object.entries(grouped).map(([label, visitors]) => ({
        label,
        visitors
      }));

      setData(chartData);
      setIsLoading(false);
    };

    fetchData();
  }, [dateRange]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Visitors Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[260px] flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <XAxis 
                dataKey="label" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
