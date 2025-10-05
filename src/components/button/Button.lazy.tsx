"use client"
import { createLazyWrapper } from "@/helpers/createLazyWrapper"

import ButtonClient from "./Button.client"
import ButtonServer from "./Button.server"

import type { ButtonProps } from "./Button.model"

/* Just export the generated wrapper */
export default createLazyWrapper<ButtonProps>({
  name: "Button",
  Client: ButtonClient,
  Server: ButtonServer,
})
