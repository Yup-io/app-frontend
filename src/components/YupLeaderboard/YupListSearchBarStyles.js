import { makeStyles } from '@mui/styles'

export default makeStyles(theme => ({
  root: {
    width: '15rem',
    position: 'relative',
    borderRadius: '0.65rem',
    '&:hover': {
      backgroundColor: theme.palette.M700
    }
  },
  searchIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '5vw',
    height: '100%',
    marginLeft: '10px',
    position: 'absolute',
    pointerEvents: 'none',
    color: theme.palette.M100
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(6)
  }
}));
