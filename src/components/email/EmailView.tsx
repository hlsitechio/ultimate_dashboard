import React from 'react';
import { Button, Card } from '@nextui-org/react';
import { ArrowLeft, Star, StarOff, Trash2 } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { format } from 'date-fns';

const EmailView: React.FC = () => {
  const { selectedEmail, setSelectedEmail, toggleStarred, deleteEmail } = useEmailStore();

  if (!selectedEmail) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Select an email to view</p>
      </div>
    );
  }

  return (
    <Card className="h-full bg-background p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          isIconOnly
          variant="light"
          onPress={() => setSelectedEmail(null)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
          <p className="text-sm text-gray-400">
            {format(selectedEmail.date, 'MMMM d, yyyy h:mm a')}
          </p>
        </div>
        <Button
          isIconOnly
          variant="light"
          onPress={() => toggleStarred(selectedEmail.id)}
        >
          {selectedEmail.starred ? (
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="h-5 w-5" />
          )}
        </Button>
        <Button
          isIconOnly
          variant="light"
          color="danger"
          onPress={() => {
            deleteEmail(selectedEmail.id);
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-medium">{selectedEmail.from}</p>
            <p className="text-sm text-gray-400">To: {selectedEmail.to}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        {selectedEmail.body.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Card>
  );
};

export default EmailView;