export async function POST(req: Request) {
  const { persona, text } = await req.json();
  const replies: Record<string, (t: string) => string> = {
    grumpy: (t) => `Hmph. ${t}? Fine. Try our hoodie. It won't disappoint, unlike most.`,
    rude: (t) => `Whatever. ${t}? You clearly need the Gemcart Tee. You're welcome.`,
    nonchalant: (t) => `Cool. ${t}. The tee is chill, price is nice.`,
    funny: (t) => `Lol ${t}. The hoodie is warmer than Lagos sun at noon. Kidding. Sort of.`,
  };
  const reply = (replies[persona] || replies['funny'])(text);
  return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } });
}












