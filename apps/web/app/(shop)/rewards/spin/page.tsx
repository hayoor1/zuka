'use client';
import { useState } from 'react';
import { Button, Card } from '@gemcart/ui';

export default function SpinPage() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <Card className="p-6">
      <div className="text-lg font-medium">Spin the Wheel</div>
      <div className="mt-2 text-sm text-zinc-400">Daily spin for a coupon. One per day.</div>
      <Button className="mt-4" onClick={async () => {
        setError(null); setResult(null);
        const res = await fetch('/api/rewards/spin', { method: 'POST' });
        if (!res.ok) { setError('Come back tomorrow.'); return; }
        const data = await res.json();
        setResult(data.code);
      }}>Spin</Button>
      {result && <div className="mt-4">Your coupon: <span className="font-mono">{result}</span></div>}
      {error && <div className="mt-4 text-red-400">{error}</div>}
    </Card>
  );
}










