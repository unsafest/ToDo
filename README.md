# 🎯 Goal Digger

> A modern, full-stack task management application built with Next.js and Supabase

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

## � About

**Goal Digger** is a personal task management application that helps users organize their goals and tasks. It provides a clean, intuitive interface for creating, organizing, and tracking tasks with full user authentication and data persistence.

The application demonstrates modern web development practices with server-side rendering, type-safe development, and secure authentication patterns. It's designed as a single-user experience where each authenticated user maintains their own private workspace of tasks and lists.

## 🛠️ Tech Stack

**Frontend**
- **Next.js 15** - React framework with App Router and Turbopack for fast development
- **React 19** - UI library with latest concurrent features
- **TypeScript** - Type-safe development with full type coverage
- **Tailwind CSS 4** - Utility-first CSS framework with custom configurations

**Backend & Database**
- **Supabase** - PostgreSQL database with built-in authentication and Row Level Security
- **Supabase Auth** - Email/password authentication with SSR support
- **Supabase SSR** - Server-side rendering compatible authentication client

**Development & Tooling**
- **Bun** - Fast JavaScript runtime and package manager
- **Zod** - Schema validation for forms and API requests
- **ESLint** - Code linting with Next.js configuration
- **PostCSS** - CSS processing with Tailwind

## ✨ Features

### Authentication & Security
The app implements secure user authentication with email/password signup and login. All routes are protected by middleware that redirects unauthenticated users to the login page. User data is isolated using Supabase Row Level Security policies, ensuring users can only access their own tasks and lists.

### Task Management
Users can create tasks with titles, optional descriptions, and due dates. Tasks can be marked as complete with a visual checkbox, edited through a modal interface, or deleted. The interface shows creation timestamps and due dates, with completed tasks displayed with a strikethrough effect.

### List Organization
Tasks can be organized into custom lists created by the user. Lists act as categories or projects, allowing users to group related tasks together. The list manager provides a collapsible interface for creating, editing, and deleting lists. Users can filter their task view by specific lists or view tasks not assigned to any list.

### User Profile Management
Each user has a profile page displaying their account information including email, display name, and account creation date. Users can update their display name and have the option to delete their account, which cascades to remove all associated data.

### User Interface
The application features a responsive design that adapts to mobile and desktop screens. It uses modal dialogs for task creation/editing, dropdown menus for task actions, and smooth transitions throughout. The interface includes custom scrollbars and maintains a clean, modern aesthetic with Tailwind CSS styling.

## 🏗️ Architecture

The application follows Next.js 15's App Router architecture with a clear separation between client and server components. Client-side interactivity is handled by React components marked with `'use client'`, while server-side operations like authentication use `'use server'` directives.

Authentication state is managed through Supabase's SSR package, with separate client and server utilities. Middleware intercepts all requests to verify authentication status before allowing access to protected routes.

The database schema consists of two main tables: `tasks` and `lists`, both with foreign key relationships to Supabase's built-in `auth.users` table. Row Level Security policies ensure data isolation between users.

## 📊 Database Schema

The application uses a PostgreSQL database through Supabase with the following structure:

```
┌─────────────────────────────────┐
│       auth.users (Supabase)     │
│─────────────────────────────────│
│ id (UUID) PK                    │
│ email                           │
│ user_metadata                   │
│   └─ name (display name)        │
└─────────────────────────────────┘
           ▲         ▲
           │         │
           │         │
    ┌──────┘         └──────┐
    │                       │
    │                       │
┌───┴──────────────────┐  ┌─┴────────────────────────┐
│      lists           │  │         tasks            │
│──────────────────────│  │──────────────────────────│
│ list_id (UUID) PK    │  │ task_id (UUID) PK        │
│ title (text)         │  │ title (text)             │
│ created_at (ts)      │  │ description (text)       │
│ user_id (UUID) FK ───┼──┤ completed (boolean)      │
└──────────────────────┘  │ created_at (ts)          │
           ▲              │ due_date (ts, nullable)  │
           │              │ user_id (UUID) FK        │
           │              │ list_id (UUID) FK ───────┘
           │              └──────────────────────────┘
           │                       │
           └───────────────────────┘

Legend:
  PK  = Primary Key
  FK  = Foreign Key
  ts  = timestamp with time zone
  ──▶ = Foreign key relationship
```

**Key Relationships:**
- Both `tasks` and `lists` belong to users via `user_id` → `auth.users.id`
- Tasks can optionally belong to a list via `list_id` → `lists.list_id`
- `auth.users` is managed entirely by Supabase Auth (not directly accessible)

**Authentication**
User authentication and user data management is handled entirely by Supabase Auth, which maintains its own `auth.users` table. The application references this table through `user_id` foreign keys but doesn't directly manage user records. User metadata (like display names) is stored in Supabase's auth system as `user_metadata`.
---

<div align="center">
  Built with Next.js, React, TypeScript, and Supabase
</div>