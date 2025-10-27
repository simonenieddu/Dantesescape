# La Selva Oscura - 3D Maze Game

## Overview

La Selva Oscura is a 3D browser-based maze game inspired by Dante's Inferno. Players navigate through a dark forest maze while avoiding three pursuing monsters, attempting to reach the exit. The game features real-time 3D graphics powered by Three.js/React Three Fiber, with dynamic lighting effects and collision detection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack**
- React 18+ with TypeScript for UI components
- Vite as the build tool and development server
- TailwindCSS with custom theme configuration for styling
- Radix UI component library for accessible UI primitives

**3D Rendering Engine**
- React Three Fiber (@react-three/fiber) - React renderer for Three.js
- React Three Drei (@react-three/drei) - Helper components and utilities for R3F
- React Three Postprocessing (@react-three/postprocessing) - Visual effects pipeline
- GLSL shader support via vite-plugin-glsl

**State Management**
- Zustand with subscribeWithSelector middleware for game state
- Separate stores for game logic (useGame) and audio control (useAudio)
- React hooks for component-level state

**Game Architecture**
- Component-based 3D scene structure
- Custom keyboard controls using @react-three/drei KeyboardControls
- Frame-based game loop via useFrame hook
- AABB (Axis-Aligned Bounding Box) collision detection system
- Camera following system with smooth interpolation

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- TypeScript with ES modules
- Development server with Vite middleware integration
- Production builds bundle server code with esbuild

**Route Structure**
- API routes prefixed with `/api`
- Placeholder storage interface for future CRUD operations
- HTTP server creation via native Node.js http module

**Development Setup**
- Hot module replacement (HMR) in development
- Custom error overlay plugin (@replit/vite-plugin-runtime-error-modal)
- Request/response logging middleware
- Separate development and production entry points

### Data Storage Solutions

**Database Layer**
- Drizzle ORM for type-safe database operations
- PostgreSQL dialect configuration via @neondatabase/serverless
- Schema definition in shared directory for frontend/backend access
- Migration system with drizzle-kit

**Current Schema**
- Users table with username/password fields
- Zod validation schemas for type safety
- In-memory storage implementation (MemStorage) for development
- Storage interface (IStorage) designed for easy database migration

**Database Design Rationale**
- Shared schema allows both client and server to use consistent types
- Drizzle chosen for its TypeScript-first approach and lightweight footprint
- In-memory implementation allows development without database provisioning
- Interface pattern enables switching between memory and database storage

### External Dependencies

**Third-Party Services**
- Neon Database (@neondatabase/serverless) - Serverless Postgres provider
- Environment variable DATABASE_URL required for database connection

**Key Libraries**
- @tanstack/react-query - Server state management and caching
- date-fns - Date manipulation utilities
- nanoid - Unique ID generation
- cmdk - Command menu interface
- class-variance-authority & clsx - CSS class composition
- @fontsource/inter - Self-hosted font files

**Build Tools**
- TypeScript compiler for type checking
- PostCSS with Autoprefixer for CSS processing
- ESBuild for fast server bundling
- Vite for frontend bundling and development

**Asset Handling**
- Support for GLTF/GLB 3D model formats
- Audio file support (MP3, OGG, WAV)
- Custom path aliases (@/ for client/src, @shared/ for shared code)