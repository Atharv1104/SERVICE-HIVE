# Explanations and Setup Guide

This document provides a detailed explanation of the commands used to set up the project, along with technical deep dives into the libraries and concepts used to help you understand and explain them in an interview.

## 1. Commands Used

### Frontend Initialization
```bash
# Initialize Vite React + TypeScript project
npx -y create-vite@latest frontend --template react-ts

# Navigate to directory and install dependencies
cd frontend
npm install

# Install Core Libraries
npm i react-router-dom lucide-react @tanstack/react-query zustand react-hook-form @hookform/resolvers zod axios clsx tailwind-merge

# Install Tailwind CSS and its peer dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind configuration
npx tailwindcss init -p
```

### Backend Initialization
```bash
# Create and navigate to backend directory
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install Core Dependencies
npm i express mongoose dotenv cors jsonwebtoken bcrypt zod

# Install Development Dependencies (Types & TS config)
npm i -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcrypt ts-node nodemon

# Initialize tsconfig.json
npx tsc --init
```

### Docker Commands
```bash
# Build and run all services (Frontend, Backend, MongoDB)
docker-compose up --build

# Run services in the background (detached mode)
docker-compose up -d

# Stop all running services
docker-compose down

# Stop all services and remove volumes (WIPES DB DATA)
docker-compose down -v
```

---

## 2. Technical Explanations

### JWT Implementation (JSON Web Tokens)
**What it is:** JWT is an open standard for securely transmitting information between parties as a JSON object.
**How it's used here:**
1. When a user logs in, the backend verifies their password and generates a token containing their `_id` using `jsonwebtoken.sign()`.
2. The frontend stores this token in local storage (via Zustand persist) and attaches it to the `Authorization` header of every Axios request.
3. The backend `protect` middleware extracts the token, verifies it using `jsonwebtoken.verify()`, fetches the user, and attaches it to the `req` object. This ensures only authenticated users can access protected routes.

### `useDebounce` Hook
**What it is:** Debouncing is a programming practice used to ensure that time-consuming tasks do not fire so often.
**How it's used here:** 
When searching for a lead, the user might type quickly (e.g., "Rahul"). Instead of making an API request for "R", "Ra", "Rah", etc., the `useDebounce` hook waits until the user stops typing for 500ms before returning the final value. This vastly reduces the number of API calls sent to the backend, saving server resources and preventing race conditions.

### State Management (Zustand)
**What it is:** Zustand is a small, fast, and scalable bearbones state-management solution for React. It is much simpler than Redux and doesn't require complex boilerplate (actions, reducers, providers).
**How it's used here:**
We use it for global state that needs to be accessed across multiple components, specifically `useAuthStore` (for user session/token) and `useThemeStore` (for dark mode). We also use the `persist` middleware to automatically save this state to `localStorage`, so the user stays logged in after refreshing the page.

### TanStack Query (React Query)
**What it is:** TanStack Query is a powerful asynchronous state management library for fetching, caching, and updating data.
**How it's used here:**
Instead of using `useEffect` and `useState` to manually fetch leads, track loading states, and handle errors, we use `useQuery`. 
* **Caching & Refetching:** It automatically caches the leads based on a query key `['leads', page, search, ...]`. If the key changes (e.g., user goes to page 2), it refetches. 
* **Mutations:** We use `useMutation` for creating, updating, and deleting leads. Upon success, we call `queryClient.invalidateQueries({ queryKey: ['leads'] })`, which automatically triggers a refetch of the leads table so the UI is immediately up to date without a page reload.

### Zod Resolver & Validation
**What it is:** Zod is a TypeScript-first schema declaration and validation library.
**How it's used here:**
We use Zod on *both* the frontend and backend to ensure data integrity.
* **Backend:** Before saving a lead or user to the database, we use `zodSchema.parse(req.body)` in the controllers. If the data is invalid, it throws an error which our global error handler catches and sends back as a 400 Bad Request.
* **Frontend:** We integrate Zod with React Hook Form using `@hookform/resolvers/zod`. When the user types in the form, it is validated against the exact same rules. If an error occurs, it maps the error to the specific input field (e.g., `errors.email?.message`) automatically, preventing invalid data from ever being sent to the server.

---

## 3. Errors Faced and How They Were Resolved

This section documents the main issues found during debugging. These are useful to explain in an interview because they show practical debugging, not just final code.

### 1. Frontend TypeScript Build Failed Due to Unused Imports

**Error:**
```bash
src/App.tsx: 'React' is declared but its value is never read
src/layouts/DashboardLayout.tsx: 'Download' is declared but its value is never read
src/pages/Leads.tsx: 'Filter' is declared but its value is never read
```

**Cause:**
The project uses the modern React JSX transform, so importing `React` is no longer required in every `.tsx` file. Some icons were also imported but not used.

**Fix:**
Removed unused imports from `App.tsx`, `DashboardLayout.tsx`, and `Leads.tsx`.

**Lesson:**
TypeScript's `noUnusedLocals` setting helps keep the code clean and prevents dead imports from building up.

### 2. ESLint Fast Refresh Error in Button Component

