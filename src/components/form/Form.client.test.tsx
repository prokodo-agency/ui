import React from "react"

import { act, render, screen, fireEvent } from "@/tests"

import type { FormField, FormFieldCondition } from "./Form.model"

// ── captured props from FormView mock ──────────────────────────────────────
let lastViewProps: Record<string, unknown> = {}

jest.mock("./Form.view", () => ({
  FormView: (props: Record<string, unknown>) => {
    lastViewProps = props
    const fieldProps = props.fieldProps as {
      onChange: (field: FormField, value?: unknown) => void
      onValidate: (field: FormField, err?: string) => void
    }
    const formState = props.formState as FormField[]
    const handleSubmit = props.onFormSubmit as React.FormEventHandler

    return (
      <form data-testid="form-view" onSubmit={handleSubmit}>
        <input
          data-testid="honeypot"
          defaultValue=""
          onChange={e => {
            const hp = props.honeypot as { onChange: React.ChangeEventHandler }
            hp?.onChange(e)
          }}
        />
        {formState?.map((f, i) => (
          <div key={f.name ?? i} data-testid={`field-${f.name ?? i}`}>
            <button
              data-testid={`change-${f.name ?? i}`}
              type="button"
              onClick={() => fieldProps?.onChange(f, `new-${f.name}`)}
            >
              change
            </button>
            <button
              data-testid={`validate-${f.name ?? i}`}
              type="button"
              onClick={() => fieldProps?.onValidate(f, "required")}
            >
              validate
            </button>
            <button
              data-testid={`validate-clear-${f.name ?? i}`}
              type="button"
              onClick={() => fieldProps?.onValidate(f, undefined)}
            >
              clear-validate
            </button>
          </div>
        ))}
        <button data-testid="submit" type="submit" />
      </form>
    )
  },
}))

const { FormClient } = require("./Form.client")

const FIELDS: FormField[] = [
  { fieldType: "input", name: "email", label: "Email", visible: true },
  { fieldType: "input", name: "name", label: "Name", visible: true },
]

