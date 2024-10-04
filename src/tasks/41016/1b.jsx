import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#A569BD", "#5DADE2", "#45B39D", "#EC7063"];

export default function App() {
  const [habits, setHabits] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [newHabit, setNewHabit] = useState({
    name: '', description: '', category: '', frequency: 'Daily', goal: 1, color: colors[0]
  });

  useEffect(() => {
    // Simulate fetching from localStorage or initialize with an empty array
    const savedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
    setHabits(savedHabits);
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    setHabits([...habits, { ...newHabit, id: Date.now(), streak: 0, history: {} }]);
    setNewHabit({ name: '', description: '', category: '', frequency: 'Daily', goal: 1, color: colors[0] });
    setCurrentTab('Dashboard');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleCompletion = (id, date = new Date()) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const dateKey = date.toISOString().split('T')[0];
    const updatedHabit = {
      ...habit,
      history: {
        ...habit.history,
        [dateKey]: !habit.history[dateKey]
      },
      streak: calculateStreak({ ...habit, history: { ...habit.history, [dateKey]: !habit.history[dateKey] } })
    };
    
    setHabits(habits.map(h => h.id === id ? updatedHabit : h));
  };

  const calculateStreak = (habit) => {
    let streak = 0;
    let currentDate = new Date();
    while (habit.history[currentDate.toISOString().split('T')[0]] === true) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  const showAchievement = (streak) => {
    if ([7, 30, 100].includes(streak)) {
      alert(`Congratulations! You've reached a ${streak}-day streak!`);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Habit Hero</h1>
        <Switch onCheckedChange={setDarkMode} checked={darkMode} />
      </header>
      <main className="p-4">
        <div className="mb-4">
          <Button onClick={() => setCurrentTab('Dashboard')}>Dashboard</Button>
          <Button onClick={() => setCurrentTab('Calendar')}>Calendar</Button>
          <Button onClick={() => setCurrentTab('Add Habit')}>Add Habit</Button>
        </div>
        {currentTab === 'Dashboard' && (
          habits.length === 0 ? 
          <div className="text-center">
            <p>Start your journey to success by adding your first habit.</p>
            <Button onClick={() => setCurrentTab('Add Habit')}>Get Started</Button>
          </div> :
          habits.map(habit => <HabitCard key={habit.id} habit={habit} toggleCompletion={toggleCompletion} deleteHabit={deleteHabit} showAchievement={showAchievement} />)
        )}
        {currentTab === 'Add Habit' && <HabitForm newHabit={newHabit} setNewHabit={setNewHabit} addHabit={addHabit} />}
        {currentTab === 'Calendar' && <Calendar habits={habits} toggleCompletion={toggleCompletion} />}
      </main>
    </div>
  );
}

function HabitCard({ habit, toggleCompletion, deleteHabit, showAchievement }) {
  const [isCompleted, setIsCompleted] = useState(habit.history[new Date().toISOString().split('T')[0]] || false);
  const streak = calculateStreak(habit);

  useEffect(() => {
    if (isCompleted) showAchievement(streak);
  }, [isCompleted, streak, showAchievement]);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{habit.name}</CardTitle>
        <CardDescription>Streak: {streak}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="progress-bar" style={{ width: `${(streak / habit.goal) * 100}%`, backgroundColor: habit.color }}></div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => { toggleCompletion(habit.id); setIsCompleted(!isCompleted); }}>
          {isCompleted ? "Completed" : "Mark Complete"}
        </Button>
        <Button variant="destructive" onClick={() => deleteHabit(habit.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

function HabitForm({ newHabit, setNewHabit, addHabit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); addHabit(); }} className="space-y-4">
      <Input 
        type="text" 
        value={newHabit.name} 
        onChange={e => setNewHabit({...newHabit, name: e.target.value})} 
        placeholder="Habit Name" 
        required 
      />
      <Input 
        type="text" 
        value={newHabit.description} 
        onChange={e => setNewHabit({...newHabit, description: e.target.value})} 
        placeholder="Description" 
      />
      <Select value={newHabit.category} onValueChange={value => setNewHabit({...newHabit, category: value})}>
        <SelectItem value="Health">Health</SelectItem>
        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
        {/* Add more categories here */}
      </Select>
      {/* Add other form fields similarly */}
      <Button type="submit">Add Habit</Button>
    </form>
  );
}

function Calendar({ habits, toggleCompletion }) {
  // This would involve a more complex implementation with a date picker or calendar library
  // For brevity, this is a placeholder
  return <div>Calendar view for habits would go here.</div>;
}