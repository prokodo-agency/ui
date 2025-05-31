import { createIsland } from '@/helpers/createIsland'

import AccordionServer from './Accordion.server'

import type { AccordionProps } from './Accordion.model'

export const Accordion = createIsland<AccordionProps>({
  name: 'Accordion',
  Server: AccordionServer,
  loadLazy: () => import('./Accordion.lazy'),
  isInteractive: () => true,
})