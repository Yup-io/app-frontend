import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  feedLoader: {
    backgroundSize: 'cover',
    maxWidth: '625px',
    minWidth: '250px',
    minHeight: '800px',
    margin: '0 auto',
    [theme.breakpoints.down('xl')]: {
      maxWidth: '600px'
    },
    [theme.breakpoints.down('lg')]: {
      maxWidth: 'auto'
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '85vw',
      marginleft: 0
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '98vw',
      margin: '0 0'
    }
  },
  scrollDiv: {
    overflowY: 'hidden',
    overflowX: 'hidden'
  },
  infiniteScroll: {
    display: 'inherit',
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block'
    }
  },
  container: {
    width: '100vw',
    marginBottom: 50
  },
  page: {
    overflowY: 'none',
    marginBottom: '0%',
    maxWidth: '625px',
    width: '100%',
    margin: '0 auto',
    [theme.breakpoints.down('xl')]: {
      maxWidth: '600px'
    },
    [theme.breakpoints.down('lg')]: {
      maxWidth: 'auto'
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '0%'
    }
  },
  resetScroll: {
    fontFamily: 'Gilroy',
    color: theme.palette.M50,
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: '300'
  },
  noPostsText: {
    color: theme.palette.M50
  }
}));
