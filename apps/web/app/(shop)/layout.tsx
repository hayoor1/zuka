import type { ReactNode } from 'react';
import { Navbar } from '../../components/Navbar';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}