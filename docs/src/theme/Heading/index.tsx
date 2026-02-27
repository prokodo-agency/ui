/**
 * Swizzle: @theme/Heading
 *
 * Routes all Docusaurus heading renders (in doc pages, MDX, and layouts)
 * through @prokodo/ui Headline so the design system font/size tokens apply
 * consistently across the entire site.
 */
import type { ReactNode } from 'react';
import { Headline } from '@prokodo/ui/headline';
import type { HeadlineTypeProps } from '@prokodo/ui/headline';

interface HeadingProps {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
  className?: string;
  children?: ReactNode;
}

// Map Docusaurus heading level to @prokodo/ui Headline size token
const SIZE_MAP: Record<HeadingProps['as'], HeadlineTypeProps> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
};

export default function Heading({ as, id, className, children }: HeadingProps): ReactNode {
  return (
    <Headline type={SIZE_MAP[as]} id={id} className={className} animated={false}>
      {children}
    </Headline>
  );
}
