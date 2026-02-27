import { act, render, screen } from "@/tests"

import type { Step } from "./Stepper.model"

let capturedSteps: Step[] = []
let capturedActiveStep = 0

const mockView = jest.fn((props: Record<string, unknown>) => {
  capturedSteps = (props.steps as Step[]) ?? []
  capturedActiveStep = (props.activeStep as number) ?? 0
  return (
    <div data-active={String(capturedActiveStep)} data-testid="stepper-view">
      {capturedSteps.map((step, i) => (
        <button
          key={i}
          data-testid={`step-${i}`}
          onBlur={step.innerContainerProps?.onBlur as never}
          onClick={step.innerContainerProps?.onClick as never}
          onFocus={step.innerContainerProps?.onFocus as never}
          onKeyDown={step.innerContainerProps?.onKeyDown as never}
        >
          {String(step.label ?? "")}
        </button>
      ))}
    </div>
  )
})

jest.mock("./Stepper.view", () => ({ StepperView: mockView }))

const StepperClient = require("./Stepper.client").default

const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }]

beforeEach(() => {
  mockView.mockClear()
  capturedSteps = []
  capturedActiveStep = 0
})

describe("Stepper.client", () => {
  it("initializes with step 0 by default", () => {
    render(<StepperClient steps={steps} />)
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
  })

  it("initializes with provided initialStep", () => {
    render(<StepperClient initialStep={2} steps={steps} />)
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "2",
    )
  })

  it("renders all steps", () => {
    render(<StepperClient steps={steps} />)
    expect(screen.getAllByTestId(/step-/)).toHaveLength(3)
  })

  it("clicking a completed step changes activeStep", async () => {
    render(<StepperClient initialStep={2} steps={steps} />)
    // step-0 is completed (activeStep=2 > 0)
    await act(async () => {
      screen
        .getByTestId("step-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
  })

  it("clicking a future (incomplete) step does nothing", async () => {
    render(<StepperClient initialStep={0} steps={steps} />)
    // step-2 is NOT completed (activeStep=0 <= 2)
    await act(async () => {
      screen
        .getByTestId("step-2")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
  })

  it("calls onChange when completed step is clicked", async () => {
    const onChangeMock = jest.fn()
    render(
      <StepperClient initialStep={2} steps={steps} onChange={onChangeMock} />,
    )
    await act(async () => {
      screen
        .getByTestId("step-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(onChangeMock).toHaveBeenCalledTimes(1)
  })

  it("syncs activeStep when initialStep prop changes", () => {
    const { rerender } = render(<StepperClient initialStep={0} steps={steps} />)
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
    rerender(<StepperClient initialStep={2} steps={steps} />)
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "2",
    )
  })

  it("calls onFocus with step index", async () => {
    const onFocusMock = jest.fn()
    render(<StepperClient steps={steps} onFocus={onFocusMock} />)
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onFocus?.(
        {} as React.FocusEvent<HTMLDivElement>,
      )
    })
    expect(onFocusMock).toHaveBeenCalledWith(expect.any(Object), 0)
  })

  it("calls onBlur with step index", async () => {
    const onBlurMock = jest.fn()
    render(<StepperClient steps={steps} onBlur={onBlurMock} />)
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onBlur?.(
        {} as React.FocusEvent<HTMLDivElement>,
      )
    })
    expect(onBlurMock).toHaveBeenCalledWith(expect.any(Object), 0)
  })

  it("handles ArrowRight key on completed step", async () => {
    render(<StepperClient initialStep={2} steps={steps} />)
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onKeyDown?.({
        key: "ArrowRight",
        preventDefault: jest.fn(),
      } as never)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "1",
    )
  })

  it("handles ArrowLeft key on forward completed step", async () => {
    render(<StepperClient initialStep={2} steps={steps} />)
    // Click step-1 first to be at index 1
    await act(async () => {
      screen
        .getByTestId("step-1")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    await act(async () => {
      capturedSteps[1]?.innerContainerProps?.onKeyDown?.({
        key: "ArrowLeft",
        preventDefault: jest.fn(),
      } as never)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
  })

  it("exposes jumpToStep via ref", async () => {
    const ref = { current: null } as unknown as React.RefObject<{
      jumpToStep(i: number): void
    }>
    render(<StepperClient ref={ref} steps={steps} />)
    await act(async () => {
      ref.current?.jumpToStep(1)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "1",
    )
  })

  it("jumpToStep does nothing when index is out of bounds", async () => {
    const ref = { current: null } as unknown as React.RefObject<{
      jumpToStep(i: number): void
    }>
    render(<StepperClient ref={ref} steps={steps} />)
    await act(async () => {
      ref.current?.jumpToStep(99)
    })
    // should remain at initial step 0
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
  })

  it("ArrowLeft does nothing when prev is not a completed step (index=0)", async () => {
    render(<StepperClient initialStep={1} steps={steps} />)
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onKeyDown?.({
        key: "ArrowLeft",
        preventDefault: jest.fn(),
      } as never)
    })
    // step-0 has prev=-1 (out of bounds), so no step change
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "1",
    )
  })

  it("ArrowRight does nothing when next is not a completed step (at last)", async () => {
    render(<StepperClient initialStep={1} steps={steps} />)
    await act(async () => {
      capturedSteps[2]?.innerContainerProps?.onKeyDown?.({
        key: "ArrowRight",
        preventDefault: jest.fn(),
      } as never)
    })
    // step-2 has next=3 which is >= steps.length, so no step change
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "1",
    )
  })

  it("clicking active step (isCompleted=false) does not call handleStepClick", async () => {
    const onChangeMock = jest.fn()
    render(
      <StepperClient initialStep={1} steps={steps} onChange={onChangeMock} />,
    )
    // step-1 is currently active (activeStep=1), so isCompleted=false for i=1
    await act(async () => {
      screen
        .getByTestId("step-1")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    // active step click should not trigger onChange via handleStepClick
    expect(onChangeMock).not.toHaveBeenCalled()
  })

  it("forwards innerContainerProps.onClick when step has its own onClick", async () => {
    const stepOnClick = jest.fn()
    const stepsWithOnClick = [
      { label: "Step 1", innerContainerProps: { onClick: stepOnClick } },
      { label: "Step 2" },
    ]
    render(<StepperClient initialStep={1} steps={stepsWithOnClick} />)
    // step-0 is completed, click it to trigger both handleStepClick and step.innerContainerProps.onClick
    await act(async () => {
      screen
        .getByTestId("step-0")
        .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    })
    expect(stepOnClick).toHaveBeenCalledTimes(1)
  })

  it("forwards innerContainerProps.onKeyDown when step has its own onKeyDown", async () => {
    const stepOnKeyDown = jest.fn()
    const stepsWithKeyDown = [
      { label: "Step 1", innerContainerProps: { onKeyDown: stepOnKeyDown } },
      { label: "Step 2" },
    ]
    render(<StepperClient steps={stepsWithKeyDown} />)
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onKeyDown?.({
        key: "ArrowLeft",
        preventDefault: jest.fn(),
      } as never)
    })
    expect(stepOnKeyDown).toHaveBeenCalledTimes(1)
  })

  it("step ref callback sets stepRefs when attached to element", async () => {
    // The ref callback (ref fn) is called when the div mounts
    // We test it indirectly: just ensure render + jumpToStep works (which calls stepRefs.current[i]?.focus())
    const ref = { current: null } as unknown as React.RefObject<{
      jumpToStep(i: number): void
    }>
    render(<StepperClient ref={ref} steps={steps} />)
    // jumpToStep calls stepRefs.current[1]?.focus() — stepRefs populated by ref callback
    await act(async () => {
      ref.current?.jumpToStep(0)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
  })

  it("does not call onFocus when no onFocus prop is provided", async () => {
    render(<StepperClient steps={steps} />)
    // Should not throw when steps[i]?.innerContainerProps?.onFocus is undefined
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onFocus?.(
        {} as React.FocusEvent<HTMLDivElement>,
      )
    })
  })

  it("does not call onBlur when no onBlur prop is provided", async () => {
    render(<StepperClient steps={steps} />)
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onBlur?.(
        {} as React.FocusEvent<HTMLDivElement>,
      )
    })
  })

  it("ArrowLeft from step 1 when activeStep=2 moves to step 0", async () => {
    const onChange = jest.fn()
    render(<StepperClient initialStep={2} steps={steps} onChange={onChange} />)
    await act(async () => {
      capturedSteps[1]?.innerContainerProps?.onKeyDown?.({
        key: "ArrowLeft",
        preventDefault: jest.fn(),
      } as never)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
    expect(onChange).toHaveBeenCalled()
  })

  it("ArrowRight from step 0 when activeStep=2 moves to step 1", async () => {
    const onChange = jest.fn()
    render(<StepperClient initialStep={2} steps={steps} onChange={onChange} />)
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onKeyDown?.({
        key: "ArrowRight",
        preventDefault: jest.fn(),
      } as never)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "1",
    )
    expect(onChange).toHaveBeenCalled()
  })

  it("Enter activates a completed step and calls preventDefault", async () => {
    const preventDefault = jest.fn()
    render(<StepperClient initialStep={1} steps={steps} />)
    await act(async () => {
      capturedSteps[0]?.innerContainerProps?.onKeyDown?.({
        key: "Enter",
        preventDefault,
      } as never)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
    expect(preventDefault).toHaveBeenCalled()
  })

  it("Space activates a completed step and calls preventDefault", async () => {
    const preventDefault = jest.fn()
    render(<StepperClient initialStep={2} steps={steps} />)
    await act(async () => {
      capturedSteps[1]?.innerContainerProps?.onKeyDown?.({
        key: " ",
        preventDefault,
      } as never)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "1",
    )
    expect(preventDefault).toHaveBeenCalled()
  })

  it("activation keys on future steps are blocked and call preventDefault", async () => {
    const preventDefault = jest.fn()
    render(<StepperClient initialStep={0} steps={steps} />)
    await act(async () => {
      capturedSteps[2]?.innerContainerProps?.onKeyDown?.({
        key: "Enter",
        preventDefault,
      } as never)
    })
    expect(screen.getByTestId("stepper-view")).toHaveAttribute(
      "data-active",
      "0",
    )
    expect(preventDefault).toHaveBeenCalled()
  })
})
