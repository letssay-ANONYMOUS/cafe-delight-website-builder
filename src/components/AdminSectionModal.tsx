import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AdminSectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (type: 'category' | 'section', data: { name: string; categoryId?: string; position: 'above' | 'below' }) => void;
  existingCategories?: { id: string; name: string }[];
}

export const AdminSectionModal = ({ open, onOpenChange, onSave, existingCategories = [] }: AdminSectionModalProps) => {
  const [type, setType] = useState<'category' | 'section'>('section');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [position, setPosition] = useState<'above' | 'below'>('below');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name) {
      toast({
        title: 'Error',
        description: 'Please enter a name',
        variant: 'destructive',
      });
      return;
    }

    if (type === 'section' && !categoryId) {
      toast({
        title: 'Error',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return;
    }

    onSave(type, { name, categoryId, position });
    onOpenChange(false);
    setName('');
    setCategoryId('');
    toast({
      title: 'Changes staged',
      description: `${type === 'category' ? 'Category' : 'Section'} creation staged. Click Save in footer to apply.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category or Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={type} onValueChange={(value: 'category' | 'section') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="section">Section</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${type} name`}
            />
          </div>

          {type === 'section' && (
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {existingCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Select value={position} onValueChange={(value: 'above' | 'below') => setPosition(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below">Below existing</SelectItem>
                <SelectItem value="above">Above existing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
