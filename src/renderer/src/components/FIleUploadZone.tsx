import { Upload } from 'lucide-react';
import { Card } from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';

interface FileUploadZoneProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadZone({ onFileUpload }: FileUploadZoneProps) {
  return (
    <Card className="p-8 card-clean border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
            <Upload className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">Adicionar vídeos</h3>
          <p className="text-muted-foreground mb-6 text-base">
            Arraste e solte seus vídeos aqui ou clique para selecionar
          </p>
          <input type="file" multiple accept="video/*" onChange={onFileUpload} className="hidden" id="file-upload" />
          <label htmlFor="file-upload">
            <Button
              variant="outline"
              className="cursor-pointer border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              size="lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Arquivos
            </Button>
          </label>
        </div>
        <p className="text-sm text-muted-foreground">Suporta: MP4, MKV, MOV, WEBM • Máximo 2GB por arquivo</p>
      </div>
    </Card>
  );
}
