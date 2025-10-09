import { Github, FileText } from 'lucide-react';
import { Button } from './ui/button';

export function HikariHeader() {
  return (
    <header className="flex items-center justify-between w-full border-b border-border/50 pb-6 mb-8 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
          <span className="text-xl font-bold text-primary">H</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight select-none">
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Hikari</span>
          <span className="text-foreground"> Compress</span>
        </h1>
      </div>

      <nav className="flex items-center gap-2">
        <Button variant="muted" className="hover:cursor-pointer">
          <FileText className="w-4 h-4" />
          Docs
        </Button>

        <Button variant="primary" className="hover:cursor-pointer">
          <Github className="w-4 h-4" />
          GitHub
        </Button>
      </nav>
    </header>
  );
}
