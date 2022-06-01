import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useAccount, useConnect, useSignMessage } from 'wagmi';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Hidden,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';

import { useRouter } from 'next/router';

import AuthMethodButton from '../../components/AuthMethodButton';
import useStyles from './AuthModalStyles';
import {
  apiCheckWhitelist,
  apiGetAccountByEthAddress,
  apiGetChallenge,
  apiGetOAuthChallenge,
  apiGetTwitterAuthInfo,
  apiInviteEmail,
  apiMirrorAccount,
  apiRequestWhitelist,
  apiValidateUsername,
  apiVerifyChallenge
} from '../../apis';
import {
  ERROR_CONNECT_WALLET_TRY_AGAIN,
  ERROR_EMPTY_USERNAME,
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_USERNAME,
  ERROR_MIRROR_ACCOUNT,
  ERROR_SIGN_FAILED,
  ERROR_TWITTER_AUTH,
  ERROR_WALLET_NOT_CONNECTED,
  INVITE_EMAIL_SUCCESS,
  WAIT_FOR_ACCOUNT_CREATION
} from '../../constants/messages';
import { AUTH_TYPE, LOCAL_STORAGE_KEYS } from '../../constants/enum';
import { updateEthAuthInfo } from '../../redux/actions';
import {
  ANALYTICS_SIGN_UP_TYPES,
  trackLogin,
  trackSignUp,
  trackSignUpAttempt,
  trackWhitelist
} from '../../utils/analytics';
import { isValidEmail } from '../../utils/helpers';
import AuthInput from '../../components/AuthInput/AuthInput';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const AUTH_MODAL_STAGE = {
  SIGN_IN: 'SIGN_IN',
  REQUIRE_EMAIL: 'REQUIRE_EMAIL',
  REQUIRE_USERNAME: 'REQUIRE_USERNAME'
};

