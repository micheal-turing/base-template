import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent, DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialTasks = [
  {
    id: 1,
    title: "Implement login",
    status: "To Do",
    priority: "High",
    dueDate: "2023-10-15",
  },
  {
    id: 2,
    title: "Design homepage",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2023-10-20",
  },
  {
    id: 3,
    title: "Test API endpoints",
    status: "Review",
    priority: "Low",
    dueDate: "2023-10-18",
  },
  {
    id: 4,
    title: "Deploy to production",
    status: "Done",
    priority: "High",
    dueDate: "2023-10-25",
  },
];

const columns = ["To Do", "In Progress", "Review", "Done"];

const Task = ({ task, openTaskModal, moveTask }) => {

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(task));
  };

  return (
    <div
      className="p-2 mb-2 bg-white rounded shadow cursor-move"
      draggable="true"
      onDragStart={handleDragStart}
      onClick={() => openTaskModal(task)}
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">Priority: {task.priority}</p>
      <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
      <div className="mt-2 flex justify-between">
        {task.status !== "To Do" && (
          <Button size="sm" onClick={(e) => { e.stopPropagation(); moveTask(task.id, columns[columns.indexOf(task.status) - 1]); }}>
            ←
          </Button>
        )}
        {task.status !== "Done" && (
          <Button size="sm" onClick={(e) => { e.stopPropagation(); moveTask(task.id, columns[columns.indexOf(task.status) + 1]); }}>
            →
          </Button>
        )}
      </div>
    </div>
  );
};

const Column = ({ status, tasks, openTaskModal, moveTask }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const taskData = e.dataTransfer.getData("text/plain");
    if (taskData) {
      const droppedTask = JSON.parse(taskData);
      if (droppedTask.status !== status) {
        moveTask(droppedTask.id, status);
      }
    }
  };

  return (
    <div
      className={`bg-gray-100 p-2 rounded min-h-[200px] ${
        isOver ? "border-2 border-blue-500" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="font-bold mb-2">{status}</h2>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          openTaskModal={openTaskModal}
          moveTask={moveTask}
        />
      ))}
    </div>
  );
};

const Board = ({ tasks, openTaskModal, moveTask }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter((task) => task.status === status)}
          openTaskModal={openTaskModal}
          moveTask={moveTask}
        />
      ))}
    </div>
  );
};

const TaskModal = ({ task, onClose, onSave, onDelete }) => {
  const [editedTask, setEditedTask] = useState(
    task || { title: "", description: "", priority: "Medium", dueDate: "" }
  );

  const handleSave = () => {
    if (!editedTask.title.trim()) {
      alert("Title is required");
      return;
    }
    onSave(editedTask);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogDescription>
          {task
            ? "Update the details of your task below."
            : "Fill in the form to create a new task."}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={editedTask.description || ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={editedTask.priority}
            onValueChange={(value) =>
              setEditedTask({ ...editedTask, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={editedTask.dueDate}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
          />
        </div>
        <div className="flex justify-between">
          <Button onClick={handleSave}>Save</Button>
          {task && (
            <Button variant="destructive" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
};

const FilterBar = ({ onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
      <Input
        placeholder="Search tasks"
        onChange={(e) => onFilterChange({ search: e.target.value })}
      />
      <Select
        onValueChange={(value) => onFilterChange({ priority: value })}
        defaultValue="all"
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="High">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const ActivityLog = ({ activities }) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          {activities.map((activity, index) => (
            <p key={index} className="mb-2">
              {activity}
            </p>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [nextId, setNextId] = useState(5);
  const [filter, setFilter] = useState({});
  const [activities, setActivities] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const addActivity = (activity) => {
    setActivities((prev) => [
      `${new Date().toLocaleString()}: ${activity}`,
      ...prev,
    ]);
  };

  const moveTask = (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
    addActivity(`Task ${id} moved to ${newStatus}`);
    setSelectedTask(null);
  };

  const saveTask = (editedTask) => {
    if (editedTask.id) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editedTask.id ? editedTask : task))
      );
      addActivity(`Task ${editedTask.id} updated`);
    } else {
      const newTask = { ...editedTask, id: nextId, status: "To Do" };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNextId((prev) => prev + 1);
      addActivity(`New task created: ${newTask.title}`);
    }
    setIsCreateModalOpen(false);
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    addActivity(`Task ${id} deleted`);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (!filter.search ||
        task.title.toLowerCase().includes(filter.search.toLowerCase())) &&
      (!filter.priority ||
        filter.priority === "all" ||
        task.priority === filter.priority)
    );
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Management App</h1>
      <FilterBar onFilterChange={setFilter} />
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} >
        <DialogTrigger asChild>
          <Button className="mb-4">Create Task</Button>
        </DialogTrigger>
        <TaskModal
          task={null}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={saveTask}
          onDelete={deleteTask}
        />
      </Dialog>
      <Board
        tasks={filteredTasks}
        openTaskModal={setSelectedTask}
        moveTask={moveTask}
      />
      <ActivityLog activities={activities} />
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onSave={saveTask}
            onDelete={deleteTask}
          />
        </Dialog>
      )}
    </div>
  );
}
