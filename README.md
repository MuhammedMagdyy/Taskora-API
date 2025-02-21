# Taskora

![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639.svg?logo=nginx&logoColor=white)
![Microsoft Azure](https://custom-icon-badges.demolab.com/badge/Microsoft%20Azure-0089D6?logo=msazure&logoColor=white)

Taskora API built using Node.js, Express.js, TypeScript, Prisma ORM, and Redis. It allows users to create, read, update, and delete projects & tasks and follows the RESTful API design principles.

## Table of Contents

- [Getting started](#getting-started)
- [Prerequisites](#prerequisites)
- [Schema](#schema)
- [Installing](#installing)
- [API Documentation](#api-documentation-swagger)

### Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- Download and install [Nodejs](https://nodejs.org/en)
- Download and install [MySQL](https://www.mysql.com/downloads/) using [Docker](https://www.docker.com/) from [Docker Hub](https://hub.docker.com/_/mysql)
- A web browser (e.g. [Google Chrome](https://www.google.com/intl/ar_eg/chrome/))
- A text editor (e.g. `recommended` [Visual Studio Code](https://code.visualstudio.com/download))
- A platform for testing APIs like [Postman](https://www.postman.com/downloads/)
- Database engine (e.g [DBeaver](https://dbeaver.io/download/))

### Schema

![Schema](https://github.com/user-attachments/assets/8a01c4be-3c6e-47e4-8a6a-52ded2f661f5)

### Installing

To set up this project locally, follow these steps:

1. Clone the repository to your local machine:

```
  https://github.com/MuhammedMagdyy/Taskora-API.git
```

2. Change the project's directory

```
  cd Taskora-API
```

3. Install required [packages](https://github.com/MuhammedMagdyy/Taskora-API/blob/main/package.json) using `npm install`

4. Rename the `.env.example` file to `.env`, then add your [environment variables](https://github.com/MuhammedMagdyy/Taskora-API/blob/main/.env.example)

5. Run the following commands in order:

```
  npm run db:migrate
  npm run db:generate
  npm run db:push
```

6. Start the application:
   - Production: `npm start`
   - Development: `npm run dev`

### API Documentation [Swagger](https://swagger.io/)

After setting up the project locally, you can view the Swagger API Documentation to learn how to use the API.

```
  http://localhost:{port}/api-docs
```
