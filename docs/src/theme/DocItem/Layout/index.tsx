import type { ReactNode } from 'react';
import Layout from '@theme-original/DocItem/Layout';
import Admonition from '@theme/Admonition';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import componentsData from '@site/docs/_data/components.json';

type ComponentCatalogEntry = {
  slug: string;
  aic: 'server' | 'client' | 'lazy' | 'none';
};

const AIC_READY_COMPONENTS = new Set(
  (componentsData as ComponentCatalogEntry[])
    .filter((entry) => entry.aic === 'server' || entry.aic === 'client' || entry.aic === 'lazy')
    .map((entry) => entry.slug),
);

function RuntimeInfo({ componentId }: { componentId: string }): ReactNode {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();

  const componentName = componentId
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const isClientOnly = componentId === 'lottie' || componentId === 'map';
  const isAicReady = AIC_READY_COMPONENTS.has(componentId);

  if (isClientOnly) {
    return (
      <Admonition type="info" title={currentLocale === 'de' ? 'Laufzeit' : 'Runtime'}>
        <p>
          {currentLocale === 'de'
            ? `${componentName} ist client-only und läuft immer im Browser.`
            : `${componentName} is client-only and always runs in the browser.`}
        </p>
      </Admonition>
    );
  }

  if (isAicReady) {
    return (
      <Admonition type="tip" title={currentLocale === 'de' ? 'AIC-fähig' : 'AIC Ready'}>
        <p>
          {currentLocale === 'de'
            ? 'Nutze immer den Standard-Import (z. B. @prokodo/ui/button). Die Library übernimmt die Runtime-Kompatibilität für dich automatisch.'
            : 'Always use the standard import (for example @prokodo/ui/button). The library handles runtime compatibility for you automatically.'}
        </p>
      </Admonition>
    );
  }

  return (
    <Admonition type="info" title={currentLocale === 'de' ? 'Laufzeit' : 'Runtime'}>
      <p>
        {currentLocale === 'de'
          ? 'RSC-ready. Nutze einfach den Standard-Import (z. B. @prokodo/ui/list) — keine Varianten-Auswahl erforderlich.'
          : 'RSC-ready. Just use the standard import (for example @prokodo/ui/list) — no variant selection required.'}
      </p>
    </Admonition>
  );
}

export default function DocItemLayout(props: { children: ReactNode }): ReactNode {
  const { metadata } = useDoc();
  const componentPrefix = 'components/';
  const isComponentDoc = metadata.id.startsWith(componentPrefix);
  const componentId = isComponentDoc ? metadata.id.slice(componentPrefix.length) : null;

  const showRuntimeInfo = componentId && componentId !== 'overview';

  return (
    <Layout {...props}>
      {showRuntimeInfo && <RuntimeInfo componentId={componentId} />}
      {props.children}
    </Layout>
  );
}
