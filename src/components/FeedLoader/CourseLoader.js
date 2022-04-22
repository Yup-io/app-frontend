import React from 'react'
import ContentLoader from 'react-content-loader'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { useTheme } from '@mui/styles'

const PostLoader = () => {
  const { palette } = useTheme()
  return (
    <ErrorBoundary>
      <div>
        <ContentLoader
          height={16}
          primaryColor={palette.M200}
          secondaryColor='#2f2f2f'
          speed={2}
          width={400}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='117'
            x='3'
            y='6'
          />
        </ContentLoader>
        <ContentLoader
          height={8}
          primaryColor='#00E4FF'
          secondaryColor='#00FFA6'
          speed={2}
          width={400}
        >
          <rect height='3'
            rx='1'
            ry='7'
            width='105'
            x='4'
            y='0'
          />
        </ContentLoader>
        <div style={{ minWidth: '600px', background: palette.M200, borderRadius: '0.5rem', marginBottom: '10px' }} >
          <ContentLoader
            height={200}
            primaryColor={palette.M100}
            secondaryColor='#2f2f2f'
            speed={2}
            width={600}
          >
            <rect height='10'
              rx='4'
              ry='40'
              width='117'
              x='50'
              y='15'
            />
            <rect height='4'
              rx='2'
              ry='7'
              width='105'
              x='56'
              y='28'
            />
            <circle cx='25'
              cy='25'
              r='18'
            />
            <rect height='150'
              rx='4'
              ry='4'
              width='580'
              x='5'
              y='50'
            />
          </ContentLoader>
          <ContentLoader
            height={20}
            primaryColor={palette.M100}
            secondaryColor='#00FFA6'
            speed={2}
            width={600}
          >
            <rect height='10'
              rx='4'
              ry='4'
              width='50'
              x='10'
              y='10'
            />
            <rect height='10'
              rx='4'
              ry='4'
              width='50'
              x='80'
              y='10'
            />
            <rect height='10'
              rx='4'
              ry='4'
              width='50'
              x='150'
              y='10'
            />
          </ContentLoader>
          <ContentLoader
            height={16}
            primaryColor={palette.M200}
            secondaryColor='#2f2f2f'
            speed={2}
            width={600}
          >
            <rect height='10'
              rx='4'
              ry='4'
              width='400'
              x='10'
              y='3'
            />
          </ContentLoader>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default PostLoader
