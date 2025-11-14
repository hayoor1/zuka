'use client';
import { useState } from 'react';
import { Button, Card } from '@gemcart/ui';

type Persona = 'grumpy' | 'rude' | 'nonchalant' | 'funny';

export default function PetPage() {
  const [persona, setPersona] = useState<Persona>('funny');
  const [messages, setMessages] = useState<{ role: 'user' | 'pet'; text: string }[]>([
    { role: 'pet', text: "I'm your shopping buddy. Ask me for tees under ₦10k." },
  ]);
  async function send(text: string) {
    setMessages((m) => [...m, { role: 'user', text }]);
    const res = await fetch('/api/pet', { method: 'POST', body: JSON.stringify({ persona, text }) });
    const data = await res.json();
    setMessages((m) => [...m, { role: 'pet', text: data.reply }]);
  }
  return (
    <div className="grid gap-4 md:grid-cols-[320px_auto]">
      <Card className="p-4">
        <div className="text-sm text-zinc-300">Persona</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['grumpy','rude','nonchalant','funny'] as Persona[]).map(p => (
            <Button key={p} variant={p===persona? 'primary':'secondary'} onClick={() => setPersona(p)}>{p}</Button>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <div className="space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'pet' ? 'text-zinc-50' : 'text-zinc-300'}>
              <span className="mr-2 text-xs uppercase text-zinc-500">{m.role}</span>
              {m.text}
            </div>
          ))}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input name="q" placeholder="Ask for products, coupons, shipping..." className="flex-1 rounded-md border border-zinc-800 bg-black p-2" />
          <Button type="button" onClick={() => {
            const input = document.querySelector<HTMLInputElement>('input[name="q"]');
            if (input && input.value.trim()) { void send(input.value.trim()); input.value=''; }
          }}>Send</Button>
        </form>
      </Card>
    </div>
  );
}




