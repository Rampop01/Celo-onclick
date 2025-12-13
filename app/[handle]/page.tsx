'use client';

import { Suspense, useState, useEffect } from 'react';
import { PublicPageContent } from '../../components/PublicPageContent';

function HandlePageContent({ params }: { params: Promise<{ handle: string }> }) {
  const [handle, setHandle] = useState<string>('');
  
  useEffect(() => {
    params.then(resolved => setHandle(resolved.handle));
  }, [params]);
  
  if (!handle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <PublicPageContent handle={handle} />;
}

export default function HandlePage({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <HandlePageContent params={params} />
    </Suspense>
  );
}

