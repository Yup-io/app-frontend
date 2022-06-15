import Fade from '@mui/material/Fade';
import { Helmet } from 'react-helmet';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import CategoryMenu from './CategoryMenu';
import SubjectMenu from './SubjectMenu';
import SiteMenu from './SiteMenu';
import YupListSearchBar from './YupListSearchBar';
import React from 'react';
import useStyles from './YupListsMenuStyles';
import useYupListSettings from '../../hooks/useYupListSettings';
import cap from 'lodash/capitalize';

const YupListsMenu = ({ isMinimize }) => {
  const classes = useStyles();
  const settings = useYupListSettings();

  const { site, preposition, category, subject } = settings;
  const siteMeta = site.altName || cap(site.displayName);
  const catMeta = category.altName || cap(category.displayName);
  const subjectMeta = subject.altName || cap(subject.displayName);

  const siteText = preposition ? `${preposition} ${siteMeta}` : '';
  const customMetaTitle = `${catMeta} ${subjectMeta} ${siteText}| Yup`;
  // TODO: The title doesn't change
  const defaultMetaTitle = 'Yup • Rate the Web. Earn & Influence.';
  const metaTitle = site.length ? customMetaTitle : defaultMetaTitle;

  const catTitleText = category.altName || cap(category.displayName);
  const subjTitleText =
    subject.altName ||
    (subject.displayName.includes('NFT')
      ? subject.displayName
      : cap(subject.displayName));
  const siteTitleText = site.altName || cap(site.displayName);
  const prepTitleText =
    preposition && siteTitleText !== 'All'
      ? `${preposition} ${siteTitleText}`
      : '';
  const dynamicListTitle = `${catTitleText} ${subjTitleText} ${prepTitleText}`;

  const hidden = isMinimize ? classes.hidden : null;
  const listTitle = isMinimize ? classes.minimizeTitle : classes.listTitle;
  const minimizeCard = isMinimize ? classes.minimizeCard : null;

  return (
    <Fade in timeout={2000}>
      <div className={classes.rootContainer}>
        <Helmet>
          <meta charSet="utf-8" />
          <title> {metaTitle} </title>
          <meta name="description" content={dynamicListTitle} />
        </Helmet>
        <div className={`${classes.infoContainer} ${minimizeCard}`}>
          <Grid
            container
            alignItems="flex-start"
            direction="column"
            tourname="LeaderboardMenu"
          >
            <Grid item>
              <Typography variant="body2" style={{ opacity: 0.3 }}>
                {' '}
                Leaderboard
              </Typography>
              <Typography variant="h3" className={listTitle}>
                {' '}
                {dynamicListTitle}
              </Typography>
            </Grid>
            <Grid
              item
              container
              spacing={1}
              justifyContent="space-between"
              className={`${classes.filters} ${hidden}`}
              tourname="ListsFilters"
            >
              <Grid item container spacing={1} sm={9}>
                <Grid item>
                  <CategoryMenu />
                </Grid>
                <Grid item>
                  <SubjectMenu />
                </Grid>
                <Grid item>
                  <SiteMenu />
                </Grid>
              </Grid>
              <Grid item sm={3} className={classes.search}>
                <YupListSearchBar />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </Fade>
  );
};

export default YupListsMenu;
