import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet, Globe } from 'lucide-react';

interface Visitor {
  id: string;
  visitor_id: string;
  device_type: string | null;
  browser: string | null;
  country: string | null;
  last_seen_at: string;
}

interface LiveVisitorsTableProps {
  visitors: Visitor[];
}

const getDeviceIcon = (deviceType: string | null) => {
  switch (deviceType?.toLowerCase()) {
    case 'mobile':
      return <Smartphone className="h-4 w-4" />;
    case 'tablet':
      return <Tablet className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
};

const getTimeSince = (dateString: string): string => {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = Math.floor((now - then) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 120) return '1 min ago';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const isActive = (lastSeen: string): boolean => {
  const now = Date.now();
  const then = new Date(lastSeen).getTime();
  return (now - then) < 2 * 60 * 1000; // Active if seen in last 2 minutes
};

export const LiveVisitorsTable = ({ visitors }: LiveVisitorsTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live Activity
          <Badge variant="secondary" className="ml-auto">
            {visitors.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Visitor</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No active visitors right now
                  </TableCell>
                </TableRow>
              ) : (
                visitors.slice(0, 10).map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-mono text-xs">
                      {visitor.visitor_id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(visitor.device_type)}
                        <span className="text-sm capitalize">{visitor.device_type || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{visitor.browser || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{visitor.country || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {isActive(visitor.last_seen_at) ? (
                        <Badge variant="default" className="bg-green-500 text-xs">
                          Active
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {getTimeSince(visitor.last_seen_at)}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
