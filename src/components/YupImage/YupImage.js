import { DEFAULT_IMAGE_PATH } from '../../utils/helpers';
import { useState } from 'react';

const YupImage = ({ src, alt, ...restProps }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const srcList = Array.isArray(src)
    ? src.filter((item) => Boolean(item))
    : [src];
  const imagePath =
    imageIndex >= srcList.length ? DEFAULT_IMAGE_PATH : srcList[imageIndex];

  const handleError = () => {
    setImageIndex((oldIndex) => oldIndex + 1);
  };

  return <img src={imagePath} alt={alt} onError={handleError} {...restProps} />;
};

export default YupImage;
