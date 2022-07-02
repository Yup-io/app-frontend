import { styled } from '@mui/material';
import YupImage from '../YupImage';
import { FlexBox } from '../styles';

export const CollectionCardRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 120,
  borderRadius: 12,
  overflow: 'hidden'
}));

export const CollectionOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.M900}E0  75%, ${theme.palette.M900} 100%)`,
  border: `solid 1px ${theme.palette.M750}`
}));

export const CollectionImage = styled(YupImage)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  maxHeight: '100%',
  aspectRatio: '1 / 1',
  objectFit: 'cover'
}));

export const CollectionContent = styled(FlexBox)(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  padding: theme.spacing(1.5)
}));
