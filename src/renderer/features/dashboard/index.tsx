import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { useState, useMemo } from 'react';
import { CardStats } from './components/card-stats';
import { CustomTooltip } from './components/custom-tool-tip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { useVideoFiles } from '@/settings/hooks/use-background-image';
import { Archive, CloudUpload, Cpu, FileVideo, HardDrive, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RANGE_OPTIONS = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 3 months', value: 90 },
];

const CARDS_STATS = [
  {
    icon: Archive,
    label: 'Total Processed',
    value: 900102301,
    subtitle: 'Growing this month',
    trend: '+8.2%',
  },
  {
    icon: HardDrive,
    label: 'Space Saved',
    value: 229309120,
    subtitle: '20% reduction',
    trend: '+20%',
  },
  {
    icon: FileVideo,
    label: 'Files Processed',
    value: 5,
    bytes: false,
    subtitle: 'High retention',
    trend: '+12.5%',
  },
  {
    icon: Zap,
    label: 'Compression Rate',
    value: '33%',
    bytes: false,
    subtitle: 'Performance growing',
    trend: '+4.5%',
  },
];

export const Dash = () => {
  const { handleFileUpload } = useVideoFiles();
  const [range, setRange] = useState(7);

  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: range }).map((_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (range - i - 1));
      const original = Math.random() * 500 + 300;
      const compressed = original * (Math.random() * 0.3 + 0.3);

      return {
        name: date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        originalSize: Number(original.toFixed(2)),
        compressedSize: Number(compressed.toFixed(2)),
      };
    });
  }, [range]);

  return (
    <div className="flex-1 overflow-auto bg-background p-12">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Dashboard</h3>
              <p className="text-sm text-muted-foreground">Compression overview</p>
            </div>
          </div>

          <Button onClick={handleFileUpload} className="bg-primary hover:bg-primary/90">
            <CloudUpload className="w-4 h-4 mr-2" /> Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS_STATS.map((c, idx) => (
            <CardStats
              key={idx}
              icon={c.icon}
              label={c.label}
              value={c.value}
              subtitle={c.subtitle}
              trend={c.trend}
              bytes={c.bytes}
            />
          ))}
        </div>

        <Tabs defaultValue="ratio" className="mt-8">
          <TabsList>
            <TabsTrigger value="ratio">File Sizes</TabsTrigger>
          </TabsList>
          <TabsContent value="ratio">
            <Card className="p-6 bg-card border-border/50 h-96">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-md font-semibold">File Sizes Over Time</h4>
                <div className="flex gap-1 bg-muted/10 p-1 rounded-md">
                  {RANGE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={range === option.value ? 'default' : 'ghost'}
                      className={`text-xs ${
                        range === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setRange(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="original" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="compressed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#0e7490" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="hsl(var(--border) / 0.15)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value} MB`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  <Area type="monotone" dataKey="originalSize" stroke="#3b82f6" strokeWidth={2} fill="url(#original)" />
                  <Area
                    type="monotone"
                    dataKey="compressedSize"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fill="url(#compressed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
