export const StatusProcessing = Object.freeze({
  WAITING: 'waiting',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error',
});

export type StatusProcessing = typeof StatusProcessing[keyof typeof StatusProcessing];