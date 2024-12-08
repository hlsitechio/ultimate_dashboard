import React from 'react';
import { Button } from '@nextui-org/react';
import { useShoppingStore } from '../../store/shoppingStore';

const CategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useShoppingStore();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <Button
        className={`w-full justify-start ${
          !selectedCategory ? 'bg-primary/20 text-primary' : ''
        }`}
        variant={!selectedCategory ? 'flat' : 'light'}
        onPress={() => setSelectedCategory(null)}
      >
        All Items
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          className={`w-full justify-start ${
            selectedCategory === category ? 'bg-primary/20 text-primary' : ''
          }`}
          variant={selectedCategory === category ? 'flat' : 'light'}
          onPress={() => setSelectedCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};