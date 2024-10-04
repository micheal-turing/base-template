// App.jsx
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

const questions = [
  { question: "What is the capital of France?", answers: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
  // Add more questions here...
];

export default function App() {
  const [gameState, setGameState] = useState('welcome');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleAnswer(null); // Time's up, consider it as incorrect
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const handleAnswer = (selectedAnswer) => {
    const correctAnswer = questions[currentQuestion].correct;
    if (selectedAnswer === correctAnswer) {
      setScore(score + 10 + timeLeft); // Bonus for time left
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(15);
    } else {
      setGameState('results');
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCurrentQuestion(0);
    setStreak(0);
  };

  const resetGame = () => {
    setGameState('welcome');
    if (score > highScore) setHighScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-teal-400 flex items-center justify-center">
      {gameState === 'welcome' && <WelcomeScreen startGame={startGame} highScore={highScore} />}
      {gameState === 'playing' && <GameScreen 
        question={questions[currentQuestion]} 
        onAnswer={handleAnswer} 
        timeLeft={timeLeft}
        score={score}
        streak={streak}
      />}
      {gameState === 'results' && <ResultScreen score={score} onRestart={startGame} onExit={resetGame} />}
    </div>
  );
}

// Additional components like WelcomeScreen, GameScreen, ResultScreen, QuestionCard, TimerProgress, Alert, and ExitDialog should be defined similarly using Tailwind and Shadcn components.