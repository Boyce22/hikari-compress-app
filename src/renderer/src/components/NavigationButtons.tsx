import icon from '../../../../resources/toji-pfp.jpg';
import { Maximize2, Minimize2, X } from 'lucide-react';

export const NavigationButtons = () => {
  return (
    <div
      className="titlebar flex items-center justify-between select-none bg-neutral-900 text-gray-200 border-b border-neutral-800 px-3 py-1.5"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Título e ícone */}
      <div className="flex items-center gap-2">
        <img src={icon} className="h-4 w-4 rounded-sm" draggable={false} />
        <p className="text-xs font-semibold tracking-wide opacity-90">Hikari Compress</p>
      </div>

      {/* Botões de janela */}
      <div
        className="flex items-center gap-1"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          id="min-btn"
          aria-label="Minimize"
          className="flex items-center justify-center w-8 h-6 rounded hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
        >
          <Minimize2 size={12} />
        </button>
        <button
          id="max-btn"
          aria-label="Maximize"
          className="flex items-center justify-center w-8 h-6 rounded hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
        >
          <Maximize2 size={12} />
        </button>
        <button
          id="close-btn"
          aria-label="Close"
          className="flex items-center justify-center w-8 h-6 rounded hover:bg-red-600 active:bg-red-700 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};
