export interface EditorConfig {
  fontSize: number;
  wrapLines: boolean;
  aiFontSize: number;
}

export const DEFAULT_EDITOR_CONFIG: EditorConfig = {
  fontSize: 12,
  wrapLines: false,
  aiFontSize: 14,
};
