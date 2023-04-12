export const transitionCSS = (t: string) => `webkit-transition: ${t};
-moz-transition: ${t};
-o-transition: ${t};
transition: ${t};`;

export function formatUrl(url: string) {
  if (url.includes('://')) {
    return url;
  } else if (!url.includes(' ') && url.includes('.')) {
    return 'https://' + url;
  } else {
    return 'http://google.com/search?q=' + encodeURIComponent(url);
  }
}
