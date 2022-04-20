import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import LinesEllipsis from 'react-lines-ellipsis'
import Truncate from 'react-truncate'
import CourseLoader from '../FeedLoader/CourseLoader'
import Grid from '@material-ui/core/Grid'
import { startCase, toLower } from 'lodash'
import Link from '@material-ui/core/Link'
import axios from 'axios'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  container: {
    width: '100%',
    position: 'relative',
    overflowY: 'hidden',
    height: '12rem'
  },
  title: {
    position: 'relative',
    fontSize: '22px',
    fontWeight: 600,
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    width: '500px',
    [theme.breakpoints.down('xs')]: {
      width: '70vw'
    }
  },
  previewContainer: {
    textDecoration: 'none',
    color: '#fafafa',
    '&:visited': {
      textDecoration: 'none',
      color: '#fafafa'
    },
    maxHeight: '800px'
  },
  description: {
    position: 'relative',
    fontSize: '18px',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
    fontWeight: 100,
    wordWrap: 'break-all'
  },
  subject: {
    fontSize: '16px',
    bottom: 0,
    fontWeight: 50
  },
  icon: {
    width: 20,
    height: 20,
    backgroundColor: 'primary',
    [theme.breakpoints.down('xs')]: {
      height: 25,
      width: 25,
      margin: 0
    },
    filter: 'brightness(0) invert(1)'
  },
  crownIcon: {
    width: '20px',
    height: '20px',
    marginLeft: 0,
    backgroundColor: 'primary',
    [theme.breakpoints.down('xs')]: {
      height: 25,
      width: 25,
      margin: 0
    }
  },
  previewData: {
    position: 'absolute',
    top: 0,
    backgroundColor: theme.palette.M900,
    textAlign: 'left',
    zIndex: 5,
    padding: '0% 3%',
    width: '94%'
  }
})

const { BACKEND_API, VERGIL_SEARCH } = process.env
const ICON_ROOT_PATH = '/images/icons'

class CourseComp extends Component {
  state = {
    name: '',
    description: '',
    subject: '',
    courseId: '',
    altTitle: '',
    courseTime: '',
    isLoading: true
  }
  componentDidMount () {
    this.fetchCourseInfo()
  }

  async fetchCourseInfo () {
    try {
      const { caption } = this.props
      const courseInfo = (await axios.get(`${BACKEND_API}/courses/${caption}`)).data
      const name = courseInfo.name
      const subject = courseInfo.subject.long_name
      const courseId = courseInfo.courseId
      const firstCourseName = courseInfo.classes[0].title
      const daysAndTimes = courseInfo.classes[0].days_times
      const courseTime = daysAndTimes[0] ? daysAndTimes[0].time : ''
      const altTitle = startCase(toLower(firstCourseName)) // convert from all caps to title case
      let _description = courseInfo.classes[0].description
      _description = _description ? _description.replace(/\s\s+/g, ' ') : _description
      const description = _description ? _description.replace(/<[^>]*>?/gm, '') : ''// remove html tags from string
      this.setState({ name, description, subject, courseId, altTitle, courseTime, isLoading: false })
    } catch (err) {
      console.log(err)
      this.setState({ isLoading: false })
    }
  }

  render () {
    const { classes } = this.props
    const { name, description, subject, courseId, altTitle, courseTime, isLoading } = this.state
    if (isLoading) {
      return <CourseLoader />
    }
    const fullDescText = `(${courseId}) ${description}`

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <div className={classes.previewContainer}>
            <div className={classes.previewData}>
              <Grid container
                direction='row'
                alignItems='center'
              >
                <Grid
                  item
                >
                  <div className={classes.icon}
                    style={{ marginRight: '10px' }}
                  >
                    <img
                      src={`${ICON_ROOT_PATH}/book.svg`}
                      alt={description}
                    />
                  </div>
                </Grid>
                <Grid item>
                  <Link href={`${VERGIL_SEARCH}/${courseId}`}>
                    <div className={classes.title}
                      style={{
                        fontSize: name && name.length > 45 ? '18px' : '22px'
                      }}
                    >
                      <LinesEllipsis
                        basedOn='letters'
                        ellipsis='...'
                        maxLine='2'
                        text={name || altTitle}
                        trimRight
                      />
                    </div>
                  </Link>
                </Grid>
                <Grid item>
                  <img className={classes.crownIcon}
                    src={`${ICON_ROOT_PATH}/crown.png`}
                    alt='crown'
                  />
                </Grid>
              </Grid>
              <p className={classes.description}>
                {/* react-line-ellipsis was a bit buggy for this case, used another component instead */}
                <Truncate
                  ellipsis='...'
                  lines='3'
                  trimRight
                > {fullDescText}
                </Truncate >
              </p>
              <div style={{ overflow: 'hidden' }}>
                <p className={classes.subject}
                  style={{ float: 'left' }}
                >{subject.toUpperCase()}</p>
                <p className={classes.subject}
                  style={{ float: 'right' }}
                >{courseTime}</p>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

CourseComp.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

export default (withStyles(styles)(CourseComp))
