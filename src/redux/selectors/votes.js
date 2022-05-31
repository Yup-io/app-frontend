import { createSelector } from 'reselect'
import { windowExists } from '../../utils/helpers'

export const votesSelector = createSelector(state => state.initialVotes[state.authInfo.eosname], (votes) => {
  return votes || []
})
