# 🔒 Ecrypta – Secure Ephemeral Chat App

A **fully encrypted, real-time chat application** with **private, self-destructing chat rooms**, built using **Elysia**, **Next.js**, and **Redis**.

Every chat is **private**, **end-to-end encrypted**, and **automatically deleted after 10 minutes**, ensuring **complete privacy**. Custom middleware ensures that **only authorized users** can access chat rooms, with multiple token verifications for enhanced security.

---

## 🛠️ Tech Stack

- **[Next.js](https://nextjs.org/)** – Frontend & server-side rendering
- **[Elysia](https://elysiajs.com/)** – High-performance TypeScript backend
- **[Redis](https://redis.io/)** – Real-time messaging with Pub/Sub
- **WebSockets** – Instant communication
- **End-to-End Encryption** – Fully private chats
- **Elysia Middleware** – Authentication & authorization for every request

---

## ⚡ Features

-  **Private one-on-one chat rooms**
-  **Ephemeral chats** – messages and rooms auto-delete after 10 minutes
-  **Real-time messaging** using Redis Pub/Sub
-  **End-to-end encryption** for complete privacy
-  **User authentication** – all requests verified with secure tokens
-  **Secure middleware** – multiple verification layers ensure only authorized access
-  **Fast & scalable backend** with Elysia
-  **Responsive UI** with Next.js

---

## 🚀 How It Works

1. User creates a **private chat room** → a unique room ID is generated
2. Middleware **verifies the user token** before granting access
3. Messages are **encrypted on the client side**
4. Messages are sent through **Redis Pub/Sub** for real-time delivery
5. **Room self-destructs after 10 minutes** → all messages are deleted from Redis
6. Server **never sees plaintext messages**

```text
User A <--> Encrypted Chat <--> User B
          \           /
           \-- Redis --/
Middleware verifies tokens for every request
