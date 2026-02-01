import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Users, Eye, Clock, TrendingUp, MousePointer, LogOut } from 'lucide-react';
import { OverviewCards } from '@/components/analytics/OverviewCards';
import { LiveVisitorsTable } from '@/components/analytics/LiveVisitorsTable';
import { VisitorsChart } from '@/components/analytics/VisitorsChart';
import { DeviceBreakdown } from '@/components/analytics/DeviceBreakdown';
import { TopPagesChart } from '@/components/analytics/TopPagesChart';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { MenuItemStats } from '@/components/analytics/MenuItemStats';
import { SessionsTable } from '@/components/analytics/SessionsTable';
import { adminService } from '@/services/adminService';

interface AnalyticsData {
  activeVisitors: number;
  todaySessions: number;
  todayPageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
}

interface VisitorSession {
  id: string;
  visitor_id: string;
  device_type: string | null;
  browser: string | null;
  landing_page: string | null;
  pages_viewed: number | null;
  session_start: string;
  session_end: string | null;
  referrer: string | null;
}

interface AnonymousVisitor {
  id: string;
  visitor_id: string;
  device_type: string | null;
  browser: string | null;
  country: string | null;
  last_seen_at: string;
}

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    activeVisitors: 0,
    todaySessions: 0,
    todayPageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0
  });
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [visitors, setVisitors] = useState<AnonymousVisitor[]>([]);
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('today');

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const isValid = adminService.checkSession();
      if (!isValid) {
        navigate('/staff/login');
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
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

    try {
      // Fetch sessions
      const { data: sessionsData } = await supabase
        .from('visitor_sessions')
        .select('*')
        .gte('session_start', startDate.toISOString())
        .order('session_start', { ascending: false });

      // Fetch page views
      const { data: pageViewsData } = await supabase
        .from('page_views')
        .select('*')
        .gte('viewed_at', startDate.toISOString());

      // Fetch anonymous visitors (active in last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const { data: activeVisitorsData } = await supabase
        .from('anonymous_visitors')
        .select('*')
        .gte('last_seen_at', fiveMinutesAgo.toISOString())
        .order('last_seen_at', { ascending: false });

      // Fetch orders for conversion
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', startDate.toISOString())
        .eq('payment_status', 'paid');

      // Calculate metrics
      const totalSessions = sessionsData?.length || 0;
      const totalPageViews = pageViewsData?.length || 0;
      const activeVisitors = activeVisitorsData?.length || 0;
      const completedOrders = ordersData?.length || 0;

      // Bounce rate: sessions with only 1 page view
      const bouncedSessions = sessionsData?.filter(s => (s.pages_viewed || 0) <= 1).length || 0;
      const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

      // Conversion rate
      const conversionRate = totalSessions > 0 ? (completedOrders / totalSessions) * 100 : 0;

      // Average session duration
      const sessionsWithDuration = sessionsData?.filter(s => s.session_end) || [];
      const totalDuration = sessionsWithDuration.reduce((acc, s) => {
        const start = new Date(s.session_start).getTime();
        const end = new Date(s.session_end!).getTime();
        return acc + (end - start);
      }, 0);
      const avgDuration = sessionsWithDuration.length > 0 
        ? Math.floor(totalDuration / sessionsWithDuration.length / 1000) 
        : 0;

      setAnalytics({
        activeVisitors,
        todaySessions: totalSessions,
        todayPageViews: totalPageViews,
        avgSessionDuration: avgDuration,
        bounceRate: Math.round(bounceRate * 10) / 10,
        conversionRate: Math.round(conversionRate * 10) / 10
      });

      setSessions(sessionsData || []);
      setVisitors(activeVisitorsData || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }, [dateRange]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, fetchAnalytics]);

  // Real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    console.log('Setting up realtime subscriptions for analytics');

    const sessionsChannel = supabase
      .channel('analytics-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visitor_sessions' },
        (payload) => {
          console.log('Session change:', payload);
          fetchAnalytics();
        }
      )
      .subscribe();

    const visitorsChannel = supabase
      .channel('analytics-visitors')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'anonymous_visitors' },
        (payload) => {
          console.log('Visitor change:', payload);
          fetchAnalytics();
        }
      )
      .subscribe();

    const pageViewsChannel = supabase
      .channel('analytics-pageviews')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'page_views' },
        (payload) => {
          console.log('Page view change:', payload);
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(visitorsChannel);
      supabase.removeChannel(pageViewsChannel);
    };
  }, [isAuthenticated, fetchAnalytics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    await adminService.logout();
    navigate('/staff/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">NAWA Analytics</h1>
            <p className="text-sm text-muted-foreground">Real-time visitor insights</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {(['today', '7days', '30days'] as const).map((range) => (
                <Button
                  key={range}
                  variant={dateRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDateRange(range)}
                  className="text-xs"
                >
                  {range === 'today' ? 'Today' : range === '7days' ? '7 Days' : '30 Days'}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Overview Cards */}
        <OverviewCards analytics={analytics} />

        {/* Live Activity + Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveVisitorsTable visitors={visitors} />
          <VisitorsChart dateRange={dateRange} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DeviceBreakdown dateRange={dateRange} />
          <TopPagesChart dateRange={dateRange} />
          <ConversionFunnel dateRange={dateRange} />
        </div>

        {/* Menu Stats */}
        <MenuItemStats dateRange={dateRange} />

        {/* All Sessions Table */}
        <SessionsTable sessions={sessions} />
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
