import { createLazyWrapper } from '@/helpers/createLazyWrapper';

import LinkClient from './Link.client';
import LinkServer from './Link.server';


import type { LinkProps } from './Link.model';

export default createLazyWrapper<LinkProps>({
  name: 'Link',
  Client: LinkClient,
  Server: LinkServer,
});
