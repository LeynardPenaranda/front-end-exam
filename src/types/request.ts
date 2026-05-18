export type RequestStatus = "Pending" | "Accepted";

export type RequestPriority = "Standard" | "Express" | "Cold Chain";

export type ProduceRequest = {
  id: number;
  farmerName: string;
  produce: string;
  quantity: number;
  unit: string;
  status: RequestStatus;
  timestamp: string;
  distributor: string;
  location: string;
  priority: RequestPriority;
  routeEta: string;
  value: number;
  acceptedAt?: string;
};

export type StreamEvent = {
  id: string;
  label: string;
  timestamp: string;
  tone: "incoming" | "accepted" | "idle";
};
