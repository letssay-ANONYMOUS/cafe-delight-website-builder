import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

interface AdminPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ADMIN_PASSWORD = 'CafeAdmin2025!';

export const AdminPasswordModal = ({ open, onOpenChange }: AdminPasswordModalProps) => {
  const [password, setPassword] = useState('');
  const { setIsAdmin } = useAdmin();
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      onOpenChange(false);
      toast({
        title: 'Success',
        description: 'Admin mode activated',
      });
      setPassword('');
    } else {
      toast({
        title: 'Error',
        description: 'Incorrect password',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
