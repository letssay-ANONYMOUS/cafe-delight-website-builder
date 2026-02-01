import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Monitor, Smartphone, Tablet, Download } from 'lucide-react';

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

interface SessionsTableProps {
  sessions: VisitorSession[];
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

const formatDuration = (start: string, end: string | null): string => {
  if (!end) return 'Active';
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const seconds = Math.floor((endTime - startTime) / 1000);
  
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const SessionsTable = ({ sessions }: SessionsTableProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayedSessions = showAll ? sessions : sessions.slice(0, 10);

  const handleExportCSV = () => {
    const headers = ['Visitor ID', 'Device', 'Browser', 'Pages', 'Duration', 'Started'];
    const rows = sessions.map(s => [
      s.visitor_id.slice(-8),
      s.device_type || 'desktop',
      s.browser || 'Unknown',
      s.pages_viewed || 1,
      formatDuration(s.session_start, s.session_end),
      new Date(s.session_start).toISOString()
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">All Sessions</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Visitor</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                displayedSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono text-xs">
                      {session.visitor_id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(session.device_type)}
                        <span className="text-sm capitalize">{session.device_type || 'desktop'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{session.browser || 'Unknown'}</TableCell>
                    <TableCell className="text-sm">{session.pages_viewed || 1}</TableCell>
                    <TableCell className="text-sm">
                      {formatDuration(session.session_start, session.session_end)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTime(session.session_start)}
                    </TableCell>
                    <TableCell>
                      {!session.session_end ? (
                        <Badge variant="default" className="bg-green-500 text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Ended
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {sessions.length > 10 && (
          <div className="flex justify-center mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show All ({sessions.length})
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
