'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, Card } from '@gemcart/ui';

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const snakeRef = useRef<Point[]>([{ x: 5, y: 5 }]);
  const foodRef = useRef<Point>({ x: 10, y: 10 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && direction.y !== 1) setDirection({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && direction.y !== -1) setDirection({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && direction.x !== 1) setDirection({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && direction.x !== -1) setDirection({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [direction]);

  useEffect(() => {
    if (!running) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const grid = 20; // 20x20
    const size = 16;
    const interval = setInterval(() => {
      const snake = snakeRef.current.slice();
      const head = { x: (snake[0].x + direction.x + grid) % grid, y: (snake[0].y + direction.y + grid) % grid };
      if (snake.some((p) => p.x === head.x && p.y === head.y)) {
        setRunning(false);
        return;
      }
      snake.unshift(head);
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((s) => s + 10);
        foodRef.current = { x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) };
      } else {
        snake.pop();
      }
      snakeRef.current = snake;
      // draw
      ctx.clearRect(0, 0, grid * size, grid * size);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, grid * size, grid * size);
      ctx.fillStyle = '#22c55e';
      snake.forEach((p) => ctx.fillRect(p.x * size, p.y * size, size - 1, size - 1));
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(foodRef.current.x * size, foodRef.current.y * size, size - 1, size - 1);
    }, 120);
    return () => clearInterval(interval);
  }, [running, direction]);

  return (
    <div className="grid gap-4 md:grid-cols-[auto_280px]">
      <Card className="p-4">
        <canvas ref={canvasRef} width={320} height={320} className="rounded-md border border-zinc-800" />
      </Card>
      <Card className="p-4">
        <div className="text-lg font-medium">Score: {score}</div>
        <div className="mt-2 flex gap-2">
          {!running ? (
            <Button onClick={() => { snakeRef.current = [{ x: 5, y: 5 }]; setScore(0); setRunning(true); }}>Start</Button>
          ) : (
            <Button variant="secondary" onClick={() => setRunning(false)}>Pause</Button>
          )}
          <form action="/api/games/score" method="post">
            <input type="hidden" name="game" value="snake" />
            <input type="hidden" name="score" value={score} />
            <Button type="submit" variant="ghost">Save score</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}












