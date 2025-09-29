import { FileVideo, History, Settings } from 'lucide-react';
import { TabsList, TabsTrigger } from '@renderer/components/ui/tabs';

interface HikariTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TABS = Object.freeze([
  { value: 'compress', label: 'Comprimir', icon: FileVideo },
  { value: 'history', label: 'Histórico', icon: History },
  { value: 'settings', label: 'Configurações', icon: Settings },
]);

const TRIGGER_CLASSES = Object.freeze(
  'cursor-pointer flex items-center justify-center gap-2 h-10 rounded-lg font-medium ' +
    'text-foreground/70 hover:text-foreground transition-all duration-300 ' +
    'data-[state=active]:bg-primary/15 data-[state=active]:text-primary ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
);

/** Componente modular de abas */
export function HikariTabs({ value, onValueChange }: HikariTabsProps) {
  console.log(value, onValueChange);

  return (
    <div className="flex justify-center">
      <TabsList className="grid grid-cols-3 w-full h-12 max-w-md rounded-xl border border-border/40 bg-card/80 backdrop-blur p-1 shadow-sm">
        {TABS.map(({ value: tabValue, label, icon: Icon }) => (
          <TabsTrigger key={tabValue} value={tabValue} className={TRIGGER_CLASSES}>
            <Icon className="w-4 h-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
