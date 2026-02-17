"use client"
import { memo, useCallback, useEffect, useState, type ChangeEvent } from "react"

import { CheckboxView } from "./Checkbox.view"

import type { CheckboxProps } from "./Checkbox.model"

function CheckboxClient<T extends string = string>(props: CheckboxProps<T>) {
  const { checked: controlledChecked, defaultChecked, onChange } = props

  const [isChecked, setIsChecked] = useState<boolean>(
    controlledChecked ?? defaultChecked ?? false,
  )

  useEffect(() => {
    if (typeof controlledChecked === "boolean") {
      setIsChecked(controlledChecked)
    }
  }, [controlledChecked])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextChecked = event.target.checked
      if (typeof controlledChecked !== "boolean") {
        setIsChecked(nextChecked)
      }
      onChange?.(event, nextChecked)
    },
    [controlledChecked, onChange],
  )

  return (
    <CheckboxView
      {...props}
      checked={undefined}
      defaultChecked={undefined}
      isChecked={isChecked}
      onChangeInternal={handleChange}
    />
  )
}

export default memo(CheckboxClient) as typeof CheckboxClient
