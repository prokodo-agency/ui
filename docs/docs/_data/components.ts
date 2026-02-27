import data from './components.json'

export type ComponentEntry = typeof data[number]
export const components: ComponentEntry[] = data
