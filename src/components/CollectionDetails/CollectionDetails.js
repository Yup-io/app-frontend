import { PageLayout } from '../styles';
import { useState, Suspense, useEffect } from 'react';
import CollectionHeader from './CollectionHeader';
import CollectionList from './CollectionList';
import useDevice from '../../hooks/useDevice';
import { useCollection } from '../../hooks/queries';
import YupTabs from '../YupTabs';
import LoadingSpin from '../LoadingSpin';
import RecommendationList from './RecommendationList';
import { Box, Container } from '@mui/material';
import YupHead from '../YupHead';
import { PageBody } from '../../_pages/pageLayouts';
import YupPageHeader from '../../components/YupPageHeader';
import SideBar from '../../components/SideBar';
import { useAppUtils } from '../../contexts/AppUtilsContext';
import {
  YupPageWrapper
} from '../../components/styles'
import YupPageTabs from '../../components/YupPageTabs';

const TabValues = {
  FEED: 'feed',
  RECOMMENDED: 'recommended'
};

const TabData = [
  {
    label: 'Feed',
    value: TabValues.FEED
  },
  {
    label: 'Recommended',
    value: TabValues.RECOMMENDED
  }
];

const CollectionDetails = ({ id }) => {
  const { isDesktop } = useDevice();
  const { isMobile } = useDevice();
  const collection = useCollection(id);
  const [headerMinimized, setHeaderMinimized] = useState(false);
  const [currentTab, setCurrentTab] = useState(TabValues.FEED);
  const isTabMode = !isDesktop;
  const { windowScrolled } = useAppUtils();
  const [headerHeight, setHeaderHeight] = useState(null);
  const tabs = [
  { label: 'Profile' },
  { label: 'Analytics' }
  ];



  return (
      <YupPageWrapper>
          <YupPageHeader scrolled={windowScrolled} onChangeHeight={setHeaderHeight}>
            <CollectionHeader collection={collection} minimized={headerMinimized} />
          {isTabMode && (
            <YupTabs
              tabs={TabData}
              value={currentTab}
              onChange={(tab) => setCurrentTab(tab)}
            />
          )}
          </YupPageHeader>
        <PageBody>
          <YupHead
            title={`${collection.name} | ${collection.owner}`}
            description={collection.description}
            image={collection.coverImgSrc}
            meta={{
              'twitter:title': `${collection.name} | ${collection.owner}`,
              'twitter:image': collection.coverImgSrc,
              'twitter:description': collection.description
            }}
          />
          {(!isTabMode || currentTab === TabValues.FEED) && (
            <CollectionList
              collection={collection}
              recommendationVisible={!isTabMode}
              onScroll={(ev) => setHeaderMinimized(ev.target.scrollTop > 0)}
              headerMinimized={headerMinimized}
            />
          )}
          {isTabMode && currentTab === TabValues.RECOMMENDED && (
            <Suspense fallback={<LoadingSpin />}>
              <Container>
                <RecommendationList collection={collection} />
              </Container>
            </Suspense>
          )}
        </PageBody>
    </YupPageWrapper>
  );
};

export default CollectionDetails;
