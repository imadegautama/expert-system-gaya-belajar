import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Brain } from "lucide-react";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(240,10%,8%)] to-[hsl(var(--background))]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-[hsl(var(--foreground))] hover:opacity-80 transition-opacity"
          >
            <Brain className="h-7 w-7 text-[hsl(var(--chart-1))]" />
            <span className="text-white">VARK Expert System</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-[hsl(var(--muted-foreground))]">
          <p>Copyright © 2026 I Made Gautama. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
