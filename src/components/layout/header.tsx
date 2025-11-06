import { Wind } from 'lucide-react';

export function Header() {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/50">
          <Wind className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          FluidFlow <span className="text-base font-medium text-muted-foreground">v0.9</span>
        </h1>
      </div>
    </header>
  );
}
