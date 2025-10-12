import { Option } from '@/shared/types/option';

import { SelectField } from '@/components/common/select-field';
import { SectionConfig } from '@/components/common/section-config';

import { useSettingsContext } from 'src/renderer/app/providers/settings-provider';
import { useSystemSpecifications } from 'src/renderer/features/settings/hooks/use-system-specifications';

import { Film, Gauge, MemoryStick, Monitor, Video, Zap } from 'lucide-react';

const VIDEO_CODECS: Option[] = [
  { value: 'h264', label: 'H.264' },
  { value: 'h265', label: 'H.265 (HEVC)' },
  { value: 'av1', label: 'AV1' },
];

const VIDEO_QUALITIES: Option[] = [
  { value: '18', label: '18 - Muito Alta' },
  { value: '23', label: '23 - Alta' },
  { value: '28', label: '28 - Média' },
  { value: '32', label: '32 - Baixa' },
];

const PRESETS: Option[] = [
  { value: 'ultrafast', label: 'Ultra Rápido' },
  { value: 'fast', label: 'Rápido' },
  { value: 'medium', label: 'Médio' },
  { value: 'slow', label: 'Lento' },
  { value: 'veryslow', label: 'Muito Lento' },
];

const FPS: Option[] = ['24', '25', '30', '60'].map((v) => ({ value: v, label: v }));

const RESOLUTIONS: Option[] = [
  { value: 'original', label: 'Original' },
  { value: '1920x1080', label: '1080p (Full HD)' },
  { value: '1280x720', label: '720p (HD)' },
  { value: '854x480', label: '480p (SD)' },
];

const MEMORY: Option[] = [
  { value: '2', label: '2GB' },
  { value: '4', label: '4GB' },
  { value: '8', label: '8GB' },
  { value: '16', label: '16GB' },
  { value: '32', label: '32GB' },
  { value: '64', label: '64GB' },
];

export const VideoSettings = () => {
  const { specifications } = useSystemSpecifications();
  const { settings, updateSetting } = useSettingsContext();

  const availableRam = MEMORY.filter((ram) => Number(ram.value) <= Number(specifications?.ram | 8) * 0.8);

  return (
    <>
      <section className="space-y-6">
        <SectionConfig
          label="Configurações de Vídeo"
          icon={Video}
          description={'Ajuste codec, qualidade, resolução e desempenho do processamento de vídeo.'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SelectField
            label="Codec de vídeo"
            icon={Film}
            value={settings.codec}
            options={VIDEO_CODECS}
            onChange={(v) => updateSetting('codec', v)}
          />
          <SelectField
            label="Qualidade (CRF)"
            icon={Gauge}
            value={settings.quality}
            options={VIDEO_QUALITIES}
            onChange={(v) => updateSetting('quality', v)}
          />
          <SelectField
            label="Preset"
            icon={Zap}
            value={settings.preset}
            options={PRESETS}
            onChange={(v) => updateSetting('preset', v)}
          />
          <SelectField
            label="Resolução"
            icon={Monitor}
            value={settings.resolution}
            options={RESOLUTIONS}
            onChange={(v) => updateSetting('resolution', v)}
          />
          <SelectField
            label="FPS"
            icon={Film}
            value={String(settings.fps)}
            options={FPS}
            onChange={(v) => updateSetting('fps', parseInt(v, 10))}
          />
          <SelectField
            label="Memória Ram"
            icon={MemoryStick}
            value={settings.ram}
            options={availableRam}
            onChange={(v) => updateSetting('ram', v)}
          />
        </div>
      </section>
    </>
  );
};
