import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Silver", "Iron"],
    correctAnswer: 1,
  },
  {
    question: "In what year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
  },
  {
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "South Africa", "Australia", "Brazil"],
    correctAnswer: 2,
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2,
  },
];

const TIMER_DURATION = 15;
const STREAK_THRESHOLD = 3;

export default function App() {
  const [gameState, setGameState] = useState("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  useEffect(() => {
    let interval;
    if (gameState === "playing" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleAnswer(-1);
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestion(0);
    setScore(0);
    setTimer(TIMER_DURATION);
    setStreak(0);
    setShowStreakAnimation(false);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const handleAnswer = (answerIndex) => {
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setSelectedAnswer(answerIndex);
    setFeedback(correct ? "Correct!" : "Incorrect!");
    if (correct) {
      const timeBonus = Math.max(timer * 10, 50);
      const newScore = score + timeBonus;
      setScore(newScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak % STREAK_THRESHOLD === 0) {
        setShowStreakAnimation(true);
        setTimeout(() => setShowStreakAnimation(false), 2000);
      }
      if (newScore > highScore) {
        setHighScore(newScore);
      }
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimer(TIMER_DURATION);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        setGameState("results");
      }
    }, 2000);
  };

  const exitGame = () => {
    setShowExitConfirmation(true);
  };

  const confirmExit = () => {
    setGameState("welcome");
    setShowExitConfirmation(false);
  };

  const cancelExit = () => {
    setShowExitConfirmation(false);
  };

  const renderWelcomeScreen = () => (
    <Card className="w-full max-w-md mx-auto mt-10 bg-purple-800 text-white">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Trivia Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-4">Test your knowledge with 10 exciting questions!</p>
        <p className="text-center mb-4">High Score: {highScore}</p>
        <Button onClick={startGame} className="w-full bg-teal-500 hover:bg-teal-600">
          Start Game
        </Button>
      </CardContent>
    </Card>
  );

  const renderGameScreen = () => (
    <div className="w-full max-w-2xl mx-auto mt-10 relative">
      <Button
        onClick={exitGame}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white"
      >
        Exit Game
      </Button>
      <Card className="bg-purple-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Question {currentQuestion + 1}</CardTitle>
          <Progress value={(timer / TIMER_DURATION) * 100} className="h-2 bg-purple-600" />
        </CardHeader>
        <CardContent>
          <h2 className="text-xl mb-4">{questions[currentQuestion].question}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full ${
                  selectedAnswer === index
                    ? selectedAnswer === questions[currentQuestion].correctAnswer
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <div>Score: {score}</div>
          <div>Streak: {streak}</div>
          <div>Time: {timer}s</div>
        </CardFooter>
      </Card>
      {feedback && (
        <Alert className={`mt-4 ${feedback === "Correct!" ? "bg-green-500" : "bg-red-500"} text-white`}>
          <AlertTitle>{feedback}</AlertTitle>
          <AlertDescription>
            {feedback === "Correct!" ? "Great job!" : `The correct answer was: ${
              questions[currentQuestion].options[questions[currentQuestion].correctAnswer]
            }`}
          </AlertDescription>
        </Alert>
      )}
      {showStreakAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-full text-2xl font-bold animate-bounce">
            Yaaay! {streak} in a row!
          </div>
        </div>
      )}
    </div>
  );

  const renderResultsScreen = () => (
    <Card className="w-full max-w-md mx-auto mt-10 bg-purple-800 text-white">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Game Over!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl text-center mb-4">Your final score: {score}</p>
        {score > highScore && (
          <p className="text-xl text-center mb-4 text-yellow-400">New High Score!</p>
        )}
        <Button onClick={startGame} className="w-full bg-teal-500 hover:bg-teal-600 mb-4">
          Play Again
        </Button>
        <Button onClick={() => setGameState("welcome")} className="w-full bg-purple-600 hover:bg-purple-700">
          Back to Main Menu
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-teal-700 p-4">
      {gameState === "welcome" && renderWelcomeScreen()}
      {gameState === "playing" && renderGameScreen()}
      {gameState === "results" && renderResultsScreen()}

      <Dialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Game</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit the game? Your current progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={cancelExit} variant="outline">
              Cancel
            </Button>
            <Button onClick={confirmExit} variant="destructive">
              Exit Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}