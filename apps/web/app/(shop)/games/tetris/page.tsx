'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, Card } from '@gemcart/ui';

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1; setScore((s) => s + 1);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 240, 360);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect((i % 10) * 24, (i % 15) * 24, 22, 22);
    }, 150);
    return () => clearInterval(id);
  }, [running]);
  return (
    <div className="grid gap-4 md:grid-cols-[auto_280px]">
      <Card className="p-4"><canvas ref={canvasRef} width={240} height={360} className="rounded-md border border-zinc-800" /></Card>
      <Card className="p-4">
        <div className="text-lg font-medium">Score: {score}</div>
        <div className="mt-2 flex gap-2">
          {!running ? <Button onClick={() => { setScore(0); setRunning(true); }}>Start</Button> : <Button variant="secondary" onClick={() => setRunning(false)}>Pause</Button>}
          <form action="/api/games/score" method="post">
            <input type="hidden" name="game" value="tetris" />
            <input type="hidden" name="score" value={score} />
            <Button type="submit" variant="ghost">Save score</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}












