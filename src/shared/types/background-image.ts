export interface BackgroundImage {
  id: string;
  preview: string;
  full: string;
  name: string;
}

export const convertRawToBackgroundImageObject = (raw: Record<string, any>): BackgroundImage => {
  return {
    id: raw['id'],
    name: raw['name'],
    full: raw['url_full'],
    preview: raw['url_preview'],
  };
};
