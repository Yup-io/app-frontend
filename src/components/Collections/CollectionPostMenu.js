import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  MenuItem,
  IconButton, Divider
} from '@mui/material';
import axios from 'axios';
import CollectionDialog from './CollectionDialog.js';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPostToCollection,
  removePostFromCollection, updateInitialVote
} from '../../redux/actions';
import { getAuth } from '../../utils/authentication';
import { apiBaseUrl } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleHistory, faPlus, faTrash, faBan } from '@fortawesome/pro-light-svg-icons';
import IconThreeDots from '@mui/icons-material/MoreHoriz';
import { YupMenu } from '../styles'
import useToast from '../../hooks/useToast'
import useAuth from '../../hooks/useAuth'
import { useInitialVotes } from '../../hooks/queries'
import withSuspense from '../../hoc/withSuspense'
import { deletevote } from '../../eos/actions'
import scatter from '../../eos/scatter/scatter.wallet'
import useEthAuth from '../../hooks/useEthAuth'

const CollectionPostMenu = ({ postid }) => {
  const dispatch = useDispatch();
  const ethAuth = useEthAuth();
  const { isLoggedIn, ...account } = useAuth();
  const collections = useSelector((state) => state.userCollections[account.name]?.collections);
  const vote = useInitialVotes(postid, account.name)?.[0];
  const category = 'popularity';

  const { toastSuccess, toastError } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const addToCollection = async (collection) => {
    try {
      const auth = await getAuth(account);

      setAnchorEl(null);

      const params = { postId: postid, ...auth };

      await axios.put(`${apiBaseUrl}/collections/${collection._id}`, params);

      toastSuccess(`Succesfully added to ${collection.name}`);

      dispatch(addPostToCollection(account.name, collection, postid));
    } catch (err) {
      console.error(err);
      toastError(`An error occured. Try again later.`);
    }
  };

  const removeFromCollection = async (collection) => {
    try {
      const auth = await getAuth(account);

      setAnchorEl(null);

      const params = { postId: postid, ...auth };

      await axios.put(
        `${apiBaseUrl}/collections/remove/${collection._id}`,
        params
      );

      toastSuccess(`Succesfully removed post from ${collection.name}`);

      dispatch(removePostFromCollection(account.name, collection, postid));
    } catch (err) {
      console.error(err);
      toastError(`An error occured. Try again later.`);
    }
  };

  const deleteOffchainVote = async (voteid) => {
    const { signature } = await scatter.scatter.getAuthToken();
    await axios.delete(`${apiBaseUrl}/votes/${voteid}`, {
      data: { signature }
    });
  };

  const deleteVote = async () => {
    const signedInWithEth = !scatter?.connected && !!ethAuth;
    const signedInWithTwitter =
      !scatter?.connected && !!localStorage.getItem('twitterMirrorInfo');

    if (vote.onchain === false && !signedInWithEth && !signedInWithTwitter) {
      await deleteOffchainVote(vote._id.voteid);
      dispatch(updateInitialVote(postid, account.name, category, null));
    } else {
      if (signedInWithEth) {
        await deletevote(account, { voteid: vote._id.voteid }, ethAuth);
      } else if (signedInWithTwitter) {
        await deletevote(account, { voteid: vote._id.voteid });
      } else {
        await scatter.scatter.deleteVote({
          data: { voteid: vote._id.voteid }
        });
      }
      dispatch(updateInitialVote(postid, account.name, category, null));
    }
  };

  if (!postid || !isLoggedIn) return null;

  const hasVote = Boolean(vote);
  const collectionsPageId = window.location.href.split('/').pop();

  return (
    <>
      <IconButton
        onClick={(ev) => setAnchorEl(ev.currentTarget)}
      >
        <IconThreeDots />
      </IconButton>
      <YupMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        { !hasVote && (
          <MenuItem dense onClick={deleteVote}>
            <FontAwesomeIcon icon={faBan} />
            Delete Vote
          </MenuItem>
        )}
        <MenuItem dense onClick={() => setDialogOpen(true)}>
          <FontAwesomeIcon icon={faPlus} />
          New Collection...
        </MenuItem>
        <Divider />
        {
          collections?.map((collection) => {
            if (
              !collection.postIds.includes(postid) &&
              collectionsPageId !== collection._id
            ) {
              return (
                <MenuItem
                  dense
                  key={collection._id}
                  onClick={() => addToCollection(collection)}
                >
                  <FontAwesomeIcon icon={faRectangleHistory} />
                  Add to {collection.name}
                </MenuItem>
              );
            } else {
              return (
                <MenuItem
                  dense
                  key={collection._id}
                  onClick={() => removeFromCollection(collection)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Remove from {collection.name}
                </MenuItem>
              );
            }
          })
        }
      </YupMenu>
      <CollectionDialog
        account={account}
        dialogOpen={dialogOpen}
        postid={postid}
        handleDialogClose={() => setDialogOpen(false)}
      />
    </>
  );
}

CollectionPostMenu.propTypes = {
  postid: PropTypes.string
};

export default withSuspense()(CollectionPostMenu);
