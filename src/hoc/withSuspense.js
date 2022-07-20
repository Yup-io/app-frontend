import React, { Suspense } from 'react';
import LoadingSpin from '../LoadingSpin';
import { LOADER_TYPE } from '../constants/enum';
import { UserConnectionSkeleton } from '../components/Skeletons';
import { FlexBox } from '../components/styles';
import FeedLoader from '../components/FeedLoader/FeedLoader';
import { Skeleton } from '@mui/material';

const withSuspense = (loaderType, repeatCount) => (Component) => (props) => {
  let loader, loaderUnit;

  switch (loaderType) {
    case LOADER_TYPE.DEFAULT:
      loaderUnit = <LoadingSpin />;
      break;
    case LOADER_TYPE.USER_CONNECTION:
      loaderUnit = <UserConnectionSkeleton />;
      break;
    case LOADER_TYPE.FEED:
      loaderUnit = <FeedLoader />;
      break;
    case LOADER_TYPE.NOTIFICATION:
      loaderUnit = <Skeleton variant="rectangular" animation="wave" height={40} sx={{ borderRadius: 1 }} />;
      break;
    default:
      loaderUnit = null;
  }

  if (loaderUnit) {
    repeatCount ||= 1;

    loader = (
      <FlexBox flexDirection="column" gap={2}>
        {[...Array(repeatCount).keys()].map((idx) => (
          <React.Fragment key={idx}>
            {loaderUnit}
          </React.Fragment>
        ))}
      </FlexBox>
    );
  }

  return (
    <Suspense fallback={loader}>
      <Component {...props} />
    </Suspense>
  );
};

export const withCustomSuspense = (LoaderComponent) => (Component) => (props) => {
  return (
    <Suspense fallback={<LoaderComponent />}>
      <Component {...props} />
    </Suspense>
  )
};

export default withSuspense;
