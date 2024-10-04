import React, { useState, useReducer, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Question data
const questions = [
  { question: "What is the capital of France?", answers: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
  // Add more questions here...
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, currentQuestion: 0, score: 0, streak: 0, timer: 15, questions: shuffleArray([...questions]).slice(0, 10), gameState: 'playing' };
    case 'ANSWER':
      const correct = action.payload === state.questions[state.currentQuestion].correct;
      const newScore = correct ? state.score + 10 + state.timer + (state.streak * 5) : state.score;
      return { 
        ...state, 
        score: newScore, 
        streak: correct ? state.streak + 1 : 0,
        feedback: correct ? 'Correct!' : 'Incorrect!',
        feedbackType: correct ? 'success' : 'destructive',
        currentQuestion: correct ? state.currentQuestion + 1 : state.currentQuestion,
        timer: 15
      };
    case 'TIMER_TICK':
      return { ...state, timer: state.timer - 1 };
    case 'NEXT_QUESTION':
      if (state.currentQuestion >= 9 || state.timer <= 0) {
        return { ...state, gameState: 'ended' };
      }
      return { ...state, currentQuestion: state.currentQuestion + 1, timer: 15, feedback: null };
    case 'END_GAME':
      return { ...state, gameState: 'ended' };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, {
    gameState: 'welcome',
    score: 0,
    highScore: 0,
    currentQuestion: 0,
    streak: 0,
    timer: 15,
    questions: [],
    feedback: null,
    feedbackType: 'info'
  });
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    let timerId;
    if (state.gameState === 'playing' && state.timer > 0) {
      timerId = setInterval(() => dispatch({ type: 'TIMER_TICK' }), 1000);
    } else if (state.timer === 0) {
      dispatch({ type: 'NEXT_QUESTION' });
    }
    return () => clearInterval(timerId);
  }, [state.timer, state.gameState]);

  const handleAnswer = (index) => {
    dispatch({ type: 'ANSWER', payload: index });
    setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 1000);
  };

  const startGame = () => dispatch({ type: 'START_GAME' });
  const endGame = () => setShowExitDialog(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent>
          {state.gameState === 'welcome' && <WelcomeScreen startGame={startGame} highScore={state.highScore} />}
          {state.gameState === 'playing' && <GameScreen state={state} onAnswer={handleAnswer} onExit={endGame} />}
          {state.gameState === 'ended' && <ResultsScreen score={state.score} highScore={state.highScore} restart={() => dispatch({ type: 'START_GAME' })} />}
        </CardContent>
      </Card>
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Game?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowExitDialog(false)}>Continue</Button>
            <Button onClick={() => dispatch({ type: 'END_GAME' })} variant="destructive">Exit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WelcomeScreen({ startGame, highScore }) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Trivia Challenge</CardTitle>
      </CardHeader>
      <CardDescription>Test your knowledge with 10 questions!</CardDescription>
      <CardFooter>
        <Button onClick={startGame}>Start Game</Button>
      </CardFooter>
      <p className="text-sm text-muted-foreground mt-2">High Score: {highScore}</p>
    </div>
  );
}

function GameScreen({ state, onAnswer, onExit }) {
  const currentQuestion = state.questions[state.currentQuestion];

  return (
    <div>
      <CardHeader>
        <CardTitle>Question {state.currentQuestion + 1}</CardTitle>
      </CardHeader>
      <Progress value={state.timer * (100 / 15)} className="mb-4" />
      <p>{currentQuestion.question}</p>
      {currentQuestion.answers.map((answer, index) => (
        <Button key={index} onClick={() => onAnswer(index)} className="mt-2 w-full">
          {answer}
        </Button>
      ))}
      {state.feedback && <FeedbackAlert type={state.feedbackType}>{state.feedback}</FeedbackAlert>}
      {state.streak >= 3 && <div className="text-center text-green-500 mt-2 animate-bounce">Streak Bonus!</div>}
      <Button onClick={onExit} variant="outline" className="mt-4 w-full">Exit Game</Button>
    </div>
  );
}

function ResultsScreen({ score, highScore, restart }) {
  return (
    <div>
      <CardHeader>
        <CardTitle>Game Over</CardTitle>
      </CardHeader>
      <CardDescription>Your Score: {score}</CardDescription>
      <CardDescription>High Score: {Math.max(score, highScore)}</CardDescription>
      <CardFooter>
        <Button onClick={restart}>Play Again</Button>
        <Button onClick={() => window.location.reload()} variant="secondary">Main Menu</Button>
      </CardFooter>
    </div>
  );
}

function FeedbackAlert({ children, type }) {
  return (
    <Alert variant={type} className="mt-2">
      <AlertTitle>{type === 'success' ? 'Great!' : 'Oops!'}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}