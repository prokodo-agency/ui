import { handleRatingValidation } from "./Rating.validation"

describe("handleRatingValidation", () => {
  it("calls onValidate with undefined error when value is valid and no constraints", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      3,
      false,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", undefined)
  })

  it("calls onValidate with required error when required and no value", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", "This field is required.")
  })

  it("uses custom required error translation", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      undefined,
      true,
      undefined,
      undefined,
      { required: "Pflichtfeld" },
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", "Pflichtfeld")
  })

  it("calls onValidate with required error when value is 0", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      0,
      true,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", "This field is required.")
  })

  it("calls onValidate with min error when value is below min", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      1,
      false,
      2,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", "Minimum rating is 2.")
  })

  it("uses custom min error translation", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      1,
      false,
      2,
      undefined,
      { min: "Too low" },
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", "Too low")
  })

  it("calls onValidate with max error when value exceeds max", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      5,
      false,
      undefined,
      3,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", "Maximum rating is 3.")
  })

  it("uses custom max error translation", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      5,
      false,
      undefined,
      3,
      { max: "Too high" },
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", "Too high")
  })

  it("does not call onValidate when onValidate is not provided", () => {
    // Should not throw
    expect(() => {
      handleRatingValidation("rating", 3, false)
    }).not.toThrow()
  })

  it("handles NaN value as no value (required error)", () => {
    const onValidate = jest.fn()
    handleRatingValidation(
      "rating",
      NaN as unknown as number,
      true,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("rating", "This field is required.")
  })
})
