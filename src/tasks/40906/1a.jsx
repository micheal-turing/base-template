import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";

// Predefined categories for exercises
const exerciseCategories = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Others'];

function App() {
  const [exercises, setExercises] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [history, setHistory] = useState([]);

  const addExercise = (name, category) => {
    setExercises([...exercises, { name, category }]);
  };

  const addtoRoutine = (exercise) => {
    setRoutine([...routine, { ...exercise, sets: 0, reps: 0, weight: 0 }]);
  };

  const updateRoutineItem = (index, key, value) => {
    const updatedRoutine = [...routine];
    updatedRoutine[index][key] = value;
    setRoutine(updatedRoutine);
  };

  const removeFromRoutine = (index) => {
    setRoutine(routine.filter((_, i) => i !== index));
  };

  const startWorkout = () => {
    setCurrentWorkout({ exercises: routine, completed: Array(routine.length).fill(false) });
  };

  const completeExercise = (index) => {
    let newCompleted = [...currentWorkout.completed];
    newCompleted[index] = true;
    setCurrentWorkout({ ...currentWorkout, completed: newCompleted });
  };

  const finishWorkout = () => {
    if (currentWorkout.completed.every(Boolean)) {
      const workoutSummary = {
        date: new Date(),
        exercises: currentWorkout.exercises,
        volume: currentWorkout.exercises.reduce((acc, exercise) => 
          acc + (exercise.sets * exercise.reps * exercise.weight), 0)
      };
      setHistory([...history, workoutSummary]);
      setCurrentWorkout(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Workout Planner & Tracker</h1>
      <Tabs defaultValue="planner">
        <TabsList>
          <TabsTrigger value="planner">Planner</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        {/* Planner Tab */}
        <TabsContent value="planner">
          <Card>
            <CardHeader>
              <CardTitle>Custom Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Exercise Name" />
              <Select>
                {exerciseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </Select>
              <Button onClick={() => addExercise('New Exercise', 'Others')}>Add Custom Exercise</Button>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Build Your Routine</CardTitle>
            </CardHeader>
            <CardContent>
              <Select>
                {exercises.map(ex => <SelectItem key={ex.name}>{ex.name}</SelectItem>)}
              </Select>
              <Button onClick={() => addtoRoutine({name: 'Selected Exercise'})}>Add</Button>
              {routine.map((item, index) => (
                <div key={index} className="mt-2">
                  <span>{item.name}</span>
                  <Input type="number" placeholder="Sets" onChange={(e) => updateRoutineItem(index, 'sets', e.target.value)} />
                  <Input type="number" placeholder="Reps" onChange={(e) => updateRoutineItem(index, 'reps', e.target.value)} />
                  <Input type="number" placeholder="Weight" onChange={(e) => updateRoutineItem(index, 'weight', e.target.value)} />
                  <Button onClick={() => removeFromRoutine(index)}>Remove</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Workout Tab */}
        <TabsContent value="workout">
          {currentWorkout && (
            <>
              {currentWorkout.exercises.map((ex, idx) => (
                <div key={idx}>
                  {ex.name} - 
                  <Button onClick={() => completeExercise(idx)} disabled={currentWorkout.completed[idx]}>
                    {currentWorkout.completed[idx] ? 'Completed' : 'Complete'}
                  </Button>
                </div>
              ))}
              <Button onClick={finishWorkout} disabled={!currentWorkout.completed.every(Boolean)}>Finish Workout</Button>
            </>
          )}
        </TabsContent>
        {/* History Tab */}
        <TabsContent value="history">
          {history.map((workout, idx) => (
            <Card key={idx} className="mt-2">
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