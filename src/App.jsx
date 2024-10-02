import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

const predefinedExercises = [
  { id: 1, name: "Push-ups", category: "Chest" },
  { id: 2, name: "Squats", category: "Legs" },
  { id: 3, name: "Pull-ups", category: "Back" },
];

const exerciseCategories = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Cardio", "Other"];

const ExerciseSelector = ({ exercises, onSelect }) => (
  <Select onValueChange={onSelect}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select an exercise" />
    </SelectTrigger>
    <SelectContent>
      {exercises.map((exercise) => (
        <SelectItem key={exercise.id} value={exercise.id.toString()}>
          {exercise.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const RoutineBuilder = ({ exercises, routine, setRoutine }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const addExerciseToRoutine = () => {
    if (selectedExercise) {
      const exercise = exercises.find((e) => e.id === parseInt(selectedExercise));
      setRoutine([...routine, { ...exercise, sets: 3, reps: 10, weight: 0 }]);
      setSelectedExercise(null);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Build Your Routine</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <ExerciseSelector exercises={exercises} onSelect={setSelectedExercise} />
          <Button onClick={addExerciseToRoutine} className="ml-2">Add</Button>
        </div>
        {routine.map((exercise, index) => (
          <Card key={index} className="mb-4 p-4">
            <h4 className="font-bold mb-2">{exercise.name}</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <Label htmlFor={`sets-${index}`}>Sets</Label>
                <Input
                  id={`sets-${index}`}
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => {
                    const newRoutine = [...routine];
                    newRoutine[index].sets = parseInt(e.target.value);
                    setRoutine(newRoutine);
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor={`reps-${index}`}>Reps</Label>
                <Input
                  id={`reps-${index}`}
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => {
                    const newRoutine = [...routine];
                    newRoutine[index].reps = parseInt(e.target.value);
                    setRoutine(newRoutine);
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                <Input
                  id={`weight-${index}`}
                  type="number"
                  value={exercise.weight}
                  onChange={(e) => {
                    const newRoutine = [...routine];
                    newRoutine[index].weight = parseFloat(e.target.value);
                    setRoutine(newRoutine);
                  }}
                  className="w-full"
                />
              </div>
            </div>
            <Button
              onClick={() => {
                const newRoutine = routine.filter((_, i) => i !== index);
                setRoutine(newRoutine);
              }}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

const WorkoutSession = ({ routine, onComplete }) => {
  const [progress, setProgress] = useState(routine.map(() => ({ completed: false })));

  const handleSetComplete = (index) => {
    const newProgress = [...progress];
    newProgress[index].completed = true;
    setProgress(newProgress);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Current Workout</h2>
      {routine.map((exercise, index) => (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle>{exercise.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight}kg</p>
            <Button
              onClick={() => handleSetComplete(index)}
              disabled={progress[index].completed}
              className="mt-2"
            >
              {progress[index].completed ? "Completed" : "Mark as Complete"}
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button onClick={onComplete} disabled={!progress.every((p) => p.completed)}>
        Finish Workout
      </Button>
    </div>
  );
};

const WorkoutSummary = ({ routine }) => {
  const totalVolume = routine.reduce(
    (acc, exercise) => acc + exercise.sets * exercise.reps * exercise.weight,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total exercises: {routine.length}</p>
        <p>Total volume lifted: {totalVolume}kg</p>
        <h3 className="font-bold mt-2">Areas of focus:</h3>
        <ul>
          {[...new Set(routine.map((exercise) => exercise.category))].map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const App = () => {
  const [exercises, setExercises] = useState(predefinedExercises);
  const [routine, setRoutine] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseCategory, setNewExerciseCategory] = useState("");

  const addCustomExercise = useCallback(() => {
    if (newExerciseName && newExerciseCategory) {
      const newExercise = {
        id: exercises.length + 1,
        name: newExerciseName,
        category: newExerciseCategory,
      };
      setExercises([...exercises, newExercise]);
      setNewExerciseName("");
      setNewExerciseCategory("");
    }
  }, [exercises, newExerciseName, newExerciseCategory]);

  const completeWorkout = useCallback(() => {
    const newWorkout = {
      date: new Date().toLocaleDateString(),
      routine: routine,
    };
    setWorkoutHistory([newWorkout, ...workoutHistory]);
    setRoutine([]);

    const totalVolume = routine.reduce(
      (acc, exercise) => acc + exercise.sets * exercise.reps * exercise.weight,
      0
    );
    const previousBest = Math.max(
      ...workoutHistory.map((workout) =>
        workout.routine.reduce(
          (acc, exercise) => acc + exercise.sets * exercise.reps * exercise.weight,
          0
        )
      ),
      0
    );
    if (totalVolume > previousBest) {
      setAlertMessage("Congratulations! You've achieved a new personal best in total volume lifted!");
      setShowAlert(true);
    }
  }, [routine, workoutHistory]);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Workout Planner & Tracker</h1>
      <Tabs defaultValue="planner">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="planner" className="flex-1">Planner</TabsTrigger>
          <TabsTrigger value="workout" className="flex-1">Workout</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
        </TabsList>
        <TabsContent value="planner">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Custom Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <Label htmlFor="new-exercise-name">Exercise Name</Label>
                  <Input
                    id="new-exercise-name"
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    placeholder="New exercise name"
                    className="mb-2"
                  />
                </div>
                <div>
                  <Label htmlFor="new-exercise-category">Category</Label>
                  <Select value={newExerciseCategory} onValueChange={setNewExerciseCategory}>
                    <SelectTrigger id="new-exercise-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addCustomExercise} className="w-full">
                Add Custom Exercise
              </Button>
            </CardContent>
          </Card>
          <RoutineBuilder exercises={exercises} routine={routine} setRoutine={setRoutine} />
        </TabsContent>
        <TabsContent value="workout">
          {routine.length > 0 ? (
            <WorkoutSession routine={routine} onComplete={completeWorkout} />
          ) : (
            <p>Build a routine in the Planner tab to start a workout.</p>
          )}
        </TabsContent>
        <TabsContent value="history">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {workoutHistory.map((workout, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <CardTitle>{workout.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <WorkoutSummary routine={workout.routine} />
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>New Personal Best!</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default App;