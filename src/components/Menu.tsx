import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState, lazy, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Lazy load the card component for better performance
const MenuCard = lazy(() => import('./MenuCard'));

const Menu = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'nawa-breakfast', name: 'NAWA Breakfast', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=300&q=80' },
    { id: 'coffee', name: 'COFFEE', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80' },
    { id: 'manual-brew', name: 'MANUAL BREW', image: '/menu-images/manual-brew-1.jpg' },
    { id: 'offer', name: 'YOUR WEEKLY DISCOUNT IS HERE', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80' },
    { id: 'lunch-dinner', name: 'Lunch & Dinner', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80' },
    { id: 'appetisers', name: 'Appetisers', image: '/menu-images/appetiser-1.jpg' },
    { id: 'pasta', name: 'Pasta', image: '/menu-images/pasta-1.jpg' },
    { id: 'risotto', name: 'RISOTTO', image: '/menu-images/risotto-1.jpg' },
    { id: 'spanish-dishes', name: 'Spanish Dishes', image: '/menu-images/spanish-1.jpg' },
    { id: 'burgers', name: 'Burgers', image: '/menu-images/burger-1.jpg' },
    { id: 'sharing-meal', name: 'SERVE SHARE & EAT - SHARING MEAL MEAN SHARING LOVE', image: '/menu-images/sharing-meal-1.jpg' },
    { id: 'fries', name: 'Fries', image: '/menu-images/fries-1.jpg' },
    { id: 'club-sandwich', name: 'EATING HEALTHY TO LOSE WEIGHT CLUB SANDWICH', image: '/menu-images/club-sandwich-1.jpg' },
    { id: 'kids-meals', name: 'Kids Meals', image: '/menu-images/kids-meal-1.jpg' },
    { id: 'pastries', name: 'Pastries & Desserts', image: '/menu-images/dessert-1.jpg' },
    { id: 'cold-beverages', name: 'Cold Beverages', image: '/menu-images/cold-coffee-1.jpg' },
    { id: 'mojito', name: 'Mojito', image: '/menu-images/mojito-1.jpg' },
    { id: 'water', name: 'Water', image: '/menu-images/water-1.jpg' },
    { id: 'infusion', name: 'Infusion', image: '/menu-images/infusion-1.jpg' },
    { id: 'fresh-juice', name: 'Fresh Juice', image: '/menu-images/fresh-juice-1.jpg' },
    { id: 'matcha', name: '🍃💚💚 MATCHA LOVERS OFFERS 🍃💚', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=300&q=80' },
    { id: 'arabic-coffee', name: 'ARABIC COFFEE', image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=300&q=80' },
    { id: 'nawa-special-tea', name: 'NAWA SPECIAL TEA', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=300&q=80' },
    { id: 'nawa-summer', name: 'NAWA SUMMER', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=300&q=80' },
  ];

  // Structured menu with subcategories (151 items total)
  const menuStructure = {
    'nawa-breakfast': {
      'Savoury': [
        { id: 1, name: 'Avocado Toast', description: 'Flavours loaded to the core', price: 0, image: '/menu-images/savoury-1.jpg' },
        { id: 2, name: 'Eggs Benedict', description: 'I want what I want', price: 0, image: '/menu-images/savoury-2.jpg' },
        { id: 3, name: 'Smoked Salmon Toast', description: 'NAWA signature', price: 0, image: '/menu-images/savoury-3.jpg' },
        { id: 4, name: 'Eggs Florentine', description: '', price: 0, image: '/menu-images/savoury-4.jpg' },
        { id: 5, name: 'Shakshuka', description: 'NAWA style', price: 0, image: '/menu-images/savoury-5.jpg' },
        { id: 6, name: 'Smoked Turkey Toast', description: '', price: 0, image: '/menu-images/savoury-6.jpg' },
        { id: 7, name: 'Scrambled Eggs Toast', description: '', price: 0, image: '/menu-images/savoury-7.jpg' },
        { id: 8, name: 'Egg White Omelette', description: '', price: 0, image: '/menu-images/savoury-8.jpg' },
        { id: 9, name: 'Halloumi Pesto Toast', description: '', price: 0, image: '/menu-images/savoury-9.jpg' },
        { id: 10, name: 'Cheese Omelette Toast', description: '', price: 0, image: '/menu-images/savoury-10.jpg' },
        { id: 11, name: 'Truffle Omelette Toast', description: '', price: 0, image: '/menu-images/savoury-11.jpg' },
        { id: 12, name: 'Fried Eggs Toast', description: '', price: 0, image: '/menu-images/savoury-12.jpg' },
      ],
      'Arabic Breakfast & Special Tea': [
        { id: 13, name: 'Arabic Breakfast', description: 'Traditional Arabic breakfast platter', price: 0, image: '/menu-images/arabic-breakfast-1.jpg' },
      ],
      'Sweets': [
        { id: 14, name: 'Pancakes', description: '', price: 0, image: '/menu-images/pancake-1.jpg' },
        { id: 15, name: 'French Toast', description: '', price: 0, image: '/menu-images/pancake-2.jpg' },
        { id: 16, name: 'Sweet Pancakes', description: '', price: 0, image: '/menu-images/pancake-3.jpg' },
        { id: 17, name: 'Classic French Toast', description: '', price: 0, image: '/menu-images/pancake-4.jpg' },
        { id: 18, name: 'Specialty Pancakes', description: '', price: 0, image: '/menu-images/pancake-5.jpg' },
        { id: 19, name: 'Premium French Toast', description: '', price: 0, image: '/menu-images/pancake-6.jpg' },
      ],
      'Croissant': [
        { id: 20, name: 'Classic Croissant', description: '', price: 0, image: '/menu-images/croissant-1.jpg' },
        { id: 21, name: 'Chocolate Croissant', description: '', price: 0, image: '/menu-images/croissant-2.jpg' },
        { id: 22, name: 'Almond Croissant', description: '', price: 0, image: '/menu-images/croissant-3.jpg' },
        { id: 23, name: 'Special Croissant', description: '', price: 0, image: '/menu-images/croissant-4.jpg' },
      ],
    },
    'coffee': {
      'Hot Coffee': [
        { id: 24, name: 'Hot Coffee 1', description: '', price: 0, image: '/menu-images/coffee-1.jpg' },
        { id: 25, name: 'Hot Coffee 2', description: '', price: 0, image: '/menu-images/coffee-2.jpg' },
        { id: 26, name: 'Hot Coffee 3', description: '', price: 0, image: '/menu-images/coffee-3.jpg' },
        { id: 27, name: 'Hot Coffee 4', description: '', price: 0, image: '/menu-images/coffee-4.jpg' },
        { id: 28, name: 'Hot Coffee 5', description: '', price: 0, image: '/menu-images/coffee-5.jpg' },
        { id: 29, name: 'Hot Coffee 6', description: '', price: 0, image: '/menu-images/coffee-6.jpg' },
        { id: 30, name: 'Hot Coffee 7', description: '', price: 0, image: '/menu-images/coffee-7.jpg' },
        { id: 31, name: 'Hot Coffee 8', description: '', price: 0, image: '/menu-images/coffee-8.jpg' },
        { id: 32, name: 'Hot Coffee 9', description: '', price: 0, image: '/menu-images/coffee-9.jpg' },
        { id: 33, name: 'Hot Coffee 10', description: '', price: 0, image: '/menu-images/coffee-10.jpg' },
        { id: 34, name: 'Hot Coffee 11', description: '', price: 0, image: '/menu-images/coffee-11.jpg' },
        { id: 35, name: 'Hot Coffee 12', description: '', price: 0, image: '/menu-images/coffee-12.jpg' },
        { id: 36, name: 'Hot Coffee 13', description: '', price: 0, image: '/menu-images/coffee-13.jpg' },
        { id: 37, name: 'Hot Coffee 14', description: '', price: 0, image: '/menu-images/coffee-14.jpg' },
        { id: 38, name: 'Hot Coffee 15', description: '', price: 0, image: '/menu-images/coffee-15.jpg' },
        { id: 39, name: 'Hot Coffee 16', description: '', price: 0, image: '/menu-images/coffee-16.jpg' },
        { id: 40, name: 'Hot Coffee 17', description: '', price: 0, image: '/menu-images/coffee-17.jpg' },
        { id: 41, name: 'Hot Coffee 18', description: '', price: 0, image: '/menu-images/coffee-18.jpg' },
      ],
      'Cold Coffee': [
        { id: 42, name: 'Cold Coffee 1', description: '', price: 0, image: '/menu-images/cold-coffee-1.jpg' },
        { id: 43, name: 'Cold Coffee 2', description: '', price: 0, image: '/menu-images/cold-coffee-2.jpg' },
        { id: 44, name: 'Cold Coffee 3', description: '', price: 0, image: '/menu-images/cold-coffee-3.jpg' },
        { id: 45, name: 'Cold Coffee 4', description: '', price: 0, image: '/menu-images/cold-coffee-4.jpg' },
        { id: 46, name: 'Cold Coffee 5', description: '', price: 0, image: '/menu-images/cold-coffee-5.jpg' },
        { id: 47, name: 'Cold Coffee 6', description: '', price: 0, image: '/menu-images/cold-coffee-6.jpg' },
        { id: 48, name: 'Cold Coffee 7', description: '', price: 0, image: '/menu-images/cold-coffee-7.jpg' },
        { id: 49, name: 'Cold Coffee 8', description: '', price: 0, image: '/menu-images/cold-coffee-8.jpg' },
        { id: 50, name: 'Cold Coffee 9', description: '', price: 0, image: '/menu-images/cold-coffee-9.jpg' },
        { id: 51, name: 'Cold Coffee 10', description: '', price: 0, image: '/menu-images/cold-coffee-10.jpg' },
        { id: 52, name: 'Cold Coffee 11', description: '', price: 0, image: '/menu-images/cold-coffee-11.jpg' },
        { id: 53, name: 'Cold Coffee 12', description: '', price: 0, image: '/menu-images/cold-coffee-12.jpg' },
        { id: 54, name: 'Cold Coffee 13', description: '', price: 0, image: '/menu-images/cold-coffee-13.jpg' },
        { id: 55, name: 'Cold Coffee 14', description: '', price: 0, image: '/menu-images/cold-coffee-14.jpg' },
        { id: 56, name: 'Cold Coffee 15', description: '', price: 0, image: '/menu-images/cold-coffee-15.jpg' },
      ],
    },
    'manual-brew': {
      'Manual Brew': [
        { id: 57, name: 'Manual Brew 1', description: '', price: 0, image: '/menu-images/manual-brew-1.jpg' },
        { id: 58, name: 'Manual Brew 2', description: '', price: 0, image: '/menu-images/manual-brew-2.jpg' },
        { id: 59, name: 'Manual Brew 3', description: '', price: 0, image: '/menu-images/manual-brew-3.jpg' },
        { id: 60, name: 'Manual Brew 4', description: '', price: 0, image: '/menu-images/manual-brew-4.jpg' },
      ],
    },
    'offer': {
      'Special Combos': [
        { id: 61, name: 'Combo 1', description: '', price: 0, image: '/menu-images/offer-1.jpg' },
        { id: 62, name: 'Combo 2', description: '', price: 0, image: '/menu-images/offer-2.jpg' },
      ],
    },
    'lunch-dinner': {
      'Savoury': [
        { id: 63, name: 'Avocado Toast', description: 'Flavours loaded to the core', price: 0, image: '/menu-images/savoury-1.jpg' },
        { id: 64, name: 'Eggs Benedict', description: 'I want what I want', price: 0, image: '/menu-images/savoury-2.jpg' },
        { id: 65, name: 'Smoked Salmon Toast', description: 'NAWA signature', price: 0, image: '/menu-images/savoury-3.jpg' },
      ],
    },
    'appetisers': {
      'Appetisers': [
        { id: 66, name: 'Appetiser 1', description: '', price: 0, image: '/menu-images/appetiser-1.jpg' },
        { id: 67, name: 'Appetiser 2', description: '', price: 0, image: '/menu-images/appetiser-2.jpg' },
        { id: 68, name: 'Appetiser 3', description: '', price: 0, image: '/menu-images/appetiser-3.jpg' },
        { id: 69, name: 'Appetiser 4', description: '', price: 0, image: '/menu-images/appetiser-4.jpg' },
        { id: 70, name: 'Appetiser 5', description: '', price: 0, image: '/menu-images/appetiser-5.jpg' },
        { id: 71, name: 'Appetiser 6', description: '', price: 0, image: '/menu-images/appetiser-6.jpg' },
        { id: 72, name: 'Appetiser 7', description: '', price: 0, image: '/menu-images/appetiser-7.jpg' },
      ],
    },
    'pasta': {
      'Pasta': [
        { id: 73, name: 'Pasta 1', description: '', price: 0, image: '/menu-images/pasta-1.jpg' },
        { id: 74, name: 'Pasta 2', description: '', price: 0, image: '/menu-images/pasta-2.jpg' },
        { id: 75, name: 'Pasta 3', description: '', price: 0, image: '/menu-images/pasta-3.jpg' },
      ],
    },
    'risotto': {
      'Risotto': [
        { id: 76, name: 'Risotto 1', description: '', price: 0, image: '/menu-images/risotto-1.jpg' },
        { id: 77, name: 'Risotto 2', description: '', price: 0, image: '/menu-images/risotto-2.jpg' },
        { id: 78, name: 'Risotto 3', description: '', price: 0, image: '/menu-images/risotto-3.jpg' },
        { id: 79, name: 'Risotto 4', description: '', price: 0, image: '/menu-images/risotto-4.jpg' },
        { id: 80, name: 'Risotto 5', description: '', price: 0, image: '/menu-images/risotto-5.jpg' },
      ],
    },
    'spanish-dishes': {
      'Spanish Dishes': [
        { id: 81, name: 'Spanish Dish 1', description: '', price: 0, image: '/menu-images/spanish-1.jpg' },
        { id: 82, name: 'Spanish Dish 2', description: '', price: 0, image: '/menu-images/spanish-2.jpg' },
      ],
    },
    'burgers': {
      'Burgers': [
        { id: 83, name: 'Burger 1', description: '', price: 0, image: '/menu-images/burger-1.jpg' },
        { id: 84, name: 'Burger 2', description: '', price: 0, image: '/menu-images/burger-2.jpg' },
        { id: 85, name: 'Burger 3', description: '', price: 0, image: '/menu-images/burger-3.jpg' },
        { id: 86, name: 'Burger 4', description: '', price: 0, image: '/menu-images/burger-4.jpg' },
        { id: 87, name: 'Burger 5', description: '', price: 0, image: '/menu-images/burger-5.jpg' },
        { id: 88, name: 'Burger 6', description: '', price: 0, image: '/menu-images/burger-6.jpg' },
        { id: 89, name: 'Burger 7', description: '', price: 0, image: '/menu-images/burger-7.jpg' },
        { id: 90, name: 'Burger 8', description: '', price: 0, image: '/menu-images/burger-8.jpg' },
      ],
    },
    'sharing-meal': {
      'Sharing Meal': [
        { id: 91, name: 'Sharing Tower', description: 'SERVE SHARE & EAT - SHARING MEAL MEAN SHARING LOVE', price: 0, image: '/menu-images/sharing-meal-1.jpg' },
      ],
    },
    'fries': {
      'Fries': [
        { id: 92, name: 'Fries 1', description: '', price: 0, image: '/menu-images/fries-1.jpg' },
        { id: 93, name: 'Fries 2', description: '', price: 0, image: '/menu-images/fries-2.jpg' },
        { id: 94, name: 'Fries 3', description: '', price: 0, image: '/menu-images/fries-3.jpg' },
      ],
    },
    'club-sandwich': {
      'Club Sandwich': [
        { id: 95, name: 'Healthy Club Sandwich', description: 'EATING HEALTHY TO LOSE WEIGHT', price: 0, image: '/menu-images/club-sandwich-1.jpg' },
      ],
    },
    'kids-meals': {
      'Kids Meals': [
        { id: 96, name: 'Kids Meal 1', description: '', price: 0, image: '/menu-images/kids-meal-1.jpg' },
        { id: 97, name: 'Kids Meal 2', description: '', price: 0, image: '/menu-images/kids-meal-2.jpg' },
        { id: 98, name: 'Kids Meal 3', description: '', price: 0, image: '/menu-images/kids-meal-3.jpg' },
      ],
    },
    'pastries': {
      'Cakes & Desserts': [
        { id: 99, name: 'Custard Donut', description: '', price: 0, image: '/menu-images/dessert-1.jpg' },
        { id: 100, name: 'Nutella Donut', description: '', price: 0, image: '/menu-images/dessert-2.jpg' },
        { id: 101, name: 'Dessert 3', description: '', price: 0, image: '/menu-images/dessert-3.jpg' },
        { id: 102, name: 'Dessert 4', description: '', price: 0, image: '/menu-images/dessert-4.jpg' },
        { id: 103, name: 'Dessert 5', description: '', price: 0, image: '/menu-images/dessert-5.jpg' },
        { id: 104, name: 'Dessert 6', description: '', price: 0, image: '/menu-images/dessert-6.jpg' },
        { id: 105, name: 'Dessert 7', description: '', price: 0, image: '/menu-images/dessert-7.jpg' },
        { id: 106, name: 'Dessert 8', description: '', price: 0, image: '/menu-images/dessert-8.jpg' },
        { id: 107, name: 'Mango Passion Cheesecake', description: '', price: 0, image: '/menu-images/dessert-9.jpg' },
        { id: 108, name: 'Very Berry Cheesecake', description: '', price: 0, image: '/menu-images/dessert-10.jpg' },
        { id: 109, name: 'Cinnamon Churros', description: '', price: 0, image: '/menu-images/dessert-11.jpg' },
        { id: 110, name: 'Dessert 12', description: '', price: 0, image: '/menu-images/dessert-12.jpg' },
        { id: 111, name: 'Dessert 13', description: '', price: 0, image: '/menu-images/dessert-13.jpg' },
        { id: 112, name: 'Dessert 14', description: '', price: 0, image: '/menu-images/dessert-14.jpg' },
      ],
    },
    'cold-beverages': {
      'Cold Beverages': [
        { id: 113, name: 'Cold Beverage 1', description: '', price: 0, image: '/menu-images/cold-coffee-1.jpg' },
        { id: 114, name: 'Cold Beverage 2', description: '', price: 0, image: '/menu-images/cold-coffee-2.jpg' },
        { id: 115, name: 'Cold Beverage 3', description: '', price: 0, image: '/menu-images/cold-coffee-3.jpg' },
        { id: 116, name: 'Cold Beverage 4', description: '', price: 0, image: '/menu-images/cold-coffee-4.jpg' },
        { id: 117, name: 'Cold Beverage 5', description: '', price: 0, image: '/menu-images/cold-coffee-5.jpg' },
        { id: 118, name: 'Cold Beverage 6', description: '', price: 0, image: '/menu-images/cold-coffee-6.jpg' },
        { id: 119, name: 'Cold Beverage 7', description: '', price: 0, image: '/menu-images/cold-coffee-7.jpg' },
      ],
    },
    'mojito': {
      'Mojito': [
        { id: 120, name: 'Mojito 1', description: '', price: 0, image: '/menu-images/mojito-1.jpg' },
        { id: 121, name: 'Mojito 2', description: '', price: 0, image: '/menu-images/mojito-2.jpg' },
        { id: 122, name: 'Mojito 3', description: '', price: 0, image: '/menu-images/mojito-3.jpg' },
        { id: 123, name: 'Mojito 4', description: '', price: 0, image: '/menu-images/mojito-4.jpg' },
        { id: 124, name: 'Mojito 5', description: '', price: 0, image: '/menu-images/mojito-5.jpg' },
      ],
    },
    'water': {
      'Water': [
        { id: 125, name: 'Himalayan Premium Glass Bottle', description: '', price: 0, image: '/menu-images/water-1.jpg' },
        { id: 126, name: 'Himalayan Luxurious Water', description: '', price: 0, image: '/menu-images/water-2.jpg' },
        { id: 127, name: 'Himalayan Sparkling Water', description: '', price: 0, image: '/menu-images/water-3.jpg' },
      ],
    },
    'infusion': {
      'Infusion': [
        { id: 128, name: 'Hibiscus Infusion', description: '', price: 0, image: '/menu-images/infusion-1.jpg' },
        { id: 129, name: 'Infusion 2', description: '', price: 0, image: '/menu-images/infusion-2.jpg' },
      ],
    },
    'fresh-juice': {
      'Fresh Juice': [
        { id: 130, name: 'Fresh Juice 1', description: '', price: 0, image: '/menu-images/fresh-juice-1.jpg' },
        { id: 131, name: 'Fresh Juice 2', description: '', price: 0, image: '/menu-images/fresh-juice-2.jpg' },
        { id: 132, name: 'Fresh Juice 3', description: '', price: 0, image: '/menu-images/fresh-juice-3.jpg' },
        { id: 133, name: 'Fresh Juice 4', description: '', price: 0, image: '/menu-images/fresh-juice-4.jpg' },
      ],
    },
    'matcha': {
      'Matcha Drinks': Array.from({ length: 6 }, (_, i) => ({ id: i + 134, name: `Matcha ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 26) % 50 + 1, 50)}.jpg` })),
    },
    'arabic-coffee': {
      'Arabic Coffee': Array.from({ length: 4 }, (_, i) => ({ id: i + 140, name: `Arabic Coffee ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 32) % 50 + 1, 50)}.jpg` })),
    },
    'nawa-special-tea': {
      'Earl Grey Special': Array.from({ length: 3 }, (_, i) => ({ id: i + 144, name: `Earl Grey ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 36) % 50 + 1, 50)}.jpg` })),
      'Green Tea Mango': Array.from({ length: 2 }, (_, i) => ({ id: i + 147, name: `Green Tea ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 39) % 50 + 1, 50)}.jpg` })),
      'Night Green Tea': Array.from({ length: 2 }, (_, i) => ({ id: i + 149, name: `Night Tea ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 41) % 50 + 1, 50)}.jpg` })),
      'Nawa Special Black Tea': Array.from({ length: 2 }, (_, i) => ({ id: i + 151, name: `Black Tea ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 43) % 50 + 1, 50)}.jpg` })),
    },
    'nawa-summer': {
      'Seasonal Desserts': Array.from({ length: 2 }, (_, i) => ({ id: i + 153, name: `Summer Dessert ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 45) % 50 + 1, 50)}.jpg` })),
      'Ice Creams': Array.from({ length: 3 }, (_, i) => ({ id: i + 155, name: `Ice Cream ${i + 1}`, description: '', price: 0, image: `/menu-images/${Math.min((i + 47) % 50 + 1, 50)}.jpg` })),
      'Acai Bowl': Array.from({ length: 1 }, (_, i) => ({ id: i + 158, name: `Acai Bowl ${i + 1}`, description: '', price: 0, image: `/menu-images/${50}.jpg` })),
    },
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#4a5f4a]/30 via-[#5a6f5a]/20 to-[#4a5f4a]/30 backdrop-blur-sm">
      {/* Header with Search */}
      <div className="bg-[#4a5f4a]/80 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 sticky top-16 z-10">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white whitespace-nowrap">Specialty Coffee</h1>
            <div className="flex-1 relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-700 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search Item By Name, Price Or Description."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#c9a962] border-none text-coffee-900 placeholder:text-coffee-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="overflow-x-auto py-6 px-4 sm:px-6 lg:px-8 scrollbar-hide">
        <div className="container mx-auto">
          <div className="flex gap-4 min-w-max justify-start">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToSection(category.id)}
                className="flex-shrink-0 w-40 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-2">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <p className="text-[#c9a962] text-sm font-medium text-center uppercase leading-tight">
                  {category.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {categories.map((category) => {
          const categoryStructure = menuStructure[category.id as keyof typeof menuStructure];
          if (!categoryStructure) return null;
          
          return (
            <div key={category.id} id={category.id} className="mb-16 scroll-mt-32">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {category.name}
                </h2>
              </div>

              {/* Subsections */}
              {Object.entries(categoryStructure).map(([subsectionName, items]) => (
                <div key={subsectionName} className="mb-12">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#c9a962] mb-6">
                    {subsectionName}
                  </h3>
                  
                  {/* Items Grid with Lazy Loading */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <Suspense fallback={
                      <div className="col-span-full flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-[#c9a962] border-t-transparent rounded-full animate-spin" />
                      </div>
                    }>
                      {items.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          onClick={() => setSelectedCard(item.id)}
                        />
                      ))}
                    </Suspense>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal for Card Details */}
      <Dialog open={selectedCard !== null} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="bg-[#4a5f4a] border-[#c9a962] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#c9a962]">
              Item {selectedCard}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-white/80">Content will be added here...</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Menu;
