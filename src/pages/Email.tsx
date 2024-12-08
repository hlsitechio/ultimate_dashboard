import React from 'react';
import { Button } from '@nextui-org/react';
import { Plus } from 'lucide-react';
import { useEmailStore } from '../store/emailStore';
import EmailList from '../components/email/EmailList';
import EmailView from '../components/email/EmailView';
import ComposeModal from '../components/email/ComposeModal';

const Email = () => {
  const { selectedEmail } = useEmailStore();
  const [isComposeOpen, setIsComposeOpen] = React.useState(false);

  return (
    <div className="h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Email</h1>
        <Button
          color="primary"
          startContent={<Plus className="h-5 w-5" />}
          onPress={() => setIsComposeOpen(true)}
        >
          Compose
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 h-full">
        <div className={`${selectedEmail ? 'col-span-5' : 'col-span-12'} overflow-y-auto`}>
          <EmailList />
        </div>
        {selectedEmail && (
          <div className="col-span-7 overflow-y-auto">
            <EmailView />
          </div>
        )}
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
};

export default Email;