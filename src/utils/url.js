export function trimURL(link) {
  const url = new URL(link);
  return `${url.host}${url.pathname}`;
}
export function trimURLEnd(link) {
  const url = new URL(link);
  return url.origin;
}
export function getFavicon(link) {
  if (!link) return '';

  return `${trimURLEnd(link)}/favicon.ico`;
}
