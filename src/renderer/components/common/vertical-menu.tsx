import { useState, useRef, useEffect } from 'react';
import { GripHorizontal, Settings, LayoutDashboard } from 'lucide-react';

interface VerticalMenuProps {
  activeTab: string;
  onSelect: (tab: string) => void;
}

const MENU_OPTIONS = [
  { id: 'dash', icon: LayoutDashboard, label: 'Dash' },
  { id: 'settings', icon: Settings, label: 'Vídeos' },
];

export default function VerticalMenu({ activeTab, onSelect }: VerticalMenuProps) {
  const MENU_MARGIN = 16;

  const [position, setPosition] = useState({ x: 24, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const menuWidth = 56;
  const menuHeight = MENU_OPTIONS.length * 56 + 16;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const x = Math.min(
      Math.max(MENU_MARGIN, e.clientX - dragOffset.current.x),
      window.innerWidth - menuWidth - MENU_MARGIN,
    );

    const y = Math.min(
      Math.max(MENU_MARGIN * 3, e.clientY - dragOffset.current.y),
      window.innerHeight - menuHeight - MENU_MARGIN * 2,
    );

    setPosition({ x, y });
  };
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleResize = () => {
      setPosition((pos) => ({
        x: Math.min(Math.max(MENU_MARGIN, pos.x), window.innerWidth - menuWidth - MENU_MARGIN),
        y: Math.min(Math.max(MENU_MARGIN, pos.y), window.innerHeight - menuHeight - MENU_MARGIN),
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDragging]);

  return (
    <div className="fixed z-50 select-none mr-2" style={{ left: position.x, top: position.y }}>
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
              className={`flex justify-center items-center w-11 h-11 transition-colors duration-300 ${
                isSelected ? 'bg-primary text-primary-foreground' : 'text-foreground/50 hover:bg-accent'
              }`}
            >
              <Icon size={19} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
