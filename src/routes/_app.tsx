import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  Bot,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  NotebookPen,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { readUser, signOut, type SessionUser } from "@/lib/settings";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Smart Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/assistant", label: "AI Chatbot", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help", icon: CircleHelp },
] as const;

function AppLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<SessionUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const u = readUser();
    if (!u) {
      navigate({ to: "/" });
      return;
    }
    setUser(u);
  }, [navigate]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const initials = (user?.name ?? "AI")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen lg:flex">
      {open ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar p-4 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="brand-gradient flex size-9 items-center justify-center rounded-xl text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <span className="text-sm leading-tight font-semibold">
              AI Workplace
              <span className="block text-xs font-normal text-muted-foreground">Productivity Assistant</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent data-[status=active]:bg-primary/15 data-[status=active]:font-medium data-[status=active]:text-primary"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="surface-card rounded-xl p-3 text-xs text-muted-foreground">
          Signed in as
          <div className="truncate text-sm font-medium text-foreground">{user?.email ?? "—"}</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold md:text-base">
              {nav.find((n) => pathname.startsWith(n.to))?.label ?? "Dashboard"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 transition-colors hover:bg-accent">
                <span className="brand-gradient flex size-7 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground">
                  {initials}
                </span>
                <span className="hidden text-sm sm:inline">{user?.name ?? "User"}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  signOut();
                  navigate({ to: "/" });
                }}
              >
                <LogOut /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
