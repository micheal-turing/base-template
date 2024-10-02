// App.js
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Planner from './components/Planner';
import Workout from './components/Workout';
import History from './components/History';

export default function App() {
  const [routines, setRoutines] = useState([]);
  const [history, setHistory] = useState([]);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="planner" className="w-full">
        <TabsList>
          <TabsTrigger value="planner">Planner</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="planner">
          <Planner setRoutines={setRoutines} />
        </TabsContent>
        <TabsContent value="workout">
          <Workout routines={routines} onFinish={(workoutData) => {
            setHistory([...history, workoutData]);
          }} />
        </TabsContent>
        <TabsContent value="history">
          <History history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// components/Planner.js
import React from 'react';
import { 
  Card, CardContent, Button, Input, Select, Option 
} from "@/components/ui";

function Planner({ setRoutines }) {
  const [exercises, setExercises] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState({ name: '', exercises: [] });

  const addExercise = (exercise) => {
    setCurrentRoutine({...currentRoutine, exercises: [...currentRoutine.exercises, exercise]});
  };

  const saveRoutine = () => {
    setRoutines(prev => [...prev, currentRoutine]);
    setCurrentRoutine({ name: '', exercises: [] });
  };

  return (
    <div>
      <Card>
        <CardContent>
          <Input placeholder="Routine Name" value={currentRoutine.name} onChange={(e) => setCurrentRoutine({...currentRoutine, name: e.target.value})} />
          {currentRoutine.exercises.map((ex, idx) => (
            <div key={idx} className="my-2">
              <p>{ex.name}</p>
              {/* Add fields for sets, reps, weight */}
            </div>
          ))}
          <Button onClick={saveRoutine}>Save Routine</Button>
        </CardContent>
      </Card>
      {/* Exercise selection UI here */}
    </div>
  );
}

// components/Workout.js
function Workout({ routines, onFinish }) {
  const [currentWorkout, setCurrentWorkout] = useState(null);

  const startWorkout = (routine) => {
    setCurrentWorkout(routine);
  };

  // Logic for workout session, completion, and history saving
  return (
    <div>
      {currentWorkout ? <WorkoutSession routine={currentWorkout} onFinish={onFinish} /> : 
        routines.map(r => <Card key={r.name} onClick={() => startWorkout(r)}>{r.name}</Card>)}
    </div>
  );
}

// components/History.js
function History({ history }) {
  return (
    <div>
      {history.map((session, index) => (
        <Card key={index}>
          <CardContent>
            <p>Date: {session.date}</p>
            <p>Total Volume: {session.totalVolume}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Additional components like WorkoutSession would follow similar patterns