import { permissionConstants as constants } from '../constants';
import produce from 'immer';

export function userPermissions(state = {}, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_PERMS:
        return {
          perm: 'active',
          eosname: action.eosname
        };
      case constants.FETCH_PERMS_SUCCESS:
        return {
          isLoading: false,
          perm: action.userPerm,
          error: null
        };
        return draft;
      case constants.FETCH_PERMS_FAILURE:
        return {
          isLoading: false,
          perm: null,
          error: action.error
        };
      default:
        return state;
    }
  });
}