**Error:**
```bash
Fast refresh only works when a file only exports components.
```

**Cause:**
`Button.tsx` exported both the `Button` React component and the helper function `cn`. React Fast Refresh prefers component files to export only components.

**Fix:**
Moved the `cn` utility into:
```bash
frontend/src/utils/cn.ts
```

Then `Button`, `Input`, and `Modal` import `cn` from that utility file.

**Lesson:**
Reusable utilities should live in a `utils` folder instead of being exported from component files.

### 3. `any` Usage in Frontend Error Handling

**Error:**
```bash
Unexpected any. Specify a different type.
```

**Cause:**
Catch blocks in login, register, and lead mutation handlers used `any` for API errors.

**Fix:**
Used Axios error typing:
```ts
import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
}
```

Then errors were handled as:
```ts
const error = err as AxiosError<ApiErrorResponse>;
setErrorMsg(error.response?.data?.message || 'Failed to login');
```

**Lesson:**
Even error handling should stay typed in a TypeScript project.

### 4. Tailwind CSS Was Not Being Processed Correctly

**Problem:**
The frontend build passed but showed warnings like:
```bash
Unknown at rule: @theme
Unknown at rule: @custom-variant
Unknown at rule: @apply
```

**Cause:**
The project had Tailwind CSS v4 installed, but Vite was not using the official Tailwind Vite plugin. Because of that, Tailwind-specific CSS directives were leaking into the final CSS build.

**Fix:**
Installed:
```bash
npm install -D @tailwindcss/vite
```

Updated `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Updated `index.css` to use the Tailwind v4 style:
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

**Lesson:**
Tailwind v4 setup is different from older Tailwind versions. The CSS pipeline must match the installed Tailwind version.

### 5. Authentication Registration Failed With `passwordHash` Error

**Error:**
```bash
User validation failed: passwordHash: Path `passwordHash` is required.
```

**Cause:**
The registration form sends a field named `password`, but the original Mongoose `User` schema expected a required field named `passwordHash`. Because the controller passed the validated request body directly to `User.create()`, Mongoose did not receive `passwordHash`, so validation failed.

**Fix:**
The user model was simplified to use a `password` field internally:
```ts
password: { type: String, required: true, select: false }
```

The pre-save middleware hashes the password before saving:
```ts
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

Login explicitly selects the hidden password field:
```ts
const user = await User.findOne({ email }).select('+password');
```

**Lesson:**
Frontend form field names, validation schemas, controller payloads, and Mongoose schema fields should align clearly. A simple `password` field with `select: false` is easier to explain than accepting `password` but storing it under a differently named required field.

### 6. Stale Backend Process Caused Old Errors After Fixing Code

**Problem:**
Even after fixing the code and restarting once, the same `passwordHash` error appeared.

**Cause:**
An older Node process was still listening on port `5000`, so requests were hitting stale backend code.

**How We Diagnosed It:**
Checked which process was using port `5000`:
```powershell
netstat -ano | findstr :5000
```

Then killed the old process:
```powershell
taskkill /PID <PID> /F
```

**Fix:**
Restarted the backend from the correct folder:
```bash
cd backend
npm run build
npm start
```

Added a temporary version marker to the base route so it was easy to confirm which backend build was running:
```txt
Service Hive CRM API is running... build: password-field-v3
```

**Lesson:**
When a fixed bug still appears, always confirm which process is actually serving the request. Restarting the wrong terminal does not restart the server using the port.

### 7. Zod Error Handler Used Old Error Shape

**Problem:**
The error middleware tried to read:
```ts
err.errors
```

**Cause:**
Zod v4 exposes validation details through:
```ts
err.issues
```

Using the old property could turn validation errors into server errors.

**Fix:**
Updated the error middleware:
```ts
errors: zodErr.issues.map((issue) => ({
  path: issue.path.join('.'),
  message: issue.message,
}))
```

**Lesson:**
When libraries update major versions, error shapes and APIs can change. Always check the installed version.

### 8. Sample Data Seeding Script Quoting Issue

**Problem:**
Trying to run a long inline Node seed command in PowerShell caused syntax errors because PowerShell interpreted `$in`, `$match`, and template strings.

**Cause:**
MongoDB query operators and JavaScript template strings use `$`, which PowerShell also treats specially.

**Fix:**
Created a reusable script instead:
```bash
backend/scripts/seedLeads.js
```

Run it with:
```bash
cd backend
node scripts/seedLeads.js
```

The script inserts 20 sample leads and first removes existing sample leads with the same emails to avoid duplicate demo data.

**Lesson:**
For repeatable database operations, a small script is better than a fragile one-line terminal command.

---

## 4. Useful Verification Commands

### Backend Build
```bash
cd backend
npm run build
```

### Frontend Build
```bash
cd frontend
npm run build
```

### Frontend Lint
```bash
cd frontend
npm run lint
```

### Seed Sample Leads
```bash
cd backend
node scripts/seedLeads.js
```

### Check Which Process Uses Port 5000
```powershell
netstat -ano | findstr :5000
```

### Kill a Stale Backend Process
```powershell
taskkill /PID <PID> /F
```
