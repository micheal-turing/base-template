import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const predefinedExercises = [
  { name: "Bench Press", category: "Chest" },
  { name: "Squat", category: "Legs" },
  // Add more exercises here
];

function App() {
  const [exercises, setExercises] = useState(predefinedExercises);
  const [currentRoutine, setCurrentRoutine] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: '', category: '' });

  // Function to add a new exercise
  const addExercise = () => {
    if (newExercise.name && newExercise.category) {
      setExercises([...exercises, newExercise]);
      setNewExercise({ name: '', category: '' });
    }
  };

  // Function to add exercise to routine
  const addToRoutine = (exercise) => {
    setCurrentRoutine([...currentRoutine, { ...exercise, sets: 0, reps: 0, weight: 0 }]);
  };

  // Function to update routine exercise details
  const updateRoutineExercise = (index, field, value) => {
    const updatedRoutine = [...currentRoutine];
    updatedRoutine[index][field] = value;
    setCurrentRoutine(updatedRoutine);
  };

  // Function to finish workout
  const finishWorkout = () => {
    const workoutSummary = {
      date: new Date(),
      exercises: currentRoutine,
      totalVolume: currentRoutine.reduce((acc, exercise) => 
        acc + (exercise.sets * exercise.reps * exercise.weight), 0),
      areasOfFocus: [...new Set(currentRoutine.map(e => e.category))],
    };
    setWorkoutHistory([...workoutHistory, workoutSummary]);
    setCurrentRoutine([]);
  };

  return (
    <div className="p-4 space-y-4">
      <Tabs currentTab="Planner">
        <Tab title="Planner">
          <Card>
            <CardHeader>
              <CardTitle>Add Exercise</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input 
                placeholder="Exercise Name" 
                value={newExercise.name} 
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})} 
              />
              <Input 
                placeholder="Category" 
                value={newExercise.category} 
                onChange={(e) => setNewExercise({...newExercise, category: e.target.value})} 
              />
              <Button onClick={addExercise}>Add</Button>
            </CardContent>
          </Card>
          <Select onValueChange={exercise => addToRoutine(exercise)}>
            <SelectItem value="">Select an exercise</SelectItem>
            {exercises.map((ex, idx) => <SelectItem key={idx} value={ex}>{ex.name}</SelectItem>)}
          </Select>
          {currentRoutine.map((ex, idx) => (
            <Card key={idx} className="mt-2">
              <CardContent>
                <Input 
                  type="number" 
                  placeholder="Sets" 
                  value={ex.sets} 
                  onChange={(e) => updateRoutineExercise(idx, 'sets', parseInt(e.target.value))} 
                />
                <Input 
                  type="number" 
                  placeholder="Reps" 
                  value={ex.reps} 
                  onChange={(e) => updateRoutineExercise(idx, 'reps', parseInt(e.target.value))} 
                />
                <Input 
                  type="number" 
                  placeholder="Weight (kg)" 
                  value={ex.weight} 
                  onChange={(e) => updateRoutineExercise(idx, 'weight', parseInt(e.target.value))} 
                />
              </CardContent>
            </Card>
          ))}
        </Tab>
        <Tab title="Workout">
          {currentRoutine.map((ex, idx) => (
            <Card key={idx}>
              <CardTitle>{ex.name}</CardTitle>
              {/* Here you would implement marking exercises as completed */}
            </Card>
          ))}
          <Button disabled={currentRoutine.length === 0} onClick={finishWorkout}>Finish Workout</Button>
        </Tab>
        <Tab title="History">
          {workoutHistory.map((workout, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{workout.date.toDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total Volume: {workout.totalVolume} kg</p>
                <p>Areas: {workout.areasOfFocus.join(', ')}</p>
              </CardContent>
            </Card>
          ))}
        </Tab>
      </Tabs>
    </div>
  );
}

function Tabs({ children, currentTab }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-around border-b mb-4">
        {React.Children.map(children, (child, index) => (
          <Button 
            variant={child.props.title === currentTab ? 'default' : 'outline'}
            onClick={() => { /* Here you would handle tab change logic */ }}
          >
            {child.props.title}
          </Button>
        ))}
      </div>
      {children.find(child => child.props.title === currentTab)}
    </div>
  );
}

function Tab({ children }) {
  return <div>{children}</div>;
}

export default App;