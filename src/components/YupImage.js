import { useImage } from 'react-image';
import { DEFAULT_IMAGE_PATH } from '../utils/helpers'
import withSuspense from '../hoc/withSuspense'

const YupImage = ({ src, alt, ...restProps }) => {
  const { src: imgSrc } = useImage({
    srcList: Array.isArray(src) ? [...src, DEFAULT_IMAGE_PATH] : [src, DEFAULT_IMAGE_PATH]
  });

  return (
    <img src={imgSrc} alt={alt} {...restProps} />
  )
};

export default withSuspense()(YupImage);
