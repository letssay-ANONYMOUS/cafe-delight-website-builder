import { Card, CardContent } from '@/components/ui/card';
import { Users, Eye, Clock, TrendingDown, TrendingUp, MousePointer } from 'lucide-react';

interface AnalyticsData {
  activeVisitors: number;
  todaySessions: number;
  todayPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
}

interface OverviewCardsProps {
  analytics: AnalyticsData;
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const OverviewCards = ({ analytics }: OverviewCardsProps) => {
  const cards = [
    {
      title: 'Active Visitors',
      value: analytics.activeVisitors,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      live: true
    },
    {
      title: 'Sessions',
      value: analytics.todaySessions,
      icon: MousePointer,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Page Views',
      value: analytics.todayPageViews,
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Avg. Duration',
      value: formatDuration(analytics.avgSessionDuration),
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      isTime: true
    },
    {
      title: 'Bounce Rate',
      value: `${analytics.bounceRate}%`,
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Conversion',
      value: `${analytics.conversionRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              {card.live && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">
              {card.isTime ? card.value : card.value}
            </p>
            <p className="text-xs text-muted-foreground">{card.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
