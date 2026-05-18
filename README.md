# AgriConnect – Technical Design & Architecture Specification

This repository contains the conceptual system architecture, frontend organization, mock-data structures, state management flow, real-time update simulation, and testing strategies for the **AgriConnect High-Concurrency Agricultural Supply Chain Platform**.

Per the examination instructions, this document outlines the complete dashboard design exercise without implementing actual backend services or production code.

---

# 1. System Core Architecture & Workflow

AgriConnect is designed to support high-concurrency agricultural logistics operations where distributors communicate directly with farmers through a real-time digital ecosystem.

## Farmer Listings

Farmers publish agricultural inventory into a centralized digital catalog. Product listings and media assets are optimized using CDN caching and Incremental Static Regeneration (ISR) for fast delivery and reduced server load.

### Technologies & Concepts

- CDN-optimized image delivery
- Incremental Static Regeneration (ISR)
- Cached product catalogs
- High-performance media rendering

---

## Concurrent Request Broker

Multiple distributors can simultaneously send purchase or logistics requests to farmers. The backend architecture ensures transactional integrity through:

- ACID-compliant database transactions
- Row-level locking
- Safe concurrent request handling
- Controlled state synchronization

### Example Transactional Strategy

```sql
SELECT * FROM requests
FOR UPDATE;
```

This ensures that multiple distributors cannot accidentally modify the same request simultaneously.

---

## Real-time Synchronization

Request state changes such as:

```text
Pending → Accepted
```

are instantly synchronized through:

- Redis Pub/Sub messaging
- WebSocket broadcasting
- Real-time dashboard updates
- No API polling or manual refreshes

This enables sub-second synchronization between all connected dashboard users.

---

## Next.js 15 Frontend

The dashboard frontend is built using:

- Next.js 15 App Router
- React-based component architecture
- Streaming-ready layouts
- Suspense-ready rendering strategy
- Kanban-style dashboard organization

The interface dynamically updates whenever request states change.

---

# 2. Project Structure & Frontend Architecture

## Directory Structure (Next.js 15 App Router)

The project structure follows the Next.js 15 App Router architecture pattern while maintaining clean separation between layouts, routes, reusable components, utilities, and testing modules.

```text
agriconnect-platform/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   └── farmer/
│       └── dashboard/
│           ├── layout.tsx
│           └── page.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── card.tsx
│   │
│   ├── dashboard-header.tsx
│   ├── kanban-board.tsx
│   ├── pending-column.tsx
│   ├── accepted-column.tsx
│   └── request-card.tsx
│
├── services/
│   └── mock-request-service.ts
│
├── utils/
│   └── mock-data-factory.ts
│
├── hooks/
│   └── use-request-stream.ts
│
└── tests/
    ├── unit/
    └── e2e/
```

---

## Frontend Architecture Responsibilities

### app/

Contains route-level pages and layout wrappers using the App Router convention.

### components/

Contains reusable UI and dashboard-specific components.

### services/

Contains mock request generators and simulated service logic.

### utils/

Contains helper utilities for timestamps, IDs, and mock data creation.

### hooks/

Contains streaming or event simulation hooks.

### tests/

Contains unit and end-to-end testing suites.

---

# 3. State Management & Data Fetching Strategy

The dashboard maintains a local collection of request items stored in component state.

The state can be managed using:

- React useState
- Server Actions
- TanStack Query
- React Suspense streaming patterns

The dashboard dynamically filters requests into separate columns based on their status values.

---

## Example State Filtering Logic

```text
Pending Column:
status === "Pending"

Accepted Column:
status === "Accepted"
```

This allows the UI to instantly re-render whenever request data changes.

---

## State Synchronization Flow

```text
Incoming Request
        ↓
Append to Local State
        ↓
Filter by Status
        ↓
Render Inside Correct Column
```

---

## Streaming Strategy

The dashboard may conceptually support:

- React Suspense streaming
- Live WebSocket subscriptions
- Server Actions for mutations
- Real-time state hydration

without requiring actual backend implementation.

---

# 4. Mock Data Design

## Request Object Structure

```json
{
  "id": "string | number",
  "farmerName": "string",
  "produce": "string",
  "quantity": "number",
  "status": "Pending | Accepted",
  "timestamp": "ISO 8601 string"
}
```

---

## Example Mock Data

```json
[
  {
    "id": 101,
    "farmerName": "Maria Santos",
    "produce": "Yellow Corn",
    "quantity": 25,
    "status": "Accepted",
    "timestamp": "2026-05-16T16:12:30Z"
  },
  {
    "id": 102,
    "farmerName": "Juan Dela Cruz",
    "produce": "Rice Premium",
    "quantity": 50,
    "status": "Pending",
    "timestamp": "2026-05-16T16:15:30Z"
  },
  {
    "id": 103,
    "farmerName": "Antonio Reyes",
    "produce": "Red Onions",
    "quantity": 10,
    "status": "Pending",
    "timestamp": "2026-05-16T16:18:02Z"
  }
]
```

