import type { LabelProps} from "../label"
import type { ChangeEvent, RefObject, ReactNode, Ref, MouseEventHandler, KeyboardEventHandler } from "react"

/* ---------- basic event --------------------------------------- */
export type SelectEvent = ChangeEvent<HTMLSelectElement> | null;

/* ---------- option item --------------------------------------- */
export interface SelectItem<Value extends string = string> {
  value: Value;
  label: string;
  icon?: () => ReactNode;
  className?: string;
}

export type SelectValue<V extends string = string> =
  | V
  | V[]
  | "";

/* ---------- main props --------------------------------------- */
export interface SelectProps<Value extends string = string> {
  /* structural */
  id: string;
  name?: string;
  items: SelectItem<Value>[];

  /* behaviour */
  multiple?: boolean;
  disabled?: boolean
  required?: boolean;
  value?: Value | Value[] | null;
  placeholder?: string;
  onChange?: (e: SelectEvent, v: SelectValue) => void;

  /* visual */
  label: string;
  hideLabel?: boolean;
  iconVisible?: boolean;

  /* messaging */
  helperText?: string;
  errorText?: string;

  /* misc */
  className?: string;
  fieldClassName?: string;
  selectClassName?: string;
  labelProps?: LabelProps;
  ref?: Ref<HTMLSelectElement>;
}

type SelectClientState<V extends string = string> = {
  open: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  listRef:   RefObject<HTMLUListElement | null>;
  onButtonClick: MouseEventHandler<HTMLButtonElement>;
  onButtonKey:   KeyboardEventHandler<HTMLButtonElement>;
  onOptionClick: (v: V | null) => void;
};

export type SelectViewProps<V extends string = string> = SelectProps<V> & { _clientState?: SelectClientState<V> };

