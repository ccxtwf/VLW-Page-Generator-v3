export interface MultiSelectItem {
  label: string;
  value: number;
}

export interface DisplayErrorContents {
  errors: string[];
  warnings: string[];
  recommendToAutoloadCategories: boolean;
}
