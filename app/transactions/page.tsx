import { Suspense } from 'react';
import TransactionsClient from './TransactionsClient';

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 text-lg">Loading transactions...</div>}>
      <TransactionsClient />
    </Suspense>
  );
}
