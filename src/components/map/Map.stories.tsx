import { Map } from "./Map"

import type { MapMarker } from "./Map.model"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "prokodo/media/Map",
  component: Map,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    /* ------- required ------------------------------------ */
    apiKey: {
      control: "text",
      description: "Google Maps JS API key.",
      table: { type: { summary: "string" } },
    },
    center: {
      control: "object",
      description: "Initial map center as `{ lat, lng }` coordinates.",
      table: { type: { summary: "MapCenter" } },
    },
    /* ------- optional ------------------------------------ */
    mapId: {
      control: "text",
      description:
        "Google Maps Map ID for custom cloud-based styling. Falls back to built-in light/dark IDs when omitted.",
      table: { type: { summary: "string" } },
    },
    zoom: {
      control: { type: "number", min: 1, max: 20, step: 1 },
      description: "Initial zoom level (1 = world, 20 = building).",
      table: { type: { summary: "number" }, defaultValue: { summary: "8" } },
    },
    marker: {
      control: "object",
      description:
        "Array of map markers. Each item requires a `position: { lat, lng }` field.",
      table: { type: { summary: "MapMarker[]" } },
    },
    heading: {
      control: { type: "number", min: 0, max: 360 },
      description: "Camera heading in degrees.",
      table: { type: { summary: "number" } },
    },
    tilt: {
      control: { type: "number", min: 0, max: 67.5 },
      description: "Camera tilt in degrees.",
      table: { type: { summary: "number" } },
    },
  },
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
    zoom: 12,
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
