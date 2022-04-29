import React from 'react'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import { Helmet } from 'react-helmet'
import { PageBody, TopBar } from '../pageLayouts'

function ScorePage () {
  return (
    <ErrorBoundary>
      <Helmet>
        <meta charSet='utf-8' />
        <title>  </title>
        <meta property='description'
          content=''
        />
        <meta property='image'
          content=''
        />
        <meta name='twitter:card'
          content='summary_large_image'
        />
        <meta
          name='twitter:title'
          content=''
        />
        <meta name='twitter:site'
          content='@yup_io'
        />
        <meta
          name='twitter:description'
          content=''
        />
        <meta
          name='twitter:image'
          content=''
        />
        <meta
          property='og:title'
          content=''
        />
        <meta
          property='og:description'
          content=''
        />
        <meta property='og:image'
          content=''
        />
      </Helmet>
      <TopBar >top</TopBar>
      <PageBody >hi
      </PageBody>
    </ErrorBoundary>)
}
export default ScorePage
