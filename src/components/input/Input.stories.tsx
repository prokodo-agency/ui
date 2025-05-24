// TODO: FIX STORY

// import { type FC, useState } from "react"

// import { Input } from "./Input"

// import type { InputProps } from "./Input.model"
// import type { Meta, StoryObj } from "@storybook/react"

// const meta: Meta<InputProps> = {
//   title: "prokodo/common/Input",
//   component: Input,
//   parameters: {
//     layout: "centered",
//   },
//   tags: ["autodocs"],
//   argTypes: {
//     color: {
//       options: [
//         "inherit",
//         "primary",
//         "secondary",
//         "success",
//         "info",
//         "warning",
//         "error",
//       ],
//       control: { type: "select" },
//       defaultValue: undefined,
//     },
//   },
// }

// export default meta
// type Story = StoryObj<typeof meta>

// const InputWithHooks: FC<InputProps> = props => {
//   const [value, setValue] = useState<string>("")
//   const [validation, setValidation] = useState<string | undefined>(undefined)

//   return (
//     <Input
//       {...props}
//       errorText={validation}
//       value={value}
//       onChange={e => setValue(e.target.value)}
//       onValidate={err => setValidation(err)}
//     />
//   )
// }

// /* eslint react-hooks/rules-of-hooks: 0 */
// export const Default: Story = {
//   args: {
//     required: true,
//     name: "test",
//     label: "Test",
//     placeholder: "This is a possible placeholder",
//     helperText: "Describe your field.",
//   },
//   render: args => <InputWithHooks {...args} />,
// }
