import { useImage } from 'react-image';
import { DEFAULT_IMAGE_PATH } from '../utils/helpers'

const YupImage = ({ src, alt, ...restProps }) => {
  const { src: imgSrc } = useImage({
    srcList: Array.isArray(src) ? [...src, DEFAULT_IMAGE_PATH] : [src, DEFAULT_IMAGE_PATH],
    useSuspense: false
  });

  return (
    <img src={imgSrc} alt={alt} {...restProps} />
  )
};

export default YupImage;
