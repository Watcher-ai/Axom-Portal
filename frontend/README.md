# Watcher Frontend

This is the React frontend for the Watcher project. It provides a modern, responsive UI for analytics, agent management, company management, and user authentication.

## Key Features
- JWT-based authentication (login, register, protected routes)
- Dashboard with analytics and charts
- Company and agent management
- Modern, responsive UI/UX
- Routing handled by `app-router.tsx` (legacy `routes.tsx` has been removed)
- Codebase is kept clean of unused files

## Getting Started

In the `frontend` directory, you can run:

### `npm install`
Install dependencies.

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder.

## Project Structure
- `src/components/routes/app-router.tsx`: Main routing logic
- `src/components/auth/`: Auth pages (Login, Register)
- `src/components/dashboard/`: Dashboard and analytics
- `src/components/company/`: Company management
- `src/components/agents/`: Agent management
- `src/context/AuthContext.tsx`: Auth context and provider

## Notes
- Unused files and legacy code (e.g., `routes.tsx`) have been removed for clarity and maintainability.
- For backend/API details, see the main project README.
