import { tourConstants as constants } from '../constants';

export function setTourAction(tour) {
  return { type: constants.SET_TOUR, tour };
}
