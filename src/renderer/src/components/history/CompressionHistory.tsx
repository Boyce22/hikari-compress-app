import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Download, TrendingDown } from "lucide-react"
import { useFileFormatter } from "@/renderer/hooks/useFileFormatter"


interface HistoryItem {
  id: string
  name: string
  date: string
  originalSize: number
  compressedSize: number
  compressionRate: number
  savedSpace: number
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    name: "video-apresentacao.mp4",
    date: "2025-01-10",
    originalSize: 524288000,
    compressedSize: 314572800,
    compressionRate: 40,
    savedSpace: 209715200,
  },
  {
    id: "2",
    name: "tutorial-completo.mp4",
    date: "2025-01-09",
    originalSize: 1073741824,
    compressedSize: 644245094,
    compressionRate: 40,
    savedSpace: 429496730,
  },
  {
    id: "3",
    name: "reuniao-equipe.mp4",
    date: "2025-01-08",
    originalSize: 367001600,
    compressedSize: 183500800,
    compressionRate: 50,
    savedSpace: 183500800,
  },
]

export function CompressionHistory() {
  const { formatFileSize } = useFileFormatter()

  const totalSaved = mockHistory.reduce((acc, item) => acc + item.savedSpace, 0)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Histórico de Compressões</h2>
          <p className="text-sm text-muted-foreground mt-1">{mockHistory.length} vídeos processados</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Espaço economizado</p>
          <p className="text-2xl font-bold text-primary">{formatFileSize(totalSaved)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {mockHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{item.name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{new Date(item.date).toLocaleDateString("pt-BR")}</span>
                <span>•</span>
                <span>{formatFileSize(item.originalSize)}</span>
                <span>→</span>
                <span className="text-primary">{formatFileSize(item.compressedSize)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-2 bg-primary/20 text-primary">
                <TrendingDown className="h-3 w-3" />
                {item.compressionRate}%
              </Badge>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Economizado</p>
                <p className="text-sm font-semibold text-primary">{formatFileSize(item.savedSpace)}</p>
              </div>
              <Button size="sm" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Reproduzir
              </Button>
              <Button size="sm" variant="ghost">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
