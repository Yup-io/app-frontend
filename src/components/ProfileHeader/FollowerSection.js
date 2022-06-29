import numeral from 'numeral';
import { FlexBox } from '../styles'
import NumberText from '../NumberText'

const FollowerSection = ({ rating, followers, followings }) => {
  return (
    <FlexBox columnGap={2.5}>
      <NumberText number={numeral(rating).format('0a').toUpperCase()} text="Ratings" />
      <NumberText number={followers?.length || 0} text="Followers" clickable />
      <NumberText number={followings?.length || 0} text="Following" clickable />
    </FlexBox>
  )
};

export default FollowerSection;
