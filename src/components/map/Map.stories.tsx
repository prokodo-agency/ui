import { Map } from "./Map"

import type { MapMarker } from "./Map.model"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "prokodo/common/Map",
  component: Map,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Map>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    apiKey: "",
    center: {
      lat: 48.13913,
      lng: 11.58022,
    },
    marker: [
      {
        position: {
          lat: 48.13913,
          lng: 11.58022,
        },
      },
      {
        position: {
          lat: 48.141904,
          lng: 11.600267,
        },
      },
      {
        position: {
          lat: 48.149234,
          lng: 11.579997,
        },
      },
      {
        position: {
          lat: 48.132052,
          lng: 11.560758,
        },
      },
    ] as MapMarker[],
  },
}
