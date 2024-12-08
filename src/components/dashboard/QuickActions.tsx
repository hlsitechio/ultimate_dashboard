import { Card, CardBody, Button } from "@nextui-org/react";
import { 
  CalendarPlus, 
  Mail, 
  FileUp, 
  ListTodo, 
  Users, 
  Video,
  FileText,
  FolderOpen
} from "lucide-react";
import { useState } from "react";
import { useDashboardStore } from "../../store/dashboardStore";
import { useNavigate } from "react-router-dom";
import FileUploadModal from "../notes/FileUploadModal";

interface QuickAction {
  id: string;
  icon: any;
  label: string;
  color: string;
  notification?: number;
  path?: string;
  onClick: () => void;
}

const QuickActions = () => {
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [actions, setActions] = useState<QuickAction[]>([
    {
      id: 'calendar',
      icon: CalendarPlus,
      label: 'New Event',
      color: 'bg-primary/20 hover:bg-primary/30',
      notification: 2,
      path: '/calendar',
      onClick: () => navigate('/calendar')
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Send Email',
      color: 'bg-green-500/20 hover:bg-green-500/30',
      notification: 5,
      path: '/email',
      onClick: () => navigate('/email')
    },
    {
      id: 'task',
      icon: ListTodo,
      label: 'Add Task',
      color: 'bg-blue-500/20 hover:bg-blue-500/30',
      onClick: () => console.log('Add task')
    },
    {
      id: 'meeting',
      icon: Video,
      label: 'Schedule Meeting',
      color: 'bg-purple-500/20 hover:bg-purple-500/30',
      onClick: () => console.log('Schedule meeting')
    },
    {
      id: 'upload-notes',
      icon: FileText,
      label: 'Upload Notes',
      color: 'bg-orange-500/20 hover:bg-orange-500/30',
      onClick: () => setIsUploadModalOpen(true)
    },
    {
      id: 'notes-storage',
      icon: FolderOpen,
      label: 'Notes Storage',
      color: 'bg-yellow-500/20 hover:bg-yellow-500/30',
      path: '/notes',
      onClick: () => navigate('/notes')
    }
  ]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newActions = [...actions];
    const [draggedAction] = newActions.splice(dragIndex, 1);
    newActions.splice(dropIndex, 0, draggedAction);
    setActions(newActions);
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const getTextColor = () => {
              if (action.id === 'calendar') return 'text-primary';
              if (action.id === 'email') return 'text-green-500';
              if (action.id === 'task') return 'text-blue-500';
              if (action.id === 'meeting') return 'text-purple-500';
              if (action.id === 'upload-notes') return 'text-orange-500';
              if (action.id === 'notes-storage') return 'text-yellow-500';
              return 'text-white';
            };

            return (
              <Button
                key={action.id}
                className={`h-auto min-h-[120px] ${action.color} relative group`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onPress={action.onClick}
              >
                {action.notification && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{action.notification}</span>
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center gap-2">
                  <Icon className={`h-8 w-8 ${getTextColor()}`} />
                  <p className={`text-sm font-semibold ${getTextColor()}`}>{action.label}</p>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
              </Button>
            );
          })}
        </div>
      </div>

      <FileUploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
};

export default QuickActions;