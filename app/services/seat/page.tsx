import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SeatClient from "./SeatClient";

export const dynamic = "force-dynamic";

export default function SeatSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SeatClient />
    </Suspense>
  );
}
