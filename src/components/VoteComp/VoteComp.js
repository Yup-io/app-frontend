import React, { Component, useEffect, useState } from 'react';
import VoteButton from '../VoteButton/VoteButton';
import PropTypes from 'prop-types';
import { useInitialVotes } from '../../hooks/queries';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import {
  apiBaseUrl,
  courseCategories,
  electionCategories,
  mapsCategories,
  nftArtCategories,
  nftMusicCategories,
  professorCategories,
  voteCategories
} from '../../config';
import useToast from '../../hooks/useToast';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { parseError } from '../../eos/error';
import {
  updateInitialVote,
  updateVoteLoading
} from '../../redux/actions';
import rollbar from '../../utils/rollbar';
import scatter from '../../eos/scatter/scatter.wallet';
import {
  deletevote,
  editvote,
  createvotev4,
  postvotev4,
  postvotev3,
  createvote
} from '../../eos/actions/vote';
import { FlexBox } from '../styles';
import { windowExists } from '../../utils/helpers';
import useAuth from '../../hooks/useAuth';
import withSuspense from '../../hoc/withSuspense';
import { useDispatch } from 'react-redux';
import useEthAuth from '../../hooks/useEthAuth';

const ratingConversion = {
  1: 2,
  2: 1,
  3: 1,
  4: 2,
  5: 3
};
const VOTE_CATEGORIES = voteCategories;
const PROF_CATEGORIES = professorCategories;
const MAPS_CATEGORIES = mapsCategories;
const COURSE_CATEGORIES = courseCategories;
const ELECTION_CATEGORIES = electionCategories;
const NFT_ART_CATEGORIES = nftArtCategories;
const NFT_MUSIC_CATEGORIES = nftMusicCategories;

function genRegEx(arrOfURLs) {
  return new RegExp(
    `^((http:|https:)([/][/]))?(www.)?(${arrOfURLs.join('|')})`
  );
}

const artPattern = genRegEx([
  'rarible.com/*',
  'app.rarible.com/*',
  'opensea.io/assets/*',
  'superrare.co/*',
  'superrare.co/*',
  'foundation.app/*/',
  'zora.co/*',
  'knownorigin.io/gallery/*'
]);
const musicPattern = genRegEx([
  'audius.co/*',
  'open.spotify.com/*',
  'soundcloud.com/*',
  'music.apple.com/us/(artist|album)/*'
]);

