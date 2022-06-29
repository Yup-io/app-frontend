import { Avatar, styled } from '@mui/material'

export const ProfilePicture = styled(Avatar)(({ theme, border }) => ({
  backgroundColor: theme.palette.M900,
  boxShadow: 'inset 2px 2px 0px 10px #AAAAAA10',
  width: 100,
  height: 100,
  border: `solid 3px ${border}`
}));
