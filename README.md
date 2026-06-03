# TaskFlow Frontend

A modern and responsive task management application built with Next.js, TypeScript, and Tailwind CSS. The application provides a seamless user experience for managing tasks, authentication, profile management, and productivity workflows.

🌐 **Live Demo:** https://taskflow-mh.vercel.app

---

## Features

* User Authentication & Authorization
* Email Verification & Password Recovery
* Task Management (Create, Update, Soft & Hard Delete, Restore from Archive)
* Task Filtering, Searching & Pagination
* Task Statistics Dashboard
* Responsive Design
* Form Validation with Zod & React Hook Form
* Internationalization (i18n) Support
* Reusable UI Components with shadcn/ui
* Type-Safe Development with TypeScript

---

## Technology Stack

* **Framework:** Next.js 16
* **UI Library:** React 19
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Components:** shadcn/ui
* **Forms & Validation:** React Hook Form + Zod
* **HTTP Client:** Axios
Query
* **Internationalization:** next-intl

---

## Installation

```bash
git clone https://github.com/mahmood-mohamed/taskflow-frontend.git
cd taskflow-frontend
npm install
```

---

## Environment Variables

Create a `.env.local` file based on `.env.example`.

```bash
cp .env.example .env.local
```

Refer to the `.env.example` file for all required environment variables and configuration values.

---

## Project Structure

```text
frontend/
├── public/
├── messages/
├── src/
│   ├── app/
│   ├── components/
│   ├── i18n/
│   ├── lib/
│   ├── validations/
│   └── proxy.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Running Locally

Development:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Production Build:

```bash
npm run build
npm run start
```

---

## Usage

### Adding UI Components

```bash
npx shadcn@latest add <component-name>
```

### API Requests

Use the configured Axios instance located in the `src/lib/` directory to communicate with the backend API.

### Localization

Add translation messages inside the `messages/` directory and configure locales through the `src/i18n/` folder.

---

## Backend Repository

This frontend communicates with the TaskFlow Backend API for authentication, task management, and user operations.

---

## License

This project is licensed under the MIT License.
