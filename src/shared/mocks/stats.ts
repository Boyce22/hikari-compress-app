export const stats = [
  {
    label: 'Total Processado',
    value: 1024000, // exemplo em bytes
    sublabel: 'Volume original',
    color: 'from-blue-500 to-blue-600',
    index: 0,
  },
  {
    label: 'Espaço Economizado',
    value: 512000, // exemplo em bytes
    sublabel: 'Liberado no disco',
    trend: 50, // porcentagem
    color: 'from-emerald-500 to-emerald-600',
    index: 1,
  },
  {
    label: 'Compressão Média',
    value: 50, // porcentagem
    sublabel: 'Taxa de redução',
    color: 'from-amber-500 to-amber-600',
    index: 2,
  },
  {
    label: 'Arquivos Processados',
    value: 8,
    sublabel: 'vídeos comprimidos',
    color: 'from-purple-500 to-purple-600',
    index: 3,
  },
];
