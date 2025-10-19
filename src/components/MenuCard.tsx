import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface MenuCardProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  cardNumber?: number;
}

const MenuCard = ({ item, cardNumber }: MenuCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/menu/${item.id}`);
  };

  return (
    <Card
      onClick={handleClick}
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
        
        {/* Temporary Card Number */}
        {cardNumber && (
          <div className="absolute top-2 left-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10">
            <span className="text-white font-bold text-lg">{cardNumber}</span>
          </div>
        )}
      </div>

      {/* Golden Footer */}
      <div className="bg-[#c9a962]/90 backdrop-blur-sm p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-base leading-tight flex-1">
            {item.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-white/90 font-bold text-lg">
            AED {item.price.toFixed(2)}
          </p>
          <p className="text-white/60 text-xs">
            Click for details
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MenuCard;
