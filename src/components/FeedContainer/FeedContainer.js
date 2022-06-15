import { FeedWrapper, PageContainer, ContainerRoot } from './styles';
import FeedHOC from '../Feed/FeedHOC';
import FeedHeader from './FeedHeader';

const FeedContainer = ({ categoryData }) => {
  return (
    <ContainerRoot>
      <PageContainer>
        <FeedWrapper>
          <FeedHeader categoryData={categoryData} />
          <FeedHOC feedType={categoryData.id} />
        </FeedWrapper>
      </PageContainer>
    </ContainerRoot>
  );
};

export default FeedContainer;
