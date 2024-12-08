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
} from '@nextui-org/react';
import { format } from 'date-fns';
import { useCalendarStore, Event } from '../../store/calendarStore';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Partial<Event>;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { addEvent, updateEvent } = useCalendarStore();
  const [title, setTitle] = React.useState(event?.title || '');
  const [description, setDescription] = React.useState(event?.description || '');
  const [startDate, setStartDate] = React.useState(
    event?.start ? format(event.start, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [endDate, setEndDate] = React.useState(
    event?.end ? format(event.end, "yyyy-MM-dd'T'HH:mm") : format(new Date(Date.now() + 3600000), "yyyy-MM-dd'T'HH:mm")
  );

  const handleSubmit = () => {
    const eventData = {
      title,
      description,
      start: new Date(startDate),
      end: new Date(endDate),
      color: 'bg-primary',
    };

    if (event?.id) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-background">
        <ModalHeader>{event?.id ? 'Edit Event' : 'New Event'}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              classNames={{
                input: "text-white",
                inputWrapper: "bg-background/50"
              }}
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              classNames={{
                input: "text-white",
                inputWrapper: "bg-background/50"
              }}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit}>
            {event?.id ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;