import BEMHelper, { type WordSet } from "react-bem-helper"

type Styles = {
  readonly [key: string]: string
}

type ClassNames = (
  element?: string,
  modifiers?: WordSet,
  extra?: WordSet,
) => string

function create(styles: Styles, name: string): ClassNames {
  const bem = new BEMHelper({ name, outputIsString: true })

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
