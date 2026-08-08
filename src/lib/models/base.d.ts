import type { ValidationBundledErrors } from "../validationErrors/types";

export interface BaseModel<T> extends T {
  preprocess: () => void;
  validate: () => ValidationBundledErrors;
  updateState: (data: Partial<T>) => void;
}

export interface PreprocessorMixin {
  preprocess: () => void;
}

export interface WikitextBuilderMixin {
  getWikitext: () => string;
}
