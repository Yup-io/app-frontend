import React, { useState } from 'react';
import { FeedWrapper, PageContainer, ContainerRoot } from './styles';
import FeedHOC from '../Feed/FeedHOC';
import FeedHeader from './FeedHeader';

const FeedContainer = ({ categoryData }) => {
  const [isMinimize, setIsMinimize] = useState(false);
  return (
    <ContainerRoot>
      <PageContainer>
        <FeedWrapper>
          <FeedHeader isMinimize={isMinimize} categoryData={categoryData} />
          <FeedHOC
            isMinimize={isMinimize}
            setIsMinimize={setIsMinimize}
            feedType={categoryData.id}
          />
        </FeedWrapper>
      </PageContainer>
    </ContainerRoot>
  );
};

export default FeedContainer;
