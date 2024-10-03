import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Input, Select, SelectItem, Dialog, DialogContent, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, Label, Textarea
} from "@/components/ui";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorities = ['Low', 'Medium', 'High'];

function TaskCard({ task, onEdit, onDelete, onMove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.priority}</CardDescription>
      </CardHeader>
      <CardContent>{task.description.slice(0, 50)}...</CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onEdit(task)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(task.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

function TaskModal({ task, onClose, onSave, onDelete }) {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!editedTask.title) tempErrors.title = 'Title is required';
    if (!editedTask.description) tempErrors.description = 'Description is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(editedTask);
      onClose();
    }
  };

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={editedTask.title} onChange={e => setEditedTask({...editedTask, title: e.target.value})} className="col-span-3" />
            {errors.title && <span className="text-red-500">{errors.title}</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={editedTask.description} onChange={e => setEditedTask({...editedTask, description: e.target.value})} className="col-span-3" />
            {errors.description && <span className="text-red-500">{errors.description}</span>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priority</Label>
            <Select value={editedTask.priority} onChange={value => setEditedTask({...editedTask, priority: value})}>
              {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">Due Date</Label>
            <Input type="date" id="dueDate" value={editedTask.dueDate} onChange={e => setEditedTask({...editedTask, dueDate: e.target.value})} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
          {task && <Button variant="destructive" onClick={() => onDelete(task.id)}>Delete</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaskColumn({ status, tasks, onMoveTask, onEditTask, onDeleteTask }) {
  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-lg font-semibold mb-4">{status}</h2>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} onMove={onMoveTask} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ search: '', priority: '' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    // Simulating fetching tasks from an API or local storage
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = { ...task, id: Date.now(), status: 'To Do' };
    setTasks([...tasks, newTask]);
    setActivityLog([...activityLog, { action: 'Added', task: newTask, time: new Date().toLocaleString() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setActivityLog([...activityLog, { action: 'Updated', task: updatedTask, time: new Date().toLocaleString() }]);
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(tasks.filter(t => t.id !== id));
    setActivityLog([...activityLog, { action: 'Deleted', task: taskToDelete, time: new Date().toLocaleString() }]);
  };

  const moveTask = (id, toStatus) => {
    const taskToMove = tasks.find(t => t.id === id);
    if (taskToMove) {
      taskToMove.status = toStatus;
      updateTask(taskToMove);
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(filter.search.toLowerCase()) && 
    (filter.priority === '' || task.priority === filter.priority)
  );

  const columns = ['To Do', 'In Progress', 'Review', 'Done'];

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="mb-4 flex justify-between items-center">
        <Input 
          placeholder="Search tasks..." 
          value={filter.search} 
          onChange={e => setFilter({...filter, search: e.target.value})} 
        />
        <Select value={filter.priority} onChange={value => setFilter({...filter, priority: value})}>
          <SelectItem value="">All Priorities</SelectItem>
          {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </Select>
        <Button onClick={() => setSelectedTask({})}>Add Task</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {columns.map(status => (
          <TaskColumn 
            key={status} 
            status={status} 
            tasks={filteredTasks.filter(t => t.status === status)} 
            onMoveTask={moveTask} 
            onEditTask={task => setSelectedTask(task)} 
            onDeleteTask={deleteTask}
          />
        ))}
      </div>
      <TaskModal 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
        onSave={selectedTask.id ? updateTask : addTask} 
        onDelete={deleteTask} 
      />
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Activity Log</h3>
        <ul className="list-disc pl-5">
          {activityLog.slice(-5).map((log, idx) => (
            <li key={idx}>{log.action} {log.task.title} at {log.time}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}