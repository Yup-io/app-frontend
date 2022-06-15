import { Suspense } from 'react';
import LoadingSpin from '../LoadingSpin';
import { LOADER_TYPE } from '../constants/enum';

const withSuspense = (loaderType) => (Component) => (props) => {
  let loader;

  switch (loaderType) {
    case LOADER_TYPE.DEFAULT:
      loader = <LoadingSpin />;
      break;
    default:
      loader = null;
  }

  return (
    <Suspense fallback={loader}>
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;
