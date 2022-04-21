import React from 'react'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import { Card, Grid, Typography, Skeleton } from '@mui/material'

const styles = theme => ({
  avatarImage: {
    width: 92,
    height: 92,
    minHeight: 92,
    minWidth: 92,
    fontSize: '70px',
    marginTop: '0px',
    marginBottom: '-4px',
    borderRadius: '100%',
    border: 'solid 3px #DADADA',
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
    background: `${theme.palette.alt.third}dd`,
    backgroundSize: 'cover',
    maxWidth: '100%',
    position: 'relative',
    borderRadius: '0.5rem',
    border: `0px solid ${theme.palette.common.fourth}10`,
    boxShadow: `0px 0px 40px ${theme.palette.alt.first}02`,
    [theme.breakpoints.down('sm')]: {
      width: '100vw'
    }
  },
  chartheader: {
    padding: theme.spacing(2)
  },
  text: {
    color: `${theme.palette.common.third}AA`,
    fontWeight: 400
  },
  Skeleton: {
    background: theme.palette.alt.fourth
  }
})

const LineChart = (props) => {
  const color = '#00E08E'
  const { classes, chartData, chartTitle, headerNumber } = props
  if (chartData && chartData.data && headerNumber) {
    const chart = {
      series: [
        chartData
      ],
      chart: {
        redrawOnWindowResize: true,
        fontFamily: 'Gilroy, sans-serif',
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 5,
          left: 0,
          blur: 3,
          opacity: 0.3,
          color: color
        },
        type: 'area',
        height: 150,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {},
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        colors: [color]
      },
      stroke: {
        colors: [color],
        curve: 'smooth',
        show: true,
        width: 3
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            fontSize: '12px'
          }
        },
        crosshairs: {
          show: false,
          position: 'front',
          stroke: {
            width: 1,
            dashArray: 3
          }
        }
      },
      yaxis: {
        labels: {
          show: false,
          style: {
            fontSize: '12px'
          }
        }
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px'
        },
        marker: {
          show: false
        },
        fixed: {
          enabled: true,
          position: 'topRight' },
        y: {
          formatter: function (val) {
            return val.toFixed(2) + ' YUP'
          }
        }
      },
      markers: {
        strokeWidth: 3
      }
    }
    return (
      <Card elevation='0'
        className={`${classes.card}`}
      >
        <div className='mixed-chart'>
          <div className={classes.chartheader} >
            <Grid container
              direction='column'
              spacing={2}
            >
              <Grid item>
                <Typography align='left'
                  variant='h5'
                >
                  {chartTitle}
                </Typography>
              </Grid>
              <Grid item>
                <Typography align='left'
                  className={classes.chart}
                  style={{ color: color }}
                  variant='h4'
                >
                  ☺ {headerNumber.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </div>
          <Chart
            options={chart}
            series={chart.series}
            type='area'
            width='100%'
            height='200'
          />
        </div>
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
            <Grid item
              xs={12}
            >
              <Skeleton variant='rectangular'
                animation='wave'
                className={classes.Skeleton}
                width={'100%'}
                height={160}
              />
            </Grid>
          </Grid>
        </div>
      </Card>
    )
  }
}

LineChart.propTypes = {
  classes: PropTypes.object.isRequired,
  chartData: PropTypes.array.isRequired,
  chartTitle: PropTypes.string.isRequired,
  headerNumber: PropTypes.string.isRequired
}
export default withStyles(styles)(LineChart)
