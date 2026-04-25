import { useEffect, useRef } from 'react';
import { pageMarkup } from './pageMarkup';
import { initializeReportEnhancements } from './reportEnhancements';

const DESCRIPTION =
  'A virtual mock blueprint for upgrading a small medical office network from basic small office infrastructure to enterprise-grade standards, covering design, inventory, deployment, hybrid cloud, cybersecurity, compliance, and scalability.';

function normalizeMarkup(markup) {
  if (!markup) return '';

  return markup
    .replace(/<nav class="dropdown-menu">[\s\S]*?<\/nav>/gi, '<nav class="dropdown-menu"><ul></ul></nav>')
    .replace(/(src|href)=["']images\//g, '$1="/site/images/')
    .replace(/url\(['"]?images\//g, 'url("/site/images/')
    .replace(/target="_blank"\s+rel="noopener noreferrer"/gi, '')
    .replace(/window\.location\.href='index\.html'/gi, "window.location.href='/'")
    .replace(/window\.location\.href='([a-z0-9-]+)\.html'/gi, "window.location.href='/$1'")
    .replace(/href="index\.html"/gi, 'href="/"')
    .replace(/href="([a-z0-9-]+)\.html"/gi, 'href="/$1"');
}

function updateMeta(page) {
  document.title = page.title || 'Upgrading The Network';

  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', DESCRIPTION);

  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute('content', DESCRIPTION);

  let twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (!twitterDescription) {
    twitterDescription = document.createElement('meta');
    twitterDescription.setAttribute('name', 'twitter:description');
    document.head.appendChild(twitterDescription);
  }
  twitterDescription.setAttribute('content', DESCRIPTION);

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('href', '/site/images/daters.png');
}

export function ReportMarkupPage({ page }) {
  const containerRef = useRef(null);
  const markup = normalizeMarkup(pageMarkup[page.fileName] || '');

  useEffect(() => {
    updateMeta(page);
  }, [page]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const cleanup = initializeReportEnhancements(container);
    return cleanup;
  }, [page.fileName]);

  return (
    <div
      ref={containerRef}
      className="react-report-page"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
