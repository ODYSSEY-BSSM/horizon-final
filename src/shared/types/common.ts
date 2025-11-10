export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ID = string;

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export type DateString = string;
export type ISODateString = string;

export interface Timestamps {
  createdAt: DateString;
  updatedAt: DateString;
}
