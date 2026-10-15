import { Suspense } from "react";
import AncillaryClient from "./AncillaryClient";

export const dynamic = "force-dynamic";

export default function AncillaryPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#006079] font-bold">
          Đang tải dữ liệu...
        </div>
      }
    >
      <AncillaryClient />
    </Suspense>
  );
}
