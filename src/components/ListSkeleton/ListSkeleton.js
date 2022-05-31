import React, { memo } from 'react';
import { SkeletonItem } from './styles'

const SKELETON_COUNT = 6;

const ListSkeleton = () => {
  const indexArr = Array.from(Array(SKELETON_COUNT).keys());

  return (
    <React.Fragment>
      {indexArr.map((index) => (
        <SkeletonItem key={index} animation="wave" />
      ))}
    </React.Fragment>
  );
};

export default memo(ListSkeleton);
