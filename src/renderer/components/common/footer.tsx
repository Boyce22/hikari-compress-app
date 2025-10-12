import { Heart } from 'lucide-react';

export function HikariFooter() {
  return (
    <footer className="w-full border-t border-border/50 mt-12 pt-8 pb-6">
      <div className="flex flex-col items-center gap-4">
        {/* <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="flex items-center gap-1.5 hover:text-foreground transition-colors duration-200">
            <span>Documentação</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-border">•</span>
          <a href="#" className="flex items-center gap-1.5 hover:text-foreground transition-colors duration-200">
            <span>Suporte</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-border">•</span>
          <a href="#" className="flex items-center gap-1.5 hover:text-foreground transition-colors duration-200">
            <span>Licença</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div> */}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} HikariCompress</span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1.5">
            Feito com <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> por
            <span className="font-medium text-foreground">Tsukuyomi Labs</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
