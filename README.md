# Personal Book Manager

A modern personal library management app built with Next.js and a secure Express backend. It helps users register, log in, and manage their own book collection with statuses, tags, and an intuitive dashboard.

## Overview

Personal Book Manager is a full-stack application for tracking books you want to read, are currently reading, or have already finished. The frontend provides a clean dashboard experience, while the backend handles authentication and protected book management.

## Screenshots

### Dashboard

![Dashboard](.github/images/Dashboard.png)

### Add Book

![Add Book](.github/images/Add-Book.png)

### Edit Book

![Edit Book](.github/images/Edit-Book.png)

## Features

- User registration and login
- Secure authentication with JWT-based sessions
- Protected dashboard routes
- Add, edit, and delete books
- Track book status: To Read, Reading, Read
- Organize books with tags
- Responsive and modern UI

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Query
- Axios
- Framer Motion
- React Toastify

## Project Structure

```text
Personal_Book_Manager/
├── app/                  # App routes and layouts
├── components/           # Reusable UI components
├── features/             # Feature-based modules
├── hooks/                # Custom hooks
├── service/              # API services and route config
├── store/                # Redux store and hooks
└── types/                # Shared TypeScript types
```

## Installation

1. Clone the repository
2. Navigate to the frontend folder
3. Install dependencies:

```bash
npm install
```

4. Create a `.env.local` file with:

```env
JWT_SECRET=your-secret-key
API_BASE_URL=http://localhost:3030
NEXT_PUBLIC_API_BASE_URL=http://localhost:3030
```

5. Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Usage

- Register a new account
- Log in to access your dashboard
- Add books to your personal collection
- Update status or tags as you progress

## Notes

This frontend expects the backend server to be running so authentication and book operations can work properly.