describe("Form.client", () => {
  beforeEach(() => {
    lastViewProps = {}
  })

  it("renders FormView with initial fields", () => {
    render(<FormClient fields={FIELDS} />)
    expect(screen.getByTestId("form-view")).toBeInTheDocument()
    expect(screen.getByTestId("field-email")).toBeInTheDocument()
    expect(screen.getByTestId("field-name")).toBeInTheDocument()
  })

  it("passes isFormValid=true when no required fields", () => {
    render(<FormClient fields={FIELDS} />)
    expect(lastViewProps.isFormValid).toBe(true)
  })

  it("syncs formMessages from prop", () => {
    const msgs = { errors: { email: ["Invalid"] } }
    render(<FormClient fields={FIELDS} messages={msgs} />)
    expect(lastViewProps.formMessages).toEqual(msgs)
  })

  it("updates formMessages when messages prop changes", () => {
    const msgs1 = { errors: { email: ["Invalid"] } }
    const msgs2 = { errors: { name: ["Required"] } }
    const { rerender } = render(<FormClient fields={FIELDS} messages={msgs1} />)
    expect(lastViewProps.formMessages).toEqual(msgs1)
    rerender(<FormClient fields={FIELDS} messages={msgs2} />)
    expect(lastViewProps.formMessages).toEqual(msgs2)
  })

  it("handleFieldChange updates field value", () => {
    render(<FormClient fields={FIELDS} />)
    fireEvent.click(screen.getByTestId("change-email"))
    const updated = (lastViewProps.formState as FormField[]).find(
      f => f.name === "email",
    )
    expect(updated?.value).toBe("new-email")
  })

  it("handleFieldChange calls onChangeForm after commit", () => {
    const onChangeForm = jest.fn()
    render(<FormClient fields={FIELDS} onChangeForm={onChangeForm} />)
    fireEvent.click(screen.getByTestId("change-email"))
    // useDeferredNotifier fires the callback after state commit
    expect(onChangeForm).toHaveBeenCalled()
    expect(onChangeForm.mock.calls[0]?.[0]?.name).toBe("email")
  })

  it("handleFieldValidate updates errorText on field", () => {
    render(<FormClient fields={FIELDS} />)
    fireEvent.click(screen.getByTestId("validate-email"))
    const updated = (lastViewProps.formState as FormField[]).find(
      f => f.name === "email",
    )
    expect(updated?.errorText).toBe("required")
  })

  it("handleFieldValidate builds formMessages.errors", () => {
    render(<FormClient fields={FIELDS} />)
    fireEvent.click(screen.getByTestId("validate-email"))
    const msgs = lastViewProps.formMessages as {
      errors?: Record<string, string[]>
    }
    expect(msgs?.errors?.["email"]).toEqual(["required"])
  })

  it("handleFieldValidate clears error when err=undefined", () => {
    render(<FormClient fields={FIELDS} />)
    fireEvent.click(screen.getByTestId("validate-email"))
    fireEvent.click(screen.getByTestId("validate-clear-email"))
    const msgs = lastViewProps.formMessages as {
      errors?: Record<string, string[]>
    }
    expect(msgs?.errors).toBeUndefined()
  })

  it("handleFieldValidate is a no-op when error unchanged", () => {
    // first set error
    render(<FormClient fields={FIELDS} />)
    fireEvent.click(screen.getByTestId("validate-email"))
    const stateBefore = lastViewProps.formState

    // calling validate again with same error should not update state
    fireEvent.click(screen.getByTestId("validate-email"))
    expect(lastViewProps.formState).toBe(stateBefore)
  })

  it("submit with errors does not call onSubmit", () => {
    const onSubmit = jest.fn()
    const requiredFields: FormField[] = [
      {
        fieldType: "input",
        name: "email",
        label: "Email",
        visible: true,
        required: true,
      },
    ]
    render(<FormClient fields={requiredFields} onSubmit={onSubmit} />)
    fireEvent.submit(screen.getByTestId("form-view"))
    expect(onSubmit).not.toHaveBeenCalled()
    const msgs = lastViewProps.formMessages as {
      errors?: Record<string, string[]>
    }
    expect(msgs?.errors?.["email"]).toBeDefined()
  })

  it("submit without errors calls onSubmit with formState", () => {
    const onSubmit = jest.fn()
    render(<FormClient fields={FIELDS} onSubmit={onSubmit} />)
    fireEvent.submit(screen.getByTestId("form-view"))
    expect(onSubmit).toHaveBeenCalledWith(FIELDS)
  })

  it("isFormValid=false when required field empty and hideResponse=true", () => {
    const requiredFields: FormField[] = [
      {
        fieldType: "input",
        name: "email",
        label: "Email",
        visible: true,
        required: true,
      },
    ]
    render(<FormClient hideResponse fields={requiredFields} />)
    expect(lastViewProps.isFormValid).toBe(false)
  })

  it("isFormValid=true when required field has value and hideResponse=true", () => {
    const filledFields: FormField[] = [
      {
        fieldType: "input",
        name: "email",
        label: "Email",
        visible: true,
        required: true,
        value: "test@test.com",
      },
    ]
    render(<FormClient hideResponse fields={filledFields} />)
    expect(lastViewProps.isFormValid).toBe(true)
  })

  it("honeypot tracks user input", () => {
    render(<FormClient fields={FIELDS} />)
    fireEvent.change(screen.getByTestId("honeypot"), {
      target: { value: "bot" },
    })
    // isHoneypotEmpty should be false when honeypot has a value
    expect(lastViewProps.isHoneypotEmpty).toBe(false)
  })

  it("honeypot is empty by default", () => {
    render(<FormClient fields={FIELDS} />)
    expect(lastViewProps.isHoneypotEmpty).toBe(true)
  })

  it("handleFieldChange with dynamic-list field updates value", () => {
    const listFields: FormField[] = [
      {
        fieldType: "dynamic-list",
        name: "items",
        label: "Items",
        visible: true,
        value: ["a", "b"],
        fields: [{ fieldType: "input" as const, name: "item", label: "Item" }],
      },
    ]
    render(<FormClient fields={listFields} />)
    fireEvent.click(screen.getByTestId("change-items"))
    const updated = (lastViewProps.formState as FormField[]).find(
      f => f.name === "items",
    )
    expect(updated?.value).toBe("new-items")
  })

  it("handleFieldChange with conditions applies matching updateProps", () => {
    const conditionalFields: FormField[] = [
      {
        fieldType: "input",
        name: "type",
        label: "Type",
        visible: true,
        conditions: [
          {
            fieldId: "detail",
            equalTo: "new-type",
            updateProps: { visible: true },
          },
        ],
      },
      {
        fieldType: "input",
        name: "detail",
        label: "Detail",
        visible: false,
      },
    ]
    render(<FormClient fields={conditionalFields} />)
    fireEvent.click(screen.getByTestId("change-type"))
    const detail = (lastViewProps.formState as FormField[]).find(
      f => f.name === "detail",
    )
    expect(detail?.visible).toBe(true)
  })

  it("handleFieldChange with boolean equalTo condition matches correctly", async () => {
    const boolFields: FormField[] = [
      {
        fieldType: "switch" as const,
        name: "toggle",
        label: "Toggle",
        visible: true,
        conditions: [
          {
            fieldId: "dependent",
            equalTo: true,
            updateProps: { visible: true },
          } as FormFieldCondition,
        ],
      } as unknown as FormField,
      {
        fieldType: "input" as const,
        name: "dependent",
        label: "Dependent",
        visible: false,
      } as unknown as FormField,
    ]
    render(<FormClient fields={boolFields} />)
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    await act(async () => {
      fieldProps.onChange(boolFields[0]!, true)
    })
    const dep = (lastViewProps.formState as FormField[]).find(
      f => f.name === "dependent",
    )
    expect(dep?.visible).toBe(true)
  })

  it("handles conditions when equalTo is array and value is string (includes check)", async () => {
    const arrFields: FormField[] = [
      {
        fieldType: "select" as const,
        name: "picker",
        label: "Picker",
        visible: true,
        conditions: [
          {
            fieldId: "target",
            equalTo: ["a", "c"],
            updateProps: { visible: true },
          } as FormFieldCondition,
        ],
      } as unknown as FormField,
      {
        fieldType: "input" as const,
        name: "target",
        label: "Target",
        visible: false,
      } as unknown as FormField,
    ]
    render(<FormClient fields={arrFields} />)
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    await act(async () => {
      fieldProps.onChange(arrFields[0]!, "c")
    })
    const t = (lastViewProps.formState as FormField[]).find(
      f => f.name === "target",
    )
    expect(t?.visible).toBe(true)
  })

  it("handles conditions when equalTo is array and value is array (intersection)", async () => {
    const arrFields2: FormField[] = [
      {
        fieldType: "select" as const,
        name: "picker2",
        label: "Picker2",
        visible: true,
        conditions: [
          {
            fieldId: "target2",
            equalTo: ["a", "c"],
            updateProps: { visible: true },
          } as FormFieldCondition,
        ],
      } as unknown as FormField,
      {
        fieldType: "input" as const,
        name: "target2",
        label: "Target2",
        visible: false,
      } as unknown as FormField,
    ]
    render(<FormClient fields={arrFields2} />)
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    await act(async () => {
      fieldProps.onChange(arrFields2[0]!, ["b", "c"])
    })
    const t2 = (lastViewProps.formState as FormField[]).find(
      f => f.name === "target2",
    )
    expect(t2?.visible).toBe(true)
  })

  it("empty value causes no condition match and targets reset to defaultVisible", async () => {
    const resetFields: FormField[] = [
      {
        fieldType: "select" as const,
        name: "sel",
        label: "Sel",
        visible: true,
        conditions: [
          {
            fieldId: "extra",
            equalTo: "x",
            updateProps: { visible: true },
          } as FormFieldCondition,
        ],
      } as unknown as FormField,
      {
        fieldType: "input" as const,
        name: "extra",
        label: "Extra",
        visible: false,
      } as unknown as FormField,
    ]
    render(<FormClient fields={resetFields} />)
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    await act(async () => {
      fieldProps.onChange(resetFields[0]!, "x")
    })
    const extra = (lastViewProps.formState as FormField[]).find(
      f => f.name === "extra",
    )
    expect(extra?.visible).toBe(true)
    await act(async () => {
      fieldProps.onChange(resetFields[0]!, "")
    })
    const extraAfter = (lastViewProps.formState as FormField[]).find(
      f => f.name === "extra",
    )
    expect(extraAfter?.visible).toBe(false)
  })

  it("conditions with undefined equalTo always apply updateProps", async () => {
    const noEqualsFields: FormField[] = [
      {
        fieldType: "input" as const,
        name: "trigger",
        label: "Trigger",
        visible: true,
        conditions: [
          {
            fieldId: "always",
            updateProps: { visible: true },
          } as FormFieldCondition,
        ],
      } as unknown as FormField,
      {
        fieldType: "input" as const,
        name: "always",
        label: "Always",
        visible: false,
      } as unknown as FormField,
    ]
    render(<FormClient fields={noEqualsFields} />)
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    await act(async () => {
      fieldProps.onChange(noEqualsFields[0]!, "anything")
    })
    const always = (lastViewProps.formState as FormField[]).find(
      f => f.name === "always",
    )
    expect(always?.visible).toBe(true)
  })

  it("isFormValid with required array field when empty array → invalid", () => {
    const emptyArr: FormField[] = [
      {
        fieldType: "select" as const,
        name: "items",
        label: "Items",
        visible: true,
        required: true,
        value: [] as unknown,
      } as unknown as FormField,
    ]
    render(<FormClient hideResponse fields={emptyArr} />)
    expect(lastViewProps.isFormValid).toBe(false)
  })

  it("isFormValid with required array field when non-empty → valid", () => {
    const nonEmptyArr: FormField[] = [
      {
        fieldType: "select" as const,
        name: "items",
        label: "Items",
        visible: true,
        required: true,
        value: ["a", "b"] as unknown,
      } as unknown as FormField,
    ]
    render(<FormClient hideResponse fields={nonEmptyArr} />)
    expect(lastViewProps.isFormValid).toBe(true)
  })

  it("submit catches errorText fields in validateFullForm", () => {
    const onSubmit = jest.fn()
    const errFields: FormField[] = [
      {
        fieldType: "input" as const,
        name: "email",
        label: "Email",
        visible: true,
        errorText: "Invalid email",
      } as unknown as FormField,
    ]
    render(<FormClient fields={errFields} onSubmit={onSubmit} />)
    fireEvent.submit(screen.getByTestId("form-view"))
    expect(onSubmit).not.toHaveBeenCalled()
    const msgs = lastViewProps.formMessages as Record<string, unknown>
    expect(msgs).toBeDefined()
  })
})

