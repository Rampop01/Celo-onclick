import { useEffect } from "react";

interface FonbnkWidgetProps {
  address: string;
}

export default function FonbnkWidget({ address }: FonbnkWidgetProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.fonbnk.io/widget.js";
    script.async = true;
    script.onload = () => {
      (window as any).FonbnkWidget?.init({
        partnerId: process.env.NEXT_PUBLIC_FONBNK_PARTNER_ID, // Set this in your .env.local
        walletAddress: address,
        crypto: "cUSD", // or "CELO"
        onSuccess: (data: any) => {
          // Optionally trigger a UI update or on-chain payment logic
          console.log("Fonbnk success:", data);
        },
        onClose: () => {},
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [address]);

  return (
    <button
      onClick={() => (window as any).FonbnkWidget?.open()}
      className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg transition-all"
    >
      Buy Crypto with Fonbnk
    </button>
  );
}