---

# 5. UI Component Layout

The dashboard is divided into two primary Kanban-style workflow columns.

---

## Pending Column

Displays:

- Incoming requests
- Farmer name
- Produce information
- Quantity
- Arrival timestamp
- Accept action button

Each request card represents an unprocessed distributor request waiting for approval.

---

## Accepted Column

Displays:

- Processed requests
- Accepted status
- Completed request history

Cards automatically move here after acceptance.

---

# 6. Dashboard Wireframe Layout

```text
+-----------------------------------------------------------------------------------+
|                                AGRI-CONNECT DASHBOARD                             |
+---------------------------------------------------+-------------------------------+
| PENDING REQUESTS                                  | ACCEPTED REQUESTS             |
+---------------------------------------------------+-------------------------------+
| [ Card #102 ]                                     | [ Card #101 ]                 |
| Farmer: Juan Dela Cruz                            | Farmer: Maria Santos          |
| Produce: Rice Premium (50 bags)                   | Produce: Yellow Corn (25 bags)|
| Time: 16:15:30                                    | Status: [ ✓ ACCEPTED ]        |
| Action: [ ACCEPT REQUEST ]                        |                               |
|                                                   |                               |
| [ Card #103 ]                                     |                               |
| Farmer: Antonio Reyes                             |                               |
| Produce: Red Onions (10 crates)                   |                               |
| Time: 16:18:02                                    |                               |
| Action: [ ACCEPT REQUEST ]                        |                               |
+---------------------------------------------------+-------------------------------+
| (Simulated Worker Thread: Appending real-time stream data dynamically...)        |
+-----------------------------------------------------------------------------------+
```

---

# 7. Status Update Logic

Each pending request includes an action button:

```text
Accept Request
```

When triggered:

1. The selected request status changes from:

```text
Pending → Accepted
```

2. The dashboard state updates instantly

3. The card automatically moves from:
   - Pending Column
   - to Accepted Column

This simulates a real-time workflow transition system.

---

## Example Update Flow

```text
User Clicks Accept Button
            ↓
Update Request Status
            ↓
Refresh Local State
            ↓
Move Card Across Columns
```

---

# 8. Simulated Notifications & Real-Time Events

To mimic WebSocket-based real-time activity without a backend:

- A timer mechanism such as `setInterval`
- Or a lightweight event listener

will periodically generate new mock requests.

---

## Simulated Event Flow

```text
Timer Trigger
      ↓
Generate Mock Request
      ↓
Append Request to State
      ↓
Render New Pending Card
```

---

## Simulated Real-time Features

The mock implementation conceptually reproduces:

- Redis Pub/Sub streams
- WebSocket push updates
- Real-time dashboard synchronization
- Automatic queue insertion

without requiring a live infrastructure.

---

# 9. Real-Time Testing Strategy

## Unit Testing Strategy

Unit tests verify the internal business logic of the dashboard.

---

## Coverage Areas

- Request status transition logic
- Card movement between columns
- Mock request generation
- State filtering functions
- Timestamp ordering
- Pending queue insertion logic

---

## Example Unit Test Cases

```text
✓ Should change request status from Pending to Accepted
✓ Should remove accepted card from Pending column
✓ Should insert accepted card into Accepted column
✓ Should generate new mock request successfully
✓ Should append new request at the top of Pending queue
```

---

# 10. End-to-End (E2E) Testing Strategy

E2E testing validates complete dashboard behavior using:

- Playwright
  or
- Cypress

---

## E2E Test Scenarios

### Initial Load Test

Verify:

- Initial mock requests display correctly
- Pending and Accepted columns render properly

---

### State Transition Test

Simulate:

```text
Click "Accept Request"
```

Verify:

- Card disappears from Pending column
- Card appears in Accepted column instantly

---

### Real-time Update Test

Simulate:

- Timer-triggered mock event
  or
- WebSocket push event

Verify:

- New request appears automatically
- Dashboard updates without refresh

---

# 11. Dashboard Verification Checklist

## Initial Rendering

```text
✓ Mock data loads correctly
✓ Pending requests display properly
✓ Accepted requests display properly
```

---

## State Update Verification

```text
✓ Clicking Accept Request updates status
✓ Card moves across columns instantly
✓ UI refresh occurs automatically
```

---

## Automatic Update Verification

```text
✓ Timer generates new mock request
✓ New request appears at top of pending queue
✓ Dashboard updates without manual reload
```

---

# 12. Conclusion

The AgriConnect dashboard architecture demonstrates a scalable, high-concurrency agricultural workflow platform using:

- Next.js 15 App Router
- Real-time synchronization concepts
- Kanban-based workflow management
- Mock state-driven UI architecture
- Simulated streaming updates
- Structured testing strategies

This conceptual dashboard exercise reproduces enterprise-grade real-time logistics coordination behavior without requiring actual backend implementation.
