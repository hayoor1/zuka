import type { ReactNode } from 'react';
import { Navbar } from '../../components/Navbar';
import { MobileNav } from '../../components/MobileNav';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 lg:pb-0">
        {children}
      </main>
      <MobileNav />
    </>
  );
}