const AuthModal = ({ open, onClose, noRedirect }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [
    {
      data: { connected }
    }
  ] = useConnect();
  const [{ data: accountData }] = useAccount();
  const [, signMessage] = useSignMessage();
  const router = useRouter();

  const [stage, setStage] = useState(AUTH_MODAL_STAGE.SIGN_IN);
  const [email, setEmail] = useState('');
  const [ethSignData, setEthSignData] = useState(null);
  const [username, setUsername] = useState('');
  const [currAuthMethod, setCurrAuthMethod] = useState(null);

  useEffect(() => {
    // If `Connect Wallet` button is clicked and wallet is connect, start auth with ETH.
    if (currAuthMethod === AUTH_TYPE.ETH && connected) {
      handleAuthWithWallet();
      setCurrAuthMethod(null);
    }
  }, [connected, currAuthMethod]);

  const handleAuthWithWallet = async () => {
    const { address } = accountData;
    let challenge, signature;

    try {
      const rspChallenge = await apiGetChallenge({ address });
      challenge = rspChallenge.data;

      const rspSignature = await signMessage({ message: challenge });
      signature = rspSignature.data;
    } catch (err) {
      // Failed to sign the challenge, should try again.
      // Most cases are when the user rejects to sign.
      enqueueSnackbar(err.message || ERROR_SIGN_FAILED, { variant: 'error' });

      return;
    }

    try {
      await apiVerifyChallenge(address, signature);
    } catch (err) {
      // Verification failed, should try again.
      enqueueSnackbar(ERROR_CONNECT_WALLET_TRY_AGAIN, { variant: 'error' });

      return;
    }

    // Save signature data for later use.
    setEthSignData({ address, signature });

    // Store challenge/signature into localStorage for later use.
    const ethAuth = {
      address,
      challenge,
      signature
    };

    localStorage.setItem(LOCAL_STORAGE_KEYS.ETH_AUTH, JSON.stringify(ethAuth));

    // Check if account is already claimed
    let account;
    try {
      account = await apiGetAccountByEthAddress(address);
    } catch {
      // Check if the address is whitelisted
      try {
        await apiCheckWhitelist(address);

        // ETH address is whitelisted.
        // Then require user to enter a unique username to finish Sign-Up process.
        setStage(AUTH_MODAL_STAGE.REQUIRE_USERNAME);
      } catch {
        // ETH address is not whitelisted.
        // Then require user to enter an email to be notified when the address is whitelisted.
        setStage(AUTH_MODAL_STAGE.REQUIRE_EMAIL);
      }

      return;
    }

    // Update redux state
    dispatch(
      updateEthAuthInfo({
        account,
        address,
        signature
      })
    );

    // Tract for analytics
    trackLogin(account.username, address);

    if (!noRedirect) {
      // Redirect to profile page
      router.push(`/${account.username}`);
    }
  };

  const handleAuthWithTwitter = async () => {
    try {
      const { token, _id: id } = await apiGetOAuthChallenge();
      const { redirectPath } = await apiGetTwitterAuthInfo(
        token,
        id,
        'website'
      );

      trackSignUpAttempt(ANALYTICS_SIGN_UP_TYPES.TWITTER, id);

      window.location.href = redirectPath;
    } catch {
      enqueueSnackbar(ERROR_TWITTER_AUTH, { variant: 'error' });
    }
  };

  const handleSignUpWithEmail = async () => {
    if (!isValidEmail(email)) {
      enqueueSnackbar(ERROR_INVALID_EMAIL, { variant: 'error' });

      return;
    }

    await apiInviteEmail(email);

    // Show success notification
    enqueueSnackbar(INVITE_EMAIL_SUCCESS, { variant: 'success' });

    trackSignUpAttempt(ANALYTICS_SIGN_UP_TYPES.EMAIL, email);

    // Close Modal
    onClose();
  };

  const handleRequestWhitelist = async () => {
    if (!isValidEmail(email)) {
      enqueueSnackbar(ERROR_INVALID_EMAIL, { variant: 'error' });

      return;
    }

    if (!ethSignData) {
      // This error should not happen at all.
      enqueueSnackbar(ERROR_WALLET_NOT_CONNECTED, { variant: 'error' });

      return;
    }

    try {
      await apiRequestWhitelist(
        ethSignData.address,
        ethSignData.signature,
        email
      );

      trackWhitelist(ethSignData.address, email);

      enqueueSnackbar(INVITE_EMAIL_SUCCESS, { variant: 'success' });

      // Close modal
      onClose();
    } catch {
      enqueueSnackbar(ERROR_CONNECT_WALLET_TRY_AGAIN, { variant: 'error' });
    }
  };

  const handleETHSignUp = async () => {
    if (!username) {
      enqueueSnackbar(ERROR_EMPTY_USERNAME, { variant: 'error' });

      return;
    }

    try {
      await apiValidateUsername(username);
    } catch {
      enqueueSnackbar(ERROR_INVALID_USERNAME, { variant: 'error' });

      return;
    }

    enqueueSnackbar(WAIT_FOR_ACCOUNT_CREATION, { variant: 'success' });

    let mirrorData;

    try {
      mirrorData = await apiMirrorAccount(
        ethSignData.address,
        ethSignData.signature,
        username
      );
    } catch {
      enqueueSnackbar(ERROR_MIRROR_ACCOUNT, { variant: 'error' });

      return;
    }

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.ETH_AUTH,
      JSON.stringify({
        ...ethSignData,
        ...mirrorData
      })
    );

    dispatch(
      updateEthAuthInfo({
        ...ethSignData,
        account: mirrorData.account
      })
    );

    trackSignUp(ethSignData.address, username);
    trackSignUpAttempt(ANALYTICS_SIGN_UP_TYPES.ETH, mirrorData.account);

    if (!noRedirect) {
      // Redirect to user profile page with rewards if it exists.
      const rewards = localStorage.getItem(LOCAL_STORAGE_KEYS.YUP_REWARDS);
      router.push(`/${username}${rewards ? `?rewards=${rewards}` : ''}`);
    }
  };

  // Render helpers
  const renderModalContent = () => {
    if (stage === AUTH_MODAL_STAGE.SIGN_IN) {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <AuthMethodButton
                  text="ConnectWallet"
                  imageUrl="/images/icons/wallet_connect.png"
                  onClick={() => {
                    setCurrAuthMethod(AUTH_TYPE.ETH);
                    openConnectModal();
                  }}
                />
              )}
            </ConnectButton.Custom>
          </Grid>
          <Grid item>
            <AuthMethodButton
              text="Twitter"
              imageUrl="/images/icons/twitter.svg"
              onClick={handleAuthWithTwitter}
            />
          </Grid>
          <Grid item>
            <AuthInput
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onEnter={handleSignUpWithEmail}
            />
          </Grid>
        </Grid>
      );
    }

    return (
      <Stepper
        className={classes.stepper}
        activeStep={2}
        orientation="vertical"
      >
        <Step>
          <StepLabel>Connect Ethereum Account</StepLabel>
          <StepContent />
        </Step>
        <Step>
          <StepLabel>Verify Ownership</StepLabel>
          <StepContent />
        </Step>
        {stage === AUTH_MODAL_STAGE.REQUIRE_EMAIL && (
          <Step>
            <StepLabel>Ethereum Whitelist Application</StepLabel>
            <StepContent>
              <Typography variant="body1" gutterBottom>
                Your address needs to be whitelisted. Please add your email so
                we can notify you.
              </Typography>
              <AuthInput
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onEnter={handleRequestWhitelist}
              />
            </StepContent>
          </Step>
        )}
        {stage === AUTH_MODAL_STAGE.REQUIRE_USERNAME && (
          <Step>
            <StepLabel>Create Account</StepLabel>
            <StepContent>
              <Typography variant="body1" gutterBottom>
                Please enter a Yup username to create your account.
              </Typography>
              <AuthInput
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onEnter={handleETHSignUp}
              />
            </StepContent>
          </Step>
        )}
      </Stepper>
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontSize: 24, fontWeight: 900 }}>
        Sign Up / Login
      </DialogTitle>

      <DialogContent>
        {/* Hide text in small devices */}
        <Hidden lgDown>
          <Typography variant="subtitle1" className={classes.title}>
            {stage === AUTH_MODAL_STAGE.SIGN_IN
              ? 'Earn money & clout for rating content anywhere on the internet. Get extra rewards for joining today.'
              : "Please sign up with an 'active' wallet, one that has held some ETH or YUP before. Fresh unused wallets will not be whitelisted and will need to be approved."}
          </Typography>
        </Hidden>

        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};

AuthModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  noRedirect: PropTypes.bool
};

export default AuthModal;
