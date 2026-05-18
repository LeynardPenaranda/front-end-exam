# AgriConnect Platform

AgriConnect is a Next.js 15 dashboard for a high-concurrency agricultural supply chain workflow. It uses Tailwind CSS for the interface, Recharts for analytics, and local mock state to simulate real-time distributor requests moving through a farmer approval queue.

The app does not include backend services. Redis Pub/Sub, WebSockets, row locking, and database transactions are represented conceptually through a client-side stream simulation and typed mock service layer.

## Tech Stack

- Next.js 15 App Router
- React 19
- Tailwind CSS 4
- Recharts
- TypeScript
- ESLint

## Routes

- `/` redirects to `/farmer/dashboard`
- `/farmer/dashboard` renders the AgriConnect farmer operations dashboard

## Implemented Features

- Dashboard header with request metrics
- Pending and accepted Kanban workflow columns
- Accept Request action that moves a request from Pending to Accepted
- Simulated real-time request stream using `setInterval`
- Mock request generation and queue insertion
- Recharts area, bar, and pie visualizations
- Typed request model and reusable data helpers
- Responsive layout built with Tailwind CSS

## Project Structure

```text
agriconnect-platform/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── farmer/
│   │       └── dashboard/
│   │           ├── layout.tsx
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── accepted-column.tsx
│   │   ├── dashboard-client.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── kanban-board.tsx
│   │   ├── pending-column.tsx
│   │   ├── request-analytics.tsx
│   │   └── request-card.tsx
│   │
│   ├── hooks/
│   │   └── use-request-stream.ts
│   │
│   ├── services/
│   │   └── mock-request-service.ts
│   │
│   ├── types/
│   │   └── request.ts
│   │
│   └── utils/
│       ├── cn.ts
│       ├── date-format.ts
│       └── mock-data-factory.ts
│
├── package.json
├── package-lock.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── tsconfig.json
```

## File Responsibilities

### App Router

- `src/app/layout.tsx` defines global metadata and the root HTML shell.
- `src/app/page.tsx` redirects the root route to `/farmer/dashboard`.
- `src/app/farmer/dashboard/page.tsx` loads initial mock requests and renders the dashboard.
- `src/app/farmer/dashboard/layout.tsx` defines route-level dashboard metadata.
- `src/app/globals.css` configures Tailwind, theme tokens, and global font fallbacks.

### Components

- `dashboard-client.tsx` is the main interactive dashboard container.
- `dashboard-header.tsx` renders stream status, actions, and summary metrics.
- `request-analytics.tsx` renders Recharts visualizations.
- `kanban-board.tsx` composes the Pending and Accepted columns.
- `pending-column.tsx` renders requests waiting for approval.
- `accepted-column.tsx` renders completed request history.
- `request-card.tsx` renders request details and the Accept Request action.
- `components/ui/button.tsx` and `components/ui/card.tsx` provide small reusable UI primitives.

### Data And State

- `types/request.ts` defines request, status, priority, and stream event types.
- `utils/mock-data-factory.ts` owns seed data, mock request generation, status transition helpers, and sorting.
- `services/mock-request-service.ts` exposes dashboard-facing helpers for metrics, filtering, chart data, and request updates.
- `hooks/use-request-stream.ts` manages local dashboard state, the simulated live stream, accept actions, and derived analytics.
- `utils/date-format.ts` formats ISO timestamps deterministically for SSR and client hydration.
- `utils/cn.ts` joins conditional Tailwind class names.

## State Flow

```text
Initial mock data
      |
      v
useRequestStream local state
      |
      +--> Pending and Accepted filters
      +--> Dashboard metrics
      +--> Recharts datasets
      |
      v
Dashboard UI
```

When a user clicks `Accept Request`, the selected request changes from `Pending` to `Accepted`, the local state is updated, and the card is rendered in the Accepted column.

## Simulated Real-Time Flow

```text
setInterval timer
      |
      v
generateIncomingRequest()
      |
      v
appendIncomingRequest()
      |
      v
Pending column and analytics update
```

This simulates WebSocket-style push updates without requiring a backend.

## Mock Request Shape

```ts
type ProduceRequest = {
  id: number;
  farmerName: string;
  produce: string;
  quantity: number;
  unit: string;
  status: "Pending" | "Accepted";
  timestamp: string;
  distributor: string;
  location: string;
  priority: "Standard" | "Express" | "Cold Chain";
  routeEta: string;
  value: number;
  acceptedAt?: string;
};
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the dashboard:

```text
http://localhost:3000/farmer/dashboard
```

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands were used to verify the implementation.
