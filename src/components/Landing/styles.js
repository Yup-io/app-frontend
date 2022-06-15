import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  container: {
    overflowX: 'hidden',
    minHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100vw - 190px)`
    },
    [theme.breakpoints.down('sm')]: {
      backgroundSize: 'contain'
    }
  },
  link: {
    textDecoration: 'none'
  },
  page: {
    zIndex: 1,
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(4),
    minHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0
    }
  },
  linkItemContainer: {
    alignContent: 'center',
    height: '100%'
  },
  imageCard: {
    borderRadius: '0.5rem',
    width: '100%',
    aspectRatio: '1 / 1',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: theme.spacing(1),
    backgroundSize: 'cover',
    transition: '0.3s box-shadow !important',
    '&:hover': {
      boxShadow: `0 0 40px ${theme.palette.M50}30`
    }
  },
  imageCardGrid: {
    aspectRatio: '1 / 1'
  },
  recommendedImg: {
    height: '60px',
    width: '60px',
    objectFit: 'cover',
    marginTop: '10px',
    borderRadius: '5px',
    [theme.breakpoints.down('lg')]: {
      height: '50px',
      width: '50px'
    },
    [theme.breakpoints.down('sm')]: {
      height: '30px',
      width: '30px'
    }
  },
  recommendedContainer: {
    borderRadius: 10,
    margin: '5px 0',
    '&:hover': {
      background: `${theme.palette.M500}10`
    }
  },
  recommendedImgContainer: {
    flexBasis: 'unset'
  },
  bannerCard: {
    height: '100%',
    backgroundSize: 'cover',
    backdropFilter: 'blur(10px)',
    padding: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(0.5)
    },
    overflow: 'visible'
  },
  bannerMediaUser: {
    maxWidth: '40%',
    maxHeight: 190,
    bottom: '16px',
    right: '16px',
    position: 'absolute'
  },
  bannerMediaNews: {
    maxWidth: '40%',
    maxHeight: '130%',
    top: '-40px',
    right: 0,
    position: 'absolute'
  },
  titlePlain: {
    paddingBottom: theme.spacing(1),
    fontSize: theme.spacing(8),
    color: theme.palette.M50,
    lineHeight: theme.spacing(8),
    textShadow: `0 0 40px ${theme.palette.M900}33`,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(4),
      lineHeight: theme.spacing(4)
    }
  },
  subtitle: {
    color: theme.palette.M50
  }
}));
