import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import { Typography, Card, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { Chart } from '../../dynamic-imports';

const styles = (theme) => ({
  card: {
    background: `${theme.palette.M800}dd`,
    backdropFilter: 'blur(10px)',
    backgroundSize: 'cover',
    padding: theme.spacing(2),
    maxWidth: '100%',
    position: 'relative',
    borderRadius: '12px',
    border: `0px solid ${theme.palette.M400}10`,
    boxShadow: `0px 0px 40px ${theme.palette.M900}02`,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    height: '100%'
  },
  chart: {
    color: theme.palette.M100
  },
  text: {
    color: theme.palette.M300
  },
  Skeleton: {
    background: `${theme.palette.M600}AA`
  }
});

const DonutChart = ({ classes, chartData, chartTitle, colors }) => {
  const { palette } = useTheme();

  if (chartData) {
    let series = [];
    let labels = [];
    Object.values(chartData).forEach((val, i) => {
      if (Object.keys(chartData)[i] !== 'total' && val !== 0)
        series.push(Number(val));
    });
    Object.keys(chartData).forEach((val, i) => {
      if (val !== 'total' && Object.values(chartData)[i] !== 0) {
        labels.push(val.charAt(0).toUpperCase() + val.slice(1));
      }
    });
    const chart = {
      series: series,
      chart: {
        height: 350,
        type: 'donut',
        fontFamily: 'Gilroy, sans-serif'
      },
      colors: colors,
      stroke: {
        width: 0
      },
      total: {
        show: true,
        label: 'Total Likes',
        color: palette.M100,
        formatter: function (w) {
          // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
          return chartData.total;
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '55%',
            track: {
              background: '#2b2b2b'
            },
            hollow: {
              size: '45%'
            },
            dataLabels: {
              show: true,
              name: {
                fontSize: '22px'
              },
              value: {
                fontSize: '15px',
                color: palette.M100,
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return (
                    Number(w).toFixed(2) +
                    `%(${Math.round((chartData.total * w) / 100)})`
                  );
                }
              }
            }
          }
        }
      },
      labels: labels
    };
    return (
      <Card className={`${classes.card}`}>
        <div className="mixed-chart">
          <Grid container justifyContent="start" direction="column" spacing={3}>
            <Grid item xs={12} spacing={3}>
              <Typography align="left" className={classes.chart} variant="h5">
                {chartTitle}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Chart
                options={chart}
                series={chart.series}
                type="donut"
                width="100%"
              />
            </Grid>
          </Grid>
        </div>
      </Card>
    );
  } else {
    return (
      <Card className={`${classes.card}`}>
        <div className="mixed-chart">
          <Grid container justifyContent="start" direction="column" spacing={3}>
            <Grid item xs={12} spacing={3}>
              <Typography align="left" className={classes.chart} variant="h4">
                <Skeleton
                  variant="text"
                  animation="wave"
                  className={classes.Skeleton}
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                className={classes.Skeleton}
                width={'100%'}
                height={150}
              />
            </Grid>
          </Grid>
        </div>
      </Card>
    );
  }
};

DonutChart.propTypes = {
  classes: PropTypes.object.isRequired,
  chartData: PropTypes.object.isRequired,
  chartTitle: PropTypes.string.isRequired,
  colors: PropTypes.array
};
export default withStyles(styles)(DonutChart);
