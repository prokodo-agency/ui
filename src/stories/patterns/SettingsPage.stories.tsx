import { useState } from "react"

import { Button } from "@/components/button"
import { CheckboxGroup } from "@/components/checkbox-group"
import { Headline } from "@/components/headline"
import { Input } from "@/components/input"
import { RichText } from "@/components/rich-text"
import { Select } from "@/components/select"
import { Snackbar } from "@/components/snackbar"
import { Tabs } from "@/components/tabs"

import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/patterns/SettingsPage",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Settings page pattern with grouped form sections, save feedback, and " +
          "tab navigation. Uses `Tabs`, `Input`, `Select`, and `Snackbar`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function ProfileSection() {
  const [name, setName] = useState("Alice Johnson")
  const [timezone, setTimezone] = useState("Europe/Berlin")
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <form
        style={{
          display: "grid",
          gap: "1.25rem",
          maxWidth: "480px",
          marginTop: "1.5rem",
        }}
        onSubmit={handleSubmit}
      >
        <Input
          required
          autoComplete="name"
          label="Display name"
          name="name"
          value={name}
          onChange={e =>
            setName((e as React.ChangeEvent<HTMLInputElement>).target.value)
          }
        />
        <Select
          id="settings-timezone"
          label="Timezone"
          value={timezone}
          items={[
            { value: "UTC", label: "UTC" },
            { value: "Europe/Berlin", label: "Europe/Berlin" },
            { value: "America/New_York", label: "America/New_York" },
            { value: "Asia/Tokyo", label: "Asia/Tokyo" },
          ]}
          onChange={(_, v) => setTimezone(v as string)}
        />
        <div>
          <Button
            color="primary"
            title="Save changes"
            type="submit"
            variant="contained"
          />
        </div>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
        color="success"
        message="Settings saved successfully."
        open={saved}
        onClose={() => setSaved(false)}
      />
    </>
  )
}

function NotificationsSection() {
  const [values, setValues] = useState<string[]>(["activity"])

  return (
    <div style={{ maxWidth: "480px", marginTop: "1.5rem" }}>
      <CheckboxGroup
        ariaLabel="Notification preferences"
        name="notifications"
        values={values}
        options={[
          {
            value: "activity",
            title: "New activity",
            description: "Email me about new activity on my account.",
          },
          {
            value: "digest",
            title: "Weekly digest",
            description: "A weekly summary of activity and updates.",
          },
        ]}
        onChange={setValues}
      />
    </div>
  )
}

function SettingsPageDemo() {
  return (
    <div style={{ maxWidth: "640px" }}>
      <Headline style={{ marginTop: 0 }} type="h1">
        Settings
      </Headline>
      <div style={{ marginTop: "1.5rem" }}>
        <Tabs
          ariaLabel="Settings sections"
          defaultValue="profile"
          id="settings-page-tabs"
          items={[
            {
              value: "profile",
              label: "Profile",
              content: <ProfileSection />,
            },
            {
              value: "notifications",
              label: "Notifications",
              content: <NotificationsSection />,
            },
            {
              value: "security",
              label: "Security",
              content: (
                <RichText style={{ marginTop: "1.5rem" }}>
                  Security settings — 2FA, sessions, API keys.
                </RichText>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => <SettingsPageDemo />,
}
