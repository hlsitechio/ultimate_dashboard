import React from 'react';
import { Card, CardBody, Input, Button, Checkbox, Tabs, Tab } from "@nextui-org/react";
import { Plus, Calendar, Clock, Tag } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

const Tasks = () => {
  const [tasks, setTasks] = React.useState<Task[]>([
    { 
      id: '1', 
      title: 'Review project proposal', 
      completed: false,
      dueDate: '2024-02-20',
      priority: 'high',
      category: 'Work'
    },
    { 
      id: '2', 
      title: 'Team meeting at 2 PM', 
      completed: false,
      dueDate: '2024-02-19',
      priority: 'medium',
      category: 'Meetings'
    },
    { 
      id: '3', 
      title: 'Update documentation', 
      completed: true,
      dueDate: '2024-02-18',
      priority: 'low',
      category: 'Documentation'
    },
  ]);
  const [newTask, setNewTask] = React.useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        { 
          id: Date.now().toString(), 
          title: newTask, 
          completed: false,
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'medium',
          category: 'General'
        },
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

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button
          color="primary"
          startContent={<Plus className="h-5 w-5" />}
        >
          New Task
        </Button>
      </div>

      <Card className="bg-background border-none">
        <CardBody className="p-6">
          <Tabs 
            aria-label="Task filters"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-2 h-12",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab
              key="all"
              title={
                <div className="flex items-center space-x-2">
                  <span>All Tasks</span>
                  <span className="text-small">({tasks.length})</span>
                </div>
              }
            >
              <div className="pt-4">
                <form onSubmit={handleAddTask} className="mb-4">
                  <Input
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
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
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5"
                    >
                      <Checkbox
                        isSelected={task.completed}
                        onValueChange={() => toggleTask(task.id)}
                        classNames={{
                          label: "text-white"
                        }}
                      >
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                          {task.title}
                        </span>
                      </Checkbox>
                      
                      <div className="ml-auto flex items-center gap-4 text-sm">
                        {task.category && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400">{task.category}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">{task.dueDate}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                          <span className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab>
            <Tab
              key="active"
              title={
                <div className="flex items-center space-x-2">
                  <span>Active</span>
                  <span className="text-small">
                    ({tasks.filter(t => !t.completed).length})
                  </span>
                </div>
              }
            />
            <Tab
              key="completed"
              title={
                <div className="flex items-center space-x-2">
                  <span>Completed</span>
                  <span className="text-small">
                    ({tasks.filter(t => t.completed).length})
                  </span>
                </div>
              }
            />
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default Tasks;