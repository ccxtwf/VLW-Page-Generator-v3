import type { ValidationBundledErrors } from "../validationErrors/types";

export interface BaseModel {
  preprocess: () => void;
  validate: () => ValidationBundledErrors;
}

export interface PreprocessorMixin {
  preprocess: () => void;
}

export interface WikitextBuilderMixin {
  getWikitext: () => string;
}
