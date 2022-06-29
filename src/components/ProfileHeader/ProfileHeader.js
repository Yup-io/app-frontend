import { FlexBox, GradientTypography, YupContainer } from '../styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ProfilePicture } from './styles'
import { levelColors } from '../../utils/colors'
import { useFollowers, useFollowings } from '../../hooks/queries'
import FollowerSection from './FollowerSection'
import { Chip, Typography } from '@mui/material';
import { etherscanUrl, formatDecimal, shortenEthAddress, twitterUrl } from '../../utils/helpers';
import YupLogoEmoji from './YupLogoEmoji';
import useDevice from '../../hooks/useDevice';
import CountUp from 'react-countup';

const ProfileHeader = ({ profile }) => {
  const { isMobile, isDesktop } = useDevice();
  const {
    quantile,
    avatar,
    username,
    _id: id,
    total_vote_value: rating,
    ethInfo,
    twitterInfo,
    weight: yupScore,
    balance
  } = profile;
  const followings = useFollowings(id);
  const followers = useFollowers(id);

  const userColor = levelColors[quantile || 'none'];

  return (
    <YupContainer sx={{ pt: 3, pb: 3 }}>
      <FlexBox columnGap={4}>
        <ProfilePicture src={avatar} alt={username} border={userColor}>
          {username}
        </ProfilePicture>
        <FlexBox flexGrow={1} flexDirection="column" rowGap={1}>
          <FlexBox alignItems="center">
            <FlexBox flexGrow={1} alignItems="center" columnGap={1.5}>
              <GradientTypography variant="h2">
                {username}
              </GradientTypography>
              {!isMobile && ethInfo && (
                <Chip
                  icon={<FontAwesomeIcon icon={faEthereum} />}
                  label={shortenEthAddress(ethInfo.address)}
                  clickable
                  component="a"
                  href={etherscanUrl(ethInfo.address)}
                  target="_blank"
                />
              )}
              {!isMobile && twitterInfo && (
                <Chip
                  icon={<FontAwesomeIcon icon={faTwitter} />}
                  label={`@${twitterInfo.username}`}
                  clickable
                  component="a"
                  href={twitterUrl(twitterInfo.username)}
                  target="_blank"
                />
              )}
            </FlexBox>
            {isDesktop && (
              <FollowerSection
                rating={rating}
                followers={followers}
                followings={followings}
              />
            )}
          </FlexBox>
          <FlexBox alignItems="center">
            <Typography
              variant="h5"
              sx={{
                color: userColor
              }}
            >
              <CountUp end={yupScore} duration={2} useEasing={false} />
            </Typography>
            <Typography variant="body2" sx={{ ml: 1, mr: 2 }}>
              yup score
            </Typography>
            <YupLogoEmoji />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {formatDecimal(balance?.YUP || 0)}
            </Typography>
          </FlexBox>
          {!isDesktop && (
            <FollowerSection />
          )}
        </FlexBox>
      </FlexBox>

    </YupContainer>
  );
};

export default ProfileHeader;
