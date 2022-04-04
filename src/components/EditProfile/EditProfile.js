import React, { Component } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, Grid, Snackbar, SnackbarContent } from '@material-ui/core'
import ReactCrop from 'react-image-crop'
import './ReactCrop.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import DoneIcon from '@material-ui/icons/Done'
import { withStyles } from '@material-ui/core/styles'
import Dropzone from 'react-dropzone'
import { updateAccountInfo } from '../../redux/actions'
import UserAvatar from '../UserAvatar/UserAvatar'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { YupButton, YupInput } from '../Miscellaneous'
import axios from 'axios'
import { Buffer } from 'buffer'
import { accountInfoSelector, ethAuthSelector, userLevelSelector } from '../../redux/selectors'
import ConnectEth from '../../components/ConnectEth/ConnectEth'

const IPFS = require('ipfs-http-client')
const BACKEND_API = process.env.BACKEND_API
const ipfsApi = new IPFS({
  host: 'ipfs2.yup.io',
  port: '443',
  protocol: 'https',
  apiPath: '/api/v0'
})

const styles = theme => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'inherit'
    }
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0
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
    margin: 0,
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
    zIndex: 1000,
    flex: 1,
    fontSize: '10px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  },
  removePhoto: {
    fontFamily: 'Gilroy',
    marginLeft: 30
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

class EditProfile extends Component {
  state = {
    files: [],
    bio: this.props.accountInfo.bio,
    avatar: this.props.accountInfo.avatar,
    fullname: this.props.accountInfo.fullname,
    ethAddress: this.props.accountInfo.address
      ? this.props.accountInfo.ethInfo.address
      : '',
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
    open: false,
    ethOpen: false
  }

  imageRef = null
  ipfs = ipfsApi

  handleDialogOpen = () => {
    this.setState({ open: true })
  }

  handleEthDialogOpen = () => {
    this.setState({ ethOpen: true })
  }
  handleEthDialogClose = () => {
    this.setState({ ethOpen: false })
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
        this.handleSnackbarOpen(
          'Photo is too large! Only files under 70 MB are accepted'
        )
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
      files: [
        {
          preview: URL.createObjectURL(img),
          file: img
        }
      ],
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
      canvas.toBlob(async blob => {
        if (blob == null) {
          return
        }
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
        console.log(files)
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

  saveImage = async () => {
    return new Promise((resolve, reject) => {
      try {
        const { files } = this.state
        if (files.length === 0) {
          return
        }
        const file = files[0].file
        const reader = new window.FileReader()
        reader.onload = async () => {
          const body = {
            key: file.name,
            data: reader.result.split(',')[1],
            contentType: file.type
          }
         const url = await axios.post(`${BACKEND_API}/accounts/account/profileImage`, { ...body })
         resolve(url.data.url)
        }

        reader.readAsDataURL(file)
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }
  handleRemoveCurrentPhoto = () => {
    this.setState({ avatar: '' })
  }

  handleSnackbarOpen = msg => {
    this.setState({ snackbarOpen: true, snackbarContent: msg })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false, snackbarContent: '' })
  }

  handleAccountInfoChange = update => {
    this.setState({ ...update })
  }

  handleBioChange = e => {
    this.handleAccountInfoChange({ bio: e.target.value })
  }

  handleFullnameChange = e => {
    this.handleAccountInfoChange({ fullname: e.target.value })
  }

  //  handleEthAddresssChange = (e) => {
  //   this.handleAccountInfoChange({ ethAddress: e.target.value })
  // }

  handleAccountInfoSubmit = async () => {
    try {
      const { account, accountInfo, dispatch, ethAuth } = this.props

      if (account == null) {
        this.handleSnackbarOpen(
          'Download the Yup extension to edit your profile'
        )
        return
      }

      let { avatar, bio, fullname, files, cropTime, ethAddress } = this.state

      if (cropTime) {
        this.handleSnackbarOpen(`Crop your photo before saving!`)
        return
      }

      if (files.length > 0) {
        avatar = await this.saveImage() // Save avatar to ipfs and retrieve file hash
        console.log(avatar)
        if (avatar == null) {
          this.handleSnackbarOpen(
            `Failed to edit your profile. Try again later. `
          )
          return
        }
      }

      if (
        bio.trim() === accountInfo.bio &&
        fullname.trim() === accountInfo.fullname &&
        avatar.trim() === accountInfo.avatar &&
        ethAddress.trim() === accountInfo.ethAddress
      ) {
        this.handleSnackbarOpen(
          `Must specify different bio, fullname, or avatar to update`
        )
        return
      }

      const update = {}
      if (bio) {
        update.bio = bio
      }
      if (avatar) {
        update.avatar = avatar || accountInfo.avatar
      }
      if (fullname) {
        update.fullname = fullname
      }
      if (ethAddress) {
        update.eth_address = ethAddress
      }

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
    const { cropTime, files, ethOpen, crop } = this.state
    const { account, username, classes, userLevel } = this.props

    const accountInfo = userLevel
    const Snack = props => (
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

    const EditButton = props => (
      <YupButton
        className={classes.editButton}
        onClick={this.handleDialogOpen}
        variant='outlined'
        color='secondary'
      >Edit</YupButton>
    )

    const filePreview = (files[0] && files[0].preview) || ''
    const filename = files[0] && files[0].name

    const CropIcon = props => {
      if (cropTime) {
        return (
          <Grid item>
            <IconButton onClick={this.cropComplete}>
              <DoneIcon style={{ marginRight: '8px' }} />
              <Typography >Crop</Typography>
            </IconButton>
          </Grid>
        )
      }
      return null
    }

    const RemovePhoto = props => {
      if (!cropTime && files.length === 0 && this.state.avatar !== '') {
        return (
          <YupButton
            className={classes.removePhoto}
            onClick={this.handleRemoveCurrentPhoto}
          >Remove Current Photo</YupButton>
        )
      }
      return null
    }

    return (
      <ErrorBoundary>
        <>
          <Snack />
          <EditButton />
          <Dialog
            aria-labelledby='form-dialog-title'
            onClose={this.handleDialogClose}
            open={this.state.open}
            className={classes.dialog}
          >
            <DialogTitle className={classes.dialogTitle}
              id='form-dialog-title'
            >
              <Typography variant='h3'>Edit Profile</Typography>
            </DialogTitle>
            <DialogContent>
              <Grid
                container
                direction='row'
                style={{ justifyContent: 'center' }}
              >
                <Grid item>
                  {!cropTime ? (
                    <div className={classes.dropzoneContainer}>
                      <Dropzone
                        accept='image/*'
                        className={classes.dropzone}
                        maxSize={70000000}
                        onDrop={this.onDrop}
                      >
                        {files.length > 0 ? (
                          <UserAvatar
                            align='center'
                            alt='Preview'
                            className={classes.previewStyle}
                            height='auto'
                            key={filename}
                            src={filePreview}
                            width='100%'
                          />
                        ) : (
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
                        )}
                      </Dropzone>
                    </div>
                  ) : (
                    <ReactCrop
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
                  )}
                  <CropIcon />
                  <RemovePhoto />
                </Grid>
                <Grid
                  item
                  container
                  direction='column'
                  alignItems='stretch'
                  spacing={2}
                >
                  <Grid item>
                    <YupInput
                      defaultValue={this.state.fullname}
                      fullWidth
                      id='name'
                      maxLength={17}
                      label='Name'
                      onChange={this.handleFullnameChange}
                      type='text'
                      variant='outlined'
                    />
                  </Grid>
                  <Grid item>
                    <YupInput
                      defaultValue={this.state.bio}
                      fullWidth
                      id='bio'
                      maxLength={140}
                      label='Bio'
                      multiline
                      onChange={this.handleBioChange}
                      type='text'
                      variant='outlined'
                    />
                  </Grid>
                  {accountInfo &&
                  accountInfo.ethInfo &&
                  accountInfo.ethInfo.address ? (
                    <Grid item>
                      <YupInput
                        autoFocus
                        defaultValue={accountInfo.ethInfo.address}
                        fullWidth
                        disabled
                        id='name'
                        maxLength={250}
                        label='ETH Address'
                        multiline
                        type='text'
                        variant='outlined'
                      />
                    </Grid>
                  ) : (
                    <Grid item>
                      <YupButton
                        fullWidth
                        onClick={this.handleEthDialogOpen}
                        variant='outlined'
                        color='secondary'
                      >Connect Eth</YupButton>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <YupButton
                onClick={this.handleDialogClose}
                variant='contained'
                color='secondary'
              >Cancel</YupButton>
              <YupButton
                onClick={this.handleAccountInfoSubmit}
                variant='contained'
                color='secondary'
              >Update</YupButton>
            </DialogActions>
          </Dialog>
          <ConnectEth
            account={account}
            dialogOpen={ethOpen}
            handleDialogClose={this.handleEthDialogClose}
          />
        </>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  const ethAuth = ethAuthSelector(state)
  const userLevel = userLevelSelector(state)
  return {
    account,
    userLevel,
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
  userLevel: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(EditProfile))
