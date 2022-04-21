import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import withStyles from '@mui/styles/withStyles'
import { withRouter } from 'react-router-dom'
import deburr from 'lodash/deburr'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateSearchListPosts } from '../../redux/actions/list-search.actions'
import { parseSettings } from '../../utils/yup-list'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import isEqual from 'lodash/isEqual'

const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  root: {
    position: 'relative',
    borderRadius: '0.65rem',
    border: '0px solid #fff',
    backgroundColor: theme.palette.alt.second,
    '&:hover': {
      backgroundColor: theme.palette.alt.third
    },
    justifyContent: 'flex-start',
    width: '',
    fontFamily: 'Gilroy',
    fontWeight: '300',
    color: '#fff',
    maxWidth: '80vw'
  },
  searchIcon: {
    width: '10vw',
    height: '100%',
    marginLeft: '10px',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    color: theme.palette.common.first,
    maxWidth: '5vw',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
    marginLeft: '0px',
    flexWrap: 'wrap'
  },
  inputInput: {
    color: 'inherit',
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(6),
    transition: theme.transitions.create('width'),
    width: '',
    maxWidth: '1000vw',
    [theme.breakpoints.up('sm')]: {
      width: '200px'
    },
    [theme.breakpoints.down('md')]: {
      width: '25vw'
    },
    flexGrow: 1
  }
})

class YupListSearchBar extends Component {
  updListData (posts) {
    const { dispatch } = this.props
    dispatch(updateSearchListPosts({ posts, initialLoad: false, hasMore: false, isSearch: true }))
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  setInitialSearchLoad = () => {
    const { dispatch } = this.props
    dispatch(updateSearchListPosts({ posts: [], initialLoad: true }))
  }

  onSearchEnter = async (event) => {
    if (event.key === 'Enter') {
      try {
        if (this.searchInput.value === '') {
          return
        }
        this.setInitialSearchLoad()
        let input = deburr(this.searchInput.value.trim()).toLowerCase()
        this.searchInput.value = ''
        let posts = (await axios.get(`${BACKEND_API}/search`, {
          params: {
            searchText: input,
            limit: 30,
            list: this.props.searchInfo.listType,
            category: this.props.settings.category.name
          }
        })).data
        this.updListData(posts)
      } catch (err) {
        this.updListData([])
      }
      event.preventDefault()
    }
  }

  searchInputRef = (input) => { this.searchInput = input }

  render () {
    const { classes, settings } = this.props
    const displaySearchStyle = settings.searchEnabled ? { display: 'block' } : { display: 'none' }
    return (
      <ErrorBoundary>
        <div
          className={classes.root}
          style={displaySearchStyle}
        >
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <TextField
            InputProps={{
              inputRef: this.searchInputRef,
              classes: {
                root: classes.inputRoot,
                input: classes.inputInput
              },
              disableUnderline: true
            }}
            onKeyPress={this.onSearchEnter}
          />
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { router, yupListSettings } = state
  const config = {
    site: router.location.query.site,
    subject: router.location.query.subject,
    category: router.location.query.category
  }

  const { listOptions } = yupListSettings
  const settings = parseSettings(config, listOptions)
  return {
    account: state.scatterRequest.account,
    settings,
    searchInfo: state.updateSearchListPosts
  }
}

YupListSearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  searchInfo: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(YupListSearchBar)))
