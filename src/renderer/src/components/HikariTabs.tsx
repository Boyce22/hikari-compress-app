import { FileVideo, History, Settings } from 'lucide-react';
import { TabsList, TabsTrigger } from '@renderer/components/ui/tabs';

interface HikariTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function HikariTabs({ value, onValueChange }: HikariTabsProps) {
  console.log(value, onValueChange); // eslint-disable-line

  return (
    <div className="flex justify-center">
      <TabsList className="grid grid-cols-3 w-full max-w-md card-clean border border-border/30 p-1">
        <TabsTrigger
          value="compress"
          className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary transition-all duration-300"
        >
          <FileVideo className="w-4 h-4" />
          Comprimir
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary transition-all duration-300"
        >
          <History className="w-4 h-4" />
          Histórico
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary transition-all duration-300"
        >
          <Settings className="w-4 h-4" />
          Configurações
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
