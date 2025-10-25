import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CardData {
  name: string;
  price: number;
  description: string;
  image: string;
}

interface AdminCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CardData) => void;
  initialData?: CardData;
  title: string;
}

export const AdminCardModal = ({ open, onOpenChange, onSave, initialData, title }: AdminCardModalProps) => {
  const [formData, setFormData] = useState<CardData>({
    name: '',
    price: 0,
    description: '',
    image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
        image: ''
      });
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    onSave(formData);
    onOpenChange(false);
    toast({
      title: 'Success',
      description: initialData ? 'Card updated successfully' : 'Card created successfully',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter card name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (AED) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              placeholder="Enter price"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Enter image URL or path"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
