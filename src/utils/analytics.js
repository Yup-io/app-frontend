const TRACK_APPLICATION = 'Web App'
const TRACK_DATA_TYPE = {
  LOGIN: 'ETH Login',
  SIGNUP: 'ETH SignUp',
  SIGNUP_ATTEMPT: 'Attempt Signup',
  ETH_APPLICATION: 'ETH Application Submission'
}

export const ANALYTICS_SIGN_UP_TYPES = {
  EMAIL: 'email',
  TWITTER: 'twitter',
  ETH: 'eth'
}

const track = (type, data) => {
  if (!window.analytics) {
    return
  }

  window.analytics.track(type, data)
}

export const trackLogin = (username, ethAddress) => {
  track(
    TRACK_DATA_TYPE.LOGIN,
    {
      userId: ethAddress,
      username: username,
      application: TRACK_APPLICATION
    }
  )
}

export const trackSignUpAttempt = (type, account) => {
  track(
    TRACK_DATA_TYPE.SIGNUP_ATTEMPT,
    {
      userId: account,
      type,
      application: TRACK_APPLICATION
    }
  )
}

export const trackSignUp = (address, username) => {
  track(
    TRACK_DATA_TYPE.SIGNUP,
    {
      userId: address,
      username: username,
      application: TRACK_APPLICATION
    }
  )
}

export const trackWhitelist = (address, email) => {
  track(
    TRACK_DATA_TYPE.ETH_APPLICATION,
    {
      userId: address,
      email: email,
      application: TRACK_APPLICATION
    }
  )
}
