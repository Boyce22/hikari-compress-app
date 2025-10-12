import { useState, useRef } from 'react';
import { Settings, History, Video, GripHorizontal } from 'lucide-react';

interface VerticalMenuProps {
  activeTab: string;
  onSelect: (tab: string) => void;
}

const MENU_OPTIONS = [
  { id: 'settings', icon: Settings, label: 'Configurações' },
  { id: 'videos', icon: Video, label: 'Vídeos' },
  { id: 'history', icon: History, label: 'Histórico' },
];

export default function VerticalMenu({ activeTab, onSelect }: VerticalMenuProps) {
  const [position, setPosition] = useState({ x: 24, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const menuHeight = MENU_OPTIONS.length * 56 + 16; 
    const menuWidth = 56;

    const x = Math.min(Math.max(0, e.clientX - dragOffset.current.x), window.innerWidth - menuWidth);
    const y = Math.min(Math.max(0, e.clientY - dragOffset.current.y), window.innerHeight - menuHeight);

    setPosition({ x, y });
  };

  const handleMouseUp = () => setIsDragging(false);

  if (typeof window !== 'undefined') {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
  }

  return (
    <div className="fixed z-50 select-none" style={{ left: position.x, top: position.y }}>
      <div
        className="flex justify-center items-center w-15 h-9 bg-muted rounded-t-xl cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal size={20} className="text-foreground/50" />
      </div>

      <nav className="flex flex-col bg-muted rounded-b-xl border border-border shadow-lg overflow-hidden">
        {MENU_OPTIONS.map(({ id, icon: Icon }) => {
          const isSelected = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex justify-center items-center w-14 h-14 transition-colors duration-300 ${
                isSelected ? 'bg-primary text-primary-foreground' : 'text-foreground/50 hover:bg-accent'
              }`}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
