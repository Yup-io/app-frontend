import { styled, Typography } from '@mui/material';
import ReactPlayer from 'react-player/lazy';

export const LeaderboardItemRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: theme.spacing(3),
  padding: theme.spacing(2, 0)
}));

export const LeaderboardItemRank = styled(Typography)(({ theme }) => ({
  textAlign: 'right',
  minWidth: 50
}));

export const AudisContentRoot = styled('div')(({ theme }) => ({
  flexGrow: 1,
  '& > iframe': {
    width: '100%',
    border: 0
  }
}));

export const LeaderboardItemThumbnailRoot = styled('div')(({ theme }) => ({
  width: 60,
  height: 60
}));

export const LeaderboardItemThumbnailImage = styled('img')(({ theme }) => ({
  width: '100%',
  aspectRatio: '1 / 1',
  objectFit: 'cover',
  borderRadius: 12
}));

export const LeaderboardItemThumbnailVideo = styled(ReactPlayer)(
  ({ theme }) => ({
    maxWidth: '100%',
    maxHeight: '100%'
  })
);

export const LeaderboardItemTitleRoot = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  textAlign: 'left'
}));
