import { create } from "@/helpers/bem"

import styles from "./Skeleton.module.scss"

import type { SkeletonProps } from "./Skeleton.model"
import type { FC } from "react"

const bem = create(styles, "Skeleton")

export const Skeleton: FC<SkeletonProps> = ({
  width = "100%",
  height = "16px",
  variant = "rectangular",
  animation = "wave", // "wave" | "pulse" | "none"
  className,
}) => (
  <div
    style={{ width, height }}
    className={bem(
      undefined,
      {
        [variant]: true,
        [animation]: true, // adds --wave / --pulse / --none
      },
      className,
    )}
  />
)
