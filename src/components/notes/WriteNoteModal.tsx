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
import { Smile } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';
import EmojiPicker from 'emoji-picker-react';

interface WriteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: any;
  onEmojiSelect: (emoji: string) => void;
  isEmojiPickerOpen: boolean;
  onEmojiPickerToggle: () => void;
}

const categories = [
  'Personal',
  'Work',
  'Ideas',
  'Tasks',
  'Meeting Notes',
  'Code Snippets',
  'Documentation',
];

const WriteNoteModal: React.FC<WriteNoteModalProps> = ({
  isOpen,
  onClose,
  note,
  onEmojiSelect,
  isEmojiPickerOpen,
  onEmojiPickerToggle,
}) => {
  const { addNote, updateNote } = useNotesStore();
  const [title, setTitle] = React.useState(note?.name || '');
  const [content, setContent] = React.useState(note?.content || '');
  const [category, setCategory] = React.useState(note?.category || categories[0]);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (note) {
      setTitle(note.name);
      setContent(note.content || '');
      setCategory(note.category || categories[0]);
    } else {
      setTitle('');
      setContent('');
      setCategory(categories[0]);
    }
  }, [note, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      const noteData = {
        name: title,
        content,
        category,
        file_type: 'text/plain',
        file_size: new Blob([content]).size,
        emoji: note?.emoji
      };

      if (note) {
        await updateNote(note.id, noteData);
      } else {
        await addNote(noteData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      isDismissable={false}
    >
      <ModalContent className="bg-background">
        <ModalHeader className="flex items-center gap-2 text-white">
          {note?.emoji && <span className="text-2xl">{note.emoji}</span>}
          <span>{note ? 'Edit Note' : 'Write New Note'}</span>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="ml-2"
            onPress={onEmojiPickerToggle}
          >
            <Smile className="h-4 w-4" />
          </Button>
        </ModalHeader>
        <ModalBody>
          {isEmojiPickerOpen && (
            <div className="absolute z-50 mt-2">
              <EmojiPicker onEmojiClick={(data) => {
                onEmojiSelect(data.emoji);
                onEmojiPickerToggle();
              }} />
            </div>
          )}

          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
            variant="bordered"
            classNames={{
              label: "text-white",
              input: "text-white",
              inputWrapper: "bg-background/50 border-gray-700 hover:border-gray-600 group-data-[focus=true]:border-primary"
            }}
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-4"
            variant="bordered"
            classNames={{
              label: "text-white",
              value: "text-white",
              trigger: "bg-background/50 border-gray-700 hover:border-gray-600 group-data-[focus=true]:border-primary"
            }}
          >
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>

          <Textarea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minRows={15}
            variant="bordered"
            classNames={{
              label: "text-white",
              input: "text-white font-mono",
              inputWrapper: "bg-background/50 border-gray-700 hover:border-gray-600 group-data-[focus=true]:border-primary"
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="light" 
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button 
            color="primary"
            onPress={handleSave}
            isLoading={saving}
          >
            {note ? 'Update' : 'Save'} Note
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WriteNoteModal;