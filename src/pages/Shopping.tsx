import React from 'react';
import { Button, Card, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Checkbox } from '@nextui-org/react';
import { Plus, Share2, Edit2, Trash2, Check } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useShoppingStore } from '../store/shoppingStore';

const Shopping = () => {
  const { items, categories, addItem, updateItem, deleteItem, toggleComplete } = useShoppingStore();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<any>(null);
  const [newItem, setNewItem] = React.useState({
    name: '',
    emoji: '🛒',
    quantity: 1,
    category: '',
  });

  const totalItems = items.length;
  const completedItems = items.filter(item => item.completed).length;
  const remainingItems = totalItems - completedItems;

  const handleAddItem = () => {
    if (newItem.name && newItem.category) {
      addItem({
        ...newItem,
        completed: false,
      });
      setNewItem({
        name: '',
        emoji: '🛒',
        quantity: 1,
        category: '',
      });
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateItem = () => {
    if (editItem) {
      updateItem(editItem.id, editItem);
      setEditItem(null);
    }
  };

  const handleShare = () => {
    const listContent = items.map(item => 
      `${item.emoji} ${item.name} (${item.quantity}x) - ${item.category} ${item.completed ? '✓' : ''}`
    ).join('\n');

    const text = `
Shopping List:
-------------
${listContent}
-------------
Total: ${totalItems} | Completed: ${completedItems} | Remaining: ${remainingItems}
    `;

    if (navigator.share) {
      navigator.share({
        title: 'Shopping List',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text)
        .then(() => alert('List copied to clipboard!'))
        .catch(console.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Shopping List</h1>
          <div className="flex gap-2 text-sm text-gray-400">
            <span>Total: {totalItems}</span>
            <span>•</span>
            <span className="text-green-500">Completed: {completedItems}</span>
            <span>•</span>
            <span className="text-blue-500">Remaining: {remainingItems}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="flat"
            startContent={<Share2 className="h-5 w-5" />}
            onPress={handleShare}
          >
            Share
          </Button>
          <Button
            color="primary"
            startContent={<Plus className="h-5 w-5" />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-background p-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                item.completed ? 'bg-success/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  isSelected={item.completed}
                  onValueChange={() => toggleComplete(item.id)}
                  icon={<Check className="h-4 w-4" />}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <p className={`font-medium ${
                      item.completed ? 'line-through text-gray-400' : 'text-white'
                    }`}>
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {item.category} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => setEditItem(item)}
                >
                  <Edit2 className="h-4 w-4" />
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
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>Your shopping list is empty</p>
              <p className="text-sm">Add items to get started</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isAddModalOpen || !!editItem} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditItem(null);
          setIsEmojiPickerOpen(false);
        }}
      >
        <ModalContent className="bg-background">
          <ModalHeader className="text-white">
            {editItem ? 'Edit Item' : 'Add New Item'}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  className="text-2xl"
                  onPress={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                >
                  {editItem ? editItem.emoji : newItem.emoji}
                </Button>
                <Input
                  label="Item Name"
                  value={editItem ? editItem.name : newItem.name}
                  onChange={(e) => {
                    if (editItem) {
                      setEditItem({ ...editItem, name: e.target.value });
                    } else {
                      setNewItem({ ...newItem, name: e.target.value });
                    }
                  }}
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-background/50"
                  }}
                />
              </div>

              {isEmojiPickerOpen && (
                <div className="absolute z-50 mt-2">
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => {
                      if (editItem) {
                        setEditItem({ ...editItem, emoji: emojiData.emoji });
                      } else {
                        setNewItem({ ...newItem, emoji: emojiData.emoji });
                      }
                      setIsEmojiPickerOpen(false);
                    }}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Quantity"
                  min="1"
                  value={editItem ? editItem.quantity : newItem.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    if (editItem) {
                      setEditItem({ ...editItem, quantity: value });
                    } else {
                      setNewItem({ ...newItem, quantity: value });
                    }
                  }}
                  classNames={{
                    input: "text-white",
                    inputWrapper: "bg-background/50"
                  }}
                />

                <Select
                  label="Category"
                  selectedKeys={[editItem ? editItem.category : newItem.category]}
                  onChange={(e) => {
                    if (editItem) {
                      setEditItem({ ...editItem, category: e.target.value });
                    } else {
                      setNewItem({ ...newItem, category: e.target.value });
                    }
                  }}
                  classNames={{
                    trigger: "bg-background/50",
                    value: "text-white"
                  }}
                >
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                setIsAddModalOpen(false);
                setEditItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={editItem ? handleUpdateItem : handleAddItem}
            >
              {editItem ? 'Update' : 'Add'} Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Shopping;