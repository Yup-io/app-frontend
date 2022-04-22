import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { SnackbarContent, Snackbar, Link, Grid } from '@mui/material'
import withStyles from '@mui/styles/withStyles';
import axios from 'axios'
import { connect } from 'react-redux'
import { addUserCollection } from '../../redux/actions'
import { YupInput, LoaderButton } from '../Miscellaneous'
import { accountInfoSelector } from '../../redux/selectors'
import { getAuth } from '../../utils/authentication'
import YupDialog from '../Miscellaneous/YupDialog'

const BACKEND_API = process.env.BACKEND_API
const WEB_APP_URL = process.env.WEB_APP_URL
const TITLE_LIMIT = 30
const DESC_LIMIT = 140

const styles = theme => ({
  dialog: {
    marginLeft: '200px',
    [theme.breakpoints.down('md')]: {
      marginLeft: 'inherit'
    }
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1.5)
  },
  dialogTitleText: {
    fontSize: '1.3rem',
    fontFamily: 'Gilroy',
    fontWeight: '300',
    color: theme.palette.M100
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2),
      color: theme.palette.M100
    }
  },
  dialogContentText: {
    root: {
      paddingBottom: '2rem',
      paddingTop: '2rem'
    }
  },
  snack: {
    justifyContent: 'center'
  }
})

const CollectionDuplicateDialog = ({ collection, classes, dialogOpen, handleDialogClose, addCollectionToRedux, account }) => {
  const [description, setDescription] = useState(collection.description)
  const [name, setName] = useState(collection.name)
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newCollectionInfo, setNewCollectionInfo] = useState({})
  const handleNameChange = ({ target }) => setName(target.value)
  const handleDescriptionChange = ({ target }) => setDescription(target.value)
  const handleSnackbarOpen = msg => setSnackbarMsg(msg)
  const handleSnackbarClose = () => setSnackbarMsg('')
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !!name) handleCreateNewCollection()
  }

  const handleCreateNewCollection = async () => {
    try {
      if (isLoading) { return }
      setIsLoading(true)
      const postId = collection.postIds.filter(n => n)
      const auth = await getAuth(account)
      const params = { name, description, postId, ...auth }
      const { data } = await axios.post(`${BACKEND_API}/collections`, params)
      addCollectionToRedux(auth.eosname, data)
      setNewCollectionInfo(data)
      handleSnackbarOpen(`Succesfully duplicated ${name}`)
      handleDialogClose()
      setIsLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Snackbar
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        open={!!snackbarMsg}
      >
        <Link
          href={`${WEB_APP_URL}/collections/${encodeURIComponent(
            newCollectionInfo.name
          )}/${newCollectionInfo._id}`}
        >
          <SnackbarContent className={classes.snack}
            message={snackbarMsg}
          />
        </Link>
      </Snackbar>

      <YupDialog
        headline='Duplicate Collection'
        description='Start here to duplicate the collection.'
        buttonPosition='full'
        open={dialogOpen}
        onClose={handleDialogClose}
        onKeyDown={handleKeyDown}
        firstButton={(
          <LoaderButton onClick={handleCreateNewCollection}
            fullWidth
            buttonText='Duplicate'
            isLoading={isLoading}
            variant='contained'
            color='secondary'
          />)}>
        <Grid
          container
          direction='column'
          alignItems='stretch'
          spacing={3}
        >
          <Grid item>
            <YupInput
              fullWidth
              id='name'
              maxLength={TITLE_LIMIT}
              multiline
              label='Name'
              onChange={handleNameChange}
              type='text'
              variant='outlined'
              size='small'
              value={name}
            />
          </Grid>
          <Grid item>
            <YupInput
              fullWidth
              id='description'
              maxLength={DESC_LIMIT}
              label='Description'
              multiline
              onChange={handleDescriptionChange}
              type='text'
              variant='outlined'
              size='small'
              value={description}
            />
          </Grid>
        </Grid>
      </YupDialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  return {
    account
  }
}

const mapActionToProps = (dispatch) => {
  return {
    addCollectionToRedux: (eosname, collection) => dispatch(addUserCollection(eosname, collection))
  }
}

CollectionDuplicateDialog.propTypes = {
  collection: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  addCollectionToRedux: PropTypes.func.isRequired,
  account: PropTypes.object
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(CollectionDuplicateDialog))
