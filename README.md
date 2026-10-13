<div align="center">

<img src="public/logo.svg" alt="HiveR logo" width="140" />

# HiveR

**Build a perfectly organized hive of work** 🐝

A modern HR system for companies that don't want to waste time (or money).
Automate your processes and focus on what truly matters.

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

</div>

---

## 📖 About

**HiveR** is the web frontend of a team & HR management platform. It connects to the HiveR backend through an API gateway and gives administrators and managers a single place to run the whole hive: people, teams, tasks, requests and work time.

## ✨ Features

- 📊 **Dashboard** — key statistics and charts at a glance
- 👥 **Company members** — employee directory with profiles, roles and availability calendars
- 🐝 **Teams** — create and manage teams, assign members and track team workload
- ✅ **Tasks** — full task workflow with types, statuses, drag & drop, per-user views and chart summaries
- 📮 **Requests** — submit and process employee requests with a pending-approval flow
- ⏰ **Check-in / check-out** — work-time tracking with statistics
- 🔐 **Role-based access control** — `ADMIN` and `MANAGER` roles enforced by route-level middleware
- 🔒 **Session-based auth** — cookie authentication with a dedicated login flow

## 🛠️ Tech stack

| Category           | Technologies                                               |
| ------------------ | ---------------------------------------------------------- |
| **Framework**      | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript |
| **Styling**        | Tailwind CSS 4 · shadcn/ui (Radix UI) · Lucide icons       |
| **Data & state**   | TanStack Query · Jotai · Zod                               |
| **UI extras**      | Recharts · dnd-kit · react-day-picker · date-fns · Sonner  |
| **Testing**        | Vitest · Testing Library · MSW                             |
| **Quality**        | ESLint · Prettier · Husky · lint-staged · commitlint       |
| **Infrastructure** | Docker · docker-compose                                    |

## 🚀 Getting started

### Prerequisites

- **Node.js 20+** and npm
- A running **HiveR backend** (defaults to `http://localhost:8000`)

### Environment variables

Create a `.env.local` file in the project root if you need non-default values:

| Variable                               | Description                      | Default                 |
| -------------------------------------- | -------------------------------- | ----------------------- |
| `NEXT_PUBLIC_BACKEND_URL`              | URL of the backend API gateway   | `http://localhost:8000` |
| `NEXT_PUBLIC_BACKEND_FOR_FRONTEND_URL` | Public URL of this frontend      | `http://localhost:3000` |
| `USE_HTTPS`                            | Set to `true` for secure cookies | `false`                 |

### Run locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (Turbopack)
npm run dev

# 3. Open the app
# → http://localhost:3000
```

### Run with Docker

The compose setup expects an external `hiver-net` network shared with the backend services:

```bash
docker network create hiver-net   # once, if it doesn't exist yet
docker compose up
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 📜 Available scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the development server (Turbopack) |
| `npm run build`        | Create a production build                |
| `npm start`            | Serve the production build               |
| `npm test`             | Run tests with Vitest                    |
| `npm run lint`         | Lint the codebase with ESLint            |
| `npm run format`       | Format all files with Prettier           |
| `npm run format:check` | Check formatting without writing         |
| `npm run typecheck`    | Type-check with `tsc --noEmit`           |

## 🗂️ Project structure

```text
src/
├── app/
│   ├── (app)/               # Authenticated area
│   │   ├── dashboard/       # Statistics & overview
│   │   ├── company-members/ # Employee directory & availability
│   │   └── manage/          # Teams, tasks & requests management
│   ├── api/                 # BFF route handlers (proxy to backend)
│   └── login/               # Authentication pages
├── components/              # Navigation, shadcn/ui primitives, user widgets
├── config/                  # Constants, enums, route permissions
├── lib/                     # Fetch helpers, auth atom, query client
├── mocks/                   # MSW handlers for tests
├── stores/                  # Client state stores
└── types/                   # Shared TypeScript types
```

## 🧪 Testing

Tests are written with **Vitest** + **Testing Library**, with API calls mocked by **MSW**:

```bash
npm test
```

Test files live in [src/test](src/test), the shared setup in [src/test/setup.ts](src/test/setup.ts) and mock handlers in [src/mocks/handlers.ts](src/mocks/handlers.ts).

## 🤝 Contributing

1. Update your local `main`:

   ```bash
   git checkout main
   git pull origin main
   ```

2. Create a feature branch (`x` = issue number):

   ```bash
   git checkout -b feat/x_my_feature
   ```

3. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint):

   ```bash
   git commit -m "feat: add my feature"
   ```

4. Push and open a Pull Request:

   ```bash
   git push origin feat/x_my_feature
   ```

> ⚠️ **Never push directly to `main`** — all changes go through code review.

After a successful merge, clean up:

```bash
git branch -d feat/x_my_feature
git push origin --delete feat/x_my_feature
```

## 👥 Team

Made with 🍯 by **[ZPIsaniNaSukces](https://github.com/ZPIsaniNaSukces)**.

---

<div align="center">
Built on top of the <a href="https://docs.solvro.pl">Solvro</a> Next.js template 🐝
</div>
