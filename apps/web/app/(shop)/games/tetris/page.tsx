'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Card } from '@gemcart/ui';
import { ChevronLeft, ChevronRight, ChevronDown, RotateCw } from 'lucide-react';

// Tetris piece shapes
const PIECES = [
  { shape: [[1, 1, 1, 1]], color: '#00f5ff' }, // I - cyan
  { shape: [[1, 1], [1, 1]], color: '#ffd700' }, // O - yellow
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' }, // T - purple
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#3b82f6' }, // J - blue
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#f97316' }, // L - orange
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#22c55e' }, // S - green
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' }, // Z - red
];

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

type Piece = {
  shape: number[][];
  color: string;
  x: number;
  y: number;
};

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const boardRef = useRef<(string | null)[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const currentPieceRef = useRef<Piece | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastDropRef = useRef(0);

  const getRandomPiece = useCallback((): Piece => {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: piece.shape.map(row => [...row]),
      color: piece.color,
      x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0,
    };
  }, []);

  const rotatePiece = useCallback((piece: Piece): number[][] => {
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;
    const rotated: number[][] = [];
    for (let c = 0; c < cols; c++) {
      const row: number[] = [];
      for (let r = rows - 1; r >= 0; r--) {
        row.push(piece.shape[r][c]);
      }
      rotated.push(row);
    }
    return rotated;
  }, []);

  const isValidMove = useCallback((piece: Piece, offsetX = 0, offsetY = 0, newShape?: number[][]): boolean => {
    const shape = newShape || piece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = piece.x + c + offsetX;
          const newY = piece.y + r + offsetY;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
          if (newY >= 0 && boardRef.current[newY][newX]) return false;
        }
      }
    }
    return true;
  }, []);

  const lockPiece = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece) return;
    
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const y = piece.y + r;
          const x = piece.x + c;
          if (y >= 0) {
            boardRef.current[y][x] = piece.color;
          }
        }
      }
    }
    
    // Check for completed lines
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (boardRef.current[r].every(cell => cell !== null)) {
        boardRef.current.splice(r, 1);
        boardRef.current.unshift(Array(COLS).fill(null));
        linesCleared++;
        r++; // Check same row again
      }
    }
    
    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] * level;
      setScore(s => s + points);
      setLines(l => {
        const newLines = l + linesCleared;
        setLevel(Math.floor(newLines / 10) + 1);
        return newLines;
      });
    }
    
    // Spawn new piece
    const newPiece = getRandomPiece();
    if (!isValidMove(newPiece)) {
      setGameOver(true);
      setRunning(false);
      return;
    }
    currentPieceRef.current = newPiece;
  }, [getRandomPiece, isValidMove, level]);

  const moveLeft = useCallback(() => {
    const piece = currentPieceRef.current;
    if (piece && isValidMove(piece, -1, 0)) {
      piece.x -= 1;
    }
  }, [isValidMove]);

  const moveRight = useCallback(() => {
    const piece = currentPieceRef.current;
    if (piece && isValidMove(piece, 1, 0)) {
      piece.x += 1;
    }
  }, [isValidMove]);

  const moveDown = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece) return;
    if (isValidMove(piece, 0, 1)) {
      piece.y += 1;
    } else {
      lockPiece();
    }
  }, [isValidMove, lockPiece]);

  const hardDrop = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece) return;
    while (isValidMove(piece, 0, 1)) {
      piece.y += 1;
      setScore(s => s + 2);
    }
    lockPiece();
  }, [isValidMove, lockPiece]);

  const rotate = useCallback(() => {
    const piece = currentPieceRef.current;
    if (!piece) return;
    const rotated = rotatePiece(piece);
    if (isValidMove(piece, 0, 0, rotated)) {
      piece.shape = rotated;
    } else if (isValidMove(piece, 1, 0, rotated)) {
      piece.x += 1;
      piece.shape = rotated;
    } else if (isValidMove(piece, -1, 0, rotated)) {
      piece.x -= 1;
      piece.shape = rotated;
    }
  }, [isValidMove, rotatePiece]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!running) return;
      switch (e.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowUp': rotate(); break;
        case ' ': hardDrop(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, moveLeft, moveRight, moveDown, rotate, hardDrop]);

  // Draw function
  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Clear and draw background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

    // Draw grid
    ctx.strokeStyle = '#27272a';
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * BLOCK_SIZE);
      ctx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * BLOCK_SIZE, 0);
      ctx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.stroke();
    }

    // Draw locked pieces
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (boardRef.current[r][c]) {
          ctx.fillStyle = boardRef.current[r][c]!;
          ctx.fillRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.strokeRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        }
      }
    }

    // Draw current piece
    const piece = currentPieceRef.current;
    if (piece) {
      ctx.fillStyle = piece.color;
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            const x = (piece.x + c) * BLOCK_SIZE;
            const y = (piece.y + r) * BLOCK_SIZE;
            ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.strokeRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          }
        }
      }
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (!running) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    
    const gameLoop = (timestamp: number) => {
      if (timestamp - lastDropRef.current > dropInterval) {
        moveDown();
        lastDropRef.current = timestamp;
      }
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [running, level, moveDown, draw]);

  const startGame = () => {
    boardRef.current = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    currentPieceRef.current = getRandomPiece();
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setRunning(true);
    lastDropRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3d074e] via-[#570a70] to-[#943aa2] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">🧱 Block Stacker</h1>
        
        <div className="grid gap-4 md:grid-cols-[auto_280px]">
          {/* Game Canvas */}
          <Card className="p-4 bg-zinc-900/80 backdrop-blur border-zinc-700">
            <div className="flex justify-center">
              <canvas 
                ref={canvasRef} 
                width={COLS * BLOCK_SIZE} 
                height={ROWS * BLOCK_SIZE} 
                className="rounded-lg border-2 border-zinc-700"
              />
            </div>
            
            {/* Mobile Controls */}
            <div className="mt-6 md:hidden">
              <p className="text-zinc-400 text-xs text-center mb-3">Use buttons to control</p>
              <div className="flex justify-center gap-3">
                {/* Left */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-14 h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-blue-600 border-zinc-600"
                  onClick={moveLeft}
                  disabled={!running}
                >
                  <ChevronLeft className="h-7 w-7" />
                </Button>
                
                {/* Down */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-14 h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-blue-600 border-zinc-600"
                  onClick={moveDown}
                  disabled={!running}
                >
                  <ChevronDown className="h-7 w-7" />
                </Button>
                
                {/* Right */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-14 h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-blue-600 border-zinc-600"
                  onClick={moveRight}
                  disabled={!running}
                >
                  <ChevronRight className="h-7 w-7" />
                </Button>
                
                {/* Rotate */}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-14 h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-purple-600 border-zinc-600"
                  onClick={rotate}
                  disabled={!running}
                >
                  <RotateCw className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Hard Drop */}
              <div className="flex justify-center mt-3">
                <Button
                  variant="secondary"
                  className="px-8 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:bg-yellow-600 border-zinc-600 font-semibold"
                  onClick={hardDrop}
                  disabled={!running}
                >
                  Drop ⬇️
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Sidebar */}
          <Card className="p-4 bg-zinc-900/80 backdrop-blur border-zinc-700">
            <div className="space-y-3 mb-4">
              <div>
                <div className="text-zinc-400 text-sm">Score</div>
                <div className="text-2xl font-bold text-white">{score.toLocaleString()}</div>
              </div>
              <div className="flex gap-4">
                <div>
                  <div className="text-zinc-400 text-sm">Level</div>
                  <div className="text-xl font-bold text-cyan-400">{level}</div>
                </div>
                <div>
                  <div className="text-zinc-400 text-sm">Lines</div>
                  <div className="text-xl font-bold text-green-400">{lines}</div>
                </div>
              </div>
            </div>
            
            {gameOver && (
              <div className="mb-4 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                <p className="text-red-400 font-semibold text-center">Game Over!</p>
              </div>
            )}
            
            <div className="space-y-2">
              {!running ? (
                <Button 
                  onClick={startGame}
                  className="w-full bg-blue-600 hover:bg-blue-700"
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
                <input type="hidden" name="game" value="tetris" />
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
                <li className="hidden md:block">• ← → to move</li>
                <li className="hidden md:block">• ↑ to rotate</li>
                <li className="hidden md:block">• ↓ to soft drop</li>
                <li className="hidden md:block">• Space for hard drop</li>
                <li className="md:hidden">• Use buttons below game</li>
                <li>• Clear lines to score</li>
                <li>• Level up every 10 lines</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
