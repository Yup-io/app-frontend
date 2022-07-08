import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  dialog: {
    marginLeft: 0,
    [theme.breakpoints.down('md')]: {
      marginLeft: 'inherit'
    }
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0
  },
  dialogTitleText: {
    fontFamily: 'Gilroy',
    fontWeight: 300,
    color: '#fafafa'
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: '#fafafa'
    }
  },
  user: {
    display: 'flex',
    padding: '3% 0% 3% 0%',
    paddingTop: '2%',
    alignItems: 'center'
  },
  avatar: {
    height: 30,
    paddingRight: '5%'
  },
  avatarImage: {
    width: 30,
    height: 30
  },
  previewStyle: {
    display: 'flex',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 0,
    position: 'absolute',
    objectFit: 'contain',
    width: '100%',
    height: '100%',
    minWidth: '100%',
    maxWidth: '100%',
    padding: 0,
    align: 'middle',
    borderRadius: '100%'
  },
  dropzoneContainer: {
    padding: theme.spacing(1),
    margin: 0,
    img: {
      verticalAlign: 'bottom',
      width: '30%',
      maxHeight: '',
      objectFit: 'contain'
    }
  },
  dropzone: {
    width: 200,
    height: 200,
    background: 'transparent',
    minHeight: ''
  },
  dropzoneImg: {
    width: 200,
    height: 200,
    marginTop: 0,
    borderRadius: '50%'
  },
  editButton: {
    zIndex: 1000,
    flex: 1,
    fontSize: 10,
    marginTop: theme.spacing(1),
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12
    }
  },
  removePhoto: {
    fontFamily: 'Gilroy'
  },
  snackbar: {
    position: 'absolute',
    backgroundColor: '#ff5252',
    textColor: '#f0f0f0',
    width: '8%'
  },
  snack: {
    backgroundColor: '#ff5252',
    color: '#fff8f3',
    fontWeight: 'light',
    fontFamily: 'Gilroy'
  },
  snackbarContent: {
    width: 150
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  }
}));
