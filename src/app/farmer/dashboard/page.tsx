import { Suspense } from "react";
import { DashboardClient } from "@/components/dashboard-client";
import { getInitialRequests } from "@/services/mock-request-service";

function DashboardFallback() {
  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-4">
        <div className="h-32 animate-pulse rounded-lg bg-white" />
        <div className="h-64 animate-pulse rounded-lg bg-white" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-lg bg-white" />
          <div className="h-96 animate-pulse rounded-lg bg-white" />
        </div>
      </div>
    </div>
  );
}

export default function FarmerDashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardClient initialRequests={getInitialRequests()} />
    </Suspense>
  );
}
