// App.jsx
import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Input, Select, Dialog, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

const statuses = ["To Do", "In Progress", "Review", "Done"];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'low');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return; // Basic error handling
    onSave({ id: task?.id, title, description, priority, dueDate });
    onClose();
  };

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{task ? 'Edit Task' : 'New Task'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <textarea className="mt-2 w-full" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <Select value={priority} onValueChange={setPriority} className="mt-2">
              {priorities.map(p => <Select.Item key={p.value} value={p.value}>{p.label}</Select.Item>)}
            </Select>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-2" />
          </CardContent>
          <Button type="submit" className="w-full mt-4">Save</Button>
        </form>
      </Card>
    </Dialog>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ title: '', priority: '' });
  const [modalTask, setModalTask] = useState(null);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, { ...reorderedItem, status: statuses[result.destination.droppableId] });
    setTasks(items);
  }, [tasks]);

  const filteredTasks = tasks.filter(task => 
    task.title.includes(filter.title) && 
    (filter.priority === '' || task.priority === filter.priority)
  );

  return (
    <div className="container mx-auto p-4">
      <input 
        value={filter.title} 
        onChange={(e) => setFilter({...filter, title: e.target.value})} 
        placeholder="Search by title..." 
        className="mb-4 w-full p-2 border rounded"
      />
      <Select value={filter.priority} onValueChange={(value) => setFilter({...filter, priority: value})}>
        <Select.Item value="">All Priorities</Select.Item>
        {priorities.map(p => <Select.Item key={p.value} value={p.value}>{p.label}</Select.Item>)}
      </Select>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statuses.map((status, index) => (
            <Droppable key={index} droppableId={index.toString()}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-100 p-4 rounded">
                  <h3 className="text-lg font-semibold">{status}</h3>
                  {filteredTasks.filter(t => t.status === status).map((task, taskIndex) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={taskIndex}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps}
                          className="bg-white p-3 my-2 shadow-md rounded"
                          onClick={() => setModalTask(task)}>
                          <Card>
                            <CardHeader>
                              <CardTitle>{task.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>Priority: {task.priority}</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <Button onClick={() => setModalTask({})}>
        <PlusIcon className="mr-2 h-4 w-4" /> Add Task
      </Button>
      <TaskModal 
        task={modalTask} 
        onClose={() => setModalTask(null)} 
        onSave={(newTask) => {
          setTasks(prev => newTask.id ? prev.map(t => t.id === newTask.id ? newTask : t) : [...prev, { ...newTask, id: Date.now(), status: 'To Do' }]);
        }}
      />
    </div>
  );
}

export default App;