# Task Management App

## Live Demo
[Task Management App](https://nextjs-assignment-flame.vercel.app/)

## GitHub Repository
[GitHub - SagarKapoorin](https://github.com/SagarKapoorin/nextjs-assignment)

## Author
Sagar Kapoor

---

## Overview
This is a Task Management application built using **Next.js (latest version)** for both frontend and backend, with **MongoDB** for data persistence and **Redis** for optimization. The app allows users to:
- Create, read, update, and delete tasks (CRUD operations).
- Mark tasks as complete or incomplete.
- Store task details such as title, description, and due date.
- Handle errors and loading states efficiently.

## Tech Stack
- **Frontend:** Next.js (App Router & Server Actions)
- **Backend:** Next.js Server Actions
- **Database:** MongoDB
- **Caching:** Redis (for optimization)
- **Deployment:** Vercel
- **Language:** TypeScript

## API Routes
The application provides the following API endpoints:

### 1. `GET /api/task`
- Fetches all tasks from the database.

### 2. `POST /api/task`
- Creates a new task with provided details (title, description, due date).

### 3. `PUT /api/task/:id`
- Updates an existing task by its ID.
- Allows marking tasks as complete/incomplete.

### 4. `DELETE /api/task/:id`
- Deletes a task by its ID.

## Installation & Setup
1. **Clone the repository:**
   ```sh
   git clone https://github.com/SagarKapoorin/nextjs-assignment.git
   cd nextjs-assignment
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env.local` file and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```

## Deployment
The application is deployed on **Vercel** and can be accessed [here](https://nextjs-assignment-flame.vercel.app/).

## Features
✅ Task CRUD operations  
✅ Mark tasks as complete/incomplete  
✅ MongoDB for data storage  
✅ Redis for caching and performance optimization  
✅ Error handling and loading states  
✅ Built with Next.js and TypeScript  

## License
This project is licensed under the **MIT License**.

---
Made with ❤️ by **Sagar Kapoor**

