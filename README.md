# Ecrypta — Secure Ephemeral Real-Time Chat App

![demo](/public/message.png)

Ecrypta is a security-first, real-time, ephemeral chat system designed for private one-on-one communication with strict access control, end-to-end encryption, and automatic data destruction.

Built with Next.js, Elysia, and Redis, Ecrypta demonstrates real-world backend engineering, event-driven architecture, and distributed system design principles used in production-grade systems .

All messages are encrypted on the client, delivered in real time, and irreversibly deleted after 10 minutes. The backend enforces a zero-trust security model, ensuring the server never accesses plaintext data.

---

## Tech Stack

* Next.js — Frontend, rendering, and UI state management
* Elysia — High-performance TypeScript backend
* Redis — In-memory real-time messaging and TTL-based lifecycle management
* Upstash Realtime — Serverless, low-latency Redis Pub/Sub
* End-to-End Encryption — Client-side message encryption
* Custom Elysia Middleware — Authentication, authorization, and room enforcement

---

## Core Features

### Security and Access Control

* Strict one-on-one private chat rooms
* Hard limit of two users per room
* Third users are blocked even with a valid room URL
* Multi-layer middleware authentication
* Token verification on every request and real-time event
* Zero plaintext exposure on the server

---

### Ephemeral Room Lifecycle

* Fixed 10-minute room lifetime
* Redis-native TTL as the single source of truth
* Automatic room and message deletion
* No database persistence
* No cron jobs or background schedulers

---

### Real-Time Countdown (Redis-Driven)

* Live countdown timer synchronized directly from Redis
* Server-trusted timing with no client-side manipulation
* Consistent real-time expiration view for all participants
* Automatic room destruction, Redis key cleanup, and client disconnection on expiry

---

### Real-Time Messaging

* True real-time message delivery
* Redis Pub/Sub for event-based communication
* Upstash Realtime for globally distributed access
* Messages streamed instantly without polling
* Optimized for low latency and high throughput

---

### End-to-End Encryption

* Messages encrypted on the client before transmission
* Backend processes encrypted payloads only
* No decryption logic exists on the server
* Zero-trust backend design

---

### Backend Architecture

* Event-driven, high-performance backend design
* Custom middleware enforces authentication, authorization, and room limits
* Clean separation of security, transport, and business logic
* Designed for horizontal scalability

---

### Frontend

* Responsive and minimal UI built with Next.js
* Real-time UI updates
* Secure session handling
* Optimized rendering for chat workloads

---

## How It Works

1. A user creates a private chat room, generating a unique room ID
2. Backend middleware authenticates and authorizes the request
3. The room is locked after exactly two users join
4. Messages are encrypted on the client side
5. Encrypted messages are published via Redis Pub/Sub
6. Upstash Realtime streams messages instantly to participants
7. A Redis TTL of 10 minutes controls the room lifecycle
8. When the TTL expires, the room and all messages are automatically destroyed
9. The server never accesses plaintext messages

```
User A <--> Encrypted Payload <--> User B
             |             |
             |---- Redis ----|
Middleware enforces authentication, TTL, and two-user limit
```

---

## Why This Project Matters

* Demonstrates real-time system design
* Shows correct Redis usage with Pub/Sub and TTL
* Highlights security-first backend architecture
* Avoids common anti-patterns such as polling, cron cleanup, and database persistence
* Strong signal for backend, distributed systems, and SDE-2 level roles

---

## USER - INTERFACE

![demo](/public/otherside.png)

## END USER - INTERFACE

![demo](/public/you.png)
