import { makeStyles } from '@mui/styles'

export default makeStyles((theme) => ({
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(1.5)
  },
  gridRoot: {
    flexGrow: 1
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(),
    top: theme.spacing(),
    color: 'black',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  followsButton: {
    margin: theme.spacing()
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2)
    }
  },
  user: {
    display: 'flex',
    padding: '3% 0% 3% 0%',
    paddingTop: '2%',
    alignItems: 'center'
  },
  avatar: {
    height: '30px',
    paddingRight: '5%'
  },
  avatarImage: {
    width: '30px',
    height: '30px',
    borderRadius: '50%'
  },
  progress: {
    margin: theme.spacing(2),
    color: '#ffffff'
  },
  Typography: {
    fontFamily: 'Gilroy'
  },
  text: {
    fontSize: '13px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    }
  },
  // Follow Button styles
  followButton: {
    zIndex: 1000,
    flex: 1,
    fontSize: 10,
    width: '50%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: 12
    }
  },
  snack: {
    backgroundColor: '#ff5252',
    color: '#fff8f3',
    fontWeight: 'light'
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  }
}));