import { styled } from '@mui/material'

export const TruncateTextRoot = styled('div')(({ lines }) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  textOverflow: 'ellipsis',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': `${lines || 1}`,
}));
