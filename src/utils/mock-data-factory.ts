import type { ProduceRequest, RequestPriority } from "@/types/request";

const farmers = [
  "Elena Mercado",
  "Rafael Lim",
  "Nora Villanueva",
  "Benito Cruz",
  "Liza Mendoza",
  "Carlo Aquino",
  "Isabel Tan",
  "Ramon Flores",
];

const distributors = [
  "Northstar Foods",
  "HarvestLink Co-op",
  "Metro Grain Exchange",
  "FreshRoute Logistics",
  "Cedar Cold Chain",
  "Bay Market Group",
];

const locations = [
  "Nueva Ecija",
  "Bulacan",
  "Batangas",
  "Pangasinan",
  "Laguna",
  "Tarlac",
];

const produceCatalog = [
  { produce: "Rice Premium", unit: "bags", quantity: 50, value: 61500 },
  { produce: "Yellow Corn", unit: "bags", quantity: 25, value: 24250 },
  { produce: "Red Onions", unit: "crates", quantity: 10, value: 18800 },
  { produce: "Cavendish Bananas", unit: "boxes", quantity: 34, value: 32130 },
  { produce: "Carabao Mangoes", unit: "crates", quantity: 18, value: 27400 },
  { produce: "Green Coffee Beans", unit: "sacks", quantity: 22, value: 70400 },
  { produce: "Tomatoes", unit: "crates", quantity: 28, value: 19600 },
  { produce: "Sweet Potatoes", unit: "sacks", quantity: 31, value: 17360 },
];

const priorities: RequestPriority[] = ["Standard", "Express", "Cold Chain"];

export const initialRequests: ProduceRequest[] = [
  {
    id: 101,
    farmerName: "Maria Santos",
    produce: "Yellow Corn",
    quantity: 25,
    unit: "bags",
    status: "Accepted",
    timestamp: "2026-05-16T16:12:30Z",
    acceptedAt: "2026-05-16T16:14:10Z",
    distributor: "Metro Grain Exchange",
    location: "Nueva Ecija",
    priority: "Standard",
    routeEta: "2h 15m",
    value: 24250,
  },
  {
    id: 102,
    farmerName: "Juan Dela Cruz",
    produce: "Rice Premium",
    quantity: 50,
    unit: "bags",
    status: "Pending",
    timestamp: "2026-05-16T16:15:30Z",
    distributor: "Northstar Foods",
    location: "Bulacan",
    priority: "Express",
    routeEta: "1h 40m",
    value: 61500,
  },
  {
    id: 103,
    farmerName: "Antonio Reyes",
    produce: "Red Onions",
    quantity: 10,
    unit: "crates",
    status: "Pending",
    timestamp: "2026-05-16T16:18:02Z",
    distributor: "FreshRoute Logistics",
    location: "Pangasinan",
    priority: "Cold Chain",
    routeEta: "3h 05m",
    value: 18800,
  },
  {
    id: 104,
    farmerName: "Lourdes Garcia",
    produce: "Carabao Mangoes",
    quantity: 18,
    unit: "crates",
    status: "Accepted",
    timestamp: "2026-05-16T16:22:48Z",
    acceptedAt: "2026-05-16T16:25:11Z",
    distributor: "Bay Market Group",
    location: "Laguna",
    priority: "Express",
    routeEta: "2h 45m",
    value: 27400,
  },
];

export function createMockRequest(sequence: number, now = new Date()): ProduceRequest {
  const catalogItem = produceCatalog[sequence % produceCatalog.length];
  const quantityOffset = (sequence % 4) * 3;

  return {
    id: sequence,
    farmerName: farmers[sequence % farmers.length],
    produce: catalogItem.produce,
    quantity: catalogItem.quantity + quantityOffset,
    unit: catalogItem.unit,
    status: "Pending",
    timestamp: now.toISOString(),
    distributor: distributors[sequence % distributors.length],
    location: locations[sequence % locations.length],
    priority: priorities[sequence % priorities.length],
    routeEta: `${1 + (sequence % 4)}h ${String((sequence * 7) % 60).padStart(
      2,
      "0",
    )}m`,
    value: catalogItem.value + quantityOffset * 720,
  };
}

export function markRequestAccepted(
  requests: ProduceRequest[],
  requestId: number,
  acceptedAt = new Date().toISOString(),
) {
  return requests.map((request) =>
    request.id === requestId
      ? { ...request, status: "Accepted" as const, acceptedAt }
      : request,
  );
}

export function sortByNewestActivity(requests: ProduceRequest[]) {
  return [...requests].sort((left, right) => {
    const leftTime = new Date(left.acceptedAt ?? left.timestamp).getTime();
    const rightTime = new Date(right.acceptedAt ?? right.timestamp).getTime();

    return rightTime - leftTime;
  });
}
