import type { LabelProps } from "../label";
import type {
  Ref,
  ChangeEvent,
  ChangeEventHandler,
  FocusEvent,
  HTMLInputTypeAttribute,
  TextareaHTMLAttributes,
  InputHTMLAttributes,
} from "react";

/* ---------- Basistypen ---------------------------------- */
export type FieldType = Omit<
  HTMLInputTypeAttribute,
  "date" | "datetime-local" | "month" | "week" | "time"
>;

export type InputChangeEvent = ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;
export type InputChangeEventHandler = ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>;

export type InputValidateEvent = (name: string, error?: string) => void;

export type InputFocus = FocusEvent<HTMLTextAreaElement | HTMLInputElement>
export type InputFocusEventHandler = ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>;

export type InputBlur = InputFocus
export type InputBlurEventHandler = ChangeEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>;

export type InputErrorTranslations = {
  required?: string;
  email?: string;
  tel?: string;
  text?: string;
  url?: string;
  number?: string;
  color?: string;
  password?: string;
  min?: string;
  max?: string;
};

/* ---------- Props --------------------------------------- */
export type InputProps = {
  isFocused?: boolean
  inputRef?: Ref<HTMLInputElement>;
  customRegexPattern?: string;
  fieldClassName?: string;
  hideCounter?: boolean;
  inputContainerClassName?: string;
  inputClassName?: string;
  fullWidth?: boolean;
  disabled?: boolean
  required?: boolean;
  name: string;
  label?: string;
  labelProps?: Omit<LabelProps, "label" | "required" | "error" | "htmlFor">;
  errorTranslations?: InputErrorTranslations;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  value?: string | number;
  hideLegend?: boolean;
  errorText?: string;
  helperText?: string;
  onChange?: InputChangeEventHandler;
  onValidate?: InputValidateEvent;
  onFocus?: InputFocusEventHandler;
  onBlur?: InputBlurEventHandler;
} & (
  | {
      /* ---------- Single-line --------------------------- */
      multiline?: false;
      type?: FieldType;
      rows?: undefined;
      minRows?: undefined;
      maxRows?: undefined;
    }
  | {
      /* ---------- Multi-line ---------------------------- */
      multiline: true;
      type?: undefined;
      rows?: number;
      minRows?: number;
      maxRows?: number;
    }
) &
  Omit<
    InputHTMLAttributes<HTMLInputElement> &
      TextareaHTMLAttributes<HTMLTextAreaElement>,
    | "color"
    | "value"
    | "onChange"
    | "maxLength"
    | "type"
    | "rows"
  >;