# Expense Tracker Application

A full-stack expense tracking application built with modern web technologies. This project consists of a backend server built with Hono.js and Bun, and a frontend application built with React, TanStack Router, and TailwindCSS.

## Project Structure

```
├── server/          # Backend server application
├── FrontEnd/        # Frontend React application
└── routes/          # API route definitions
```

## Backend Server

The backend is built using Hono.js, a lightweight and fast web framework, running on Bun runtime.

### Technologies Used
- Bun - JavaScript runtime and package manager
- Hono.js - Web framework
- Zod - Schema validation

### Server Architecture
The server is structured in a modular way:
```
server/
├── index.ts    # Server entry point
├── app.ts      # Application setup and middleware
routes/
└── expenses.ts  # API route handlers
```

### API Configuration
- Base URL: `/api`
- Available Endpoints:
  - `/api/expenses` - Expense management endpoints

### Server Configuration

#### Development Mode
```
Frontend (Vite) - http://localhost:5173
├── React development server
├── Hot Module Replacement (HMR)
└── Proxies API requests to Backend

Backend (Bun) - http://localhost:3000
├── API endpoints under /api/*
├── Hot-reload enabled
├── CORS configured for frontend
└── Logging middleware active
```

- **Frontend Development Server**
  - Runs on port 5173 using Vite
  - Provides fast refresh for React components
  - Handles asset compilation (TypeScript, CSS)
  - Proxies API requests to backend server

- **Backend Development Server**
  - Runs on port 3000 using Bun
  - Handles API requests under `/api/*`
  - CORS enabled for frontend requests
  - Logging middleware for request tracking

#### Production Mode
```
Single Server (Bun) - http://localhost:3000
├── /api/* → API endpoints
├── /* → Serves static frontend files
└── /* → Falls back to index.html
```

- **Unified Server**
  - Single Bun server on port 3000
  - Serves built frontend from `./FrontEnd/dist`
  - Handles API requests under `/api/*`
  - Static file serving with fallback routing
  - No CORS needed (same origin)

### Server Architecture & Communication

#### Development Architecture
```
┌─────────────────┐                     ┌─────────────────┐
│    Frontend     │                     │    Backend      │
│   Vite Server  ─┼─── API Requests ───▶│   Bun Server   │
│   Port 5173    │                     │   Port 3000     │
└─────────────────┘                     └─────────────────┘
         │                                      │
         └── Serves React App                   │
         └── Hot Module Replacement             │
         └── TypeScript Compilation             │
                                               │
         ┌── Handles API Routes ────────────────┘
         └── Serves Static Files in Production
         └── Logging & Middleware
```

#### How It Works

1. **Development Flow**
   ```typescript
   // Frontend API Configuration (api.ts)
   const api = {
     expenses: {
       $get: () => fetch('/api/expenses'),
       $post: (data) => fetch('/api/expenses', { 
         method: 'POST', 
         body: JSON.stringify(data) 
       })
     }
   }
   ```

   ```typescript
   // Backend Server Setup (app.ts)
   const app = new Hono()
   app.use(logger())
   const apiRoutes = app.basePath("/api")
     .route("/expenses", expensesRoute)
   ```

   - Frontend makes API calls to `/api/*`
   - Vite dev server proxies these requests to backend
   - Backend processes requests and returns responses
   - CORS headers allow cross-origin communication

2. **Production Flow**
   ```typescript
   // Server Static File Serving (app.ts)
   app.get('*', serveStatic({ root: './FrontEnd/dist' }))
   app.get('*', serveStatic({ path: './FrontEnd/dist/index.html' }))
   ```
   
   - Single Bun server handles everything
   - Static files served from built frontend
   - API requests processed internally
   - No CORS needed (same origin)

3. **Deployment Process**
   ```bash
   # Build frontend
   cd FrontEnd && bun run build
   
   # Start production server
   cd .. && bun start
   ```
   
   - Frontend built to `FrontEnd/dist/`
   - Backend serves these files
   - All traffic goes through port 3000

### Getting Started

1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun dev
```

The server will start on `http://localhost:3000` with hot-reload enabled.

## Frontend Application

The frontend is a modern React application using TanStack Router for routing and Radix UI components with TailwindCSS for styling.

### Technologies Used
- React 19
- TanStack Router - For type-safe routing
- TanStack Query - For data fetching and caching
- TanStack Form - For form handling
- Radix UI - For accessible UI components
- TailwindCSS - For styling
- Vite - Build tool

### Features
- View all expenses in a table format
- Create new expenses
- View detailed expense information
- Real-time total calculation
- Responsive design with mobile support
- Loading states and skeletons

### Getting Started

1. Navigate to the frontend directory:
```bash
cd FrontEnd
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

The frontend application will start on `http://localhost:5173`

## Development

To run both frontend and backend in development mode:

1. Start the backend server:
```bash
bun dev
```

2. In a new terminal, start the frontend:
```bash
cd FrontEnd && bun dev
```

## Project Features

- **Expense Management**
  - Create new expenses
  - View all expenses in a table
  - View detailed expense information
  - Calculate total expenses

- **Modern UI/UX**
  - Responsive design
  - Loading states
  - Skeleton loaders
  - Sliding panels for details
  - Form validation

- **Technical Features**
  - Type-safe API calls
  - Form validation
  - Error handling
  - Data caching
  - Real-time updates

## Requirements

- Bun 1.0 or higher
- Node.js 19.0 or higher (for certain dev tools)

## License

MIT

---

For more information or issues, please refer to the project repository.
