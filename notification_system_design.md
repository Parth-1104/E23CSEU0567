# Stage 1: Notification System Design

## 1. Overview
This specification outlines the architectural blueprint for the AffordMed Notification Platform. The system prioritizes **message durability**, **low-latency synchronization**, and **operational observability**. By integrating a hybrid real-time delivery strategy and a strict logging narrative, this design ensures a production-grade experience for high-concurrency environments.

---

## 2. Core Platform Actions
The architecture supports the following high-level operations to manage the notification lifecycle:
* **Synchronous State Retrieval:** RESTful endpoints for historical data fetching with server-side pagination.
* **Atomic State Updates:** Precise control over read/unread statuses to maintain multi-device synchronization.
* **Real-time Push Orchestration:** An event-driven layer for instantaneous delivery via persistent connections.
* **System Telemetry:** Full-lifecycle logging (Dispatch → Delivery → Interaction) utilizing the mandatory custom middleware.

---

## 3. REST API Contract

### Global Request Constraints
* **Base URL:** `/api/v1/notifications`
* **Auth Strategy:** `Authorization: Bearer <access_token>`
* **Primary Headers:** * `Content-Type: application/json`
    * `X-Request-ID`: A unique UUID for distributed tracing and log correlation.

### API Endpoints

| Action | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Fetch Feed** | `GET` | `/` | Returns a paginated list of notifications for the authenticated user. |
| **Mark Read** | `PATCH` | `/:id/read` | Updates a specific notification's status to 'read'. |
| **Clear All** | `POST` | `/read-all` | Atomic bulk update to clear all unread flags for the user. |
| **Badge Sync** | `GET` | `/count` | Returns only the integer count of unread items for UI badge rendering. |

#### Sample Request: Fetching the Feed
`GET /api/v1/notifications?page=1&limit=20`

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "id": "30c9b20c-83f3-4469-b421-5b4ca3012cc6",
        "title": "Unusual Login Detected",
        "message": "A new login was detected from Lucknow, IN at 12:44 PM.",
        "category": "alert",
        "isRead": false,
        "createdAt": "2026-05-11T12:44:00Z",
        "metadata": { "ip": "192.168.1.1", "browser": "Chrome" }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 87
    }
  }
}


## JSON SCHEMA

{
  "$schema": "[http://json-schema.org/draft-07/schema#](http://json-schema.org/draft-07/schema#)",
  "type": "object",
  "required": ["id", "title", "message", "isRead", "category"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "title": { "type": "string", "minLength": 1, "maxLength": 100 },
    "message": { "type": "string" },
    "category": { "enum": ["transactional", "marketing", "alert", "system"] },
    "isRead": { "type": "boolean", "default": false },
    "createdAt": { "type": "string", "format": "date-time" },
    "metadata": { "type": "object" }
  }
}



## 5. Real-Time Mechanism: Hybrid Delivery Strategy

To handle high concurrency (200+ users), the platform utilizes a Hybrid Real-Time Strategy:

Primary Transport: Uses WebSockets (Socket.io) for low-latency, full-duplex communication.

Auth Handshake: Token validation occurs during the connection event using the access_token provided in the handshake query/headers.

Room Isolation: Users are joined to private virtual "rooms" identified by their unique UUID to prevent cross-talk and ensure data privacy.

Reliability Fallback: Supports Server-Sent Events (SSE) for environments where persistent WebSocket connections are restricted by proxy or firewall settings.

Guaranteed Delivery (ACK Protocol): The server tracks "Sent" vs "Delivered" states. Critical alerts require a client-side acknowledgement. If no ACK is received within a 5-second timeout period, the notification is queued for retry upon the next socket reconnection.

Event Debouncing & Batching: To preserve the UI thread during "Notification Storms," the frontend implements a 500ms debounce window, batching multiple rapid-fire updates into a single UI transition.

Observability Integration: Every stage of the pipeline (Handshake, Emission, and ACK) is logged via the custom Logging Middleware (backend stack, middleware package). This replaces all console.log statements with production-grade telemetry for real-time monitoring.
