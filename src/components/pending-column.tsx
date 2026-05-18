import type { ProduceRequest } from "@/types/request";
import { RequestCard } from "@/components/request-card";

type PendingColumnProps = {
  requests: ProduceRequest[];
  onAccept: (requestId: number) => void;
};

export function PendingColumn({ onAccept, requests }: PendingColumnProps) {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-stone-950">Pending Requests</h2>
        <span className="rounded-md bg-amber-100 px-2 py-1 font-mono text-sm font-bold text-amber-900">
          {requests.length}
        </span>
      </div>
      <div className="grid gap-3">
        {requests.length > 0 ? (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              onAccept={onAccept}
              request={request}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-amber-300 bg-white/60 p-6 text-center text-sm font-medium text-stone-600">
            Queue clear
          </div>
        )}
      </div>
    </section>
  );
}
