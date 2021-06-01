import React, { Component, Fragment } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ReactCrop from 'react-image-crop'
import './ReactCrop.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DoneIcon from '@material-ui/icons/Done'
import IconButton from '@material-ui/core/IconButton'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Dropzone from 'react-dropzone'
import Grid from '@material-ui/core/Grid'
import { updateAccountInfo } from '../../redux/actions'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import UserAvatar from '../UserAvatar/UserAvatar'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import { Buffer } from 'buffer'

const IPFS = require('ipfs-http-client')
const BACKEND_API = process.env.BACKEND_API
const ipfsApi = new IPFS({ host: 'ipfs2.yup.io', port: '443', protocol: 'https', apiPath: '/api/v0' })

const styles = theme => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'inherit'
    }
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1.5)
  },
  dialogTitleText: {
    fontFamily: 'Gilroy',
    fontWeight: '300',
    color: '#fafafa'
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: '#fafafa'
    }
  },
  input: {
    color: '#fafafa',
    cssUnderline: {
      '&:after': {
        borderBottomColor: '#fafafa'
      }
    },
    marginBottom: '20px',
    fontFamily: 'Gilroy'
  },
  inputRoot: {
    color: '#fafafa'
  },
  inputInput: {
    color: '#fafafa'
  },
  inputUnderline: {
    borderBottomColor: '#fafafa'
  },
  inputImage: {
    display: ''
  },
  textField: {
    color: '#fafafa',
    flexWrap: 'none',
    fontFamily: 'Gilroy'
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
    height: '30px'
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
    margin: '0',
    img: {
      verticalAlign: 'bottom',
      width: '30%',
      maxHeight: '',
      objectFit: 'contain'
    }
  },
  dropzone: {
    width: '200px',
    height: '200px',
    background: 'transparent',
    minHeight: ''
  },
  dropzoneImg: {
    width: '200px',
    height: '200px',
    marginTop: 0,
    borderRadius: '50%'
  },
  editButton: {
    fontFamily: 'Gilroy',
    flex: 1,
    fontSize: '10px',
    backgroundColor: 'transparent',
    marginTop: '5px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '8px'
    }
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
})

const theme = createMuiTheme({
  palette: {
    primary: { main: '#fff' },
    secondary: { main: '#fff' },
    third: { main: '#00eab7' }
  },
  button: {
    width: 16,
    height: 16,
    padding: 5
  },
  icon: {
    width: 30,
    height: 30,
    color: 'primary'
  },
  stats: {
    fontFamily: 'Gilroy',
    color: '#fff'
  },
  MuiInputBase: {
    root: {
      color: '#fafafa'
    }
  }
})

class EditProfile extends Component {
  state = {
    files: [],
    bio: this.props.accountInfo.bio,
    avatar: this.props.accountInfo.avatar,
    fullname: this.props.accountInfo.fullname,
    ethAddress: this.props.accountInfo.ethInfo ? this.props.accountInfo.ethInfo.address : '',
    cropTime: false,
    crop: {
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25,
      aspect: 1
    },
    snackbarOpen: false,
    snackbarContent: '',
    open: false
  }

  imageRef = null
  ipfs = ipfsApi

  handleDialogOpen = () => {
    this.setState({ open: true })
  }

