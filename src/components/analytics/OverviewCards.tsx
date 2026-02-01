import { Card, CardContent } from '@/components/ui/card';
import { Users, Eye, Clock, ArrowDownRight, ShoppingBag, MousePointer } from 'lucide-react';

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
      title: 'Browsing Now',
      subtitle: 'People on your site',
      value: analytics.activeVisitors,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      live: true
    },
    {
      title: 'Total Visitors',
      subtitle: 'Unique sessions',
      value: analytics.todaySessions,
      icon: MousePointer,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Page Views',
      subtitle: 'Pages browsed',
      value: analytics.todayPageViews,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Time on Site',
      subtitle: 'Average per visitor',
      value: formatDuration(analytics.avgSessionDuration),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      isTime: true
    },
    {
      title: 'Quick Exits',
      subtitle: 'Left after 1 page',
      value: `${analytics.bounceRate}%`,
      icon: ArrowDownRight,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Ordered',
      subtitle: 'Visitors who bought',
      value: `${analytics.conversionRate}%`,
      icon: ShoppingBag,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              {card.live && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground mb-0.5">
              {card.value}
            </p>
            <p className="text-sm font-medium text-foreground">{card.title}</p>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
