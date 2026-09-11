export interface BaseModel<T> extends T {
  preprocess: () => void;
  updateState: (data: Partial<T>) => void;
  resetHotTables: () => void;
}

export interface PreprocessorMixin {
  preprocess: () => void;
}

export interface WikitextBuilderMixin {
  getWikitext: () => string;
}