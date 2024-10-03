import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

function App() {
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  const [newExercise, setNewExercise] = useState({ name: '', category: '' });

  const addExercise = () => {
    if (newExercise.name && newExercise.category) {
      setExercises([...exercises, { ...newExercise, id: Date.now() }]);
      setNewExercise({ name: '', category: '' });
    }
  };

  const addRoutine = () => {
    setRoutines([...routines, { id: Date.now(), exercises: [] }]);
  };

  const addExerciseToRoutine = (exercise, routineId) => {
    setRoutines(routines.map(r => 
      r.id === routineId ? {...r, exercises: [...r.exercises, { ...exercise, sets: 3, reps: 10, weight: 0 }]} : r
    ));
  };

  const updateExerciseInRoutine = (routineId, exerciseId, field, value) => {
    setRoutines(routines.map(r => 
      r.id === routineId ? {
        ...r, 
        exercises: r.exercises.map(e => 
          e.id === exerciseId ? {...e, [field]: value} : e
        )
      } : r
    ));
  };

  const removeExerciseFromRoutine = (routineId, exerciseId) => {
    setRoutines(routines.map(r => 
      r.id === routineId ? {...r, exercises: r.exercises.filter(e => e.id !== exerciseId)} : r
    ));
  };

  const startWorkout = (routine) => setCurrentRoutine(routine);

  const finishWorkout = () => {
    const totalVolume = currentRoutine.exercises.reduce((acc, ex) => 
      acc + (ex.sets * ex.reps * ex.weight), 0
    );
    const newHistoryEntry = {
      date: new Date(),
      routine: currentRoutine,
      totalVolume
    };
    setWorkoutHistory([...workoutHistory, newHistoryEntry]);
    setCurrentRoutine(null);
  };

  const isBestVolume = (volume) => {
    const best = Math.max(...workoutHistory.map(h => h.totalVolume), 0);
    return volume > best;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Tabs defaultValue="planner" className="w-full">
        <TabsList>
          <TabsTrigger value="planner">Planner</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="planner">
          <Card>
            <CardHeader>
              <CardTitle>Add Exercise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input 
                value={newExercise.name} 
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})} 
                placeholder="Exercise Name"
              />
              <Input 
                value={newExercise.category} 
                onChange={(e) => setNewExercise({...newExercise, category: e.target.value})} 
                placeholder="Category"
              />
              <Button onClick={addExercise}>Add Exercise</Button>
            </CardContent>
          </Card>
          <Button className="mt-4" onClick={addRoutine}>Create New Routine</Button>
          {routines.map((routine, idx) => (
            <RoutineCard 
              key={idx} 
              routine={routine} 
              exercises={exercises} 
              addExerciseToRoutine={addExerciseToRoutine}
              updateExerciseInRoutine={updateExerciseInRoutine}
              removeExerciseFromRoutine={removeExerciseFromRoutine}
              startWorkout={() => startWorkout(routine)}
            />
          ))}
        </TabsContent>
        <TabsContent value="workout">
          {currentRoutine ? 
            <WorkoutSession 
              routine={currentRoutine} 
              finishWorkout={finishWorkout} 
              updateExerciseInRoutine={(exerciseId, field, value) => 
                updateExerciseInRoutine(currentRoutine.id, exerciseId, field, value)
              }
            /> : 
            <p className="text-center p-4">No active workout. Select a routine to start.</p>
          }
        </TabsContent>
        <TabsContent value="history">
          {workoutHistory.map((history, idx) => (
            <HistoryCard key={idx} history={history} isBest={isBestVolume(history.totalVolume)} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RoutineCard({ routine, exercises, addExerciseToRoutine, updateExerciseInRoutine, removeExerciseFromRoutine, startWorkout }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Routine</CardTitle>
        <CardDescription>Exercises: {routine.exercises.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setSelectedExercise}>
          <SelectTrigger>
            <SelectValue placeholder="Add Exercise" />
          </SelectTrigger>
          <SelectContent>
            {exercises.map(ex => (
              <SelectItem key={ex.id} value={ex.id} onClick={() => addExerciseToRoutine(ex, routine.id)}>
                {ex.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {routine.exercises.map((ex, idx) => (
          <div key={idx} className="mt-2">
            <Input 
              value={ex.sets} 
              onChange={(e) => updateExerciseInRoutine(routine.id, ex.id, 'sets', parseInt(e.target.value))} 
              type="number" 
              placeholder="Sets"
            />
            <Input 
              value={ex.reps} 
              onChange={(e) => updateExerciseInRoutine(routine.id, ex.id, 'reps', parseInt(e.target.value))} 
              type="number" 
              placeholder="Reps"
            />
            <Input 
              value={ex.weight} 
              onChange={(e) => updateExerciseInRoutine(routine.id, ex.id, 'weight', parseFloat(e.target.value))} 
              type="number" 
              placeholder="Weight (kg)"
            />
            <Button variant="destructive" onClick={() => removeExerciseFromRoutine(routine.id, ex.id)}>Remove</Button>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={startWorkout}>Start Workout</Button>
      </CardFooter>
    </Card>
  );
}

function WorkoutSession({ routine, finishWorkout, updateExerciseInRoutine }) {
  const [completedExercises, setCompletedExercises] = useState([]);

  const toggleComplete = (exerciseId) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const allCompleted = routine.exercises.length === completedExercises.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Workout</CardTitle>
      </CardHeader>
      <CardContent>
        {routine.exercises.map((ex, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <Checkbox 
              checked={completedExercises.includes(ex.id)} 
              onCheckedChange={() => toggleComplete(ex.id)} 
            />
            <span>{ex.name} - Sets: {ex.sets}, Reps: {ex.reps}, Weight: {ex.weight}kg</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button disabled={!allCompleted} onClick={finishWorkout}>Finish Workout</Button>
      </CardFooter>
    </Card>
  );
}

function HistoryCard({ history, isBest }) {
  const areasOfFocus = useMemo(() => [...new Set(history.routine.exercises.map(e => e.category))], [history]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{history.date.toLocaleDateString()}</CardTitle>
        <CardDescription>Total Volume: {history.totalVolume} kg {isBest && <span className="text-green-500">New Best!</span>}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Exercises: {history.routine.exercises.length}</p>
        <p>Areas of Focus: {areasOfFocus.join(', ')}</p>
      </CardContent>
    </Card>
  );
}

export default App;