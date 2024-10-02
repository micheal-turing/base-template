import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, 
  Button, Input, Select, Option, Tabs, TabsList, TabsContent, TabsTrigger 
} from "@/components/ui";

function App() {
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  // Exercise Management
  const [newExercise, setNewExercise] = useState({ name: '', category: '' });

  const addExercise = () => {
    if (newExercise.name && newExercise.category) {
      setExercises([...exercises, newExercise]);
      setNewExercise({ name: '', category: '' });
    }
  };

  // Routine Builder
  const createRoutine = (name) => {
    setRoutines([...routines, { name, exercises: [] }]);
  };

  const addExerciseToRoutine = (routine, exercise, sets, reps, weight) => {
    const updatedRoutine = { ...routine, 
      exercises: [...routine.exercises, { ...exercise, sets, reps, weight }] 
    };
    setRoutines(routines.map(r => r.name === routine.name ? updatedRoutine : r));
  };

  // Workout Session
  const startWorkout = (routine) => setCurrentRoutine(routine);

  const finishWorkout = () => {
    const totalVolume = currentRoutine.exercises.reduce((acc, ex) => 
      acc + ex.sets * ex.reps * ex.weight, 0);
    const newBest = !workoutHistory.some(h => h.volume >= totalVolume);

    setWorkoutHistory([...workoutHistory, {
      date: new Date(),
      routine: currentRoutine,
      volume: totalVolume,
      isBest: newBest
    }]);
    setCurrentRoutine(null);
  };

  // Helper Functions
  const categories = [...new Set(exercises.map(ex => ex.category))];

  return (
    <div className="container mx-auto p-4">
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
              <CardTitle>Add Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <Input value={newExercise.name} onChange={(e) => setNewExercise({...newExercise, name: e.target.value})} placeholder="Exercise Name" />
              <Select onValueChange={(value) => setNewExercise({...newExercise, category: value})}>
                {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
              </Select>
              <Button onClick={addExercise}>Add</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardTitle>Create Routine</CardTitle>
            <Input placeholder="Routine Name" onChange={(e) => createRoutine(e.target.value)} />
            {routines.map(routine => (
              <Card key={routine.name} className="mt-2">
                <CardContent>
                  {routine.exercises.map((ex, idx) => (
                    <div key={idx}>
                      {ex.name} - Sets: <Input type="number" onChange={(e) => addExerciseToRoutine(routine, ex, e.target.value, ex.reps, ex.weight)} />
                      Reps: <Input type="number" onChange={(e) => addExerciseToRoutine(routine, ex, ex.sets, e.target.value, ex.weight)} />
                      Weight: <Input type="number" onChange={(e) => addExerciseToRoutine(routine, ex, ex.sets, ex.reps, e.target.value)} />
                    </div>
                  ))}
                  <Select>
                    {exercises.map(ex => <Option key={ex.name} value={ex.name} onClick={() => addExerciseToRoutine(routine, ex, 0, 0, 0)}>{ex.name}</Option>)}
                  </Select>
                </CardContent>
              </Card>
            ))}
          </Card>
        </TabsContent>

        {/* Workout Tab */}
        <TabsContent value="workout">
          {currentRoutine && (
            <Card>
              <CardContent>
                {currentRoutine.exercises.map((ex, idx) => (
                  <div key={idx}>
                    {ex.name} - {ex.sets} sets of {ex.reps} reps at {ex.weight}kg
                  </div>
                ))}
                <Button disabled={currentRoutine.exercises.some(ex => !ex.completed)} onClick={finishWorkout}>Finish Workout</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          {workoutHistory.map((workout, idx) => (
            <Card key={idx}>
              <CardContent>
                <CardTitle>{workout.date.toLocaleDateString()}</CardTitle>
                {workout.isBest && <p>New Personal Best!</p>}
                <p>Volume: {workout.volume} kg</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;