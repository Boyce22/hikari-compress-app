import { FileVideo, History, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './ui/sidebar';
import { BACKGROUNDS } from '../lib/background';

interface HikariSidebarProps {
  activeTab: 'videos' | 'history' | 'settings';
  onTabChange: (value: 'videos' | 'history' | 'settings') => void;
  className?: string;
}

const NAV_MAP = {
  videos: { label: 'Comprimir', icon: FileVideo },
  history: { label: 'Histórico', icon: History },
  settings: { label: 'Configurações', icon: Settings },
} as const;

export function HikariSidebar({ activeTab, onTabChange, className }: HikariSidebarProps) {
  return (
    <Sidebar className={className}>
      <SidebarHeader className="border-b px-4 h-14 flex justify-center items-center">
        <span className="text-xs text-sidebar-foreground/60">Video Compressor</span>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="gap-1">
          {Object.entries(NAV_MAP).map(([value, { label, icon: Icon }]) => (
            <SidebarMenuItem key={value}>
              <SidebarMenuButton
                isActive={activeTab === value}
                onClick={() => onTabChange(value as keyof typeof NAV_MAP)}
                tooltip={label}
                className="h-8 px-3 transition-all duration-200 hover:bg-sidebar-accent/80 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-primary-foreground"
              >
                {activeTab === value && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-sidebar-primary-foreground rounded-r-full" />
                )}
                <Icon className="size-5" />
                <span className="font-medium">{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t mt-auto">
        <div
          className="flex items-center text-[10px] text-muted-foreground rounded-md px-3 py-2 bg-cover bg-center"
          style={{
            backgroundImage: `url(${BACKGROUNDS.ANIME_BG_1.full})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <span className="backdrop-blur-[2px] bg-black/30 px-2 py-1 rounded-md">
            Powered by <span className="font-semibold text-primary">Tsukuyomi Labs</span>
          </span>
          <span className="ml-3 opacity-80 backdrop-blur-[2px] bg-black/30 px-2 py-1 rounded-md">v1.0.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
