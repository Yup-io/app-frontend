import { useRouter } from 'next/router'
import ProfileHeader from '../../components/ProfileHeader'
import { YupPageHeader, YupPageWrapper } from '../../components/styles'
import { useSocialLevel } from '../../hooks/queries'
import { LOADER_TYPE } from '../../constants/enum'
import withSuspense from '../../hoc/withSuspense'
import useWindowScroll from '../../hooks/useWindowScroll';
import { useState } from 'react';
import YupPageTabs from '../../components/YupPageTabs';
import { Typography } from '@mui/material';

const PROFILE_TAB_IDS = {
  PROFILE: 'profile',
  WALLET: 'wallet',
  ANALYTICS: 'analytics',
  COLLECTIONS: 'collections'
}

const UserAccountPage = () => {
  const { query } = useRouter();
  const { username } = query;
  const profile = useSocialLevel(username);
  const { isScrolled } = useWindowScroll();

  const [selectedTab, setSelectedTab] = useState(PROFILE_TAB_IDS.PROFILE);

  if (!username) return null;

  return (
    <YupPageWrapper>
      <YupPageHeader scrolled={isScrolled}>
        <ProfileHeader profile={profile} />
        {!isScrolled && (
          <YupPageTabs
            tabs={[
              { label: 'Profile', value: PROFILE_TAB_IDS.PROFILE },
              { label: 'Wallet', value: PROFILE_TAB_IDS.WALLET },
              { label: 'Analytics', value: PROFILE_TAB_IDS.ANALYTICS },
              { label: 'Collections', value: PROFILE_TAB_IDS.COLLECTIONS }
            ]}
            value={selectedTab}
            onChange={setSelectedTab}
          />
        )}
      </YupPageHeader>
      <Typography variant="h1">Hello World</Typography>
    </YupPageWrapper>
  )
};

export default withSuspense(LOADER_TYPE.DEFAULT)(UserAccountPage);
