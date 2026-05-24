# SoftOne.Web — Task Management Frontend

Angular 17 standalone application for the SoftOne task management dashboard. It connects to the **SoftOne.Api** backend for authentication and task operations, with a Material-based UI themed for a professional burgundy-and-white workflow.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **SoftOne.Api** running locally (see [Backend setup](#backend-setup))

## Getting started

From the `SoftOne.Web` directory:

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). The dev server reloads automatically when source files change.

### Other scripts

| Command | Description |
|--------|-------------|
| `npm start` | Start dev server (`ng serve`) on port **4200** |
| `npm run build` | Production build (output in `dist/soft-one.web`) |
| `npm run watch` | Development build with watch mode |
| `npm test` | Unit tests (Karma/Jasmine) |

## Backend setup

The frontend expects the API at **`http://localhost:5298`** by default (`src/environments/environment.ts`).

1. Start **SoftOne.Api** using the `http` profile (port **5298**).
2. Ensure CORS allows the Angular origin (`http://localhost:4200`).
3. Sign in with valid API credentials (Basic Authentication).

To point at another API URL, update `apiBaseUrl` in:

- `src/environments/environment.ts` (development)
- `src/environments/environment.production.ts` (production builds)

## Application routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Sign-in page |
| `/tasks` | Authenticated | Task dashboard (default after login) |
| `/**` | — | Not found page |

Unauthenticated users are redirected to `/login` via `AuthGuard`.

## Features

### Authentication & security

- Login form with validation, loading state, and error handling
- **Basic Authentication** against `POST /api/auth/login`
- Encrypted session storage (`sessionStorage` + CryptoJS)
- `AuthInterceptor` attaches the `Authorization` header and handles **401** (logout)
- `AuthGuard` protects dashboard routes
- App toolbar with sign-out

### Task dashboard

- **List tasks** with server-side **pagination** (no client-side paging)
- **Filter** by status and priority
- **Sort** by created date or due date (ascending / descending)
- **Create**, **edit**, and **delete** tasks via Material dialog
- **Complete** tasks (status update to Completed)
- Loading spinner, empty states, and confirmation dialog for destructive actions
- Success/error feedback via snackbars

### Task presentation

- Card-based task list with title, description, and metadata row
- **Status chip** — workflow state (Todo, In Progress, Waiting, Completed, Rejected)
- **Priority chip** — Low / Medium / High
- **Due date chip** — prominent badge with state styling:
  - Upcoming (neutral/burgundy)
  - Due today (orange)
  - Overdue (red)
  - Muted for completed/rejected tasks

### Pagination

- Previous / Next navigation with disabled states on first/last page
- Page indicator (e.g. `Page 2 of 5`)
- Range summary (e.g. `Showing 11–20 of 24 tasks`)
- Page size selector: **5**, **10**, or **20** per page
- Resets to page **1** when filters or sort change
- Pagination state owned by `TasksPageComponent`; reusable `app-pagination` component

### UX & layout

- Main layout with toolbar and content area
- Responsive toolbar, filters, task cards, and pagination
- Custom SoftOne favicon and page titles
- Rounded dialogs and consistent Material form styling

## Architecture overview

```
src/app/
├── core/           # Services, guards, interceptors, models, security
├── features/
│   ├── auth/       # Login page & form
│   └── tasks/      # Dashboard, list, dialog, toolbar
├── shared/         # Reusable components, enums, utils, Material imports
└── layouts/        # Main layout & app toolbar
```

- **Standalone components** throughout
- Business logic in **services** and **mappers** (`TaskService`, `task.mapper`, `task-query.mapper`)
- Presentational shared components (chips, pagination, empty state, loading spinner)

## Tech stack

- Angular 17 (standalone, signals-friendly patterns where used)
- Angular Material 17 + CDK
- RxJS
- Reactive Forms
- CryptoJS (session encryption)
- SCSS with shared design tokens (`src/styles/`)

## API integration (summary)

| Area | Endpoint pattern |
|------|------------------|
| Login | `POST /api/auth/login` |
| Tasks (paged) | `GET /api/tasks?page=&pageSize=&sortBy=&...` |
| Task detail | `GET /api/tasks/{id}` |
| Create / update | `POST` / `PUT /api/tasks` |
| Status | `PATCH /api/tasks/{id}/status` |
| Delete | `DELETE /api/tasks/{id}` |

List responses use the backend `PagedResponse<T>` shape (`items`, `page`, `pageSize`, `totalCount`, `totalPages`).

## Further help

- Angular CLI: [angular.io/cli](https://angular.io/cli)
- Generated with Angular CLI **17.3**
