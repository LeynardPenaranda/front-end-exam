import type { ProduceRequest, RequestStatus } from "@/types/request";
import {
  createMockRequest,
  initialRequests,
  markRequestAccepted,
  sortByNewestActivity,
} from "@/utils/mock-data-factory";
import { formatUtcHourMinute } from "@/utils/date-format";

export type DashboardMetrics = {
  total: number;
  pending: number;
  accepted: number;
  acceptanceRate: number;
  totalQuantity: number;
  totalValue: number;
  expressCount: number;
};

export type StatusDatum = {
  name: RequestStatus;
  value: number;
};

export type ProduceVolumeDatum = {
  produce: string;
  quantity: number;
  value: number;
};

export type ThroughputDatum = {
  time: string;
  Pending: number;
  Accepted: number;
};

export function getInitialRequests() {
  return sortByNewestActivity(initialRequests);
}

export function generateIncomingRequest(sequence: number) {
  return createMockRequest(sequence);
}

export function acceptRequest(requests: ProduceRequest[], requestId: number) {
  return sortByNewestActivity(markRequestAccepted(requests, requestId));
}

export function appendIncomingRequest(
  requests: ProduceRequest[],
  request: ProduceRequest,
) {
  return sortByNewestActivity([request, ...requests]).slice(0, 24);
}

export function splitRequestsByStatus(requests: ProduceRequest[]) {
  return {
    pending: sortByNewestActivity(
      requests.filter((request) => request.status === "Pending"),
    ),
    accepted: sortByNewestActivity(
      requests.filter((request) => request.status === "Accepted"),
    ),
  };
}

export function getDashboardMetrics(requests: ProduceRequest[]): DashboardMetrics {
  const pending = requests.filter((request) => request.status === "Pending").length;
  const accepted = requests.filter(
    (request) => request.status === "Accepted",
  ).length;
  const totalQuantity = requests.reduce(
    (sum, request) => sum + request.quantity,
    0,
  );
  const totalValue = requests.reduce((sum, request) => sum + request.value, 0);
  const expressCount = requests.filter(
    (request) => request.priority !== "Standard",
  ).length;

  return {
    total: requests.length,
    pending,
    accepted,
    acceptanceRate:
      requests.length === 0 ? 0 : Math.round((accepted / requests.length) * 100),
    totalQuantity,
    totalValue,
    expressCount,
  };
}

export function getStatusBreakdown(requests: ProduceRequest[]): StatusDatum[] {
  const { pending, accepted } = splitRequestsByStatus(requests);

  return [
    { name: "Pending", value: pending.length },
    { name: "Accepted", value: accepted.length },
  ];
}

export function getProduceVolumeData(
  requests: ProduceRequest[],
): ProduceVolumeDatum[] {
  const grouped = requests.reduce<Record<string, ProduceVolumeDatum>>(
    (accumulator, request) => {
      const existing = accumulator[request.produce] ?? {
        produce: request.produce,
        quantity: 0,
        value: 0,
      };

      accumulator[request.produce] = {
        ...existing,
        quantity: existing.quantity + request.quantity,
        value: existing.value + request.value,
      };

      return accumulator;
    },
    {},
  );

  return Object.values(grouped)
    .sort((left, right) => right.quantity - left.quantity)
    .slice(0, 6);
}

export function getThroughputData(requests: ProduceRequest[]): ThroughputDatum[] {
  const recent = sortByNewestActivity(requests).slice(0, 8).reverse();

  return recent.map((request) => {
    return {
      time: formatUtcHourMinute(request.acceptedAt ?? request.timestamp),
      Pending: request.status === "Pending" ? 1 : 0,
      Accepted: request.status === "Accepted" ? 1 : 0,
    };
  });
}
