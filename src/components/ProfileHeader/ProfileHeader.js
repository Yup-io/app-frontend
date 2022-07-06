import { ActionButton, FlexBox, GradientTypography, ProfilePicture, YupContainer } from '../styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { levelColors } from '../../utils/colors'
import { useFollowers, useFollowings } from '../../hooks/queries'
import FollowerSection from './FollowerSection'
import { Box, Button, Chip, Typography } from '@mui/material';
import { etherscanUrl, formatDecimal, shortenEthAddress, twitterUrl } from '../../utils/helpers';
import YupLogoEmoji from './YupLogoEmoji';
import useDevice from '../../hooks/useDevice';
import CountUp from 'react-countup';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';

const ProfileHeader = ({ profile, hidden }) => {
  const { isMobile, isDesktop } = useDevice();
  const {
    quantile,
    avatar,
    username,
    fullname,
    _id: id,
    total_vote_value: rating,
    ethInfo,
    twitterInfo,
    weight: yupScore,
    balance
  } = profile;
  const { isLoggedIn, name: authName } = useAuth();
  const followings = useFollowings(id);
  const followers = useFollowers(id);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const isMyProfile = isLoggedIn && authName === id;

  const userColor = levelColors[quantile || 'none'];

  return (
    <YupContainer
      sx={{
        py: 3,
        display: hidden ? 'none' : 'block'
      }}
    >
      <FlexBox columnGap={4}>
        <ProfilePicture src={avatar} alt={username} border={userColor}>
          {username}
        </ProfilePicture>
        <FlexBox flexGrow={1} flexDirection="column" rowGap={1}>
          <FlexBox alignItems="center">
            <FlexBox flexGrow={1} alignItems="center" columnGap={1.5}>
              <GradientTypography variant="h2">
                {fullname}
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
            <FlexBox alignItems="center" columnGap={3}>
              {isDesktop && (
                <FollowerSection
                  rating={rating}
                  followers={followers}
                  followings={followings}
                />
              )}
              {isMyProfile && (
                <ActionButton onClick={() => setEditModalOpen(true)}>
                  Edit
                </ActionButton>
              )}
              {isLoggedIn && !isMyProfile && (
                <ActionButton>
                  Follow
                </ActionButton>
              )}
            </FlexBox>
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
