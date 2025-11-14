export const dynamic = 'force-static';

export function GET() {
  const body = {
    name: 'Gemcart',
    short_name: 'Gemcart',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [],
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/manifest+json' } });
}










