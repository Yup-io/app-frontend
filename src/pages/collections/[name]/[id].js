import { Suspense } from 'react';
import { useRouter } from 'next/router';
import CollectionDetails from '../../../components/CollectionDetails';
import PageLoader from '../../../components/PageLoader';
import TutorialsProvider from '../../../providers/TutorialsProvider'
import { COLLECTIONS_TUTORIAL_STEPS } from '../../../constants/data'

const Collections = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id) return null;

  return (
    <Suspense fallback={<PageLoader />}>
      <TutorialsProvider steps={COLLECTIONS_TUTORIAL_STEPS}>
        <CollectionDetails id={id} />
      </TutorialsProvider>
    </Suspense>
  );
};

export default Collections;
