import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useShoppingStore, ShoppingItem } from '../../store/shoppingStore';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: ShoppingItem | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  editItem,
}) => {
  const { categories, addItem, updateItem } = useShoppingStore();
  const [name, setName] = React.useState(editItem?.name || '');
  const [quantity, setQuantity] = React.useState(editItem?.quantity?.toString() || '1');
  const [category, setCategory] = React.useState(editItem?.category || '');
  const [price, setPrice] = React.useState(editItem?.price?.toString() || '');
  const [notes, setNotes] = React.useState(editItem?.notes || '');

  React.useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setQuantity(editItem.quantity.toString());
      setCategory(editItem.category);
      setPrice(editItem.price?.toString() || '');
      setNotes(editItem.notes || '');
    }
  }, [editItem]);

  const handleSubmit = () => {
    const itemData = {
      name,
      quantity: parseInt(quantity),
      category,
      completed: false,
      price: price ? parseFloat(price) : undefined,
      notes: notes || undefined,
    };

    if (editItem) {
      updateItem(editItem.id, itemData);
    } else {
      addItem(itemData);
    }

    onClose();
    setName('');
    setQuantity('1');
    setCategory('');
    setPrice('');
    setNotes('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-background">
        <ModalHeader>{editItem ? 'Edit Item' : 'Add New Item'}</ModalHeader>
        <ModalBody>
          <Input
            label="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <Input
              type="number"
              label="Price (optional)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              startContent={<span className="text-gray-400">$</span>}
            />
          </div>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-4"
          >
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>
          <Textarea
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            {editItem ? 'Update' : 'Add'} Item
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddItemModal;