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
  removePostFromCollection
} from '../../redux/actions';
import { apiBaseUrl } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleHistory, faPlus, faTrash, faBan } from '@fortawesome/pro-light-svg-icons';
import IconThreeDots from '@mui/icons-material/MoreHoriz';
import { YupMenu } from '../styles'
import useToast from '../../hooks/useToast'
import useAuth from '../../hooks/useAuth'
import { useInitialVotes } from '../../hooks/queries'
import withSuspense from '../../hoc/withSuspense'
import {  deleteVote } from '../../apis';
import useAuthInfo from '../../hooks/useAuthInfo.js';
import ClipLoader from "react-spinners/ClipLoader";


const CollectionPostMenu = ({ postid }) => {
  const authInfo = useAuthInfo();
  const { isLoggedIn, ...account } = useAuth();
  const vote = useInitialVotes(postid, account.name)?.[0];
  const [isLoading, setIsLoading] = useState(false)
  const [hasVote, setHasVote] = useState(Boolean(vote))
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.userCollections[account.name]?.collections);

  const { toastSuccess, toastError } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const addToCollection = async (collection) => {
    try {

      setAnchorEl(null);

      const params = { postId: postid, ...authInfo };

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

      setAnchorEl(null);

      const params = { postId: postid, ...authInfo };

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


  const handleDeleteVote = async () => {
    setIsLoading(true)
    await deleteVote({ voteId: vote._id.voteid, authInfo });
    setHasVote(false)
  }
  

  if (!postid || !isLoggedIn) return null;

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
        { hasVote && (
          <MenuItem dense onClick={handleDeleteVote}>
            {!isLoading? ( <><FontAwesomeIcon icon={faBan} />
           </>): ( <ClipLoader color='white' loading={true} css={ {marginRight: "12px"}} size={15} />)}
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
