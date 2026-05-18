import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, LogOut, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { Button } from '../components/Button';



export function Landing() {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
              SH
            </span>
            <span className="text-base font-semibold sm:text-lg">Service Hive CRM</span>
          </Link>

          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="secondary">Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto  max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className={isDark ? "flex flex-col items-center rounded-2xl p-6 lg:p-12"  : "flex flex-col items-center bg-blue-100 rounded-2xl p-6 lg:p-12"}>
            <p className="mb-4 text-sm font-semibold uppercase text-primary-600 dark:text-primary-400 text-center ">
              Service Hive CRM
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Smart Ai Solutions for Growing Businesses
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A clean SaaS-style lead management dashboard built for growing teams that need simple workflows, reliable follow-up, and practical customer visibility.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={user ? '/dashboard' : '/register'}>
                <Button className="w-full sm:w-auto">
                  {user ? 'Open Dashboard' : 'Get Started'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="https://servicehive.tech/" target="_blank" rel="noreferrer">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Visit Main Site
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>

          
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="font-semibold">Service Hive CRM</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              A practical lead management dashboard for authentication, lead workflows, exports, and team-ready CRM operations.
            </p>
          </div>
          <div>
            <p className="font-semibold">Links</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400">Login</Link>
              <Link to="/register" className="hover:text-primary-600 dark:hover:text-primary-400">Register</Link>
              <a href="https://servicehive.tech/" target="_blank" rel="noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
                Main website
              </a>
            </div>
          </div>
          <div>
            <p className="font-semibold">Contact</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span>Website: servicehive.tech</span>
              <span>Social: LinkedIn / X placeholders</span>
              <span>Support: Service Hive team contact channels</span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 px-4 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          © {new Date().getFullYear()} Service Hive CRM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}