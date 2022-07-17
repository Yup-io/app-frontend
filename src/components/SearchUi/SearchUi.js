import { SearchLayout, SearchUiHeader } from './styles';
import { useState } from 'react';
import SearchInput from './SearchInput';
import { YupContainer } from '../styles';
import useDevice from '../../hooks/useDevice';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import IconClose from '@mui/icons-material/Close';
import YupPageTabs from '../YupPageTabs';
import SearchPosts from './SearchPosts';
import SearchPeople from './SearchPeople';
import SearchCollections from './SearchCollections';

const SEARCH_TAB_IDS = {
  POSTS: 'posts',
  PEOPLE: 'people',
  COLLECTIONS: 'collections'
};

const SearchUi = ({ onClose }) => {
  const { isMobile } = useDevice();
  const [selectedTab, setSelectedTab] = useState(SEARCH_TAB_IDS.POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(null);

  const handleScroll = (ev) => {
    setScrolled(ev.currentTarget.scrollTop > 0);
  };

  return (
    <SearchLayout onScroll={handleScroll}>
      <SearchUiHeader
        sx={{ zIndex: 1110 }}
        scrolled={scrolled}
        noborder
        onChangeHeight={setHeaderHeight}
      >
        <YupContainer sx={{ paddingTop: searchQuery ? 3 : '25vh', paddingBottom: 3 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} lg={8}>
              <SearchInput onSearch={setSearchQuery} />
            </Grid>
          </Grid>
        </YupContainer>
        <YupPageTabs
          tabs={[
            { label: 'Posts', value: SEARCH_TAB_IDS.POSTS },
            { label: 'People', value: SEARCH_TAB_IDS.PEOPLE },
            { label: 'Collections', value: SEARCH_TAB_IDS.COLLECTIONS }
          ]}
          value={selectedTab}
          onChange={setSelectedTab}
          hidden={!isMobile || !searchQuery}
        />
        <IconButton
          sx={{
            position: 'absolute',
            right: (theme) => theme.spacing(1),
            top: (theme) => theme.spacing(1)
          }}
          onClick={onClose}
        >
          <IconClose />
        </IconButton>
      </SearchUiHeader>
      {searchQuery && (
        isMobile ? (
          <YupContainer>
            {selectedTab === SEARCH_TAB_IDS.POSTS ? (
              <SearchPosts searchQuery={searchQuery} />
            ) : selectedTab === SEARCH_TAB_IDS.PEOPLE ? (
              <SearchPeople searchQuery={searchQuery} />
            ) : selectedTab === SEARCH_TAB_IDS.COLLECTIONS ? (
              <SearchCollections searchQuery={searchQuery} />
            ) : null
            }
          </YupContainer>
        ) : (
          <YupContainer>
            <Grid container spacing={3}>
              {/* Posts */}
              <Grid item md={8} lg={7}>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  Posts
                </Typography>
                <SearchPosts searchQuery={searchQuery} />
              </Grid>

              <Grid item md={4} lg={5}>
                <Box
                  sx={{
                    pt: 2,
                    position: headerHeight === null ? 'relative' : 'sticky',
                    top: headerHeight,
                    overflowY: 'auto',
                    height: headerHeight && `calc(100vh - ${headerHeight}px)`
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 3 }}>
                    People
                  </Typography>
                  <SearchPeople searchQuery={searchQuery} />
                  <Typography variant="h5" sx={{ my: 3 }}>
                    Collections
                  </Typography>
                  <SearchCollections searchQuery={searchQuery} />
                </Box>
              </Grid>
            </Grid>
          </YupContainer>
        )
      )}
    </SearchLayout>
  );
};

export default SearchUi;
