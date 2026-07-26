export interface Language {
  name: string;
  transliteration?: string;
  code: string | null;
  iso?: string;
}

export interface Synth {
  id: number;
  name: string;
}

export interface Translator {
  name: string;
  aliases?: string[];
}