import { memo } from 'react';
import { Card } from '@/ui/card';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  fullWidth?: boolean;
}

export const SwitchField = memo(({ label, checked, onChange, description, fullWidth = false }: SwitchFieldProps) => (
  <Card className={`p-4 bg-background/50 border ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  </Card>
));
