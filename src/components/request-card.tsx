import type { ProduceRequest } from "@/types/request";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { formatUtcTime } from "@/utils/date-format";

type RequestCardProps = {
  request: ProduceRequest;
  onAccept?: (requestId: number) => void;
};

const priorityClasses = {
  "Cold Chain": "border-sky-200 bg-sky-50 text-sky-800",
  Express: "border-amber-200 bg-amber-50 text-amber-800",
  Standard: "border-stone-200 bg-stone-50 text-stone-700",
};

export function RequestCard({ onAccept, request }: RequestCardProps) {
  const isPending = request.status === "Pending";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-xs font-semibold text-stone-500">
            REQ-{request.id}
          </div>
          <h3 className="mt-1 text-lg font-bold leading-tight text-stone-950">
            {request.farmerName}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md border px-2 py-1 text-xs font-bold",
            isPending
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800",
          )}
        >
          {request.status}
        </span>
      </div>

      <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3">
        <div className="text-sm font-semibold text-stone-950">
          {request.produce}
        </div>
        <div className="mt-1 text-sm text-stone-600">
          {request.quantity.toLocaleString("en-US")} {request.unit} -{" "}
          {request.distributor}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Location
          </dt>
          <dd className="mt-1 font-medium text-stone-900">{request.location}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            ETA
          </dt>
          <dd className="mt-1 font-medium text-stone-900">{request.routeEta}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Arrived
          </dt>
          <dd className="mt-1 font-mono text-stone-900">
            {formatUtcTime(request.timestamp)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            Priority
          </dt>
          <dd className="mt-1">
            <span
              className={cn(
                "rounded-md border px-2 py-1 text-xs font-bold",
                priorityClasses[request.priority],
              )}
            >
              {request.priority}
            </span>
          </dd>
        </div>
      </dl>

      {isPending ? (
        <Button
          className="mt-4 w-full"
          onClick={() => onAccept?.(request.id)}
        >
          Accept Request
        </Button>
      ) : (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
          Accepted at {formatUtcTime(request.acceptedAt ?? request.timestamp)}
        </div>
      )}
    </Card>
  );
}
