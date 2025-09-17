import type { InputProps } from "../input";
import type { Dayjs } from "dayjs";

export type DatePickerValue = Dayjs | string | null;

export type DatePickerErrorTranslations = {
  required?: string;
  minDate?: string;
  maxDate?: string;
};

export interface DatePickerProps
  extends Omit<
    InputProps,
    "onChange" | "value" | "errorTranslations" | "type"
  > {
  /** Single-line only */
  multiline?: false;
  /** Single-line only */
  rows?: undefined;
  /** Single-line only */
  minRows?: undefined;
  /** Single-line only */
  maxRows?: undefined;
  /** Label text */
  label: string;
  /** unique name/id */
  name: string;
  /** required flag */
  required?: boolean;
  /** error text from parent/form */
  errorText?: string;
  /** helper/hint text */
  helperText?: string;
  /** current Dayjs|null value */
  value?: DatePickerValue;
  /** minimum allowed date */
  minDate?: DatePickerValue;
  /** maximum allowed date */
  maxDate?: DatePickerValue;
  /** called with Dayjs|null */
  onChange?: (value: DatePickerValue) => void;
  /** override default messages */
  translations?: DatePickerErrorTranslations;
  /**
   * Include time selection (uses <input type="datetime-local"> when true).
   * Default: false (date only with <input type="date">).
   */
  withTime?: boolean;

  /**
   * Parsing/formatting pattern.
   * Defaults to "YYYY-MM-DD" for date-only and "YYYY-MM-DDTHH:mm" when withTime=true.
   */
  format?: string;

  /**
   * Minute granularity for time part (applies when withTime=true).
   * Translates to HTML input "step" in seconds. Example: 15 => 900 seconds.
   * Default: 1 minute.
   */
  minuteStep?: number;
}
