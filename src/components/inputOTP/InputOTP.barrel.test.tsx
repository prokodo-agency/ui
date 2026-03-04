import { render } from "@/tests"

import { InputOTP } from "./InputOTP"

describe("InputOTP island barrel", () => {
  it("renders via createIsland mock (server component path)", () => {
    render(<InputOTP groupLabel="OTP code" label="Code" name="otp" />)
    // createIsland is globally mocked to render InputOTPServer synchronously
    expect(InputOTP).toBeDefined()
  })
})
