import { useRouter } from 'next/router'
import ProfileHeader from '../../components/ProfileHeader'
import {
  FlexBox,
  GradientTypography,
  ProfilePicture,
  YupContainer,
  YupPageWrapper
} from '../../components/styles'
import { useSocialLevel } from '../../hooks/queries'
import { LOADER_TYPE } from '../../constants/enum'
import withSuspense from '../../hoc/withSuspense'
import { useEffect, useRef, useState } from 'react';
import YupPageTabs from '../../components/YupPageTabs';
import { Box, Grid, Typography } from '@mui/material';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import UserPosts from '../../components/UserPosts';
import useDevice from '../../hooks/useDevice';
import { levelColors } from '../../utils/colors';
import UserCollectionsSection from '../../components/UserCollectionsSection/UserCollectionsSection';
import YupPageHeader from '../../components/YupPageHeader';

const PROFILE_TAB_IDS = {
  PROFILE: 'profile',
  ANALYTICS: 'analytics',
  COLLECTIONS: 'collections'
}

const UserAccountPage = () => {
  const { query } = useRouter();
  const { username } = query;
  const { isMobile } = useDevice();
  const profile = useSocialLevel(username);
  const { windowScrolled } = useAppUtils();

  const [selectedTab, setSelectedTab] = useState(PROFILE_TAB_IDS.PROFILE);
  const [headerHeight, setHeaderHeight] = useState(null);

  useEffect(() => {
    // If `Collections` tab is selected in Desktop mode, switch it to `Profile` tab.
    if (!isMobile && selectedTab === PROFILE_TAB_IDS.COLLECTIONS) {
      setSelectedTab(PROFILE_TAB_IDS.PROFILE);
    }
  }, [isMobile, selectedTab]);

  if (!username) return null;

  const { avatar, quantile } = profile;
  const tabs = [
    { label: 'Profile', value: PROFILE_TAB_IDS.PROFILE },
    { label: 'Analytics', value: PROFILE_TAB_IDS.ANALYTICS }
  ];

  if (isMobile) {
    tabs.push({ label: 'Collections', value: PROFILE_TAB_IDS.COLLECTIONS });
  }

  return (
    <YupPageWrapper>
      <YupPageHeader scrolled={windowScrolled} onChangeHeight={setHeaderHeight}>
        <ProfileHeader
          profile={profile}
          hidden={isMobile && windowScrolled}
        />
        <YupPageTabs
          tabs={tabs}
          value={selectedTab}
          onChange={setSelectedTab}
          hidden={!isMobile && windowScrolled}
          endComponent={ windowScrolled && (
            <FlexBox gap={1} alignItems="center" mr={3}>
              <ProfilePicture
                src={avatar}
                alt={username}
                size="md"
                border={levelColors[quantile || 'none']}
              />
              <GradientTypography variant="h6">
                {profile.fullname}
              </GradientTypography>
            </FlexBox>
          )}
        />
      </YupPageHeader>
      <YupContainer visible={selectedTab === PROFILE_TAB_IDS.PROFILE}>
        <Grid container spacing={5}>
          {/* User Posts */}
          <Grid item xs={12} md={8} lg={7}>
            <UserPosts userId={profile._id} />
          </Grid>

          {/* User Collections */}
          <Grid item md={4} lg={5}>
            <Box
              sx={{
                pt: 2,
                display: isMobile ? 'none' : 'block',
                position: headerHeight === null ? 'relative' : 'sticky',
                top: headerHeight === null ? undefined : headerHeight
              }}
            >
              <UserCollectionsSection userId={profile._id} />
            </Box>
          </Grid>
        </Grid>
      </YupContainer>
      <YupContainer visible={selectedTab === PROFILE_TAB_IDS.COLLECTIONS} sx={{ pt: 3 }}>
        <UserCollectionsSection userId={profile._id} />
      </YupContainer>
    </YupPageWrapper>
  )
};

export default withSuspense(LOADER_TYPE.DEFAULT)(UserAccountPage);
