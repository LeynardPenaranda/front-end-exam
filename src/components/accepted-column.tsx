import type { ProduceRequest } from "@/types/request";
import { RequestCard } from "@/components/request-card";

type AcceptedColumnProps = {
  requests: ProduceRequest[];
};

export function AcceptedColumn({ requests }: AcceptedColumnProps) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-stone-950">Accepted Requests</h2>
        <span className="rounded-md bg-emerald-100 px-2 py-1 font-mono text-sm font-bold text-emerald-900">
          {requests.length}
        </span>
      </div>
      <div className="grid gap-3">
        {requests.length > 0 ? (
          requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-emerald-300 bg-white/60 p-6 text-center text-sm font-medium text-stone-600">
            No accepted requests
          </div>
        )}
      </div>
    </section>
  );
}
