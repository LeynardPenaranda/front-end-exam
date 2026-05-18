"use client";

import type { ProduceRequest } from "@/types/request";
import { DashboardHeader } from "@/components/dashboard-header";
import { KanbanBoard } from "@/components/kanban-board";
import { RequestAnalytics } from "@/components/request-analytics";
import { useRequestStream } from "@/hooks/use-request-stream";

type DashboardClientProps = {
  initialRequests: ProduceRequest[];
};

export function DashboardClient({ initialRequests }: DashboardClientProps) {
  const {
    acceptedRequests,
    handleAcceptRequest,
    isStreaming,
    metrics,
    pendingRequests,
    produceData,
    recentEvent,
    resetDemo,
    setIsStreaming,
    statusData,
    throughputData,
  } = useRequestStream(initialRequests);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <DashboardHeader
        isStreaming={isStreaming}
        metrics={metrics}
        onReset={resetDemo}
        onToggleStream={() => setIsStreaming((current) => !current)}
        recentEvent={recentEvent}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <RequestAnalytics
          produceData={produceData}
          statusData={statusData}
          throughputData={throughputData}
        />
        <KanbanBoard
          acceptedRequests={acceptedRequests}
          onAcceptRequest={handleAcceptRequest}
          pendingRequests={pendingRequests}
        />
      </main>
    </div>
  );
}
