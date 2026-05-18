"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ProduceRequest, StreamEvent } from "@/types/request";
import {
  acceptRequest,
  appendIncomingRequest,
  generateIncomingRequest,
  getDashboardMetrics,
  getProduceVolumeData,
  getStatusBreakdown,
  getThroughputData,
  splitRequestsByStatus,
} from "@/services/mock-request-service";

const STREAM_INTERVAL_MS = 6500;

export function useRequestStream(initialRequests: ProduceRequest[]) {
  const [requests, setRequests] = useState(initialRequests);
  const [isStreaming, setIsStreaming] = useState(true);
  const [recentEvent, setRecentEvent] = useState<StreamEvent>({
    id: "initial-load",
    label: "Initial request queue loaded",
    timestamp: new Date().toISOString(),
    tone: "idle",
  });
  const sequenceRef = useRef(200);

  useEffect(() => {
    if (!isStreaming) {
      return;
    }

    const timer = window.setInterval(() => {
      sequenceRef.current += 1;
      const request = generateIncomingRequest(sequenceRef.current);

      setRequests((currentRequests) =>
        appendIncomingRequest(currentRequests, request),
      );
      setRecentEvent({
        id: `incoming-${request.id}`,
        label: `${request.produce} request from ${request.distributor}`,
        timestamp: request.timestamp,
        tone: "incoming",
      });
    }, STREAM_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isStreaming]);

  const handleAcceptRequest = useCallback(
    (requestId: number) => {
      const target = requests.find((request) => request.id === requestId);

      setRequests((currentRequests) => acceptRequest(currentRequests, requestId));

      if (target) {
        setRecentEvent({
          id: `accepted-${target.id}`,
          label: `${target.produce} accepted for ${target.distributor}`,
          timestamp: new Date().toISOString(),
          tone: "accepted",
        });
      }
    },
    [requests],
  );

  const resetDemo = useCallback(() => {
    sequenceRef.current = 200;
    setRequests(initialRequests);
    setRecentEvent({
      id: "reset",
      label: "Dashboard queue reset",
      timestamp: new Date().toISOString(),
      tone: "idle",
    });
  }, [initialRequests]);

  const columns = useMemo(() => splitRequestsByStatus(requests), [requests]);
  const metrics = useMemo(() => getDashboardMetrics(requests), [requests]);
  const statusData = useMemo(() => getStatusBreakdown(requests), [requests]);
  const produceData = useMemo(() => getProduceVolumeData(requests), [requests]);
  const throughputData = useMemo(() => getThroughputData(requests), [requests]);

  return {
    acceptedRequests: columns.accepted,
    handleAcceptRequest,
    isStreaming,
    metrics,
    pendingRequests: columns.pending,
    produceData,
    recentEvent,
    requests,
    resetDemo,
    setIsStreaming,
    statusData,
    throughputData,
  };
}
