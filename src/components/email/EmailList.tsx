import React, { useEffect } from 'react';
import { Card, Checkbox, Button } from '@nextui-org/react';
import { Star, StarOff, RefreshCw } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { format } from 'date-fns';
import LoadingSpinner from '../LoadingSpinner';

const EmailList: React.FC = () => {
  const { 
    emails, 
    selectedFolder, 
    selectedEmail, 
    loading,
    error,
    setSelectedEmail, 
    toggleStarred, 
    markAsRead,
    fetchEmails,
    connectGmail 
  } = useEmailStore();

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const filteredEmails = emails.filter((email) => {
    switch (selectedFolder) {
      case 'starred':
        return email.starred;
      case 'sent':
        return email.labels.includes('SENT');
      default:
        return true;
    }
  });

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      await markAsRead(email.id);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-danger mb-4">{error}</p>
        <Button 
          color="primary"
          onPress={() => connectGmail()}
        >
          Connect Gmail
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {selectedFolder.charAt(0).toUpperCase() + selectedFolder.slice(1)}
        </h2>
        <Button
          isIconOnly
          variant="light"
          onPress={() => fetchEmails()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {filteredEmails.map((email) => (
        <Card
          key={email.id}
          className={`p-4 cursor-pointer ${
            selectedEmail?.id === email.id ? 'bg-primary/20' : 'bg-background'
          } ${!email.read ? 'border-l-4 border-l-primary' : ''}`}
          onClick={() => handleEmailClick(email)}
        >
          <div className="flex items-center gap-4">
            <Checkbox />
            <button
              className="text-gray-400 hover:text-yellow-400"
              onClick={(e) => {
                e.stopPropagation();
                toggleStarred(email.id);
              }}
            >
              {email.starred ? (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">{email.from}</p>
                <p className="text-sm text-gray-400">
                  {format(email.date, 'MMM d, h:mm a')}
                </p>
              </div>
              <p className="text-sm font-medium truncate">{email.subject}</p>
              <p className="text-sm text-gray-400 truncate">{email.body}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EmailList;