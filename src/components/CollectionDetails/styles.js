import { Container, styled } from '@mui/material';
import YupImage from '../YupImage';

export const HeaderRoot = styled('div')(({ theme }) => ({
  marginTop: 'var(--header-height)',
  marginBottom: theme.spacing(2),
  display: 'flex',
  columnGap: theme.spacing(2),
  alignItems: 'center'
}));

export const Logo = styled(YupImage)(({ theme, size }) => ({
  width: size === 'small' ? 50 : 100,
  height: size === 'small' ? 50 : 100,
  aspectRatio: 1,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius
}));

export const PostWrapper = styled(Container)(({ theme, center }) => ({
  display: center ? 'flex' : 'block',
  justifyContent: center ? 'center' : undefined
}));