const VoteComp = ({
  postid,
  caption,
  weights,
  postType,
  categories: _categories,
  listType,
  postInfo,
  rating
}) => {
  const dispatch = useDispatch();
  const ethAuth = useEthAuth();
  const account = useAuth();
  const vote = useInitialVotes(postid, account.name);
  const { open: openAuthModal } = useAuthModal();
  const [newRating, setNewRating] = useState();
  const [lastClicked, setLastClicked] = useState();
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const { toastError, toastInfo } = useToast();
  const category = 'popularity';
  const { post } = postInfo;
  console.log(account.name, postid, vote, newRating);
  useEffect(() => {
    let timer1;
    if (newRating) {
      timer1 = setTimeout(() => setShouldSubmit(true), 3 * 1000);
    }

    return () => {
      setShouldSubmit(false);
      clearTimeout(timer1);
    };
  }, [newRating]);

  useEffect(() => {
    if (shouldSubmit) handleDefaultVote();
  }, [shouldSubmit]);

  useEffect(() => {
    let ups = 0;
    let downs = 0;
    categories.forEach((category) => {
      ups =
        ups + ((post.catVotes[category] && post.catVotes[category].up) || 0);
      downs =
        downs +
        ((post.catVotes[category] && post.catVotes[category].down) || 0);
    });
    setUpvotes(ups);
    setDownvotes(downs);
  }, []);

  const fetchActionUsage = async (eosname) => {
    try {
      const resData = (
        await axios.get(`${apiBaseUrl}/accounts/actionusage/${eosname}`)
      ).data;
      return resData;
    } catch (err) {
      console.error('Failed to fetch action usage', err);
    }
  };
  const decreaseRating = () => {
    setNewRating((prevRating) => {
      if (prevRating < 1) return;
      if (!prevRating || prevRating > 2) {
        return 2;
      } else if (prevRating > 1) {
        return prevRating - 1;
      } else {
        return 1;
      }
    });
  };
  const increaseRating = () => {
    setNewRating((prevRating) => {
      if (prevRating > 5) return;
      if (!prevRating || prevRating < 3) {
        return 3;
      } else if (prevRating < 5) {
        return prevRating + 1;
      } else {
        return 5;
      }
    });
  };
  const isMobile = windowExists() ? window.innerWidth <= 600 : false;
  let voterWeight = 0;

  let categories;

  if (_categories == null) {
    // TODO: Make this configurable
    if (postType === 'columbia-course-registration:courses') {
      categories = COURSE_CATEGORIES.filter((cat) => cat !== 'overall');
    } else if (postType === 'columbia-course-registration:professors') {
      categories = PROF_CATEGORIES.filter((cat) => cat !== 'overall');
    } else if (postType === 'maps.google.com') {
      categories = MAPS_CATEGORIES.filter((cat) => cat !== 'overall');
    } else if (
      postType === 'politics:candidates' &&
      listType === 'politics:candidates'
    ) {
      categories = ELECTION_CATEGORIES.filter((cat) => cat !== 'overall');
    } else if (caption && caption.match(artPattern)) {
      categories = NFT_ART_CATEGORIES.filter((cat) => cat !== 'overall');
    } else if (caption && caption.match(musicPattern)) {
      categories = NFT_MUSIC_CATEGORIES.filter((cat) => cat !== 'overall');
    } else {
      categories = VOTE_CATEGORIES.filter((cat) => cat !== 'overall');
    }
  } else {
    categories = VOTE_CATEGORIES.filter((cat) => cat !== 'overall');
  }

  const deletevvote = async (voteid) => {
    const { signature } = await scatter.scatter.getAuthToken();
    await axios.delete(`${apiBaseUrl}/votes/${voteid}`, {
      data: { signature }
    });
  };

  const handleDefaultVote = async () => {
    await handleVote(rating, newRating);
  };

  const submitVote = async (prevRating, newRating, ignoreLoading) => {
    const { caption, imgHash, videoHash, tag } = post;

    if (account == null) {
      handleDialogOpen();
      return;
    }

    const signedInWithEth = !scatter?.connected && !!ethAuth;
    const signedInWithTwitter =
      !scatter?.connected && !!localStorage.getItem('twitterMirrorInfo');

    // Converts 1-5 rating to like/dislike range
    const rating = ratingConversion[newRating];
    const like = newRating > 2;
    const oldRating = ratingConversion[prevRating];
    console.log(newRating, like);
    dispatch(updateVoteLoading(postid, account.name, category, true));
    if (vote == null || vote._id == null) {
      if (post.onchain === false) {
        if (signedInWithEth) {
          await postvotev3(
            account,
            {
              postid,
              caption,
              imgHash,
              videoHash,
              tag,
              like,
              category,
              rating
            },
            ethAuth
          );
        } else if (signedInWithTwitter) {
          await postvotev3(account, {
            postid,
            caption,
            imgHash,
            videoHash,
            tag,
            like,
            category,
            rating
          });
        } else {
          await scatter.scatter.postvotev3({
            data: {
              postid,
              caption,
              imgHash,
              videoHash,
              tag,
              like,
              category,
              rating
            }
          });
        }
      } else {
        if (signedInWithEth) {
          await createvote(
            account,
            { postid, like, category, rating },
            ethAuth
          );
        } else if (signedInWithTwitter) {
          await createvote(account, { postid, like, category, rating });
        } else {
          const txStatus = await scatter.scatter.createVote({
            data: { postid, like, category, rating }
          });
          if (txStatus === 'Action limit exceeded for create vote') {
            toastError("You've run out of votes for the day");
            dispatch(updateVoteLoading(postid, account.name, category, false));
            return;
          }
        }
      }
    } else if (vote && prevRating === newRating) {
      if (vote.onchain === false && !signedInWithEth && !signedInWithTwitter) {
        await deletevvote(vote._id.voteid);
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
    } else {
      let voteid = vote._id.voteid;
      if (post.onchain === false) {
        if (vote.onchain === false) {
          if (signedInWithEth) {
            await postvotev4(
              account,
              {
                postid,
                voteid,
                caption,
                imgHash,
                videoHash,
                tag,
                like,
                category,
                rating
              },
              ethAuth
            );
          } else if (signedInWithTwitter) {
            await postvotev4(account, {
              postid,
              voteid,
              caption,
              imgHash,
              videoHash,
              tag,
              like,
              category,
              rating
            });
          } else {
            await scatter.scatter.postvotev4({
              data: {
                postid,
                voteid,
                caption,
                imgHash,
                videoHash,
                tag,
                like,
                category,
                rating
              }
            });
          }
        } else {
          if (signedInWithEth) {
            await postvotev3(
              account,
              {
                postid,
                caption,
                imgHash,
                videoHash,
                tag,
                like,
                category,
                rating
              },
              ethAuth
            );
          } else if (signedInWithTwitter) {
            await postvotev3(account, {
              postid,
              caption,
              imgHash,
              videoHash,
              tag,
              like,
              category,
              rating
            });
          } else {
            await scatter.scatter.postvotev3({
              data: {
                postid,
                caption,
                imgHash,
                videoHash,
                tag,
                like,
                category,
                rating
              }
            });
          }
        }
      } else {
        if (vote.onchain === false) {
          if (signedInWithEth) {
            await createvotev4(
              account,
              { postid, voteid, like, category, rating },
              ethAuth
            );
          } else if (signedInWithTwitter) {
            await createvotev4(account, {
              postid,
              voteid,
              like,
              category,
              rating
            });
          } else {
            await scatter.scatter.createvotev4({
              data: { postid, voteid, like, category, rating }
            });
          }
        } else {
          if (signedInWithEth) {
            await editvote(
              account,
              { voteid: vote._id.voteid, like, rating, category },
              ethAuth
            );
          } else if (signedInWithTwitter) {
            await editvote(account, {
              voteid: vote._id.voteid,
              like,
              rating,
              category
            });
          } else {
            await scatter.scatter.editVote({
              data: { voteid: vote._id.voteid, like, rating, category }
            });
          }
        }
      }

      const voteInfluence = Math.round(vote.influence);
      const updatedVoteInfluence = Math.round(
        (rating / oldRating) * voteInfluence
      );

      const newVote = {
        ...vote,
        like,
        rating,
        influence: updatedVoteInfluence
      };
      dispatch(updateInitialVote(postid, account.name, category, newVote));
    }

    //this.fetchUpdatedPostInfo()
    dispatch(updateVoteLoading(postid, account.name, category, false));
  };

  const submitForcedVote = async (prevRating, newRating) => {
    try {
      const actionUsage = await fetchActionUsage(account.name);
      const lastReset = new Date(actionUsage.lastReset).getTime();
      const dayInMs = 24 * 60 * 60 * 1000;
      const now = new Date().getTime();

      // Check if there are votes remaining for current period
      if (
        actionUsage == null ||
        now >= lastReset + dayInMs ||
        CREATE_VOTE_LIMIT > actionUsage.createVoteCount
      ) {
        let forcedVoteRating;
        const highestLike = 3;
        const highestDislike = 2;
        const remainingVotes = CREATE_VOTE_LIMIT - actionUsage.createVoteCount;
        let highestPossibleRating;
        if (newRating > 2) {
          highestPossibleRating = Math.min(
            Math.floor(Math.sqrt(remainingVotes)),
            highestLike
          );
          // TODO: Throw if the remaining votes is 0
          forcedVoteRating = likeRatingConversion[highestPossibleRating];
        } else {
          highestPossibleRating = Math.min(
            Math.floor(Math.sqrt(remainingVotes)),
            highestDislike
          );
          forcedVoteRating = dislikeRatingConversion[highestPossibleRating];
        }
        await submitVote(prevRating, forcedVoteRating, true);
        return;
      }
      toastError("You've run out of votes for the day");
      dispatch(updateVoteLoading(postid, account.name, category, false));
    } catch (error) {
      toastError(parseError(error, 'vote'));
      dispatch(updateVoteLoading(postid, account.name, category, false));
    }
  };

  const handleVote = async (prevRating, newRating) => {
    try {
      if (account == null) {
        handleDialogOpen();
        return;
      }

      await submitVote(prevRating, newRating);
    } catch (error) {
      const actionLimitExc = /Action limit exceeded/gm;
      const jsonStr = typeof error === 'string' ? error : JSON.stringify(error);

      // Submit forced vote if action limit will be exceeded
      if (jsonStr.match(actionLimitExc)) {
        await submitForcedVote(prevRating, newRating);
        return;
      }
      toastError(parseError(error, 'vote'));
      dispatch(updateVoteLoading(postid, account.name, category, false));
      rollbar.error(
        'WEB APP VoteButton handleVote() ' +
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2) +
          ':\n' +
          'Post ID: ' +
          postid +
          ', Account: ' +
          account.name +
          ', Category: ' +
          category
      );
      console.error(
        'WEB APP VoteButton handleVote() ' +
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2) +
          ':\n' +
          'Post ID: ' +
          postid +
          ', Account: ' +
          account.name +
          ', Category: ' +
          category
      );
    }
  };

  const handleDialogOpen = () => {
    openAuthModal();
  };

  return (
    <ErrorBoundary>
      <FlexBox sx={{ columnGap: (theme) => theme.spacing(3) }}>
        <VoteButton
          category={'popularity'}
          catWeight={weights['popularity']}
          handleOnclick={increaseRating}
          setLastClicked={() => setLastClicked('up')}
          type="up"
          totalVoters={
            upvotes + (lastClicked === 'up' ? ratingConversion[newRating] : 0)
          }
          rating={lastClicked === 'up' && newRating}
          postid={postid}
          listType={listType}
          voterWeight={voterWeight}
          isShown={!isMobile}
          isVoted={lastClicked === 'up' || (!lastClicked && vote?.[0]?.like)}
          postInfo={postInfo}
        />
        <VoteButton
          category={'popularity'}
          catWeight={weights['popularity']}
          handleOnclick={decreaseRating}
          type="down"
          setLastClicked={() => setLastClicked('down')}
          totalVoters={
            downvotes +
            (lastClicked === 'down' ? ratingConversion[newRating] : 0)
          }
          rating={lastClicked === 'down' && newRating}
          postid={postid}
          listType={listType}
          voterWeight={voterWeight}
          isShown={!isMobile}
          isVoted={
            lastClicked === 'down' || (!lastClicked && vote[0] && !vote[0].like)
          }
          postInfo={postInfo}
        />
      </FlexBox>
    </ErrorBoundary>
  );
};

VoteComp.propTypes = {
  account: PropTypes.object,
  caption: PropTypes.string.isRequired,
  postid: PropTypes.string.isRequired,
  weights: PropTypes.object.isRequired,
  levels: PropTypes.number.isRequired,
  rating: PropTypes.object.isRequired,
  postType: PropTypes.string,
  postInfo: PropTypes.object.isRequired,
  listType: PropTypes.string,
  ethAuth: PropTypes.object,
  categories: PropTypes.array,
  dispatch: PropTypes.func.isRequired
};

VoteComp.defaultProps = {
  weights: {
    intelligence: null,
    popularity: null,
    overall: null,
    funny: null
  },
  voterWeight: 0
};


export default (withSuspense()(VoteComp));
