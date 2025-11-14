import dynamic from 'next/dynamic';

// Lazy load heavy animation components to improve initial load time
// These are only loaded when actually needed (on user interaction)

export const GemAnimation = dynamic(
  () => import('./GemAnimation').then(m => ({ default: m.GemAnimation })),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-white text-xl">Loading animation...</div>
      </div>
    )
  }
);

export const CelebrationAnimation = dynamic(
  () => import('./CelebrationAnimation').then(m => ({ default: m.CelebrationAnimation })),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-white text-xl">Loading celebration...</div>
      </div>
    )
  }
);

export const WelcomeAnimation = dynamic(
  () => import('./WelcomeAnimation').then(m => ({ default: m.WelcomeAnimation })),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#050816] via-[#120c2c] to-[#341056]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }
);

export const SignupAnimation = dynamic(
  () => import('./SignupAnimation').then(m => ({ default: m.SignupAnimation })),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#fbf8ff] via-[#fffdf7] to-[#fbf8ff]">
        <div className="text-brand-purple text-xl">Loading...</div>
      </div>
    )
  }
);

// Export GemIcon separately (not lazy) since it's used in the UI directly
export { GemIcon } from './GemAnimation';

