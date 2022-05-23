import { permissionConstants as constants } from '../constants'
import axios from 'axios'
import { apiBaseUrl } from '../../config'

export function fetchUserPermissions (eosname) {
  return async dispatch => {
    dispatch(request(eosname))
    try {
      const { permissions } = (await axios.post(`${apiBaseUrl}/v1/chain/get_account`, { account_name: eosname })).data
      if (permissions) {
        const allPermNames = permissions.map((perm) => perm.perm_name)
        const userPerm = allPermNames.includes('yup') ? 'yup' : 'active'
        dispatch(success(eosname, userPerm))
      }
    } catch (err) {
      dispatch(failure(eosname, err))
    }
  }
  function request (eosname) {
    return { type: constants.FETCH_PERMS, eosname }
  }
  function success (eosname, userPerm) {
    return { type: constants.FETCH_PERMS_SUCCESS, eosname, userPerm }
  }

  function failure (eosname, error) {
    return { type: constants.FETCH_PERMS_FAILURE, eosname, error }
  }
}
