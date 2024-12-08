import React from 'react';
import { Card, Checkbox, Button } from '@nextui-org/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useShoppingStore, ShoppingItem } from '../../store/shoppingStore';
import AddItemModal from './AddItemModal';

const ShoppingList: React.FC = () => {
  const { items, selectedCategory, toggleComplete, deleteItem } = useShoppingStore();
  const [editItem, setEditItem] = React.useState<ShoppingItem | null>(null);

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <Card key={item.id} className="p-4 bg-background">
          <div className="flex items-center gap-4">
            <Checkbox
              isSelected={item.completed}
              onValueChange={() => toggleComplete(item.id)}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${item.completed ? 'line-through text-gray-400' : ''}`}>
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {item.category} • Qty: {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.price && (
                    <p className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  )}
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => setEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    color="danger"
                    onPress={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {item.notes && (
                <p className="text-sm text-gray-400 mt-1">{item.notes}</p>
              )}
            </div>
          </div>
        </Card>
      ))}

      <AddItemModal
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        editItem={editItem}
      />
    </div>
  );
};