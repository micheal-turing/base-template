import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Others'];

function App() {
  const [activeTab, setActiveTab] = useState('Planner');
  const [exercises, setExercises] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  const [newExercise, setNewExercise] = useState({ name: '', category: '' });

  const addCustomExercise = () => {
    if (newExercise.name && newExercise.category) {
      setCustomExercises([...customExercises, newExercise]);
      setNewExercise({ name: '', category: '' });
    }
  };

  const addExerciseToRoutine = (exercise) => {
    setCurrentRoutine([...currentRoutine, { ...exercise, sets: 0, reps: 0, weight: 0 }]);
  };

  const updateRoutineExercise = (index, field, value) => {
    const updatedRoutine = [...currentRoutine];
    updatedRoutine[index][field] = value;
    setCurrentRoutine(updatedRoutine);
  };

  const removeFromRoutine = (index) => {
    setCurrentRoutine(currentRoutine.filter((_, i) => i !== index));
  };

  const finishWorkout = () => {
    const volume = currentRoutine.reduce((acc, ex) => acc + (ex.sets * ex.reps * ex.weight), 0);
    const newHistory = { date: new Date(), routine: currentRoutine, volume };
    setWorkoutHistory([...workoutHistory, newHistory]);
    setCurrentRoutine([]);
  };

  const isWorkoutComplete = currentRoutine.every(ex => ex.completed);

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Workout Planner & Tracker</h1>
      <Tabs defaultValue="Planner" className="w-full">
        <TabsList>
          <TabsTrigger value="Planner">Planner</TabsTrigger>
          <TabsTrigger value="Workout">Workout</TabsTrigger>
          <TabsTrigger value="History">History</TabsTrigger>
        </TabsList>
        <TabsContent value="Planner">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Custom Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <Input 
                value={newExercise.name} 
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})} 
                placeholder="Exercise Name" 
              />
              <Select 
                value={newExercise.category} 
                onValueChange={(value) => setNewExercise({...newExercise, category: value})}
              >
                <SelectItem value="">Select Category</SelectItem>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </Select>
            </CardContent>
            <CardFooter>
              <Button onClick={addCustomExercise}>Add Custom Exercise</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Build Your Routine</CardTitle>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectItem value="">Select Exercise</SelectItem>
                {[...exercises, ...customExercises].map(ex => 
                  <SelectItem key={ex.name} value={ex.name}>{ex.name}</SelectItem>
                )}
              </Select>
              <Button onClick={() => addExerciseToRoutine({name: 'Example', category: 'Chest'})}>Add</Button>
              {currentRoutine.map((ex, index) => (
                <div key={index} className="mt-2">
                  <p>{ex.name}</p>
                  <Input type="number" placeholder="Sets" onChange={(e) => updateRoutineExercise(index, 'sets', parseInt(e.target.value))} />
                  <Input type="number" placeholder="Reps" onChange={(e) => updateRoutineExercise(index, 'reps', parseInt(e.target.value))} />
                  <Input type="number" placeholder="Weight (kg)" onChange={(e) => updateRoutineExercise(index, 'weight', parseFloat(e.target.value))} />
                  <Button onClick={() => removeFromRoutine(index)}>Remove</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Workout">
          {currentRoutine.map((ex, index) => (
            <Card key={index} className="mb-2">
              <CardContent>
                <p>{ex.name} - Sets: {ex.sets}, Reps: {ex.reps}, Weight: {ex.weight} kg</p>
                <Button onClick={() => updateRoutineExercise(index, 'completed', true)}>Mark as Completed</Button>
              </CardContent>
            </Card>
          ))}
          <Button disabled={!isWorkoutComplete} onClick={finishWorkout}>Finish Workout</Button>
        </TabsContent>
        <TabsContent value="History">
          {workoutHistory.map((workout, idx) => (
            <Card key={idx} className="mb-2">
              <CardContent>
                <p>Date: {workout.date.toLocaleDateString()}</p>
                <p>Total Volume: {workout.volume} kg</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;