import type {
  LoadingBaseProps,
  LoadingColor,
  LoadingOverlayProps,
  LoadingSize,
} from "./Loading.model"
import type { FC } from "react"

/** Maps a LoadingColor value to a CSS color expression. */
const colorToCSS: Record<LoadingColor, string> = {
  // "inherit" explicitly targets the adaptive foreground token so the spinner
  // stays visible regardless of light/dark mode instead of blindly inheriting
  // a parent color that may match the background.
  inherit: "var(--pk-color-fg)",
  primary: "var(--pk-color-brand)",
  secondary: "var(--pk-color-accent)",
  success: "var(--pk-color-success)",
  error: "var(--pk-color-error)",
  info: "var(--pk-color-fg)",
  warning: "var(--pk-color-warning)",
  white: "var(--pk-palette-white)",
}

/** px per size */
const PX: Record<LoadingSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

export const SpinnerView: FC<LoadingBaseProps> = ({
  className,
  style,
  /* istanbul ignore next */
  size = /* istanbul ignore next */ "sm",
  /* istanbul ignore next */
  ariaLabel = /* istanbul ignore next */ "Loading",
  reducedMotion,
  color,
}) => {
  const s = PX[size]
  const r = s / 2
  const stroke = Math.max(2, Math.round(s / 12))
  const radius = r - stroke

  const arcPath = describeArc(0, 0, radius, -20, 270)

  return (
    <svg
      aria-label={ariaLabel}
      className={className}
      height={s}
      role="status"
      viewBox={`0 0 ${s} ${s}`}
      width={s}
      style={{
        display: "inline-block",
        ...(color
          ? ({
              "--pk-loading-color": colorToCSS[color],
              color: colorToCSS[color],
            } as React.CSSProperties)
          : undefined),
        ...style,
      }}
    >
      <defs>
        <linearGradient
          id="ui-loading-gradient"
          x1="0%"
          x2="0%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <g transform={`translate(${r} ${r})`}>
        {/* track */}
        <circle
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth={stroke}
        />
        {/* spinner arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#ui-loading-gradient)"
          strokeLinecap="round"
          strokeWidth={stroke}
        >
          {!Boolean(reducedMotion) && (
            <animateTransform
              attributeName="transform"
              dur="0.9s"
              from="0 0 0"
              repeatCount="indefinite"
              to="360 0 0"
              type="rotate"
            />
          )}
        </path>
      </g>
    </svg>
  )
}

export const OverlayView: FC<
  LoadingOverlayProps & { resolvedBackdrop: "light" | "dark" }
> = ({
  className,
  style,
  /* istanbul ignore next */
  size = /* istanbul ignore next */ "xl",
  /* istanbul ignore next */
  ariaLabel = /* istanbul ignore next */ "Loading",
  /* istanbul ignore next */
  show = /* istanbul ignore next */ true,
  blur = 0,
  zIndex = 9999,
  reducedMotion,
  resolvedBackdrop,
  color,
}) => {
  if (!show) return null
  const bg =
    resolvedBackdrop === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"
  return (
    <div
      className={className}
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        backdropFilter: blur ? `blur(${blur}px)` : undefined,
        WebkitBackdropFilter: blur ? `blur(${blur}px)` : undefined,
        zIndex,
        ...style,
      }}
    >
      <SpinnerView
        ariaLabel={ariaLabel}
        color={color}
        reducedMotion={reducedMotion}
        size={size}
      />
    </div>
  )
}

/* helpers */
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
function describeArc(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
) {
  const startPt = polarToCartesian(cx, cy, r, end)
  const endPt = polarToCartesian(cx, cy, r, start)
  const largeArcFlag = end - start <= 180 ? /* istanbul ignore next */ "0" : "1"
  return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${endPt.x} ${endPt.y}`
}
