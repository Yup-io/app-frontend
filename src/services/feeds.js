import { FEED_CATEGORIES } from '../constants/data'
import { appMetaImagesUrl } from '../config'

export const getFeedCategory = (categoryName) => Object.values(FEED_CATEGORIES).find((item) => item.id === categoryName);
export const getFeedCategoryWithDefault = (categoryName) => getFeedCategory(categoryName) || FEED_CATEGORIES.DEFAULT;

export const getFeedCategoryMetaImage = (categoryName) => {
  const imageFileName = categoryName === FEED_CATEGORIES.MIRROR.name ? 'mirror-meta.jpg' : 'main-meta.jpg';

  return `${appMetaImagesUrl}/${imageFileName}`;
}
