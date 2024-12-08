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
import { useEmailStore } from '../../store/emailStore';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose }) => {
  const { sendNewEmail, loading } = useEmailStore();
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');

  const handleSend = async () => {
    try {
      await sendNewEmail(to, subject, body);
      onClose();
      setTo('');
      setSubject('');
      setBody('');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent className="bg-background">
        <ModalHeader>New Message</ModalHeader>
        <ModalBody>
          <Input
            label="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mb-4"
          />
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mb-4"
          />
          <Textarea
            label="Message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            minRows={10}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSend}
            isLoading={loading}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ComposeModal;