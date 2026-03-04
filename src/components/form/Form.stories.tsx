import dayjs from "dayjs"

import { Form } from "./Form"

import type {
  FormProps,
  FormField,
  FormMessages,
  FormFieldMessages,
  OnChangeFormHandler,
} from "./Form.model"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/form/Form",
  component: Form,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
        "inherit",
      ],
      description: "Color variant applied to all child fields",
    },
    label: { control: "text", description: "Form heading label" },
    hideResponse: {
      control: "boolean",
      description: "Hide the server response message after submit",
    },
    fields: { table: { disable: true } },
    defaultFields: { table: { disable: true } },
    messagesFields: { table: { disable: true } },
    messages: { table: { disable: true } },
    button: { table: { disable: true } },
    onSubmit: { action: "submitted", table: { disable: true } },
    onChangeForm: { action: "changed", table: { disable: true } },
  },
} satisfies Meta<typeof Form>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Example field definitions for the Form story:
 * – one text input (required),
 * – one select with options,
 * – one switch,
 * – one slider,
 * – one date picker,
 * – one dynamic-list,
 * – one checkbox,
 * – one checkbox-group,
 * – one autocomplete.
 */
const exampleFields: FormField[] = [
  {
    id: "rating",
    label: "Rating",
    fieldType: "rating",
    name: "rating",
    value: "3",
  },
  {
    id: "firstName",
    fieldType: "input",
    name: "firstName",
    label: "First Name",
    placeholder: "Enter your first name",
    required: true,
  },
  {
    id: "favoriteColor",
    fieldType: "select",
    name: "favoriteColor",
    label: "Favorite Color",
    items: [
      { label: "Red", value: "red" },
      { label: "Green", value: "green" },
      { label: "Blue", value: "blue" },
    ],
    required: true,
  },
  {
    id: "subscribe",
    fieldType: "switch",
    name: "subscribe",
    label: "Subscribe to newsletter",
    checked: false,
  },
  {
    id: "ageRange",
    fieldType: "slider",
    name: "ageRange",
    label: "Age Range",
    min: 0,
    max: 100,
    step: 1,
    value: "25",
  },
  {
    id: "birthDate",
    fieldType: "date",
    name: "birthDate",
    label: "Birth Date",
    value: dayjs().subtract(30, "year").toISOString(),
  },
  {
    id: "multiItems",
    fieldType: "dynamic-list",
    name: "dynamicList",
    fields: [{ name: "value", label: "Tag" }],
    value: ["react", "typescript", "nextjs"],
  },
  {
    id: "agreeTerms",
    fieldType: "checkbox",
    name: "agreeTerms",
    title: "I agree to the terms and conditions",
    value: false,
  },
  {
    id: "interests",
    fieldType: "checkbox-group",
    name: "interests",
    legend: "Interests",
    options: [
      { value: "design", title: "Design" },
      { value: "engineering", title: "Engineering" },
      { value: "marketing", title: "Marketing" },
    ],
  },
  {
    id: "framework",
    fieldType: "autocomplete",
    name: "framework",
    label: "Preferred Framework",
    placeholder: "Search frameworks…",
    items: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
    ],
    value: "",
  },
]

/**
 * Example defaultFields: used to reset fields when conditions change.
 * For this story, none of the fields are conditional, so defaultFields === exampleFields.
 */
const defaultFields: FormField[] = [...exampleFields]

/**
 * Example validation messages per field‐type
 */
const messagesFields: FormFieldMessages = {
  errors: {
    input: {
      required: "Please enter a value",
    },
    date: {
      required: "Please select a date",
    },
  },
}

/**
 * Example initial error messages
 */
const initialMessages: FormMessages = {
  errors: {
    "First Name": ["First name cannot be blank"],
  },
}

/**
 * Utility handler for onSubmit: simply logs and shows an alert
 */
const handleSubmit = (fields: FormField[]) => {
  console.warn("Form submitted with:", fields)
  alert("Form submitted! Check console for values.")
}

/**
 * Utility handler for onChangeForm: logs which field changed
 */
const handleChangeForm: OnChangeFormHandler = field => {
  console.warn("Field changed:", field.name, "→", field.value)
}

export const Default: Story = {
  args: {
    label: "User Information",
    color: "primary",
    fields: exampleFields,
    defaultFields,
    button: { children: "Submit" },
    messagesFields,
    onSubmit: handleSubmit,
    onChangeForm: handleChangeForm,
  } as FormProps,
  render: args => <Form priority {...args} />,
}

export const WithInitialMessages: Story = {
  args: {
    label: "User Information",
    fields: exampleFields,
    defaultFields,
    button: { children: "Send user information" },
    messagesFields,
    messages: initialMessages,
    onSubmit: handleSubmit,
    onChangeForm: handleChangeForm,
  } as FormProps,
  render: args => <Form priority {...args} />,
}

export const HideResponse: Story = {
  args: {
    label: "User Information",
    fields: exampleFields,
    defaultFields,
    hideResponse: true,
    button: { children: "Submit" },
    messagesFields,
    onSubmit: handleSubmit,
    onChangeForm: handleChangeForm,
  } as FormProps,
  render: args => <Form priority {...args} />,
}
