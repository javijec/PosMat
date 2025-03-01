import DOMPurify from 'dompurify';

export const sanitizeHtml = (html) => {
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  return clean;
};