describe("Form.client – additional branch coverage", () => {
  it("matches() returns false when equalTo is array but v is null/undefined (line 175)", async () => {
    const arrEqualToFields: FormField[] = [
      {
        fieldType: "select" as const,
        name: "picker3",
        label: "Picker3",
        visible: true,
        conditions: [
          {
            fieldId: "target3",
            equalTo: ["a", "c"],
            updateProps: { visible: true },
          } as FormFieldCondition,
        ],
      } as unknown as FormField,
      {
        fieldType: "input" as const,
        name: "target3",
        label: "Target3",
        visible: false,
      } as unknown as FormField,
    ]
    render(<FormClient fields={arrEqualToFields} />)
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    // Pass null value → equalTo is array, v is null → not string/number, not array → return false (line 175)
    await act(async () => {
      fieldProps.onChange(arrEqualToFields[0]!, null)
    })
    const t3 = (lastViewProps.formState as FormField[]).find(
      f => f.name === "target3",
    )
    // condition should NOT apply (matches returned false), target stays hidden
    expect(t3?.visible).toBe(false)
  })

  it("defaultFields provided: def is truthy → uses defaultFields baseline (lines 181-183, 199)", async () => {
    const trigger: FormField = {
      fieldType: "input" as const,
      name: "triggerDf",
      label: "Trigger",
      visible: true,
      conditions: [
        {
          fieldId: "dependentDf",
          equalTo: "show",
          updateProps: { visible: true },
        } as FormFieldCondition,
      ],
    } as unknown as FormField

    const dependent: FormField = {
      fieldType: "input" as const,
      name: "dependentDf",
      label: "Dependent",
      visible: false,
    } as unknown as FormField

    // defaultFields provides the baseline for dependentDf
    const defaultFields: FormField[] = [
      {
        fieldType: "input" as const,
        name: "dependentDf",
        label: "Dependent",
        visible: false,
      } as unknown as FormField,
    ]

    render(
      <FormClient
        defaultFields={defaultFields as never}
        fields={[trigger, dependent]}
      />,
    )
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    // First change: show the dependent field
    await act(async () => {
      fieldProps.onChange(trigger, "show")
    })
    const dep1 = (lastViewProps.formState as FormField[]).find(
      f => f.name === "dependentDf",
    )
    expect(dep1?.visible).toBe(true)

    // Second change: reset — dependent should go back to defaultFields baseline (visible: false)
    await act(async () => {
      fieldProps.onChange(trigger, "hide")
    })
    const dep2 = (lastViewProps.formState as FormField[]).find(
      f => f.name === "dependentDf",
    )
    expect(dep2?.visible).toBe(false)
  })
})

