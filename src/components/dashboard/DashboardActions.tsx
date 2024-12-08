import React from 'react';
import { Button, Card, CardBody, Input, Checkbox } from "@nextui-org/react";
import { 
  CalendarPlus, 
  Mail, 
  FileText, 
  Video,
  Plus,
  ListTodo
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const DashboardActions = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [newTask, setNewTask] = React.useState("");
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: '1', title: 'Review project proposal', completed: false },
    { id: '2', title: 'Team meeting at 2 PM', completed: false },
    { id: '3', title: 'Update documentation', completed: true },
  ]);

  const quickActions = [
    {
      id: 'calendar',
      icon: CalendarPlus,
      label: 'New Event',
      color: 'bg-primary/20 hover:bg-primary/30',
      textColor: 'text-primary',
      notification: 2,
      onClick: () => navigate('/calendar')
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Send Email',
      color: 'bg-green-500/20 hover:bg-green-500/30',
      textColor: 'text-green-500',
      notification: 5,
      onClick: () => navigate('/email')
    },
    {
      id: 'meeting',
      icon: Video,
      label: 'Meeting',
      color: 'bg-purple-500/20 hover:bg-purple-500/30',
      textColor: 'text-purple-500',
      onClick: () => navigate('/calendar')
    },
    {
      id: 'notes',
      icon: FileText,
      label: 'Notes',
      color: 'bg-orange-500/20 hover:bg-orange-500/30',
      textColor: 'text-orange-500',
      onClick: () => navigate('/notes')
    }
  ];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        { id: Date.now().toString(), title: newTask, completed: false },
        ...tasks
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Quick Actions */}
      <div className="md:col-span-8">
        <Card className="bg-background/80 backdrop-blur-md border-none">
          <CardBody className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <Button
                color="primary"
                variant="flat"
                size="sm"
                startContent={<ListTodo className="h-4 w-4" />}
                onPress={() => navigate('/tasks')}
                className="hidden md:flex"
              >
                View All Tasks
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    className={`h-auto min-h-[100px] md:min-h-[120px] ${action.color} relative group`}
                    onPress={action.onClick}
                  >
                    {action.notification && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {action.notification}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col items-center text-center gap-2">
                      <Icon className={`h-6 w-6 md:h-8 md:w-8 ${action.textColor}`} />
                      <p className={`text-xs md:text-sm font-semibold text-white`}>
                        {action.label}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Tasks */}
      <div className="md:col-span-4">
        <Card className="bg-background/80 backdrop-blur-md border-none h-full">
          <CardBody className="p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Tasks</h3>
            
            <form onSubmit={handleAddTask} className="mb-4">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                size={isMobile ? "sm" : "md"}
                endContent={
                  <Button
                    isIconOnly
                    type="submit"
                    size="sm"
                    variant="flat"
                    className="text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                }
                classNames={{
                  input: "text-white",
                  inputWrapper: "bg-background/50 border-gray-700"
                }}
              />
            </form>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5"
                >
                  <Checkbox
                    isSelected={task.completed}
                    onValueChange={() => toggleTask(task.id)}
                    size={isMobile ? "sm" : "md"}
                    classNames={{
                      label: "text-white"
                    }}
                  >
                    <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                      {task.title}
                    </span>
                  </Checkbox>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardActions;