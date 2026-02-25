import { handleValidation } from "./InputValidation"

describe("handleValidation", () => {
  it("returns early when onValidate is not provided", () => {
    // Should not throw
    expect(() =>
      handleValidation("input", "field", "value", false),
    ).not.toThrow()
  })

  it("calls onValidate with error when required and value is empty", () => {
    const onValidate = jest.fn()
    handleValidation(
      "input",
      "name",
      "",
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith(
      "name",
      expect.stringContaining("required"),
    )
  })

  it("calls onValidate with error when required and value is null/undefined", () => {
    const onValidate = jest.fn()
    handleValidation(
      "input",
      "name",
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith(
      "name",
      expect.stringContaining("required"),
    )
  })

  it("calls onValidate without error when not required and value is empty", () => {
    const onValidate = jest.fn()
    handleValidation(
      "input",
      "name",
      "",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("name")
    expect(onValidate).not.toHaveBeenCalledWith("name", expect.anything())
  })

  it("calls onValidate with min error when numeric value is below min", () => {
    const onValidate = jest.fn()
    handleValidation(
      "number",
      "age",
      "3",
      false,
      5,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("age", expect.stringContaining("5"))
  })

  it("calls onValidate with max error when numeric value exceeds max", () => {
    const onValidate = jest.fn()
    handleValidation(
      "number",
      "age",
      "100",
      false,
      undefined,
      50,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith(
      "age",
      expect.stringContaining("50"),
    )
  })

  it("calls onValidate with min error for string length below min", () => {
    const onValidate = jest.fn()
    handleValidation(
      "input",
      "name",
      "ab",
      false,
      5,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith(
      "name",
      expect.stringContaining("5"),
    )
  })

  it("validates email: valid email calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "email",
      "email",
      "test@example.com",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("email")
    const { calls } = onValidate.mock
    // should be called with just "email" (no second arg)
    expect(calls[0]).toEqual(["email"])
  })

  it("validates email: invalid email calls onValidate with error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "email",
      "email",
      "notanemail",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("email", expect.any(String))
  })

  it("validates tel: valid phone calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "tel",
      "phone",
      "+491234567890",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("phone")
  })

  it("validates tel: invalid phone calls onValidate with error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "tel",
      "phone",
      "abc",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("phone", expect.any(String))
  })

  it("validates url: valid URL calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "url",
      "website",
      "https://example.com",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("website")
  })

  it("validates url: invalid URL calls onValidate with error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "url",
      "website",
      "not-a-url",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("website", expect.any(String))
  })

  it("validates url: ftp:// URL calls onValidate with error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "url",
      "website",
      "ftp://example.com",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("website", expect.any(String))
  })

  it("validates number: valid number calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "number",
      "count",
      "42",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("count")
  })

  it("validates number: invalid number calls onValidate with error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "number",
      "count",
      "abc",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("count", expect.any(String))
  })

  it("validates number: float number calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "number",
      "price",
      "3.14",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("price")
  })

  it("validates number: negative number calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "number",
      "temp",
      "-5",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("temp")
  })

  it("validates color: valid hex color calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "color",
      "bgColor",
      "#FF0000",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("bgColor")
  })

  it("validates color: invalid color calls onValidate with error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "color",
      "bgColor",
      "red",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("bgColor", expect.any(String))
  })

  it("validates color: 3-char hex color calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "color",
      "bgColor",
      "#F0A",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("bgColor")
  })

  it("validates password: valid strong password calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "password",
      "pass",
      "StrongP@ss1",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("pass")
  })

  it("validates password: weak password calls onValidate with error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "password",
      "pass",
      "weak",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("pass", expect.any(String))
  })

  it("uses custom error translations for required error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "input",
      "name",
      "",
      true,
      undefined,
      undefined,
      undefined,
      { required: "Pflichtfeld" },
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith(
      "name",
      expect.stringContaining("Pflichtfeld"),
    )
  })

  it("uses custom error translations for email error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "email",
      "email",
      "bad",
      false,
      undefined,
      undefined,
      undefined,
      { email: "Ungültige E-Mail" },
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("email", "Ungültige E-Mail")
  })

  it("validates custom regex pattern: matching value calls onValidate without error", () => {
    const onValidate = jest.fn()
    handleValidation(
      "input",
      "code",
      "ABC",
      false,
      undefined,
      undefined,
      "/^[A-Z]+$/",
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("code")
  })

  it("validates custom regex pattern: non-matching value calls onValidate", () => {
    const onValidate = jest.fn()
    // For type "email", when regex fails, the email error message is used
    handleValidation(
      "email",
      "code",
      "abc@test.com",
      false,
      undefined,
      undefined,
      "/^[A-Z]+$/",
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("code", expect.any(String))
  })

  it("validates custom regex pattern as plain string (no /.../ delimiters)", () => {
    const onValidate = jest.fn()
    handleValidation(
      "input",
      "code",
      "abc",
      false,
      undefined,
      undefined,
      "^[a-z]+$",
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("code")
  })

  it("validates default type (text) as valid", () => {
    const onValidate = jest.fn()
    handleValidation(
      "text" as "input",
      "name",
      "anything",
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("name")
  })

  it("min/max uses custom error translations", () => {
    const onValidate = jest.fn()
    handleValidation(
      "number",
      "age",
      "3",
      false,
      5,
      undefined,
      undefined,
      { min: "Mindestens" },
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith(
      "age",
      expect.stringContaining("Mindestens"),
    )
  })

  it("max error uses custom translation", () => {
    const onValidate = jest.fn()
    handleValidation(
      "number",
      "age",
      "100",
      false,
      undefined,
      50,
      undefined,
      { max: "Höchstens" },
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith(
      "age",
      expect.stringContaining("Höchstens"),
    )
  })

  it("validates custom regex with delimiter and flags (covers m[2]?.replace branch)", () => {
    const onValidate = jest.fn()
    // Pattern with delimiters and 'i' flag — exercises the m truthy path with flags
    handleValidation(
      "input",
      "field",
      "HELLO",
      false,
      undefined,
      undefined,
      "/^hello$/i",
      undefined,
      onValidate,
    )
    expect(onValidate).toHaveBeenCalledWith("field")
  })
})
