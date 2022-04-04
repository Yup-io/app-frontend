import { authInviteConstants as constants } from '../constants'
import produce from 'immer'

const initialState = {
  code: null,
  isLoading: false,
  error: null,
  isValid: false
}

export function inviteAuth (state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
    case constants.AUTH_INVITE_CODE:
      draft.code = action.code
      draft.isLoading = true
      break
    case constants.AUTH_INVITE_CODE_SUCCESS:
      draft.code = action.code
      draft.isLoading = false
      draft.isValid = true
      draft.error = null
      break
    case constants.AUTH_INVITE_CODE_FAILURE:
      draft.code = action.code
      draft.isLoading = false
      draft.isValid = false
      draft.error = action.error
      break
    default:
      return state
    }
  })
}
