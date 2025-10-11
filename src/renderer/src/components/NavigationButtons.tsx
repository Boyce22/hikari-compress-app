import { useState } from 'react';

import icon from '@/assets/ico.jpg';

import { Maximize2, Minimize2, X } from 'lucide-react';

export const NavigationButtons = () => {
  const [maximized, setMaximized] = useState(false);

  const handleMinimize = async () => {
    await window.api.minimize();
  };

  const handleMaximizeRestore = async () => {
    const isMax = await window.api.maximizeRestore();
    setMaximized(isMax);
  };

  const handleClose = async () => {
    await window.api.close();
  };

  return (
    <div
      className="titlebar fixed top-0 left-0 w-full flex items-center justify-between select-none bg-neutral-900 text-gray-200 border-b border-neutral-800 px-3 py-1.5 z-50"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <img src={icon} className="h-4 w-4 rounded-sm" draggable={false} />
        <p className="text-xs font-semibold tracking-wide opacity-90">Hikari Compress</p>
      </div>

      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          id="min-btn"
          aria-label="Minimize"
          className="flex items-center justify-center w-8 h-6 rounded hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
          onClick={handleMinimize}
        >
          <Minimize2 size={12} />
        </button>
        <button
          id="max-btn"
          aria-label={maximized ? 'Restore' : 'Maximize'}
          className="flex items-center justify-center w-8 h-6 rounded hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
          onClick={handleMaximizeRestore}
        >
          <Maximize2 size={12} />
        </button>
        <button
          id="close-btn"
          aria-label="Close"
          className="flex items-center justify-center w-8 h-6 rounded hover:bg-red-600 active:bg-red-700 transition-colors"
          onClick={handleClose}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};
