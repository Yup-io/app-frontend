import React from 'react'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import Typography from '@mui/material/Typography'
import { Card, Grid, Skeleton } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

const styles = theme => ({
  avatarImage: {
    width: 100 - theme.spacing(),
    height: 100 - theme.spacing(),
    minHeight: 100 - theme.spacing(),
    minWidth: 100 - theme.spacing(),
    fontSize: '70px',
    marginTop: '0px',
    marginBottom: '-4px',
    borderRadius: '100%',
    border: `solid 3px ${theme.palette.alt.third}`,
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      fontSize: '50px',
      marginLeft: '25px',
      marginBottom: '6vw',
      borderRadius: '100%',
      width: '70px',
      height: '70px',
      minHeight: '70px',
      minWidth: '70px'
    }
  },
  card: {
    padding: theme.spacing(2),
    background: `${theme.palette.alt.third}dd`,
    backgroundSize: 'cover',
    margin: 'auto',
    maxWidth: '100%',
    position: 'relative',
    borderRadius: '0.5rem',
    border: `0px solid ${theme.palette.common.fourth}10`,
    boxShadow: `0px 0px 40px ${theme.palette.alt.first}02`,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  chart: {
    margin: '0 0 0.75rem 0'
  },
  name: {
    color: 'contrastText'
  },
  text: {
    color: 'contrastText'
  },
  Skeleton: {
    background: `${theme.palette.alt.fourth}AA`
  }
})

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 20,
    borderRadius: 30
  },
  colorPrimary: {
    backgroundColor: '#AAAAAA50' },
  bar: {
    borderRadius: 0,
    background: 'linear-gradient(45deg,#00e08e75,#00E08E)'
  }
}))(LinearProgress)

const BarChart = ({ classes, chartData, chartTitle, color, unit }) => {
  if (chartData) {
    const chart = {
      series: [
        {
          name: 'Marine Sprite',
          data: [chartData]
        },

        {
          name: 'Marine Sprite',
          data: [100 - chartData]
        }
      ],
      chart: {
        type: 'bar',
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        },
        fontFamily: 'Gilroy, sans-serif'
      },
      colors: [color, `#AAAAAA88`],
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 50,
          barHeight: '25%'
        }
      },
      grid: {
        show: false,
        padding: {
          left: 20,
          right: 20
        } },
      stroke: {
        width: 0,
        colors: ['#fff'],
        lineCap: 'round'
      },

      fill: {
        opacity: 1

      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        enabled: false
      }

    }

    return (
      <Card className={`${classes.card}`}>
        <Grid
          spacing={3}
        >
          <Grid item
            xs={12}
          >
            <div className={classes.chartheader}
              style={{ display: 'flex', justifyContent: 'left' }}
            >
              <Grid container
                direction='row'
                alignItems='flex-end'
                className={classes.chart}
              >
                <Grid item>
                  <Typography align='left'
                    style={{ color: color }}
                    variant='h3'
                  >
                    {chartData.toFixed(0) + (unit || '')}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography align='left'
                    className={classes.text}
                    style={{ paddingLeft: '5px' }}
                    variant='h5'
                  >
                    {chartTitle}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item>
            <div>
              <BorderLinearProgress
                className={classes.chart}
                variant='determinate'
                value={chartData.toFixed(0) + (unit || '')}
              />
            </div>
          </Grid>
          <Grid item
            style={{ display: 'none' }}
          >
            <Chart
              options={chart}
              series={chart.series}
              type='bar'
              width='100%'
              height='70'
            />
          </Grid>
        </Grid>
      </Card>)
  } else {
    return (
      <Card className={`${classes.card}`}>
        <div className='mixed-chart'>
          <Grid container
            justifyContent='start'
            direction='column'
          >
            <Grid item
              xs={12}
              className={classes.chartheader}
            >
              <Typography align='left'
                variant='h4'
              >
                <Skeleton variant='text'
                  animation='wave'
                  className={classes.Skeleton}
                />
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Card>
    )
  }
}

BarChart.propTypes = {
  classes: PropTypes.object.isRequired,
  chartData: PropTypes.array.isRequired,
  chartTitle: PropTypes.string.isRequired,
  unit: PropTypes.string,
  color: PropTypes.string
}
export default withStyles(styles)(BarChart)
