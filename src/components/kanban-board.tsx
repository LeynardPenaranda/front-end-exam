import type { ProduceRequest } from "@/types/request";
import { AcceptedColumn } from "@/components/accepted-column";
import { PendingColumn } from "@/components/pending-column";

type KanbanBoardProps = {
  acceptedRequests: ProduceRequest[];
  onAcceptRequest: (requestId: number) => void;
  pendingRequests: ProduceRequest[];
};

export function KanbanBoard({
  acceptedRequests,
  onAcceptRequest,
  pendingRequests,
}: KanbanBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PendingColumn onAccept={onAcceptRequest} requests={pendingRequests} />
      <AcceptedColumn requests={acceptedRequests} />
    </div>
  );
}
