import React from 'react'
import withStyles from '@mui/styles/withStyles'
import { List, ListItem, ListItemText, Grow } from '@mui/material'

const { YUP_LANDING } = process.env

const styles = () => ({
  list1: {
    background: 'transparent',
    border: '0px solid #e6e6e6'
  },
  listItem: {
    borderRadius: '0.4rem',
    bottom: 0,
    marginTop: '6vh'
  },
  listInfoLinks: {
    color: '#888888'
  }
})

export const StyledSecondMenuList = withStyles(styles)(
  function SecondMenuList ({
    classes
  }) {
    return (
      <Grow in
        timeout={1000}
      >
        <List
          component='nav'
          aria-label='secondary'
          className={classes.list1}
          tourname='InfoDrawer'
        >
          <ListItem className={classes.listItem}
            button
            dense
          >
            <ListItemText>
              <p
                className={classes.listInfoLinks}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  fontWeight: 300,
                  fontSize: '12px'
                }}
              >
                <a
                  href={YUP_LANDING}
                  className={classes.listInfoLinks}
                  target='_blank'
                >
                Main Site
                </a>
              ,&nbsp;
                <a
                  href='https://yup.live'
                  className={classes.listInfoLinks}
                  target='_blank'
                >
                Explorer
                </a>
              ,&nbsp;
                <a
                  href='https://blog.yup.io'
                  className={classes.listInfoLinks}
                  target='_blank'
                >
                Blog
                </a>
              ,&nbsp;
                <a
                  href='https://docs.yup.io'
                  className={classes.listInfoLinks}
                  target='_blank'
                >
                Docs
                </a>
              ,&nbsp;
                <a
                  href='https://docs.google.com/document/d/1LFrn0eeTfiy8lWAs8TPzWeydkRI-TRCDP0_NHCBOR0s/edit?usp=sharing'
                  className={classes.listInfoLinks}
                  target='_blank'
                >
                Privacy
                </a>
              </p>
            </ListItemText>
          </ListItem>
        </List>
      </Grow>
    )
  })
