'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetPayments } from '../../hooks/useContract';
import { fromUSDCAmount } from '../../lib/contract';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TransactionsClient() {
  const searchParams = useSearchParams();
  const handle = searchParams.get('handle') || '';
  const { payments, isLoading } = useGetPayments(handle);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-24 pb-16 px-2 sm:px-4">
        <button
          onClick={() => router.back()}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 mb-8 text-blue-600 hover:underline py-2 px-4 rounded-lg bg-white shadow-sm border"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center">Transactions</h1>
        {isLoading ? (
          <div className="text-center py-20 text-slate-500">Loading on-chain transactions...</div>
        ) : payments && payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl border shadow-sm w-full">
                <div className="mb-2 sm:mb-0">
                  <div className="font-mono text-blue-700">{payment.supporter.slice(0, 6)}...{payment.supporter.slice(-4)}</div>
                  {payment.message && (
                    <div className="text-xs text-slate-500">"{payment.message}"</div>
                  )}
                </div>
                <div className="text-right w-full sm:w-auto">
                  <div className="font-bold text-green-700">${fromUSDCAmount(payment.amount).toFixed(2)}</div>
                  <div className="text-xs text-slate-400">{new Date(Number(payment.timestamp) * 1000).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">No transactions found for this page.</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
