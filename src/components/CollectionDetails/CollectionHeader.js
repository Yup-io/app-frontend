import { FlexBox } from '../styles';
import { HeaderRoot, Logo } from './styles';
import { DEFAULT_IMAGE_PATH } from '../../utils/helpers';
import { Container, Menu, MenuItem, Typography } from '@mui/material';
import { faShare, faCopy, faBars } from '@fortawesome/pro-solid-svg-icons';
import YupLink from '../YupLink';
import ActionIcon from '../ActionIcon';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import React, { useState } from 'react';
import {
  CollectionDuplicateDialog,
  CollectionEditDialog,
  CollectionReorderDialog
} from '../Collections';

// TODO: Implement Tour
const CollectionHeader = ({ collection, minimized }) => {
  const { toastSuccess } = useToast();
  const account = useAuth();
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const { isLoggedIn, name: username } = account;

  const handleShare = async () => {
    // eslint-disable-next-line no-restricted-globals
    await navigator.clipboard.writeText(location.href);
    toastSuccess('Copied collection to clipboard');
  };

  const { name, owner, ownerId, posts } = collection;
  const logoPath = posts?.[0]?.previewData?.img;
  const isMyCollection = username === ownerId;

  return (
    <>
      <HeaderRoot>
        <Logo
          src={[logoPath, DEFAULT_IMAGE_PATH]}
          alt={name}
          size={minimized ? 'small' : 'large'}
        />
        <FlexBox flexGrow={1} flexDirection="column">
          <Typography variant="h3">{name}</Typography>
          {!minimized && (
            <Typography variant="subtitle1">
              Curated by&nbsp;
              <YupLink href={`/account/${ownerId}`}>{owner}</YupLink>
            </Typography>
          )}
        </FlexBox>
        <FlexBox columnGap={1}>
          <ActionIcon icon={faShare} onClick={handleShare} />
          {isLoggedIn && !isMyCollection && (
            <ActionIcon
              icon={faCopy}
              onClick={() => setDuplicateModalOpen(true)}
            />
          )}
          {isMyCollection && (
            <ActionIcon
              icon={faBars}
              onClick={(ev) => setMenuAnchorEl(ev.currentTarget)}
            />
          )}
        </FlexBox>
      </HeaderRoot>

      {/* Menu */}
      <Menu
        id="collection-edit-menu"
        open={Boolean(menuAnchorEl)}
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null);
            setEditModalOpen(true);
          }}
        >
          Edit
        </MenuItem>
        {posts.length > 0 && (
          <MenuItem
            onClick={() => {
              setMenuAnchorEl(null);
              setReorderModalOpen(true);
            }}
          >
            Reorder
          </MenuItem>
        )}
      </Menu>

      {/* Modal Definition */}

      <CollectionDuplicateDialog
        collection={collection}
        account={account}
        dialogOpen={duplicateModalOpen}
        handleDialogClose={() => setDuplicateModalOpen(false)}
      />

      <CollectionEditDialog
        collection={collection}
        account={account}
        dialogOpen={editModalOpen}
        handleDialogClose={() => setEditModalOpen(false)}
      />

      <CollectionReorderDialog
        handleDialogClose={() => setReorderModalOpen(false)}
        collection={collection}
        dialogOpen={reorderModalOpen}
      />
    </>
  );
};

export default CollectionHeader;
