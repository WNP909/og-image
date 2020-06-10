export type FileType = "png" | "jpeg";
export type Theme = "light" | "dark";
export type BackgroundType = "color" | "radial" | "image";

export interface ParsedRequest {
  fileType: FileType;
  text: string;
  theme: Theme;
  md: boolean;
  fontSize: string;
  logo: string;
  logoWidth: string;
  logoHeight: string;
  backgroundType: BackgroundType;
  backgroundImage: string;
}
