import React, { useEffect, useState } from 'react';
import VoteButton from '../VoteButton/VoteButton';
import PropTypes from 'prop-types';
import { useInitialVotes } from '../../hooks/queries';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { apiBaseUrl } from '../../config';
import useToast from '../../hooks/useToast';
import { parseError } from '../../eos/error';
import rollbar from '../../utils/rollbar';
import { createVote, editVote, deleteVote } from '../../apis';
import { FlexBox } from '../styles';
import { windowExists } from '../../utils/helpers';
import useAuth from '../../hooks/useAuth';
import withSuspense from '../../hoc/withSuspense';
import useEthAuth from '../../hooks/useEthAuth';
import useAuthInfo from '../../hooks/useAuthInfo';

const ratingConversion = {
  1: 2,
  2: 1,
  3: 1,
  4: 2,
  5: 3
};
const dislikeRatingConversion = {
  2: 1,
  1: 2
};
const likeRatingConversion = {
  1: 3,
  2: 4,
  3: 5
};

function genRegEx(arrOfURLs) {
  return new RegExp(
    `^((http:|https:)([/][/]))?(www.)?(${arrOfURLs.join('|')})`
  );
}
const modifyAuthInfo = (authInfo) => {
  if (authInfo.authType === 'eth') {
    return {
      address: authInfo.address,
      signature: authInfo.signature,
      authType: 'ETH'
    };
  } else if (authInfo.authType === 'extension') {
    return {
      eosname: authInfo.eosname,
      signature: authInfo.signature,
      authType: 'extension'
    };
  } else if (authInfo.authType === 'twitter') {
    return { oauthToken: authInfo.oauthToken, authType: 'twitter' };
  }
};

const VoteComp = ({
  postid,
  url,
  weights,
  listType,
  postInfo,
  rating
}) => {
  const ethAuth = useEthAuth();
  const name = useAuth().name;
  const initialAuthInfo = useAuthInfo();
  const authInfo = modifyAuthInfo(initialAuthInfo);
  const votes = useInitialVotes(postid, name);
  const [newRating, setNewRating] = useState();
  const [lastClicked, setLastClicked] = useState();
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const { toastError, toastInfo } = useToast();
  const category = 'overall';
  const { post } = postInfo;
  const vote = votes?.[0];
  useEffect(() => {
    let timer1;
    if (newRating && lastClicked) {
      timer1 = setTimeout(() => setShouldSubmit(true), 3 * 1000);
    }

    return () => {
      setShouldSubmit(false);
      clearTimeout(timer1);
    };
  }, [newRating, lastClicked]);

  useEffect(() => {
    console.log({ shouldSubmit });
    if (shouldSubmit) handleDefaultVote();
  }, [shouldSubmit]);

  useEffect(() => {
    vote &&
      setNewRating(vote.like ? likeRatingConversion[vote.rating] : vote.rating);
    setUpvotes((post.catVotes['overall'] && post.catVotes['overall'].up) || 0);
    setDownvotes(
      (post.catVotes['overall'] && post.catVotes['overall'].down) || 0
    );
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

  const handleDefaultVote = async () => {
    await handleVote(rating, newRating);
  };

  const submitVote = async (prevRating, newRating, ignoreLoading) => {
 
    // // Converts 1-5 rating to like/dislike range
    const rating = ratingConversion[newRating];
    const like = newRating > 2;
    console.log(newRating, like);
    if (vote == null || vote._id == null) {
      await createVote({
        url,
        postid,
        voter: name,
        like: true,
        rating,
        authInfo
      });
    }
    // //If already voted on, and new rating is the same as old rating -> Deletes existing vote
    else if (vote && prevRating === newRating) {
      await deleteVote({ voteId: vote._id.voteid, authInfo });
    }
    // //If already voted on, and new rating is different as old rating -> Updates existing vote
    else {
      await editVote({
        voter: name,
        voteId: vote._id.voteid,
        like,
        rating,
        authInfo
      });
    }
  };

  const submitForcedVote = async (prevRating, newRating) => {
    try {
      const actionUsage = await fetchActionUsage(name);
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
    } catch (error) {
      toastError(parseError(error, 'vote'));
    }
  };

  const handleVote = async (prevRating, newRating) => {
    try {
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
      rollbar.error(
        'WEB APP VoteButton handleVote() ' +
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2) +
          ':\n' +
          'Post ID: ' +
          postid +
          ', Account: ' +
          name +
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
          name +
          ', Category: ' +
          category
      );
    }
  };

  return (
    <ErrorBoundary>
      <FlexBox sx={{ columnGap: (theme) => theme.spacing(3) }}>
        <VoteButton
          category={category}
          catWeight={weights[category]}
          handleOnclick={increaseRating}
          setLastClicked={() => setLastClicked('like')}
          type="like"
          totalVoters={
            upvotes +
            (lastClicked === 'like' ? ratingConversion[newRating] : 0) -
            (lastClicked && vote?.like ? vote.rating : 0)
          }
          rating={
            (lastClicked && lastClicked === 'like' && newRating) ||
            (vote?.like && vote.rating)
          }
          postid={postid}
          listType={listType}
          voterWeight={voterWeight}
          isShown={!isMobile}
          isVoted={lastClicked === 'like' || (!lastClicked && vote?.like)}
          postInfo={postInfo}
        />
        <VoteButton
          category={category}
          catWeight={weights[category]}
          handleOnclick={decreaseRating}
          type="dislike"
          setLastClicked={() => setLastClicked('dislike')}
          totalVoters={
            downvotes +
            (lastClicked === 'dislike' ? ratingConversion[newRating] : 0) -
            (lastClicked && vote && !vote.like ? vote.rating : 0)
          }
          rating={
            (lastClicked && lastClicked === 'dislike' && newRating) ||
            (vote && !vote.like && vote.rating)
          }
          postid={postid}
          listType={listType}
          voterWeight={voterWeight}
          isShown={!isMobile}
          isVoted={
            lastClicked === 'dislike' || (!lastClicked && vote && !vote.like)
          }
          postInfo={postInfo}
        />
      </FlexBox>
    </ErrorBoundary>
  );
};

VoteComp.propTypes = {
  account: PropTypes.object,
  url: PropTypes.string.isRequired,
  postid: PropTypes.string.isRequired,
  weights: PropTypes.object.isRequired,
  levels: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  postType: PropTypes.string,
  postInfo: PropTypes.object.isRequired,
  listType: PropTypes.string,
  ethAuth: PropTypes.object,
  categories: PropTypes.array
};

VoteComp.defaultProps = {
  weights: {
    overall: null,
  },
  voterWeight: 0
};

export default withSuspense()(VoteComp);
