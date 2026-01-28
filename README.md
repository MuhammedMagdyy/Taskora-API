# Taskora 🚀

![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff) ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff) ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white) ![BullMQ](https://img.shields.io/badge/BullMQ-FF3D00.svg?logo=bull&logoColor=white) ![Nginx](https://img.shields.io/badge/Nginx-009639.svg?logo=nginx&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-<SWAGGER_COLOR>?logo=swagger&logoColor=white) ![Microsoft Azure](https://custom-icon-badges.demolab.com/badge/Microsoft%20Azure-0089D6?logo=msazure&logoColor=white)

Taskora API built using **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **Redis**. It allows users to **create**, **read**, **update**, and **delete** projects & tasks while following RESTful API design principles.

🌐 **[Frontend Repository](https://github.com/amatter23/Taskora)** | 🚀 **[Live Preview](https://Taskora.live)**

---

**[⚠️ Alerts]**

> Due to the low traffic and high costs, I decided to discontinue hosting and the domain. 💔

> Taskora serves `+450` active users! 🎉

> I have created a [Node.js script](https://github.com/MuhammedMagdyy/taskora-user-tracker) to monitor new user registrations passionately and celebrate every new member of the Taskora community by sending me an email notification. 🥳

---

## 📚 Table of Contents

- [🌟 Features](#-features)
- [📖 API Documentation](#-api-documentation)
  - [🚀 Postman](#-postman)
  - [📚 Swagger](#-swagger)
- [🗄️ Database Schema](#️-database-schema)
- [🛠️ Getting Started](#️-getting-started)
  - [⚡ Prerequisites](#-prerequisites)
  - [📦 Installing](#-installing)
    - [🐳 Docker](#-docker)
- [🤝 Contributing](#-contributing)

---

## 🌟Features

- 🔒 **Authentication & Authorization** (JWT & OAuth2 with Google & GitHub).
- ✅ **CRUD Operations** for Projects, Tasks, and Tags.
- 📅 **Task Management** with Tags & Status.
- 📊 **User Profile** Handling.
- 🔄 **Token Refresh** & Password Reset via Email.
- 📥 **Redis Caching** for Improved Performance.
- 📧 **Email Notifications** for Verification & Password Reset.
- 🕒 **Background Jobs** using BullMQ for sending emails asynchronously.
- 🌐 [Previously] **Deployed on Azure**, [Currently] running on a **VPS** with **Nginx** as Reverse Proxy.
- 🔄️ **CI/CD** using GitHub Actions.
- 🌙 **Ramadan Challenge** A special feature for Ramadan, allowing users to set daily goals and track their progress.
- 🥳 **Eid Competition** A fun competition feature for Eid, where users can participate in challenges and win prizes.
- 📝 **[Todo](https://github.com/MuhammedMagdyy/Taskora-API/blob/main/TODO.md)** – 🚀 Explore finished & upcoming features, enhancements, and what's next for Taskora!

---

## 📖 API Documentation

### 🚀 Postman

Easily test and interact with the API documentation using Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/10107969/2sAYdZuZDa)

---

### 📚 Swagger

[Swagger](https://swagger.io/) UI is available at `/api-docs` to explore the API endpoints and their details.

---

## 🗄️ Database Schema

![Schema](https://github.com/user-attachments/assets/d48b49fb-5066-4f64-a655-635a4019539b)

---

## 🛠️ Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing.

### ⚡ Prerequisites

Before you begin, ensure you have met the following requirements:

- 🐳 [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- 🌐 Web browser like [Google Chrome](https://www.google.com/intl/ar_eg/chrome/)
- 💻 Text editor (_recommended_: [Visual Studio Code](https://code.visualstudio.com/download))
- 🧪 API Testing Tool — [Postman](https://www.postman.com/downloads/)
- 🐘 Database Engine — [DBeaver](https://dbeaver.io/download/)

---

## 📦 Installing

### 🐳 Docker

1. 🔗 **Clone the repository** :

   ```bash
   git clone https://github.com/MuhammedMagdyy/Taskora-API.git
   ```

2. 📁 **Navigate to the project directory** :

   ```bash
   cd Taskora-API
   ```

3. 🛡️ Configure Environment Variables :

   ```bash
   # Update the `.env` file with your environment variables.
   cp .env.example .env
   ```

4. 🚀 Build and start the Docker containers :

   ```bash
   docker compose up -d --build
   ```

5. 🖥️ Useful commands :

   ```bash
   # Start containers
   docker compose up -d

   # Follow logs
   docker compose logs -f app

   # Stop, and remove containers
   docker compose down

   # Stop, remove containers, and volumes
   docker compose down -v
   ```

---

## 🤝 Contributing

💡 Found a **bug**? Have an **idea** for a new feature? Contributions are welcome!

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute to this project.

---

🚀 **Happy Coding!**