describe("Form.client – edge case branch coverage", () => {
  it("renders without fields prop (fields ?? [] fallback, line 67)", () => {
    render(<FormClient />)
    expect(screen.getByTestId("form-view")).toBeInTheDocument()
  })

  it("handleFieldValidate ignores field not in formState (idx < 0, line 112)", async () => {
    const onChangeMock = jest.fn()
    render(<FormClient fields={FIELDS} onChangeForm={onChangeMock} />)
    const fieldProps = lastViewProps.fieldProps as {
      onValidate: (f: FormField, err?: string) => void
    }
    // Validate a field whose name doesn't exist in formState
    await act(async () => {
      fieldProps.onValidate(
        {
          fieldType: "input",
          name: "nonexistent",
          label: "Ghost",
        } as FormField,
        "required",
      )
    })
    // State should not change
    const state = lastViewProps.formState as FormField[]
    expect(state.every(f => f.name !== "nonexistent")).toBe(true)
  })

  it("handleFieldChange ignores field not in formState (srcIdx < 0, line 140)", async () => {
    render(<FormClient fields={FIELDS} />)
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    const stateBefore = lastViewProps.formState
    await act(async () => {
      fieldProps.onChange(
        { fieldType: "input", name: "ghost", label: "Ghost" } as FormField,
        "value",
      )
    })
    // formState should be unchanged
    expect(lastViewProps.formState).toEqual(stateBefore)
  })

  it("conditions with target not in formState (depIdx < 0, lines 194, 222, 238)", async () => {
    const fieldsWithCondition: FormField[] = [
      {
        fieldType: "input" as const,
        name: "srcField",
        label: "Source",
        visible: true,
        conditions: [
          {
            fieldId: "missingTarget",
            equalTo: "trigger",
            updateProps: { visible: true },
          } as FormFieldCondition,
        ],
      } as unknown as FormField,
    ]
    render(<FormClient fields={fieldsWithCondition} />)
    const fieldProps = lastViewProps.fieldProps as {
      onChange: (f: FormField, v: unknown) => void
    }
    // Trigger − missingTarget doesn't exist, so loops continue without crashing
    await act(async () => {
      fieldProps.onChange(fieldsWithCondition[0]!, "trigger")
    })
    // No error thrown
    const state = lastViewProps.formState as FormField[]
    expect(state[0]?.name).toBe("srcField")
  })

  it("isFormValid skips required field when visible=false (line 320)", () => {
    const hiddenRequired: FormField[] = [
      {
        fieldType: "input" as const,
        name: "hidden",
        label: "Hidden",
        visible: false,
        required: true,
      } as unknown as FormField,
    ]
    render(<FormClient hideResponse fields={hiddenRequired} />)
    // Required but not visible → should be valid
    expect(lastViewProps.isFormValid).toBe(true)
  })

  it("validateFullForm with required field value='' (emptyScalar === '' branch, lines 281-283)", () => {
    const onSubmit = jest.fn()
    const emptyStringField: FormField[] = [
      {
        fieldType: "input" as const,
        name: "email",
        label: "Email",
        visible: true,
        required: true,
        value: "",
      } as unknown as FormField,
    ]
    render(<FormClient fields={emptyStringField} onSubmit={onSubmit} />)
    fireEvent.submit(screen.getByTestId("form-view"))
    expect(onSubmit).not.toHaveBeenCalled()
    const msgs = lastViewProps.formMessages as {
      errors?: Record<string, string[]>
    }
    expect(msgs?.errors?.["email"]).toBeDefined()
  })

  it("validateFullForm with required field value=[] (emptyArray branch, line 281)", () => {
    const onSubmit = jest.fn()
    const emptyArrField: FormField[] = [
      {
        fieldType: "select" as const,
        name: "options",
        label: "Options",
        visible: true,
        required: true,
        value: [],
      } as unknown as FormField,
    ]
    render(<FormClient fields={emptyArrField} onSubmit={onSubmit} />)
    fireEvent.submit(screen.getByTestId("form-view"))
    expect(onSubmit).not.toHaveBeenCalled()
    const msgs = lastViewProps.formMessages as {
      errors?: Record<string, string[]>
    }
    expect(msgs?.errors?.["options"]).toBeDefined()
  })
})
