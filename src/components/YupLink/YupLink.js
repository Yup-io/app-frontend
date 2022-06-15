import Link from 'next/link';
import { StyledLink } from './styles';

const YupLink = ({ href, children, ...restProps }) => {
  return (
    <Link href={href}>
      <StyledLink {...restProps}>{children}</StyledLink>
    </Link>
  );
};

export default YupLink;