  handleDialogClose = () => {
    const { files } = this.state
    files.forEach(file => {
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    this.setState({ open: false, files: [] })
  }

  onDrop = files => {
    try {
      if (files.length === 0) {
        // TODO: Add more specific error handling
        this.handleSnackbarOpen('Photo is too large! Only files under 70 MB are accepted')
        return
      }

      this.setState({
        files: files.map(file => ({
          preview: URL.createObjectURL(file),
          file: file
        })),
        cropTime: !!files[0]['type'].includes('image')
      })
    } catch (err) {
      this.handleSnackbarOpen('Failed to upload file. Try again later.')
    }
  }

  cropComplete = async () => {
    const { files, pixelCrop } = this.state
    let file = files[0]['file']
    let img = await this.getCroppedImg(this.imageRef, pixelCrop, file['name'])
    this.setState({
      files: [{
        preview: URL.createObjectURL(img),
        file: img
      }],
      cropTime: false
    })
  }

  onImageLoaded = (ref, pixelCrop) => {
    this.imageRef = ref
    this.setState({ pixelCrop: { ...pixelCrop } })
  }

  getCroppedImg = async (image, pixelCrop, fileName) => {
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = await canvas.getContext('2d')

    await ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    return new Promise((resolve, reject) => {
      let bb = null
      canvas.toBlob(async (blob) => {
        if (blob == null) { return }
        blob.name = fileName
        bb = blob
        resolve(bb)
      }, 'image/jpeg')
    })
  }

  onCropChange = (crop, pixelCrop) => {
    this.setState({
      crop: { ...crop },
      pixelCrop: { ...pixelCrop }
    })
  }

  saveToIpfs = () => {
    return new Promise((resolve, reject) => {
      try {
        const { files } = this.state
        if (files.length === 0) {
          return
        }
        const reader = new window.FileReader()
        reader.onload = async () => {
          const buf = await Buffer.from(reader.result)
          let res = await this.ipfs.add(buf, { recursive: true })
          const fileHash = res.path
          await axios.post(`${BACKEND_API}/ipfs/pin`, { fileHash })
          resolve(fileHash)
        }

        reader.readAsArrayBuffer(files[0].file)
      } catch (err) {
          console.log(err)
          reject(err)
        }
    })
  }

  handleRemoveCurrentPhoto = () => {
    this.setState({ avatar: '' })
  }

  handleSnackbarOpen = (msg) => {
   this.setState({ snackbarOpen: true, snackbarContent: msg })
 }

 handleSnackbarClose = () => {
   this.setState({ snackbarOpen: false, snackbarContent: '' })
 }

 handleAccountInfoChange = update => {
   this.setState({ ...update })
 }

 handleBioChange = (e) => {
   this.handleAccountInfoChange({ bio: e.target.value })
 }

 handleFullnameChange = (e) => {
   this.handleAccountInfoChange({ fullname: e.target.value })
 }

//  handleEthAddresssChange = (e) => {
//   this.handleAccountInfoChange({ ethAddress: e.target.value })
// }

  handleAccountInfoSubmit = async () => {
    try {
      const { account, accountInfo, dispatch, ethAuth } = this.props
      if (account == null) {
        this.handleSnackbarOpen('Download the Yup extension to edit your profile')
        return
      }

      let { avatar, bio, fullname, files, cropTime, ethAddress } = this.state
      let avatarHash

      if (cropTime) {
        this.handleSnackbarOpen(`Crop your photo before saving!`)
        return
      }

      if (files.length > 0) {
        avatarHash = await this.saveToIpfs() // Save avatar to ipfs and retrieve file hash
        if (avatarHash == null) {
          this.handleSnackbarOpen(`Failed to edit your profile. Try again later. `)
          return
        }

        avatar = `https://ipfs2.yup.io/ipfs/${avatarHash}` // hashToUrl(avatarHash)
      }

      if (bio.trim() === accountInfo.bio &&
        fullname.trim() === accountInfo.fullname &&
        avatar.trim() === accountInfo.avatar && ethAddress.trim() === accountInfo.ethAddress) {
        this.handleSnackbarOpen(`Must specify different bio, fullname, or avatar to update`)
        return
      }

      const update = {}
      if (bio) { update.bio = bio }
      if (avatar) { update.avatar = avatar || accountInfo.avatar }
      if (fullname) { update.fullname = fullname }
      if (ethAddress) { update.eth_address = ethAddress }

      await dispatch(updateAccountInfo(account, update, ethAuth))
      this.handleDialogClose()
    } catch (err) {
      this.handleDialogClose()
      this.handleSnackbarOpen('Failed to update account info. Try again later')
    }
  }

  componentWillUnmount () {
    const { files } = this.state
    files.forEach(file => {
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
  }

  render () {
    const { cropTime, files, crop } = this.state
    const { username, classes } = this.props

    const Snack = (props) => (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={4000}
        className={classes.snackUpper}
        onClose={this.handleSnackbarClose}
        open={this.state.snackbarOpen}
      >
        <SnackbarContent
          className={classes.snack}
          message={this.state.snackbarContent}
        />
      </Snackbar>
    )

    const EditButton = (props) => (
      <Button className={classes.editButton}
        color='primary'
        onClick={this.handleDialogOpen}
        variant='outlined'
      >
        Edit
      </Button>
    )

    const filePreview = (files[0] && files[0].preview) || ''
    const filename = files[0] && files[0].name

    const CropIcon = (props) => {
      if (cropTime) {
        return (
          <Grid item>
            <IconButton onClick={this.cropComplete}>
              <DoneIcon style={{ color: 'white', marginRight: '8px' }} />
              <Typography style={{ color: 'white' }} >Crop</Typography>
            </IconButton>
          </Grid>
        )
      }
      return null
    }

    const RemovePhoto = (props) => {
      if (!cropTime &&
        files.length === 0 &&
        this.state.avatar !== ''
      ) {
        return (
          <Button
            align='right'
            color='primary'
            onClick={this.handleRemoveCurrentPhoto}
            style={{ fontFamily: 'Gilroy' }}
          >
            Remove Current Photo
          </Button>
        )
      }
      return null
    }

    return (
      <ErrorBoundary>
        <Fragment>
          <Snack />
          <EditButton />
          <Dialog
            aria-labelledby='form-dialog-title'
            onClose={this.handleDialogClose}
            open={this.state.open}
            className={classes.dialog}
            PaperProps={{
              style: {
                backgroundColor: '#0A0A0A',
                borderRadius: '25px',
                boxShadow: '0px 0px 20px 6px rgba(255, 255, 255, 0.1)',
                width: '80%',
                padding: '1rem 0.5rem',
                maxWidth: '500px',
                color: '#fafafa'
              }
            }}
            BackdropProps={{
              style: {
                backdropFilter: 'blur(3px)'
              }
            }}
          >
            <MuiThemeProvider theme={theme}>
              <DialogTitle className={classes.dialogTitle}
                id='form-dialog-title'
              >
                <Typography variant='h3'
                  className={classes.dialogTitleText}
                >
                  Edit Profile
                </Typography>
              </DialogTitle>
              <DialogContent style={{ margin: '20px' }}>
                <Grid
                  container
                  direction='row'
                  style={{ justifyContent: 'space-evenly' }}
                >
                  <Grid item>
                    {!cropTime
                    ? <div className={classes.dropzoneContainer}>
                      <Dropzone
                        accept='image/*'
                        className={classes.dropzone}
                        maxSize={70000000}
                        onDrop={this.onDrop}
                      >{
                          files.length > 0
                            ? <UserAvatar
                              align='center'
                              alt='Preview'
                              className={classes.previewStyle}
                              height='auto'
                              key={filename}
                              src={filePreview}
                              width='100%'
                              />
                          : <div style={{ width: '250px', height: '250px' }}>
                            <UserAvatar
                              align='center'
                              alt='Add'
                              username={username}
                              className={classes.dropzoneImg}
                              style={{ fontSize: '100px' }}
                              height='auto'
                              src={this.state.avatar}
                              width='100%'
                            />
                          </div>

                        }

                      </Dropzone>
                    </div>
                    : <ReactCrop
                      crop={crop}
                      imageStyle={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        marginTop: 0,
                        maxWidth: '100%',
                        maxHeight: '400px'
                      }}
                      onChange={this.onCropChange}
                      onImageLoaded={this.onImageLoaded}
                      src={filePreview}
                      />
                  }
                    <CropIcon />
                    <RemovePhoto />
                  </Grid>
                  <Grid item
                    container
                    alignItems='center'
                  >
                    <TextField
                      className={classes.textField}
                      defaultValue={this.state.fullname}
                      fullWidth
                      id='name'
                      inputProps={{ maxLength: 17, borderBottomColor: '#fafafa' }}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          input: classes.inputInput,
                          underline: classes.inputUnderline
                        },
                        className: classes.input }}
                      InputLabelProps={{
                        style: {
                          color: '#a0a0a0'
                        }
                      }}
                      label='Name'
                      onChange={this.handleFullnameChange}
                      type='text'
                    />
                    <TextField
                      className={classes.textField}
                      defaultValue={this.state.bio}
                      color='#fafafa'
                      fullWidth
                      id='bio'
                      inputProps={{ maxLength: 140 }}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          input: classes.inputInput
                        },
                        className: classes.input }}
                      InputLabelProps={{
                        style: {
                          color: '#a0a0a0'
                        }
                      }}
                      label='Bio'
                      multiline
                      onChange={this.handleBioChange}
                      type='text'
                    />
                    <TextField
                      autoFocus
                      className={classes.textField}
                      defaultValue={this.state.ethAddress}
                      fullWidth
                      disabled
                      id='name'
                      inputProps={{ maxLength: 250 }}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          input: classes.inputInput
                        },
                        className: classes.input }}
                      InputLabelProps={{
                        style: {
                          color: '#a0a0a0'
                        }
                      }}
                      label='ETH Address'
                      multiline
                      type='text'
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  color='primary'
                  onClick={this.handleDialogClose}
                  style={{ fontFamily: 'Gilroy' }}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={this.handleAccountInfoSubmit}
                  style={{ fontFamily: 'Gilroy', backgroundColor: '#00eab7' }}
                >
                  Update
                </Button>
              </DialogActions>
            </MuiThemeProvider>
          </Dialog>
        </Fragment>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { account: ethAccount } = state.ethAuth
  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  let account = scatterIdentity || state.ethAccount

  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }

  const ethAuth = !scatterIdentity && state.ethAuth.account ? state.ethAuth : null

  return {
    account,
    ethAuth,
    scatter: state.scatterRequest.scatter
  }
}

EditProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  ethAuth: PropTypes.object,
  accountInfo: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(EditProfile))
