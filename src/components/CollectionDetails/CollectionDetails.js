import { PageLayout } from '../styles';
import { useState, Suspense } from 'react';
import CollectionHeader from './CollectionHeader';
import CollectionList from './CollectionList';
import useDevice from '../../hooks/useDevice';
import { useCollection } from '../../hooks/queries';
import YupTabs from '../YupTabs';
import LoadingSpin from '../LoadingSpin';
import RecommendationList from './RecommendationList';
import { Box, Container } from '@mui/material';
import YupHead from '../YupHead';
import { PageBody } from '../../_pages/pageLayouts'

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
  const collection = useCollection(id);
  const [headerMinimized, setHeaderMinimized] = useState(false);
  const [currentTab, setCurrentTab] = useState(TabValues.FEED);
  const isTabMode = !isDesktop;

  return (
    <Box sx={{ height: '100vh', width: '100vw' }}>
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
        <CollectionHeader collection={collection} minimized={headerMinimized} />
        {isTabMode && (
          <YupTabs
            tabs={TabData}
            value={currentTab}
            onChange={(tab) => setCurrentTab(tab)}
          />
        )}
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
    </Box>
  );
};

export default CollectionDetails;
