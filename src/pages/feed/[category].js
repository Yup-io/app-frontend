import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import YupHead from '../../components/YupHead';
import { Suspense } from 'react';
import {
  getFeedCategoryWithDefault,
  getFeedCategoryMetaImage
} from '../../services/feeds';
import FeedContainer from '../../components/FeedContainer';
import PageLoader from '../../components/PageLoader'

const Feeds = () => {
  const { query } = useRouter();
  const { category } = query;

  const categoryData = getFeedCategoryWithDefault(category);
  const metaImage = getFeedCategoryMetaImage(category);

  return (
    
    <Suspense fallback={<PageLoader />}>
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      maxWidth="100vw"
      sx={{
        overflowY: 'hidden'
      }}
    >
      <YupHead
        title={categoryData.metaTitle}
        description={categoryData.description}
        image={metaImage}
        meta={{
          'og:title': categoryData.metaTitle,
          'og:description': categoryData.description,
          'og:image': metaImage
        }}
      />
      <FeedContainer categoryData={categoryData} />
    </Box>
    </Suspense>
  );
};

export default Feeds;
