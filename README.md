# Taskora 🚀

![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639.svg?logo=nginx&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)
![Microsoft Azure](https://custom-icon-badges.demolab.com/badge/Microsoft%20Azure-0089D6?logo=msazure&logoColor=white)

Taskora API built using **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **Redis**. It allows users to **create**, **read**, **update**, and **delete** projects & tasks while following RESTful API design principles.

🌐 **[Frontend Repository](https://github.com/amatter23/Taskora)** | 🚀 **[Live Demo](https://Taskora.live)**

---

**[Alert ⚠️]** I have created a [Node.js script](https://github.com/MuhammedMagdyy/taskora-user-tracker) to monitor new user registrations passionately and celebrate every new member of the Taskora community.

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
- 🌐 **Deployed on Azure** with **Nginx** as Reverse Proxy.
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

[Swagger](https://swagger.io/) UI is available at `/api-docs` to explore the API endpoints

```
Server URL could be:
  - http://localhost:3000/api-docs (development)
  - https://backend.taskora.live/api-docs (staging)
  - https://api.taskora.live/api-docs (production)
```

---

## 🗄️ Database Schema

![Schema](https://github.com/user-attachments/assets/d48b49fb-5066-4f64-a655-635a4019539b)

---

## 🛠️ Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing.

### ⚡ Prerequisites

- 🟢 [Node.js](https://nodejs.org/en)
- 🐬 [MySQL](https://www.mysql.com/downloads/) using 🐳 [Docker](https://www.docker.com/) from [Docker Hub](https://hub.docker.com/_/mysql)
- 🌐 A web browser like [Google Chrome](https://www.google.com/intl/ar_eg/chrome/)
- 💻 A text editor (_recommended_: [Visual Studio Code](https://code.visualstudio.com/download))
- 🧪 API Testing Tool — [Postman](https://www.postman.com/downloads/)
- 🐘 Database Engine — [DBeaver](https://dbeaver.io/download/)

---

## 📦 Installing

1. **Clone the repository** 🔗:

   ```bash
   git clone https://github.com/MuhammedMagdyy/Taskora-API.git
   ```

2. **Navigate to the project directory** 📁:

   ```bash
   cd Taskora-API
   ```

3. **Install required packages** 📦:

   ```bash
   npm install
   ```

4. **Configure Environment Variables** 🛡️:

   - Rename `.env.example` ➔ `.env`
   - Add your environment variables based on [`.env.example`](https://github.com/MuhammedMagdyy/Taskora-API/blob/main/.env.example)

5. **Run Database Migrations** 🗄️:

   ```bash
   npm run db:migrate
   npm run db:generate
   npm run db:push
   ```

6. **Start the Application** ⚡:
   - **Production** 🏆: `npm start`
   - **Development** 🧑‍💻: `npm run dev`

---

## 🤝 Contributing

💡 **Found a bug?** Have an idea for a new feature? Contributions are welcome!

1. **Fork the repository** 🚀
2. **Create a new branch** `git checkout -b feature/awesome-feature` 🌟
3. **Commit your changes** `git commit -m 'Add some awesome feature'` 🔥
4. **Push to your branch** `git push origin feature/awesome-feature` 🚀
5. **Create a Pull Request** 🎉

---

🚀 **Happy Coding!**
