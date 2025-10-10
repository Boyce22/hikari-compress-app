import { memo } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Option } from '@/shared/types/Option';

interface SelectFieldProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export const SelectField = memo(({ label, icon: Icon, value, options, onChange }: SelectFieldProps) => {
  if (!label || !Array.isArray(options)) return null;

  return (
    <Card className="p-4 bg-background/50 border">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <Label className="text-sm font-medium">{label}</Label>
        </div>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={String(opt.value)} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
});
