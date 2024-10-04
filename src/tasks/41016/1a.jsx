import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Color palette for habits
const colorPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#A569BD", "#5DADE2", "#45B39D", "#EC7063"];

function App() {
  const [habits, setHabits] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('Dashboard');

  // Function to toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Placeholder for adding habit functionality
  const addHabit = (newHabit) => {
    setHabits([...habits, { ...newHabit, id: Date.now(), streak: 0, lastCompleted: null }]);
  };

  // Mark habit as complete
  const markComplete = (habitId) => {
    setHabits(currentHabits => 
      currentHabits.map(habit => 
        habit.id === habitId ? {...habit, lastCompleted: new Date()} : habit
      )
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <Button onClick={toggleDarkMode}>Toggle Dark Mode</Button>
      <Tabs defaultValue="Dashboard" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="Dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="Calendar">Calendar</TabsTrigger>
          <TabsTrigger value="Add">Add Habit</TabsTrigger>
        </TabsList>
        <TabsContent value="Dashboard">
          {habits.length === 0 ? 
            <p>Start your journey to success by adding your first habit.</p> : 
            habits.map(habit => <HabitCard key={habit.id} habit={habit} onComplete={markComplete} />)
          }
        </TabsContent>
        <TabsContent value="Calendar">
          <Calendar />
        </TabsContent>
        <TabsContent value="Add">
          <AddHabitForm onSubmit={addHabit} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HabitCard({ habit, onComplete }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{habit.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Streak: {habit.streak}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onComplete(habit.id)}>{habit.lastCompleted ? 'Completed' : 'Mark Complete'}</Button>
      </CardFooter>
    </Card>
  );
}

function AddHabitForm({ onSubmit }) {
  const [habit, setHabit] = useState({ name: '', description: '', category: 'Health', frequency: 'Daily', goal: 1, color: colorPalette[0] });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(habit);
    setHabit({ name: '', description: '', category: 'Health', frequency: 'Daily', goal: 1, color: colorPalette[0] });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields for name, description, etc. */}
      <Button type="submit">Add Habit</Button>
    </form>
  );
}

export default App;