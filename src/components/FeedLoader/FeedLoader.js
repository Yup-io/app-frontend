import React from 'react'
import ContentLoader from 'react-content-loader'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { useTheme } from '@mui/styles'

const FeedLoader = () => {
  const { palette } = useTheme()
  return (
    <ErrorBoundary>
      <div>
        <ContentLoader
          height={16}
          primaryColor={palette.alt.second}
          secondaryColor={palette.alt.third}
          speed={2}
          width={400}
          style={{ display: 'flex', margin: 'auto', width: '100%', paddingBottom: '10px' }}
        >
          <rect height='10'
            rx='4'
            ry='40'
            width='117'
            x='3'
            y='6'
            style={{ boxShadow: `20px 20px 20px 0px ${palette.common.first}04, -2px -2px 20px  ${palette.alt.first}06, inset 12px 3px 20px 0px ${palette.common.first}04, inset -3px -7px 17px 0px ${palette.alt.second}4a, 5px 5px 9px 0px ${palette.common.first}24, -20px -20px 12px ${palette.alt.first}06, inset 1px 1px 6px 0px ${palette.common.first}05, inset -1px -1px 2px 0px ${palette.alt.second}0f` }}
          />
        </ContentLoader>
        <ContentLoader
          height={8}
          primaryColor='#00E4FFcc'
          secondaryColor='#00FFA6cc'
          speed={2}
          width={400}
          style={{ display: 'flex', margin: 'auto', width: '100%', paddingBottom: '10px' }}
        >
          <rect height='3'
            rx='1'
            ry='7'
            width='105'
            x='4'
            y='0'
            style={{ boxShadow: `20px 20px 20px 0px ${palette.common.first}04, -2px -2px 20px  ${palette.alt.first}06, inset 12px 3px 20px 0px ${palette.common.first}04, inset -3px -7px 17px 0px ${palette.alt.second}4a, 5px 5px 9px 0px ${palette.common.first}24, -20px -20px 12px ${palette.alt.first}06, inset 1px 1px 6px 0px ${palette.common.first}05, inset -1px -1px 2px 0px ${palette.alt.second}0f` }}
          />
        </ContentLoader>
        <div style={{ width: '100%', margin: 'auto', background: `${palette.alt.second}`, borderRadius: '0.5rem', marginBottom: '10px' }} >
          <ContentLoader
            height={200}
            primaryColor={palette.alt.second}
            secondaryColor={palette.alt.third}
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
            primaryColor={palette.alt.second}
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
            primaryColor={palette.alt.second}
            secondaryColor={palette.alt.third}
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

        <ContentLoader
          height={17}
          primaryColor={palette.alt.second}
          secondaryColor={palette.alt.third}
          speed={2}
          width={400}
          style={{ display: 'flex', margin: 'auto', width: '100%', paddingBottom: '10px' }}
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
          height={10}
          primaryColor='#FFFB00cc'
          secondaryColor='#FFAE00cc'
          speed={2}
          width={400}
          style={{ display: 'flex', margin: 'auto', width: '100%', paddingBottom: '10px' }}
        >
          <rect height='3'
            rx='1'
            ry='7'
            width='105'
            x='4'
            y='0'
          />
        </ContentLoader>
        <div style={{ width: '100%', margin: 'auto', background: `${palette.alt.second}`, borderRadius: '0.5rem' }} >
          <ContentLoader
            height={250}
            primaryColor={palette.alt.second}
            secondaryColor={palette.alt.third}
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
            <rect height='200'
              rx='4'
              ry='4'
              width='580'
              x='5'
              y='50'
            />
          </ContentLoader>
          <ContentLoader
            height={20}
            primaryColor={palette.alt.second}
            secondaryColor='#FFFB00'
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
            primaryColor={palette.alt.second}
            secondaryColor={palette.alt.third}
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

export default FeedLoader
