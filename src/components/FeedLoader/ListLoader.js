import React from 'react'
import { Skeleton } from '@mui/material';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const PostLoader = () => (
  <ErrorBoundary>
    <div>
      <div>
        <Skeleton
          style={{ margin: '16px 0px' }}
          height={60}
          animation='wave'
        />
      </div>
      <div>
        <Skeleton
          style={{ margin: '16px 0px' }}
          height={60}
          animation='wave'
        />
      </div>
      <div>
        <Skeleton
          style={{ margin: '16px 0px' }}
          height={60}
          animation='wave'
        />
      </div>
      <div>
        <Skeleton
          style={{ margin: '16px 0px' }}
          height={60}
          animation='wave'
        />
      </div>
      <div>
        <Skeleton
          style={{ margin: '16px 0px' }}
          height={60}
          animation='wave'
        />
      </div>
      <div>
        <Skeleton
          style={{ margin: '16px 0px' }}
          height={60}
          animation='wave'
        />
      </div>
    </div>
  </ErrorBoundary>
)

export default PostLoader
