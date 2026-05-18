import type { DashboardMetrics } from "@/services/mock-request-service";
import type { StreamEvent } from "@/types/request";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type DashboardHeaderProps = {
  isStreaming: boolean;
  metrics: DashboardMetrics;
  onReset: () => void;
  onToggleStream: () => void;
  recentEvent: StreamEvent;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

function formatEventTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "amber" | "blue" | "stone";
}) {
  const toneClasses = {
    amber: "border-amber-200 bg-amber-50 text-amber-950",
    blue: "border-sky-200 bg-sky-50 text-sky-950",
    green: "border-emerald-200 bg-emerald-50 text-emerald-950",
    stone: "border-stone-200 bg-stone-50 text-stone-950",
  };

  return (
    <div className={cn("rounded-lg border p-4", toneClasses[tone])}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-bold leading-none">
        {value}
      </div>
    </div>
  );
}

export function DashboardHeader({
  isStreaming,
  metrics,
  onReset,
  onToggleStream,
  recentEvent,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Farmer Operations
            </p>
            <h1 className="mt-1 text-3xl font-bold text-stone-950">
              AgriConnect Dashboard
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
              <span
                className={cn(
                  "mr-2 inline-block h-2.5 w-2.5 rounded-full",
                  isStreaming ? "bg-emerald-500" : "bg-stone-400",
                )}
              />
              Stream {isStreaming ? "active" : "paused"} ·{" "}
              {formatEventTime(recentEvent.timestamp)}
            </div>
            <Button onClick={onToggleStream} variant="secondary">
              {isStreaming ? "Pause Stream" : "Resume Stream"}
            </Button>
            <Button onClick={onReset} variant="ghost">
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricTile
            label="Pending"
            tone="amber"
            value={String(metrics.pending).padStart(2, "0")}
          />
          <MetricTile
            label="Accepted"
            tone="green"
            value={String(metrics.accepted).padStart(2, "0")}
          />
          <MetricTile
            label="Acceptance"
            tone="blue"
            value={`${metrics.acceptanceRate}%`}
          />
          <MetricTile
            label="Volume"
            tone="stone"
            value={metrics.totalQuantity.toLocaleString("en-US")}
          />
          <MetricTile
            label="Value"
            tone="green"
            value={currencyFormatter.format(metrics.totalValue)}
          />
        </div>

        <div
          className={cn(
            "rounded-lg border px-4 py-3 text-sm font-medium",
            recentEvent.tone === "accepted" &&
              "border-emerald-200 bg-emerald-50 text-emerald-950",
            recentEvent.tone === "incoming" &&
              "border-amber-200 bg-amber-50 text-amber-950",
            recentEvent.tone === "idle" &&
              "border-stone-200 bg-stone-50 text-stone-800",
          )}
        >
          {recentEvent.label}
        </div>
      </div>
    </header>
  );
}
