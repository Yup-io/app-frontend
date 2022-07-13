import { Box, Drawer as MuiDrawer, Fab, Skeleton, styled } from '@mui/material';

export const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  left: theme.spacing(2),
  bottom: theme.spacing(2),
  zIndex: 1200,
  ...(!open && {
    width: 56,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }),
  ...(open && {
    width: 170,
    right: theme.spacing(2),
    '& .MainLink .MuiListItemIcon-root': {
      width: 20
    },
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      '& .MainLink svg': {
        height: 20
      },
      '& .FeedLink .MuiTypography-bodyS2': {
        fontSize: 15
      }
    }
  }),
  '& .MainLink': {
    height: 40
  },
  '& .LogoLink': {
    height: 50
  },
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: '100%',
    height: '100%',
    visibility: 'visible !important',
    transform: 'none !important',
    padding: theme.spacing(3.5, 1.5),
    background: `${theme.palette.M750}88`,
    border: `solid 1px ${theme.palette.M750}`,
    borderRadius: 12,
    backdropFilter: 'blur(10px)',
    rowGap: theme.spacing(5)
  }
}));

export const DrawerLogo = styled('img')(({ theme }) => ({
  width: 26,
  height: 26
}));

Drawer.defaultProps = {
  variant: 'persistent'
};

export const ExternalLinkList = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  '& > a::after': {
    content: '","',
    color: theme.palette.M500
  }
}));

export const ExternalLinkA = styled('a')(({ theme }) => ({
  textDecorationLine: 'underline',
  textDecorationColor: theme.palette.M500
}));

export const AvatarSkeleton = styled(Skeleton)(({ theme }) => ({
  width: 35,
  height: 35
}));

export const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  left: theme.spacing(3),
  bottom: theme.spacing(3),
  backgroundColor: `${theme.palette.M800}A6`,
  border: `solid 1px ${theme.palette.M750}`,
  zIndex: 1150,
  '& img': {
    width: 45
  }
}));
