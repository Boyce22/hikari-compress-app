
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';

import { VideoTable } from './components/video-table';
import { CustomTooltip } from './components/custom-tool-tip';

import { useState, useMemo } from 'react';
import { CloudUpload, Cpu, } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { formatFileSize } from '@/shared/utils/format-file-size';
import { StatusProcessing } from '@/shared/types/status-processing';
import { useVideoFilesContext } from '@/renderer/app/providers/videos-provider';
import { calculateCardsStats, CardStat } from './utils/calculate-cards-stats';
import { CardStats } from './components/card-stats';

const RANGE_OPTIONS = [
  { label: '7 dias', value: 7 },
  { label: '30 dias', value: 30 },
  { label: '3 meses', value: 90 },
];

export const Dash = () => {
  const [range, setRange] = useState(7);
  const [cardsStats, setCardsStats] = useState<CardStat[]>();

  const { videos } = useVideoFilesContext()

  const chartData = useMemo(() => {
    if (!videos?.length) return [];

    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short'
    });

    const videosCompleted = videos
      .filter((video) => video.progress === StatusProcessing.COMPLETED)

    const processedVideos = videosCompleted.map(video => ({
      name: dateFormatter.format(new Date(video.processedAt!)),
      originalSize: video.originalSize,
      compressedSize: video.compressedSize,
    }));

    setCardsStats(calculateCardsStats(videosCompleted, range))

    return processedVideos.slice(-Math.max(0, range));
  }, [videos, range]);

  return (
    <div className="flex-1 overflow-auto bg-background p-12">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Dashboard</h3>
              <p className="text-sm text-muted-foreground">Visão geral da compactação</p>
            </div>
          </div>

          <Button onClick={() => undefined} className="bg-primary hover:bg-primary/90">
            <CloudUpload className="w-4 h-4 mr-2" /> Upload
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardsStats && cardsStats.map((c, idx) => (
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
            <TabsTrigger value="ratio" className="text-xs">
              Taxa de Conversão
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ratio">
            <Card className="p-6 bg-card border-border/50 h-96">
              <div className="flex justify-between items-center mb-6">
                <div className="gap-1 flex flex-col">
                  <h4 className="text-md font-semibold">Histórico de Conversão</h4>
                  <p className="text-sm text-muted-foreground ">
                    Total de {RANGE_OPTIONS.find((opt) => opt.value === range)?.label.toLocaleLowerCase()}
                  </p>
                </div>
                <div className="flex gap-1 bg-muted/10 p-1 rounded-md">
                  {RANGE_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={range === option.value ? 'default' : 'ghost'}
                      className={`text-xs ${range === option.value
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
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="original" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="compressed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.15)" vertical={false} />

                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />

                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => formatFileSize(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="natural"
                    dataKey="originalSize"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#original)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }}
                  />

                  <Area
                    type="natural"
                    dataKey="compressedSize"
                    stroke="#22d3ee"
                    strokeWidth={2.5}
                    fill="url(#compressed)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#22d3ee', strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>

        <VideoTable />
      </div>
    </div>
  );
};
