import type { ValidationBundledErrors } from "../validationErrors/types";

export interface BaseModel {
  preprocess: () => void;
  validate: () => ValidationBundledErrors;
}

export interface FactoryMixin<T> {
  createDefault: () => T;
}
