import React from "react";

// Example hardcoded sandbox params for demonstration
const SOURCE_PARAM = "bd3X9Cgq"; // Example source param
const SIGNATURE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJlcmcyMmYyZkBAIn0.Z1BB4eiClKH_k18w5I3tMiutuWpPgPb5gI33FrkpJcY"; // Example JWT signature

interface FonbnkSandboxModalProps {
  onClose: () => void;
  recipient: string;
}

export default function FonbnkSandboxModal({ onClose, recipient }: FonbnkSandboxModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl p-4 max-w-lg w-full relative">
        <iframe
          src={`https://sandbox-pay.fonbnk.com/?source=${SOURCE_PARAM}&signature=${SIGNATURE}&recipient=${recipient}&wallet=${recipient}&address=${recipient}`}
          width="100%"
          height="600"
          frameBorder="0"
          style={{ borderRadius: 12 }}
        />
        <button onClick={onClose} className="absolute top-2 right-2 p-2 bg-slate-200 rounded-full">Close</button>
      </div>
    </div>
  );
}
