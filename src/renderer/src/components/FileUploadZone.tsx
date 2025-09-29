import { Upload } from 'lucide-react';
import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';

interface FileUploadZoneProps {
  onFileUpload: () => void;
}

const CLASSES = Object.freeze({
  card: 'p-8 card-clean border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift',
  iconWrapper: 'flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20',
  button: 'cursor-pointer border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300',
  title: 'text-xl font-semibold mb-3 text-foreground',
  description: 'text-muted-foreground mb-6 text-base',
  footer: 'text-sm text-muted-foreground',
});

export function FileUploadZone({ onFileUpload }: FileUploadZoneProps) {
  return (
    <Card className={CLASSES.card}>
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className={CLASSES.iconWrapper}>
            <Upload className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div>
          <h3 className={CLASSES.title}>Adicionar vídeos</h3>
          <p className={CLASSES.description}>Arraste e solte seus vídeos aqui ou clique para selecionar</p>

          <Button variant="outline" onClick={onFileUpload} className={`${CLASSES.button} w-full`} size="lg">
            <Upload className="w-4 h-4 mr-2" />
            Selecionar Arquivos
          </Button>
        </div>

        <p className={CLASSES.footer}>Suporta: MP4, MKV, MOV, WEBM • Máximo 2GB por arquivo</p>
      </div>
    </Card>
  );
}
