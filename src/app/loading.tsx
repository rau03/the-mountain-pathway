import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-stone flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3 text-brand-slate/80">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
        <p className="text-sm">Loading your pathway...</p>
      </div>
    </div>
  );
}
