import { Suspense } from 'react';
import { useRouter } from 'next/router'
import CollectionDetails from '../../../components/CollectionDetails'
import PageLoader from '../../../components/PageLoader'


const Collections = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id) return null;

  return (
    <Suspense fallback={<PageLoader />}>
      <CollectionDetails id={id} />
    </Suspense>
  );
};

export default Collections;
