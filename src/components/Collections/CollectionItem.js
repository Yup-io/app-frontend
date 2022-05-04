
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, Paper } from '@mui/material'
import withStyles from '@mui/styles/withStyles'
import { Link } from 'react-router-dom'
import Img from 'react-image'
import { styled } from '@mui/material/styles'
import Skeleton from '@mui/material/Skeleton'

const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${Math.floor(Math.random() * 5) + 1}.png`

const CustomPaper = styled(Paper)(({ theme }) => ({
  background: 'none',
  boxShadow: 'none',
  padding: theme.spacing(1),
  '&:hover': {
    background: '#fafafa05'
  }
}))

const ImageSkeleton = styled(Skeleton)(({ theme }) => ({
  bgcolor: theme.palette.M850,
  borderRadius: '8px',
  width: '50px',
  height: '50px'
}))

const styles = theme => ({
  link: {
    textDecoration: 'none',
    color: '#fff'
  },
  collectionImg: {
    height: '60px',
    width: '60px',
    objectFit: 'cover',
    borderRadius: '5px',
    [theme.breakpoints.down('lg')]: {
      height: '50px',
      width: '50px'
    },
    [theme.breakpoints.down('sm')]: {
      height: '40px',
      width: '40px',
      marginTop: '5px'
    }
  }
})
function isValidHttpUrl (string) {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

const CollectionItem = ({ classes, collection, username }) => {
  const [hasLoaded, setHasLoaded] = useState(false)
  const fmtCollectionName = collection && collection.name.replace(/\s+/g, '-').toLowerCase()
  const collectionLength = collection.postIds.length
  const collectionSubheader = username === collection.owner
    ? collectionLength === 1
      ? `1 post`
      : `${collectionLength} posts`
    : collection.owner

  return (
    <Link
      to={`/collections/${encodeURIComponent(fmtCollectionName.replace('/', ''))}/${collection._id}`}
      className={classes.link}
    >
      <CustomPaper>
        <Grid
          container
          direction='row'
          justifyContent='flex-start'
          alignItems='center'
          spacing={2}
        >
          <Grid item
            xs={2}
            lg={3}
            xl={2}>
            <Grid
              container
              justifyContent='center'
              alignItems='center'
            >
              {!hasLoaded ? (<ImageSkeleton variant='rectangular'
                animation={false} ><Img
                  src={isValidHttpUrl(collection.imgSrcUrl) ? [collection.imgSrcUrl, DEFAULT_IMG] : DEFAULT_IMG}
                  alt='thumbnail'
                  onLoad={() => setHasLoaded(true)}
                  className={classes.collectionImg}
                /></ImageSkeleton>)
                : <Img
                  src={isValidHttpUrl(collection.imgSrcUrl) ? [collection.imgSrcUrl, DEFAULT_IMG] : DEFAULT_IMG}
                  alt='thumbnail'
                  className={classes.collectionImg}
                />}
            </Grid>
          </Grid>
          <Grid item
            xs={10}
            lg={9}
            xl={10}
          >
            <Grid container
              direction='column'
              spacing={1}
            >
              <Grid item>
                <Typography variant='subtitle2'>{!hasLoaded ? <Skeleton animation={false} /> : collection.name}</Typography>
              </Grid>
              <Grid item>
                <Typography variant='body2'>{!hasLoaded ? <Skeleton animation={false} /> : collectionSubheader}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CustomPaper>
    </Link>
  )
}

CollectionItem.propTypes = {
  classes: PropTypes.object.isRequired,
  collection: PropTypes.array.isRequired,
  username: PropTypes.string
}

export default (withStyles(styles)(CollectionItem))
