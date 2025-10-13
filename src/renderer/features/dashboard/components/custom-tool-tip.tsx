import { formatFileSize } from '@/shared/utils/format-file-size';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;

  const original = payload.find((p) => p.dataKey === 'originalSize')?.value;
  const compressed = payload.find((p) => p.dataKey === 'compressedSize')?.value;

  if (!original || !compressed) return null;

  const saved = original - compressed;
  const percent = ((saved / original) * 100).toFixed(1);

  return (
    <div className="rounded-lg text-xs border border-border bg-card p-4 shadow-lg min-w-[250px]">
      <p className="font-semibold mb-2 text-foreground">{label}</p>
      <div className="space-y-2 text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Original:</span>
          <span className="text-blue-400 font-medium">{formatFileSize(original * 1_000_000)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Compressed:</span>
          <span className="text-cyan-400 font-medium">{formatFileSize(compressed * 1_000_000)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-border/40 pt-2 mt-2 text-foreground font-medium">
          <span>Savings:</span>
          <span className="text-green-400">
            {formatFileSize(saved * 1_000_000)} ({percent}%)
          </span>
        </div>
      </div>
    </div>
  );
};
