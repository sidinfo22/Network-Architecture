import { useEffect } from 'react';

const DESCRIPTION =
  'A virtual mock blueprint for upgrading a small medical office network from basic small office infrastructure to enterprise-grade standards, covering design, inventory, deployment, hybrid cloud, cybersecurity, compliance, and scalability.';

function updateMeta(page) {
  document.title = page.title || 'Upgrading The Network';

  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', DESCRIPTION);

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('href', `${import.meta.env.BASE_URL}site/images/daters.png`);
}

export function IframePage({ page }) {
  useEffect(() => {
    updateMeta(page);
  }, [page]);

  const src = `${import.meta.env.BASE_URL}site/${page.fileName}?v=restore-2`;

  return (
    <iframe
      title={page.title}
      src={src}
      style={{
        width: '100%',
        minHeight: '100vh',
        border: '0',
        display: 'block',
        background: 'transparent',
      }}
    />
  );
}
