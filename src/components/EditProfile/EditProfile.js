import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import { useDispatch, connect } from 'react-redux'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { Grid, IconButton, Typography } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import YupDialog from '../Miscellaneous/YupDialog'
import { YupButton, YupInput } from '../Miscellaneous'
import UserAvatar from '../UserAvatar/UserAvatar'
import { updateAccountInfo } from '../../redux/actions'
import { apiUploadProfileImage } from '../../apis'
import useToast from '../../hooks/useToast'
import { accountInfoSelector, ethAuthSelector } from '../../redux/selectors'
import useStyles from './styles'
import { useAccount, useConnect } from 'wagmi'

// TODO: Refactor styling to Mui v5
const EditProfile = ({ username, account, accountInfo, ethAuth, setEth }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { toastError } = useToast()
  const [{ data: ethAccount }] = useAccount()
  const [{ data: { connected } }] = useConnect()

  const [connectEthClicked, setConnectEthClicked] = useState(false)
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [avatar, setAvatar] = useState(accountInfo.avatar)
  const [fullName, setFullName] = useState(accountInfo.fullname)
  const [ethAddress, setEthAddress] = useState(accountInfo.ethInfo.address || '')
  const [bio, setBio] = useState(accountInfo.bio)
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
    aspect: 1
  })
  const [pixelCrop, setPixelCrop] = useState({})
  const [cropTime, setCropTime] = useState(false)
  const [imageRef, setImageRef] = useState(null)

  const filePreview = files.length > 0 ? files[0].preview : ''
  const filename = files.length > 0 ? files[0].name : ''

  useEffect(() => {
    if (connectEthClicked && connected) {
      setEthAddress(ethAccount.address)

      if (setEth) {
        setEth(ethAccount.address)
      }

      setConnectEthClicked(false)
    }
  }, [connectEthClicked, connected])

  const handleDialogClose = () => {
    files.forEach(file => {
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })

    setOpen(false)
    setFiles([])
  }

  const saveImage = async () => {
    return new Promise((resolve, reject) => {
      try {
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
          const { url } = await apiUploadProfileImage(body)
          resolve(url)
        }

        reader.readAsDataURL(file)
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  }

  const handleAccountInfoSubmit = async () => {
    try {
      if (account == null) {
        toastError('Download the Yup extension to edit your profile')
        return
      }

      let newAvatar = avatar

      if (cropTime) {
        toastError(`Crop your photo before saving!`)
        return
      }

      if (files.length > 0) {
        newAvatar = await saveImage() // Save avatar to ipfs and retrieve file hash
        if (newAvatar == null) {
          toastError('Failed to edit your profile. Try again later.')
          return
        }
      }

      if (
        bio.trim() === accountInfo.bio &&
        fullName.trim() === accountInfo.fullname &&
        newAvatar.trim() === accountInfo.avatar &&
        ethAddress.trim() === accountInfo.ethAddress
      ) {
        toastError('Must specify different bio, fullname, or avatar to update')
        return
      }

      const update = {}
      if (bio) {
        update.bio = bio
      }
      if (newAvatar) {
        update.avatar = newAvatar || accountInfo.avatar
      }
      if (fullName) {
        update.fullname = fullName
      }
      if (ethAddress) {
        update.eth_address = ethAddress
      }

      await dispatch(updateAccountInfo(account, update, ethAuth))
      handleDialogClose()
    } catch (err) {
      handleDialogClose()
      toastError('Failed to update account info. Try again later')
    }
  }

  const handleDrop = (files) => {
    try {
      if (files.length === 0) {
        // TODO: Add more specific error handling
        toastError('Photo is too large! Only files under 70 MB are accepted')
        return
      }

      setFiles(files.map(file => ({
        preview: URL.createObjectURL(file),
        file: file
      })))
      setCropTime(!!files[0]['type'].includes('image'))
    } catch (err) {
      toastError('Failed to upload file. Try again later.')
    }
  }

  const handleCropChange = (crop, pixelCrop) => {
    setCrop({ ...crop })
    setPixelCrop({ ...pixelCrop })
  }

  const handleImageLoaded = (ref, pixelCrop) => {
    setImageRef(ref)
    setPixelCrop(pixelCrop)
  }

  const getCroppedImg = async (image, _pixelCrop, fileName) => {
    const canvas = document.createElement('canvas')
    canvas.width = _pixelCrop.width
    canvas.height = _pixelCrop.height
    const ctx = await canvas.getContext('2d')

    await ctx.drawImage(
      image,
      _pixelCrop.x,
      _pixelCrop.y,
      _pixelCrop.width,
      _pixelCrop.height,
      0,
      0,
      _pixelCrop.width,
      _pixelCrop.height
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

  const cropComplete = async () => {
    let file = files[0]['file']
    let img = await getCroppedImg(imageRef, pixelCrop, file['name'])

    setFiles([
      {
        preview: URL.createObjectURL(img),
        file: img
      }
    ])
    setCropTime(false)
  }

  // Rendering Helpers
  const EditButton = () => (
    <YupButton
      className={classes.editButton}
      onClick={() => setOpen(true)}
      variant='outlined'
      color='secondary'
      size='small'
    >Edit</YupButton>
  )

  const CropIcon = () => {
    if (!cropTime) {
      return null
    }

    return (
      <Grid item>
        <IconButton
          onClick={cropComplete}
          size='large'
        >
          <DoneIcon style={{ marginRight: '8px' }} />
          <Typography>Crop</Typography>
        </IconButton>
      </Grid>
    )
  }

  const RemovePhoto = () => {
    if (cropTime || files.length || avatar === '') {
      return null
    }

    return (
      <YupButton
        className={classes.removePhoto}
        onClick={() => setAvatar('')}
      >Remove Current Photo</YupButton>
    )
  }

  return (
    <ErrorBoundary>
      <>
        <EditButton />
        <YupDialog
          headline='Edit Profile'
          buttonPosition='right'
          open={open}
          onClose={handleDialogClose}
          className={classes.dialog}
          aria-labelledby='form-dialog-title'
          firstButton={(
            <YupButton
              onClick={handleAccountInfoSubmit}
              variant='contained'
              color='secondary'
            >Update</YupButton>)}
          secondButton={(
            <YupButton
              onClick={handleDialogClose}
              variant='contained'
              color='secondary'
            >Cancel</YupButton>)}>
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
                    onDrop={handleDrop}
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
                        src={avatar}
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
                  onChange={handleCropChange}
                  onImageLoaded={handleImageLoaded}
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
                  defaultValue={fullName}
                  fullWidth
                  id='name'
                  maxLength={17}
                  label='Name'
                  onChange={(e) => setFullName(e.target.value)}
                  type='text'
                  variant='outlined'
                />
              </Grid>
              <Grid item>
                <YupInput
                  defaultValue={bio}
                  fullWidth
                  id='bio'
                  maxLength={140}
                  label='Bio'
                  multiline
                  onChange={(e) => setBio(e.target.value)}
                  type='text'
                  variant='outlined'
                />
              </Grid>
              {ethAddress ? (
                <Grid item>
                  <YupInput
                    autoFocus
                    defaultValue={ethAddress}
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
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <YupButton
                        fullWidth
                        onClick={() => {
                          setConnectEthClicked(true)
                          openConnectModal()
                        }}
                        variant='outlined'
                        color='secondary'
                      >
                        Connect Eth
                      </YupButton>
                    )}
                  </ConnectButton.Custom>
                </Grid>
              )}
            </Grid>
          </Grid>
        </YupDialog>
      </>
    </ErrorBoundary>
  )
}

EditProfile.propTypes = {
  ethAuth: PropTypes.object,
  accountInfo: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  setEth: PropTypes.func
}

// TODO: Move to `useSelector`
const mapStateToProps = (state) => {
  const account = accountInfoSelector(state)
  const ethAuth = ethAuthSelector(state)
  return {
    account,
    ethAuth
  }
}

export default connect(mapStateToProps)(EditProfile)
