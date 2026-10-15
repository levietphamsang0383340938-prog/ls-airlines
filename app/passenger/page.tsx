import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PassengerClient from "./PassengerClient";

export const dynamic = "force-dynamic";

export default function PassengerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      }
    >
      <PassengerClient />
    </Suspense>
  );
}
