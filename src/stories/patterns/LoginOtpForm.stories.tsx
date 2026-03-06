import { useState } from "react"

import { Button } from "@/components/button"
import { Headline } from "@/components/headline"
import { Input } from "@/components/input"
import { InputOTP } from "@/components/inputOTP"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/patterns/LoginOtpForm",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Two-step authentication flow: email/password → OTP verification. " +
          "Uses `Input` and `InputOTP`. Shows step-based UI transition.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/* ── Step 1: Credentials ──────────────────────────────────────── */

function CredentialsForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }
    // Simulate credential check
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setError(undefined)
    onSuccess()
  }

  return (
    <form
      style={{ display: "grid", gap: "1.25rem", width: "360px" }}
      onSubmit={handleSubmit}
    >
      <Headline style={{ marginTop: 0 }} type="h2">
        Sign in
      </Headline>
      <Input
        required
        autoComplete="username"
        errorText={error}
        label="Email address"
        name="email"
        placeholder="you@example.com"
        type="email"
        value={email}
        onChange={e =>
          setEmail((e as React.ChangeEvent<HTMLInputElement>).target.value)
        }
      />
      <Input
        required
        autoComplete="current-password"
        label="Password"
        name="password"
        placeholder="Min. 6 characters"
        type="password"
        value={password}
        onChange={e =>
          setPassword((e as React.ChangeEvent<HTMLInputElement>).target.value)
        }
      />
      <Button
        fullWidth
        color="primary"
        title="Continue"
        type="submit"
        variant="contained"
      />
    </form>
  )
}

/* ── Step 2: OTP ─────────────────────────────────────────────── */

function OtpForm({ onBack }: { onBack: () => void }) {
  const [error, setError] = useState<string>()

  return (
    <div style={{ display: "grid", gap: "1.25rem", width: "360px" }}>
      <Headline style={{ marginTop: 0 }} type="h2">
        Verification
      </Headline>
      <p style={{ margin: 0, color: "var(--ifm-color-emphasis-600, #666)" }}>
        Enter the 6-digit code sent to your email. (Try&nbsp;
        <strong>1&nbsp;2&nbsp;3&nbsp;4&nbsp;5&nbsp;6</strong>.)
      </p>
      <InputOTP
        errorText={error}
        label="Verification code"
        length={6}
        name="otp"
        onComplete={code => {
          if (code === "123456") {
            alert("✓ Authenticated!")
            setError(undefined)
          } else {
            setError("Invalid code. Try 1 2 3 4 5 6.")
          }
        }}
      />
      <Button
        fullWidth
        title="← Back"
        type="button"
        variant="outlined"
        onClick={onBack}
      />
    </div>
  )
}

/* ── Composed flow ───────────────────────────────────────────── */

function LoginOtpFlowDemo() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials")

  return step === "credentials" ? (
    <CredentialsForm onSuccess={() => setStep("otp")} />
  ) : (
    <OtpForm onBack={() => setStep("credentials")} />
  )
}

export const Default: Story = {
  render: () => <LoginOtpFlowDemo />,
}

export const CredentialsStep: Story = {
  render: () => <CredentialsForm onSuccess={() => {}} />,
}

export const OtpStep: Story = {
  render: () => <OtpForm onBack={() => {}} />,
}
