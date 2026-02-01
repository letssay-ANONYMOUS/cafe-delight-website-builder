import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DeviceBreakdownProps {
  dateRange: 'today' | '7days' | '30days';
}

interface DeviceData {
  name: string;
  value: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(221.2 83.2% 53.3%)', 'hsl(212.7 50% 40%)'];

export const DeviceBreakdown = ({ dateRange }: DeviceBreakdownProps) => {
  const [data, setData] = useState<DeviceData[]>([]);
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

      const { data: visitors } = await supabase
        .from('anonymous_visitors')
        .select('device_type')
        .gte('last_seen_at', startDate.toISOString());

      if (!visitors) {
        setData([]);
        setIsLoading(false);
        return;
      }

      // Count by device type
      const counts: Record<string, number> = {
        Desktop: 0,
        Mobile: 0,
        Tablet: 0
      };

      visitors.forEach(v => {
        const type = v.device_type?.toLowerCase() || 'desktop';
        if (type === 'mobile') counts['Mobile']++;
        else if (type === 'tablet') counts['Tablet']++;
        else counts['Desktop']++;
      });

      const chartData = Object.entries(counts)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));

      setData(chartData);
      setIsLoading(false);
    };

    fetchData();
  }, [dateRange]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Device Breakdown</CardTitle>
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
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} (${Math.round(value / total * 100)}%)`, '']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
