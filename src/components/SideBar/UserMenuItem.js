import { Badge, Grow, ListItemAvatar, ListItemText } from '@mui/material';
import { formatWeight } from '../../utils/helpers';
import { StyledProfileAvatar } from '../TopBarAndDrawer/StyledProfileAvatar';
import { levelColors } from '../../utils/colors';
import { MENU_ANIMATION_DURATION } from '../../constants/const';
import { useSocialLevel } from '../../hooks/queries';
import useAuth from '../../hooks/useAuth';
import { withCustomSuspense } from '../../hoc/withSuspense';
import useDevice from '../../hooks/useDevice';
import { useSideBar } from './SideBarContext';
import { MenuItemButton } from './styles';
import YupLogoMenuItem from './YupLogoMenuItem';
import Link from '../Link';

const UserMenuItem = () => {
  const { open } = useSideBar();
  const { isDesktop } = useDevice();
  const { name: username } = useAuth();
  const profile = useSocialLevel(username);

  return (
    <MenuItemButton
      className="LogoLink"
      sx={{ flexGrow: 0, justifyContent: 'center' }}
      component={Link}
      href={`/account/${username}`}
    >
      <ListItemAvatar sx={{ minWidth: 0 }}>
        <Badge
          color="secondary"
          overlap="circular"
          badgeContent={formatWeight(profile.weight)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <StyledProfileAvatar
            username={profile.username}
            socialLevelColor={levelColors[profile.quantile]}
            avatar={profile.avatar}
          />
        </Badge>
      </ListItemAvatar>
      <Grow in={open} timeout={MENU_ANIMATION_DURATION}>
        <ListItemText
          primary={profile.username}
          primaryTypographyProps={{ align: 'right', variant: isDesktop ? 'body' : 'h5' }}
          secondary={profile && `${profile.weight} YUP`}
          secondaryTypographyProps={{ variant: isDesktop ? 'bodyS2' : 'h6', align: 'right' }}
          sx={{ display: !open && 'none' }}
        />
      </Grow>
    </MenuItemButton>
  );
};

export default withCustomSuspense(YupLogoMenuItem)(UserMenuItem);
