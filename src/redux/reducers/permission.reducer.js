import { permissionConstants as constants } from '../constants'
import produce from 'immer'

export function userPermissions (state = {}, action) {
  return produce(state, draft => {
    switch (action.type) {
    case constants.FETCH_PERMS:
      draft[action.eosname] = {
        isLoading: false,
        perm: 'active',
        error: null
      }
      break
    case constants.FETCH_PERMS_SUCCESS:
      draft[action.eosname] = {
        isLoading: false,
        perm: action.userPerm,
        error: null
      }
      break
    case constants.FETCH_PERMS_FAILURE:
      draft[action.eosname] = {
        isLoading: false,
        permission: null,
        error: action.error
      }
      break
    default:
      return state
    }
  })
}
