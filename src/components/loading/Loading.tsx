import { create } from "@/helpers/bem" // BEM helper function for class names

import styles from "./Loading.module.scss" // SCSS module for custom styles

import type { LoadingProps } from "./Loading.model"
import type { FC } from "react"

const bem = create(styles, "Loading")

export const Loading: FC<LoadingProps> = ({ className, size = "sm" }) => (
  <div
    className={bem(undefined, undefined, className)}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
    }}
  >
    {/* SVG Gradient Definition */}
    <svg height={0} style={{ position: "absolute" }} width={0}>
      <defs>
        <linearGradient
          className={bem("gradient")}
          id="loading-gradient"
          x1="0%"
          x2="0%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" />
          <stop offset="50%" />
          <stop offset="100%" />
        </linearGradient>
      </defs>
    </svg>

    {/* Custom Circular Progress Component */}
    <div
      className={bem("animation", {
        [`size-${size}`]: true,
      })}
      style={{
        borderRadius: "50%",
        border: `4px solid transparent`, // Transparent border for empty space
        borderTop: `4px solid`, // Apply color for top border only
        animation: `${styles.spin} 1s linear infinite`, // Define animation for spinning
        background: `conic-gradient(from 0deg at 50% 50%, url(#loading-gradient) 0deg 360deg)`, // Create a conic gradient
      }}
    />
  </div>
)

Loading.displayName = "Loading"
