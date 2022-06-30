import { useRouter } from 'next/router'
import ProfileHeader from '../../components/ProfileHeader'
import {
  FlexBox,
  GradientTypography,
  ProfilePicture,
  YupContainer,
  YupPageHeader,
  YupPageWrapper
} from '../../components/styles'
import { useSocialLevel } from '../../hooks/queries'
import { LOADER_TYPE } from '../../constants/enum'
import withSuspense from '../../hoc/withSuspense'
import { useState } from 'react';
import YupPageTabs from '../../components/YupPageTabs';
import { Grid, Typography } from '@mui/material';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import UserPosts from '../../components/UserPosts';
import useDevice from '../../hooks/useDevice';
import { levelColors } from '../../utils/colors';

const PROFILE_TAB_IDS = {
  PROFILE: 'profile',
  WALLET: 'wallet',
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

  if (!username) return null;

  const { avatar, quantile } = profile;

  return (
    <YupPageWrapper>
      <YupPageHeader scrolled={windowScrolled}>
        <ProfileHeader
          profile={profile}
          hidden={isMobile && windowScrolled}
        />
        <YupPageTabs
          tabs={[
            { label: 'Profile', value: PROFILE_TAB_IDS.PROFILE },
            { label: 'Wallet', value: PROFILE_TAB_IDS.WALLET },
            { label: 'Analytics', value: PROFILE_TAB_IDS.ANALYTICS },
            { label: 'Collections', value: PROFILE_TAB_IDS.COLLECTIONS }
          ]}
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
                {profile.username}
              </GradientTypography>
            </FlexBox>
          )}
        />
      </YupPageHeader>
      <YupContainer>
        <Grid container spacing={5}>
          {/* User Posts */}
          <Grid item xs={12} md={8} lg={7}>
            <UserPosts userId={profile._id} />
          </Grid>

          {/* User Collections */}
          <Grid item md={4} lg={5}>
            <Typography variant="h2">
              Collections
            </Typography>
          </Grid>
        </Grid>
      </YupContainer>
    </YupPageWrapper>
  )
};

export default withSuspense(LOADER_TYPE.DEFAULT)(UserAccountPage);
