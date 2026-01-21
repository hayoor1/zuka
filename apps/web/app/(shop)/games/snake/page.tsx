'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Card } from '@gemcart/ui';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const snakeRef = useRef<Point[]>([{ x: 5, y: 5 }]);
  const foodRef = useRef<Point>({ x: 10, y: 10 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const directionRef = useRef(direction);

  // Keep directionRef in sync
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Direction change handler
  const changeDirection = useCallback((newDir: Point) => {
    const current = directionRef.current;
    // Prevent reversing direction
    if (newDir.x !== 0 && current.x !== -newDir.x) {
      setDirection(newDir);
    } else if (newDir.y !== 0 && current.y !== -newDir.y) {
      setDirection(newDir);
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') changeDirection({ x: 0, y: -1 });
      if (e.key === 'ArrowDown') changeDirection({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft') changeDirection({ x: -1, y: 0 });
      if (e.key === 'ArrowRight') changeDirection({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeDirection]);

  // Touch swipe controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const minSwipe = 30;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (Math.abs(dx) > minSwipe) {
          changeDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
        }
      } else {
        // Vertical swipe
        if (Math.abs(dy) > minSwipe) {
          changeDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
        }
      }
      touchStartRef.current = null;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [changeDirection]);

  // Game loop
  useEffect(() => {
    if (!running) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const grid = 20;
    const size = 16;
    
    const interval = setInterval(() => {
      const snake = snakeRef.current.slice();
      const head = { 
        x: (snake[0].x + directionRef.current.x + grid) % grid, 
        y: (snake[0].y + directionRef.current.y + grid) % grid 
      };
      
      // Check collision with self
      if (snake.some((p) => p.x === head.x && p.y === head.y)) {
        setRunning(false);
        setGameOver(true);
        return;
      }
      
      snake.unshift(head);
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((s) => s + 10);
        foodRef.current = { 
          x: Math.floor(Math.random() * grid), 
          y: Math.floor(Math.random() * grid) 
        };
      } else {
        snake.pop();
      }
      snakeRef.current = snake;
      
      // Draw
      ctx.clearRect(0, 0, grid * size, grid * size);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, grid * size, grid * size);
      
      // Draw grid lines (subtle)
      ctx.strokeStyle = '#27272a';
      for (let i = 0; i <= grid; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, grid * size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(grid * size, i * size);
        ctx.stroke();
      }
      
      // Draw snake
      ctx.fillStyle = '#22c55e';
      snake.forEach((p, i) => {
        const brightness = 1 - (i / snake.length) * 0.5;
        ctx.fillStyle = `hsl(142, 71%, ${50 * brightness}%)`;
        ctx.fillRect(p.x * size + 1, p.y * size + 1, size - 2, size - 2);
      });
      
      // Draw food
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * size + size / 2, 
        foodRef.current.y * size + size / 2, 
        size / 2 - 2, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
    }, 120);
    
    return () => clearInterval(interval);
  }, [running]);

  const startGame = () => {
    snakeRef.current = [{ x: 5, y: 5 }];
    foodRef.current = { x: 10, y: 10 };
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setRunning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3d074e] via-[#570a70] to-[#943aa2] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">🐍 Snake Classic</h1>
        
        <div className="grid gap-4 md:grid-cols-[auto_280px]">
          {/* Game Canvas */}
          <Card className="p-4 bg-zinc-900/80 backdrop-blur border-zinc-700">
            <div className="flex justify-center">
              <canvas 
                ref={canvasRef} 
                width={320} 
                height={320} 
                className="rounded-lg border-2 border-zinc-700 touch-none"
              />
            </div>
            
            {/* Mobile Controls - D-Pad */}
            <div className="mt-6 md:hidden">
              <p className="text-zinc-400 text-xs text-center mb-3">Swipe on game or use buttons</p>
              <div className="flex flex-col items-center gap-1">
                {/* Up */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-16 h-16 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-green-600 border-zinc-600"
                  onClick={() => changeDirection({ x: 0, y: -1 })}
                  disabled={!running}
                >
                  <ChevronUp className="h-8 w-8" />
                </Button>
                
                {/* Left, Down, Right */}
                <div className="flex gap-1">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-16 h-16 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-green-600 border-zinc-600"
                    onClick={() => changeDirection({ x: -1, y: 0 })}
                    disabled={!running}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-16 h-16 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-green-600 border-zinc-600"
                    onClick={() => changeDirection({ x: 0, y: 1 })}
                    disabled={!running}
                  >
                    <ChevronDown className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-16 h-16 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-green-600 border-zinc-600"
                    onClick={() => changeDirection({ x: 1, y: 0 })}
                    disabled={!running}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Sidebar */}
          <Card className="p-4 bg-zinc-900/80 backdrop-blur border-zinc-700">
            <div className="text-2xl font-bold text-white mb-1">Score: {score}</div>
            <p className="text-zinc-400 text-sm mb-4">
              {gameOver ? 'Game Over!' : running ? 'Playing...' : 'Press Start to play'}
            </p>
            
            <div className="space-y-2">
              {!running ? (
                <Button 
                  onClick={startGame}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {gameOver ? 'Play Again' : 'Start Game'}
                </Button>
              ) : (
                <Button 
                  variant="secondary" 
                  onClick={() => setRunning(false)}
                  className="w-full"
                >
                  Pause
                </Button>
              )}
              
              <form action="/api/games/score" method="post">
                <input type="hidden" name="game" value="snake" />
                <input type="hidden" name="score" value={score} />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  className="w-full text-zinc-400 hover:text-white"
                  disabled={score === 0}
                >
                  Save Score
                </Button>
              </form>
            </div>
            
            {/* Instructions */}
            <div className="mt-6 pt-4 border-t border-zinc-700">
              <h3 className="text-white font-semibold mb-2">How to Play</h3>
              <ul className="text-zinc-400 text-sm space-y-1">
                <li className="hidden md:block">• Use arrow keys to move</li>
                <li className="md:hidden">• Swipe on the game area</li>
                <li className="md:hidden">• Or use the D-pad buttons</li>
                <li>• Eat the red food to grow</li>
                <li>• Don&apos;t hit yourself!</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
