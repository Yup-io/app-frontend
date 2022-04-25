
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Typography, Grid } from '@mui/material'
import Img from 'react-image'
import withStyles from '@mui/styles/withStyles'

const AWS_DEFAULT_COLLECTION_IMG_URLS = [...Array(5)].map((_, i) => `https://app-gradients.s3.amazonaws.com/gradient${i + 1}.png`)
const getRandomGradientImg = () => `${AWS_DEFAULT_COLLECTION_IMG_URLS[Math.floor(Math.random() * AWS_DEFAULT_COLLECTION_IMG_URLS.length)]}`

const styles = theme => ({
  recommendedImg: {
    height: '60px',
    width: '60px',
    objectFit: 'cover',
    marginTop: '10px',
    borderRadius: '5px',
    [theme.breakpoints.down('md')]: {
      height: '50px',
      width: '50px'
    },
    [theme.breakpoints.down('xs')]: {
      height: '40px',
      width: '40px'
    }
  },
  recommendedContainer: {
    borderRadius: 10,
    margin: '5px 0px',
    '&:hover': {
      background: '#fafafa05'
    }
  },
  recommendedImgContainer: {
    flexBasis: 'unset'
  }
})

const RecommendedCollections = ({ classes, collection }) => {
  const fmtCollectionName = collection && collection.name && collection.name.replace(/\s+/g, '-').toLowerCase()
  const collectionHref = fmtCollectionName && `/collections/${encodeURIComponent(fmtCollectionName.replace('/', ''))}/${collection._id}`

  return (
    <Link
      to={collectionHref}
      style={{ textDecoration: 'none', color: '#fff' }}
    >
      <Grid
        container
        direction='row'
        justifyContent='flex-start'
        alignItems='center'
        spacing={2}
        className={classes.recommendedContainer}
      >
        <Grid item
          xs={3}
          lg={4}
          xl={4}
          className={classes.recommendedImgContainer}
        >
          <Img
            src={[collection.imgSrcUrl, getRandomGradientImg()]}
            alt='thumbnail'
            className={classes.recommendedImg}
          />
        </Grid>
        <Grid item
          xs={9}
          lg={8}
          xl={8}
        >
          <Grid container
            spacing={1}
            direction='column'
          >
            <Grid item >
              <Typography variant='subtitle2'>{collection.name}</Typography>
            </Grid>
            <Grid item >
              <Typography variant='body2'>{collection.owner}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Link>
  )
}

RecommendedCollections.propTypes = {
  classes: PropTypes.object.isRequired,
  collection: PropTypes.array.isRequired
}

export default memo(withStyles(styles)(RecommendedCollections))
