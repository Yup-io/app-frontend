import { tourConstants as constants } from '../constants'
import produce from 'immer'

const initialState = {
  isTourOpen: false
}

export function tour (state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
    case constants.SET_TOUR: {
      draft['isTourOpen'] = action.tour.isTourOpen
      break
    }
    }
  })
}
