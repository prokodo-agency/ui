import BEMHelper, { type WordSet } from "react-bem-helper"

type Styles = {
  readonly [key: string]: string
}

type ClassNames = (
  element?: string,
  modifiers?: WordSet,
  extra?: WordSet,
) => string

export const COMPANY_PREFIX = "prokodo"

function create(styles: Styles, blockName: string): ClassNames {
  const prefixedName = `${COMPANY_PREFIX}-${blockName}`
  const bem = new BEMHelper({ name: prefixedName, outputIsString: true })

  return (element, modifiers, extra) => {
    const className = bem(element, modifiers, extra)
    const classNames = className.split(" ")

    return classNames
      .map(key =>
        styles[key] !== undefined && styles[key] !== "" ? styles[key] : key,
      )
      .join(" ")
  }
}

export { create }
