export const dynamic = 'force-static';

export function GET() {
  const body = {
    name: 'Zuka',
    short_name: 'Zuka',
    start_url: '/',
    display: 'standalone',
    background_color: '#570a70',
    theme_color: '#570a70',
    icons: [
      {
        src: '/brand/zuka-icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/manifest+json' } });
}












