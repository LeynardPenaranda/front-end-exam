"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  ProduceVolumeDatum,
  StatusDatum,
  ThroughputDatum,
} from "@/services/mock-request-service";

type RequestAnalyticsProps = {
  produceData: ProduceVolumeDatum[];
  statusData: StatusDatum[];
  throughputData: ThroughputDatum[];
};

const statusColors = {
  Accepted: "#047857",
  Pending: "#d97706",
};

function ChartPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center rounded-md bg-stone-50">
      <div className="h-24 w-3/4 animate-pulse rounded-md bg-stone-200" />
    </div>
  );
}

export function RequestAnalytics({
  produceData,
  statusData,
  throughputData,
}: RequestAnalyticsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
      <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-950">
              Request Throughput
            </h2>
            <p className="text-sm text-stone-500">Latest queue events</p>
          </div>
        </div>
        <div className="h-64">
          {mounted ? (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={throughputData} margin={{ left: -18, right: 8 }}>
                <defs>
                  <linearGradient id="pendingFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="acceptedFill"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  minTickGap={16}
                  stroke="#78716c"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#78716c"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderColor: "#d6d3d1",
                    borderRadius: 8,
                    boxShadow: "0 12px 32px rgba(28, 25, 23, 0.12)",
                  }}
                />
                <Area
                  dataKey="Pending"
                  fill="url(#pendingFill)"
                  isAnimationActive={false}
                  stroke="#d97706"
                  strokeWidth={2}
                  type="monotone"
                />
                <Area
                  dataKey="Accepted"
                  fill="url(#acceptedFill)"
                  isAnimationActive={false}
                  stroke="#047857"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ChartPlaceholder />
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60">
          <h2 className="text-lg font-bold text-stone-950">Produce Volume</h2>
          <div className="mt-4 h-56">
            {mounted ? (
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={produceData} margin={{ left: -18, right: 8 }}>
                  <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="produce"
                    interval={0}
                    stroke="#78716c"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value: string) => value.split(" ")[0]}
                  />
                  <YAxis stroke="#78716c" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderColor: "#d6d3d1",
                      borderRadius: 8,
                      boxShadow: "0 12px 32px rgba(28, 25, 23, 0.12)",
                    }}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="#2563eb"
                    isAnimationActive={false}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ChartPlaceholder />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/60">
          <h2 className="text-lg font-bold text-stone-950">Status Mix</h2>
          <div className="mt-4 h-56">
            {mounted ? (
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={statusData}
                    dataKey="value"
                    innerRadius={52}
                    isAnimationActive={false}
                    nameKey="name"
                    outerRadius={82}
                    paddingAngle={4}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        fill={statusColors[entry.name]}
                        key={`status-${entry.name}`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderColor: "#d6d3d1",
                      borderRadius: 8,
                      boxShadow: "0 12px 32px rgba(28, 25, 23, 0.12)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ChartPlaceholder />
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {statusData.map((entry) => (
              <div
                className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2"
                key={entry.name}
              >
                <span
                  className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: statusColors[entry.name] }}
                />
                <span className="font-semibold text-stone-800">
                  {entry.name}
                </span>
                <span className="ml-2 font-mono text-stone-500">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
