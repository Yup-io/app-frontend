import { colorThemeConstants as constants } from '../constants'
import produce from 'immer'

const initalState = { active: false }

export function lightMode (state = initalState, action) {
  return produce(state, draft => {
    switch (action.type) {
    case constants.TOGGLE_COLOR_THEME:
      draft.active = !state.active
      break
    default:
      return state
    }
  })
}
