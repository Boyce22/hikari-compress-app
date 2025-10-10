import { memo } from 'react';

interface SectionConfigProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string | null;
}

export const SectionConfig = memo(({ icon: Icon, label, description }: SectionConfigProps) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
      <Icon className="w-5 h-5 text-primary" />
    </div>

    <div>
      <h3 className="text-lg font-semibold text-foreground">{label}</h3>
      {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
    </div>
  </div>
));
