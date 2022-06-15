const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
export const isValidEmail = (email) => EMAIL_RE.test(email);

const MIRROR_REGEX =
  /^((http:|https:)([/][/]))?(www.)?[a-z]*?.mirror.xyz(\/)?[^/]*[/]?$/;

export const windowExists = () => {
  return typeof window !== 'undefined';
};

export const getDefaultImage = () =>
  `https://app-gradients.s3.amazonaws.com/gradient${
    Math.floor(Math.random() * 5) + 1
  }.png`;

export const DEFAULT_IMAGE_PATH = getDefaultImage();

export const isNftUrl = (url) => {
  if (!url) return false;

  const regExp = new RegExp(
    '^(app.rarible.com|www.app.rarible.com|http://app.rarible.com|https://app.rarible.com|http://www.app.rarible.com|https://www.app.rarible.com|rarible.com/token/|www.rarible.com/token/|http://rarible.com/token/|https://rarible.com/*/|opensea.io/assets/|www.opensea.io/assets/|http://opensea.io/assets/|https://opensea.io/assets/|superrare.co/|www.superrare.co/|http://superrare.co/|https://superrare.co/|foundation.app/*/|www.foundation.app/*/|http://foundation.app/*/|https://foundation.app/*/|zora.co/|www.zora.co/|http://zora.co/|https://zora.co/)'
  );

  return url.match(regExp);
};

export const isCollectionUrl = (url) => {
  if (!url) return false;

  const regExp = new RegExp(
    '^(app.yup.io/collections/|www.app.yup.io/collections/|http://app.yup.io/collections/|https://app.yup.io/collections/)'
  );

  return url.match(regExp);
};

export const calc2dArrayItems = (arr) => {
  return arr
    .map((item) => item.length || 0)
    .reduce((prev, curr) => prev + curr, 0);
};

export const isMirrorUrl = (url) => MIRROR_REGEX.test(url);
