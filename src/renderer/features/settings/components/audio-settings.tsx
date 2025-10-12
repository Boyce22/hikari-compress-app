import { Gauge, Music, Volume2 } from 'lucide-react';

import { Option } from '@/shared/types/Option';
import { SelectField } from '@/components/common/select-field';
import { SwitchField } from '@/components/common/switch-field';
import { SectionConfig } from '@/components/common/section-config';
import { useSettingsContext } from 'src/renderer/app/providers/settings-provider';

const AUDIO_BITRATES: Option[] = [
  { value: '96', label: '96 kbps' },
  { value: '128', label: '128 kbps' },
  { value: '192', label: '192 kbps' },
  { value: '256', label: '256 kbps' },
  { value: '320', label: '320 kbps' },
];

const AUDIO_CODECS: Option[] = [
  { value: 'aac', label: 'AAC' },
  { value: 'mp3', label: 'MP3' },
  { value: 'opus', label: 'Opus' },
  { value: 'copy', label: 'Copiar Original' },
];

export const AudioSettings = () => {
  const { settings, updateSetting } = useSettingsContext();

  return (
    <section className="space-y-6">
      <SectionConfig
        icon={Music}
        label="Configurações de Áudio"
        description={'Configure codec, taxa de bits e controle de faixas de áudio e legendas.'}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Codec de áudio"
          icon={Volume2}
          value={settings.audioCodec}
          options={AUDIO_CODECS}
          onChange={(v) => updateSetting('audioCodec', v)}
        />
        <SelectField
          label="Bitrate (kbps)"
          icon={Gauge}
          value={settings.audioBitrate}
          options={AUDIO_BITRATES}
          onChange={(v) => updateSetting('audioBitrate', v)}
        />

        <SwitchField
          label="Manter faixas de áudio"
          checked={settings.keepAudio}
          onChange={(v) => updateSetting('keepAudio', v)}
        />
        <SwitchField
          label="Manter legendas"
          checked={settings.keepSubtitles}
          onChange={(v) => updateSetting('keepSubtitles', v)}
        />
        <SwitchField
          label="Aceleração de hardware"
          checked={settings.hardwareAcceleration}
          onChange={(v) => updateSetting('hardwareAcceleration', v)}
          description="Usa GPU para acelerar a codificação (requer suporte)"
          fullWidth
        />
      </div>
    </section>
  );
};
