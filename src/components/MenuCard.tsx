import { Card } from '@/components/ui/card';

interface MenuCardProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onClick: () => void;
}

const MenuCard = ({ item, onClick }: MenuCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-transparent cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Golden Footer */}
      <div className="bg-[#c9a962]/90 backdrop-blur-sm p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-base leading-tight flex-1">
            {item.name}
          </h3>
        </div>
        
        <p className="text-white/70 text-xs">
          Click to view details
        </p>
      </div>
    </Card>
  );
};

export default MenuCard;
