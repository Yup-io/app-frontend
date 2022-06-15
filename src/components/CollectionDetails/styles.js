import { Container, styled } from '@mui/material';
import YupImage from '../YupImage';

export const HeaderRoot = styled('div')(({ theme }) => ({
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

export const RecommendationWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 200,
  left: 'calc(50vw + 200px)'
}));

export const PostWrapper = styled(Container)(({ theme, center }) => ({
  display: center ? 'flex' : 'block',
  justifyContent: center ? 'center' : undefined
}));
