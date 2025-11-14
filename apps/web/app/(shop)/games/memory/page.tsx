'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@gemcart/ui';
import { 
  Brain, 
  Trophy, 
  Timer, 
  RotateCcw,
  Sparkles,
  Star,
  ArrowLeft,
  Zap
} from 'lucide-react';
import Link from 'next/link';

// Card symbols for matching (using emojis for visual appeal)
const cardSymbols = [
  '💎', '👑', '🎯', '🚀', '⭐', '🔥', '💰', '🎁',
  '🏆', '💝', '🌟', '✨', '🎨', '🎮', '🎪', '🎭'
];

interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGamePage() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [bestScore, setBestScore] = useState<number | null>(null);

  const difficultySettings = {
    easy: { pairs: 6, grid: 'grid-cols-3 sm:grid-cols-4', xp: 50 },
    medium: { pairs: 8, grid: 'grid-cols-4', xp: 100 },
    hard: { pairs: 12, grid: 'grid-cols-4 sm:grid-cols-6', xp: 200 }
  };

  const settings = difficultySettings[difficulty];

  // Initialize game board
  const initializeGame = () => {
    const selectedSymbols = cardSymbols.slice(0, settings.pairs);
    const duplicatedSymbols = [...selectedSymbols, ...selectedSymbols];
    const shuffledSymbols = duplicatedSymbols.sort(() => Math.random() - 0.5);
    
    const newCards: MemoryCard[] = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
    
    setCards(newCards);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setGameStarted(false);
    setGameComplete(false);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameComplete]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (isProcessing || gameComplete) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Flip the card
    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);
    
    // Check for match when two cards are selected
    if (newSelectedCards.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);
      
      const [firstId, secondId] = newSelectedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(matches + 1);
          setSelectedCards([]);
          setIsProcessing(false);
          
          // Check if game is complete
          if (matches + 1 === settings.pairs) {
            setGameComplete(true);
            const score = Math.max(1000 - (moves * 10) - (timer * 2), 100);
            if (!bestScore || score > bestScore) {
              setBestScore(score);
            }
          }
        }, 600);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
          setSelectedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    return Math.max(1000 - (moves * 10) - (timer * 2), 100);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link 
            href="/games" 
            className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-purple-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Memory Match</h1>
          <p className="mt-2 text-gray-600">Test your memory and earn XP!</p>
        </div>
        
        <div className="text-right">
          <Badge variant="gem" className="mb-2">
            <Sparkles className="mr-1 h-3 w-3" />
            +{settings.xp} XP
          </Badge>
          {bestScore && (
            <p className="text-sm text-gray-600">
              Best Score: {bestScore}
            </p>
          )}
        </div>
      </div>

      {/* Game Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Moves</p>
              <p className="text-2xl font-bold text-gray-900">{moves}</p>
            </div>
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Matches</p>
              <p className="text-2xl font-bold text-gray-900">{matches}/{settings.pairs}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(timer)}</p>
            </div>
            <Timer className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-gray-900">{gameStarted ? calculateScore() : 0}</p>
            </div>
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
        </Card>
      </div>

      {/* Difficulty Selector */}
      <div className="mb-6 flex justify-center gap-2">
        <Button
          variant={difficulty === 'easy' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => {
            setDifficulty('easy');
            initializeGame();
          }}
        >
          Easy (6 pairs)
        </Button>
        <Button
          variant={difficulty === 'medium' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => {
            setDifficulty('medium');
            initializeGame();
          }}
        >
          Medium (8 pairs)
        </Button>
        <Button
          variant={difficulty === 'hard' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => {
            setDifficulty('hard');
            initializeGame();
          }}
        >
          Hard (12 pairs)
        </Button>
      </div>

      {/* Game Board */}
      <Card gradient className="p-8">
        {!gameComplete ? (
          <div className={`grid ${settings.grid} gap-3 sm:gap-4 max-w-4xl mx-auto`}>
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched || isProcessing}
                className={`
                  aspect-square rounded-lg transition-all duration-300 transform
                  ${card.isFlipped || card.isMatched
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 scale-95'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:scale-105 hover:from-gray-600 hover:to-gray-700'
                  }
                  ${card.isMatched ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900' : ''}
                  ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}
                  flex items-center justify-center text-4xl sm:text-5xl
                  shadow-lg
                `}
              >
                <span className={`
                  transition-all duration-300
                  ${card.isFlipped || card.isMatched ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                `}>
                  {card.symbol}
                </span>
                {!card.isFlipped && !card.isMatched && (
                  <Zap className="h-8 w-8 text-gray-600" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h2>
            <p className="text-gray-600 mb-2">
              You matched all {settings.pairs} pairs in {moves} moves!
            </p>
            <p className="text-lg text-gray-900 mb-6">
              Time: {formatTime(timer)} | Score: {calculateScore()}
            </p>
            
            <div className="flex justify-center gap-3">
              <Button onClick={initializeGame}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
              <Link href="/games">
                <Button variant="secondary">
                  Try Other Games
                </Button>
              </Link>
            </div>
            
            <Card className="mt-6 mx-auto max-w-md p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <p className="text-sm font-semibold text-gray-900 mb-1">🎉 Rewards Earned!</p>
              <p className="text-xs text-gray-600">
                +{settings.xp} XP added to your account
              </p>
            </Card>
          </div>
        )}
      </Card>

      {/* Reset Button */}
      {!gameComplete && (
        <div className="mt-6 text-center">
          <Button 
            variant="secondary"
            onClick={initializeGame}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </div>
      )}

      {/* Instructions */}
      <Card className="mt-8 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">How to Play</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Click on cards to flip them and reveal symbols
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Match pairs of identical symbols to score points
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Complete the game in fewer moves and less time for a higher score
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Earn XP based on difficulty: Easy (50 XP), Medium (100 XP), Hard (200 XP)
          </li>
        </ul>
      </Card>
    </div>
  );
}





