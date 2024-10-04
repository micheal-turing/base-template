import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["Select category", "Health", "Productivity", "Learning", "Creativity", "Relationships", "Other"];
const FREQUENCIES = ["Daily", "Weekly", "Monthly"];
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#A569BD", "#5DADE2", "#45B39D", "#EC7063"];

export default function App() {
  const [habits, setHabits] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: "Daily",
    category: "Select category",
    goal: 1,
    color: COLORS[0],
  });
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState("");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addHabit = (e) => {
    e.preventDefault();
    if (newHabit.name.trim() === "" || newHabit.category === "Select category") return;
    const habit = { ...newHabit, id: Date.now(), streak: 0, completions: {} };
    setHabits([...habits, habit]);
    setNewHabit({
      name: "",
      description: "",
      frequency: "Daily",
      category: "Select category",
      goal: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
    setActiveTab("dashboard");
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const toggleCompletion = (habit, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const updatedHabit = {
      ...habit,
      completions: {
        ...habit.completions,
        [dateStr]: !habit.completions[dateStr],
      },
    };
    const oldStreak = habit.streak;
    updatedHabit.streak = calculateStreak(updatedHabit, date);
    const updatedHabits = habits.map((h) => (h.id === habit.id ? updatedHabit : h));
    setHabits(updatedHabits);
    checkAchievements(updatedHabit, oldStreak);
  };

  const calculateStreak = (habit, currentDate) => {
    let streak = 0;
    const today = currentDate || new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (habit.completions[dateStr]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const checkAchievements = (habit, oldStreak) => {
    const milestones = [7, 30, 100];
    for (let milestone of milestones) {
      if (habit.streak === milestone && oldStreak < milestone) {
        setAchievementMessage(`Congratulations! You've reached a ${milestone}-day streak for "${habit.name}"!`);
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 5000);
        break;
      }
    }
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-100 to-purple-100"}`}>
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Habit Hero</h1>
          <div className="flex items-center space-x-4">
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            <Label htmlFor="dark-mode" className={darkMode ? "text-white" : "text-gray-800"}>Dark Mode</Label>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="add">Add Habit</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {habits.length === 0 ? (
              <Card className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} text-center p-8`}>
                <CardContent>
                  <h2 className="text-2xl font-bold mb-4">No habits yet!</h2>
                  <p className="mb-4">Start your journey to success by adding your first habit.</p>
                  <Button onClick={() => setActiveTab("add")} className="inline-flex items-center">
                    Get Started <span className="ml-2">→</span>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              habits.map((habit) => (
                <Card key={habit.id} className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} overflow-hidden transition-all duration-300 hover:shadow-lg`}>
                  <div className="h-2" style={{ backgroundColor: habit.color }}></div>
                  <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>{habit.name}</CardTitle>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">Details</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Habit Details</h4>
                          <p>Category: {habit.category}</p>
                          <p>Frequency: {habit.frequency}</p>
                          <p>Goal: {habit.goal} times per {habit.frequency.toLowerCase()}</p>
                          <p>Description: {habit.description}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <span className="flex items-center">
                        Streak: {habit.streak} days
                      </span>
                      <Button variant="destructive" size="sm" onClick={() => deleteHabit(habit.id)}>
                        Delete
                      </Button>
                    </div>
                    <Progress value={(habit.streak / habit.goal) * 100} className="mb-2" />
                    <Button
                      onClick={() => toggleCompletion(habit, new Date())}
                      className={`w-full ${darkMode ? "text-white hover:text-white" : ""}`}
                      variant={habit.completions[new Date().toISOString().split('T')[0]] ? "outline" : "default"}
                    >
                      {habit.completions[new Date().toISOString().split('T')[0]] ? "Completed" : "Mark Complete"}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
              <CardContent className="flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className={`rounded-md border ${darkMode ? "bg-gray-700 text-white" : "bg-white"} mb-4`}
                />
                <div className="w-full max-w-md">
                  <h3 className="font-bold mb-2">Habits for {selectedDate.toDateString()}:</h3>
                  <ul className="space-y-2">
                    {habits.map((habit) => (
                      <li key={habit.id} className="flex items-center justify-between p-2 rounded hover:bg-opacity-10 hover:bg-gray-500">
                        <span className="flex items-center">
                          <input
                            type="checkbox"
                            checked={habit.completions[selectedDate.toISOString().split('T')[0]] || false}
                            onChange={() => toggleCompletion(habit, selectedDate)}
                            className="mr-2 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span style={{ color: habit.color }}>{habit.name}</span>
                        </span>
                        <span>Streak: {habit.streak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
              <CardHeader>
                <CardTitle>Add New Habit</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addHabit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="habit-name">Habit Name</Label>
                    <Input
                      id="habit-name"
                      placeholder="Enter habit name"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                      required
                      className={darkMode ? "bg-gray-700 text-white" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="habit-description">Description</Label>
                    <Input
                      id="habit-description"
                      placeholder="Enter habit description"
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                      className={darkMode ? "bg-gray-700 text-white" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="habit-category">Category</Label>
                    <Select
                      value={newHabit.category}
                      onValueChange={(value) => setNewHabit({ ...newHabit, category: value })}
                    >
                      <SelectTrigger className={darkMode ? "bg-gray-700 text-white" : ""}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="habit-frequency">Frequency</Label>
                    <Select
                      value={newHabit.frequency}
                      onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value })}
                    >
                      <SelectTrigger className={darkMode ? "bg-gray-700 text-white" : ""}>
                        <SelectValue placeholder="Select a frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCIES.map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="habit-goal">Goal (times per frequency)</Label>
                    <Input
                      id="habit-goal"
                      type="number"
                      placeholder="Enter goal"
                      value={newHabit.goal}
                      onChange={(e) => setNewHabit({ ...newHabit, goal: parseInt(e.target.value) })}
                      min="1"
                      required
                      className={darkMode ? "bg-gray-700 text-white" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full transition-all ${newHabit.color === color ? 'ring-2 ring-offset-2 ring-black scale-110' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewHabit({ ...newHabit, color })}
                        />
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className={`w-full ${darkMode ? "text-white hover:text-white" : ""}`}>
                    Add Habit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showAchievement && (
          <Alert className="mt-4 bg-yellow-100 border-yellow-400 text-yellow-800">
            <AlertTitle>Achievement Unlocked!</AlertTitle>
            <AlertDescription>{achievementMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
  }